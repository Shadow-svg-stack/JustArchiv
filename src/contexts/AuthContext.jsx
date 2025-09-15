import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase, dbHelpers } from "../lib/supabase"
import toast from "react-hot-toast"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userRole, setUserRole] = useState("reader")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])

  // ==================== INITIALISATION ====================
  useEffect(() => {
    let mounted = true

    const init = async () => {
      console.log("AuthProvider: initialisation session...")
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) console.error("AuthProvider getSession error:", error)

        if (mounted) {
          setUser(data?.session?.user ?? null)
          if (data?.session?.user) {
            await loadUserProfile(data.session.user.id)
          }
        }
      } catch (err) {
        console.error("AuthProvider unexpected error:", err)
      } finally {
        // 🔹 Timeout sécurité
        setTimeout(() => {
          if (mounted) setLoading(false)
        }, 2000)
      }
    }

    init()

    // Abonnement aux changements d'auth
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider authStateChange:", event, session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadUserProfile(session.user.id)

          if (event === "SIGNED_IN") {
            await dbHelpers.logActivity(session.user.id, "login")
            toast.success("Connexion réussie !")
          }
        } else {
          setUserProfile(null)
          setUserRole("reader")
          setIsActive(true)
          if (event === "SIGNED_OUT") toast.success("Déconnexion réussie !")
        }

        setLoading(false)
      }
    )

    // Timeout de sécurité supplémentaire
    const timer = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 5000)

    return () => {
      mounted = false
      subscription?.subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  // ==================== CHARGEMENT PROFIL ====================
  const loadUserProfile = async (userId) => {
    try {
      const profile = await dbHelpers.getUserProfile(userId)
      setUserProfile(profile ?? null)
      setUserRole(profile?.role ?? "reader")
      setIsActive(profile?.is_active ?? true)
      console.log("AuthProvider loaded profile:", profile)
    } catch (err) {
      console.error("AuthProvider error loading profile:", err)
      setUserProfile(null)
      setUserRole("reader")
      setIsActive(true)
    } finally {
      setLoading(false)
    }
  }

  // ==================== COMPTE DESACTIVÉ ====================
  useEffect(() => {
    if (user && isActive === false) {
      toast.error("Votre compte a été désactivé par l’administrateur.")
      supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
      setUserRole("reader")
    }
  }, [user, isActive])

  // ==================== FONCTIONS ====================
  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      })
      if (error) throw error

      if (data.user) {
        await supabase.from("user_profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          role: "reader"
        })
        await dbHelpers.logActivity(data.user.id, "register")
        toast.success("Inscription réussie ! Vérifiez votre email.")
      }
      return { data, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      toast.error("Email ou mot de passe incorrect")
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      if (user) await dbHelpers.logActivity(user.id, "logout")
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("Aucun utilisateur connecté")
      const updatedProfile = await dbHelpers.updateUserProfile(user.id, updates)
      setUserProfile(updatedProfile)
      setUserRole(updatedProfile?.role ?? userRole)
      await dbHelpers.logActivity(user.id, "profile_update", { fields: Object.keys(updates) })
      toast.success("Profil mis à jour !")
      return { data: updatedProfile, error: null }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil")
      return { data: null, error }
    }
  }

  const changePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      await dbHelpers.logActivity(user.id, "password_change")
      toast.success("Mot de passe modifié !")
      return { error: null }
    } catch (error) {
      toast.error("Erreur lors du changement de mot de passe")
      return { error }
    }
  }

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error("Aucun utilisateur connecté")
      await dbHelpers.logActivity(user.id, "account_deletion")
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error
      toast.success("Compte supprimé avec succès")
      return { error: null }
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte")
      return { error }
    }
  }

  const getSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessions([{
          id: session.access_token.substring(0, 8),
          device: navigator.userAgent,
          ip: "Current session",
          last_active: new Date().toISOString(),
          current: true
        }])
      }
    } catch (error) {
      console.error("Erreur récupération sessions:", error)
    }
  }

  // ==================== VALEURS CONTEXTE ====================
  const value = {
    user,
    userProfile,
    userRole,
    isActive,
    loading,
    sessions,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    deleteAccount,
    getSessions
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
