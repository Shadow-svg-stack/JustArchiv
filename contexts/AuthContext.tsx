import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isRole: (role: UserRole) => boolean;
  isBackendAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Permissions par rôle
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  headmaster: [
    "view_admin_dashboard",
    "manage_users",
    "manage_system_settings",
    "view_audit_logs",
    "manage_backups",
    "delete_any_document",
    "edit_any_document",
    "view_all_documents",
    "create_documents",
    "manage_categories",
    "view_analytics",
    "system_maintenance",
  ],
  admin: [
    "manage_users",
    "view_all_documents",
    "edit_any_document",
    "delete_any_document",
    "create_documents",
    "manage_categories",
    "view_analytics",
  ],
  editor: [
    "view_all_documents",
    "create_documents",
    "edit_own_documents",
    "delete_own_documents",
    "manage_categories",
  ],
  reader: ["view_all_documents"],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  // Charge le profil utilisateur
  const loadUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const { profile } = await response.json();
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar: profile.avatar_url,
          isActive: profile.isActive !== false,
          lastLogin: profile.lastLogin
            ? new Date(profile.lastLogin)
            : new Date(),
          createdAt: new Date(profile.created_at),
      
        });
      } else {
        console.log("Could not load user profile, fallback to Supabase user");

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser({
            id: user.id,
            name:
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "Utilisateur",
            email: user.email || "",
            role: "reader",
            avatar: undefined,
            isActive: true,
            lastLogin: new Date(),
            createdAt: new Date(user.created_at || Date.now()),
           
          });
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  // Initialise l'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let backendOk = false;

        // Test de disponibilité du backend
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const healthResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/health`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${publicAnonKey}` },
              signal: controller.signal,
            },
          );

          clearTimeout(timeoutId);

          if (healthResponse.ok) {
            console.log("Backend available - JustArchiv ready");
            backendOk = true;
            setIsBackendAvailable(true);

            // Init headmaster (protège bien cette route côté backend !)
            try {
              await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/init-headmaster`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${publicAnonKey}`,
                    "Content-Type": "application/json",
                  },
                },
              );
            } catch (initError) {
              console.log(
                "Headmaster already initialized or error:",
                initError,
              );
            }
          } else {
            console.log("Backend not responding properly");
            setIsBackendAvailable(false);
          }
        } catch (backendError: any) {
          if (backendError.name === "AbortError") {
            console.log("Backend health check timeout");
          } else {
            console.log("Backend not available:", backendError);
          }
          setIsBackendAvailable(false);
        }

        // Vérifie la session seulement si backend dispo
        if (backendOk) {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (session?.access_token && !error) {
            await loadUserProfile(session.access_token);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Écoute les changements d'état
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.access_token) {
            await loadUserProfile(session.access_token);
          }
        }
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Connexion
  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    if (!isBackendAvailable) {
      setLoading(false);
      return {
        success: false,
        error: "Service non disponible. Réessayez plus tard.",
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Erreur de connexion";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email non confirmé";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Utilisateur non trouvé";
        }
        setLoading(false);
        return { success: false, error: errorMessage };
      }

      if (data.session?.access_token) {
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: "Erreur de connexion" };
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      if (isBackendAvailable) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
    }
  };

  // Mise à jour utilisateur
  const updateUser = async (updates: Partial<User>) => {
    if (user && isBackendAvailable) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/users/${user.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updates),
            },
          );

          if (response.ok) {
            const { user: updatedUser } = await response.json();
            setUser({
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              avatar: updatedUser.avatar_url,
              isActive: updatedUser.isActive !== false,
              lastLogin: updatedUser.lastLogin
                ? new Date(updatedUser.lastLogin)
                : new Date(),
              createdAt: new Date(updatedUser.created_at),
            
            });
          }
        }
      } catch (error) {
        console.error("Update user error:", error);
      }
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    updateUser,
    hasPermission,
    isRole,
    isBackendAvailable,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
