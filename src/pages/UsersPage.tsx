import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Users,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  User,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Switch } from "../components/ui/switch";
import { useAuth } from "../contexts/AuthContext";
import { User as UserType, UserRole } from "../types";
import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";
import {
  formatUserFromProfile,
  formatDateTime,
  getUserInitials,
  roleLabels,
  roleColors,
  roleDescriptions,
} from "../utils/userHelpers";
import { toast } from "sonner@2.0.3";
import { fallbackUsers } from "../data/fallbackAuth";

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

const roleLabels = {
  headmaster: "Headmaster",
  admin: "Administrateur",
  editor: "Éditeur",
  reader: "Lecteur",
};

const roleColors = {
  headmaster: "bg-gradient-to-r from-purple-500 to-pink-500",
  admin: "bg-gradient-to-r from-blue-500 to-cyan-500",
  editor: "bg-gradient-to-r from-green-500 to-emerald-500",
  reader: "bg-gradient-to-r from-gray-500 to-slate-500",
};

const roleDescriptions = {
  headmaster: "Accès complet au système et à l'administration",
  admin: "Gestion des utilisateurs et documents, analytics",
  editor: "Création et modification de documents, catégories",
  reader: "Lecture seule des documents",
};

export function UsersPage() {
  const { user: currentUser, hasPermission, isBackendAvailable } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "reader",
    isActive: true,
  });

  const canManageUsers = hasPermission("manage_users");

  // Charge la liste des utilisateurs
  const loadUsers = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.log("No session available for loading users");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/users`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const { users: userProfiles } = await response.json();
        const formattedUsers = userProfiles.map(formatUserFromProfile);
        setUsers(formattedUsers);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Erreur de chargement" }));
        console.error("Failed to load users:", errorData);
        toast.error("Erreur lors du chargement des utilisateurs");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Impossible de charger la liste des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageUsers) {
      if (isBackendAvailable) {
        loadUsers();
      } else {
        // Mode fallback - utilise les données mock
        setUsers(fallbackUsers);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [canManageUsers, isBackendAvailable]);

  const handleCreateUser = () => {
    if (!canManageUsers) return;

    setFormData({
      name: "",
      email: "",
      role: "reader",
      isActive: true,
    });
    setEditingUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user: UserType) => {
    if (!canManageUsers) return;
    if (user.id === currentUser?.id && user.role === "headmaster") return; // Ne peut pas se modifier soi-même si headmaster

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setEditingUser(user);
    setShowCreateModal(true);
  };

  const handleSaveUser = async () => {
    if (!canManageUsers) return;
    setActionLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Session expirée, veuillez vous reconnecter");
        return;
      }

      if (editingUser) {
        // Modification d'un utilisateur existant
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        if (response.ok) {
          await loadUsers();
          toast.success(`Utilisateur ${formData.name} modifié avec succès`);
          setShowCreateModal(false);
          setEditingUser(null);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Erreur de modification" }));
          toast.error(`Erreur: ${errorData.error}`);
        }
      } else {
        // Création d'un nouvel utilisateur
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/auth/signup`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              password: "demo123", // Mot de passe temporaire
            }),
          },
        );

        if (response.ok) {
          await loadUsers();
          toast.success(`Utilisateur ${formData.name} créé avec succès`);
          setShowCreateModal(false);
          setEditingUser(null);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Erreur de création" }));
          toast.error(`Erreur: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserType) => {
    if (!canManageUsers) return;
    if (user.id === currentUser?.id) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) return;

    setActionLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Session expirée, veuillez vous reconnecter");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        await loadUsers();
        toast.success(`Utilisateur ${user.name} supprimé`);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Erreur de suppression" }));
        toast.error(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: UserType) => {
    if (!canManageUsers) return;
    if (user.id === currentUser?.id) return;

    setActionLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Session expirée, veuillez vous reconnecter");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        },
      );

      if (response.ok) {
        await loadUsers();
        toast.success(
          `Utilisateur ${user.name} ${!user.isActive ? "activé" : "désactivé"}`,
        );
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Erreur de modification" }));
        toast.error(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setActionLoading(false);
    }
  };

  const canEditUser = (user: UserType) => {
    if (!canManageUsers) return false;
    if (user.id === currentUser?.id && user.role === "headmaster") return false;
    return true;
  };

  const canDeleteUser = (user: UserType) => {
    if (!canManageUsers) return false;
    if (user.id === currentUser?.id) return false;
    if (user.role === "headmaster" && currentUser?.role !== "headmaster")
      return false;
    return true;
  };

  const getAvailableRoles = (): UserRole[] => {
    if (currentUser?.role === "headmaster") {
      return ["headmaster", "admin", "editor", "reader"];
    } else if (currentUser?.role === "admin") {
      return ["admin", "editor", "reader"];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Chargement des utilisateurs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Mode indicator */}
      {!isBackendAvailable && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Mode démonstration</span>
            <span className="text-xs">• Backend non disponible</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>

        {canManageUsers && (
          <Button onClick={handleCreateUser} disabled={actionLoading}>
            {actionLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            Nouvel utilisateur
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.isActive).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      users.filter(
                        (u) => u.role === "admin" || u.role === "headmaster",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      users.filter((u) => {
                        const daysDiff = Math.floor(
                          (Date.now() - u.lastLogin.getTime()) /
                            (1000 * 60 * 60 * 24),
                        );
                        return daysDiff <= 7;
                      }).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback
                          className={`${roleColors[user.role]} text-white font-semibold`}
                        >
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {user.id === currentUser?.id && (
                            <Badge variant="outline" className="text-xs">
                              Vous
                            </Badge>
                          )}
                          {user.role === "headmaster" && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Dernière connexion:{" "}
                              {formatDateTime(user.lastLogin)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Role */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge
                          className={`${roleColors[user.role]} text-white border-0 mb-1`}
                        >
                          {roleLabels[user.role]}
                        </Badge>
                        <div className="flex items-center gap-1 justify-end">
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">
                                Actif
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-600">
                                Inactif
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {canManageUsers && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEditUser(user) && (
                              <DropdownMenuItem
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                            {user.id !== currentUser?.id && (
                              <DropdownMenuItem
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.isActive ? (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            {canDeleteUser(user) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nom et prénom"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="utilisateur@exemple.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Rôle
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${roleColors[role]}`}
                        />
                        <span>{roleLabels[role]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {roleDescriptions[formData.role]}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Compte actif</Label>
                <p className="text-sm text-muted-foreground">
                  L'utilisateur peut se connecter et utiliser l'application
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={
                  !formData.name.trim() ||
                  !formData.email.trim() ||
                  actionLoading
                }
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingUser ? "Modification..." : "Création..."}
                  </>
                ) : editingUser ? (
                  "Modifier"
                ) : (
                  "Créer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
