import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Shield, User, Crown, Edit, Eye } from "lucide-react";
import { User as UserType, UserRole } from "../../types";

interface UserRoleManagerProps {
  users: UserType[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  currentUserRole: UserRole;
}

const roleConfig = {
  headmaster: {
    label: "Headmaster",
    icon: Crown,
    color: "bg-purple-500",
    description: "Accès complet au système et maintenance",
  },
  admin: {
    label: "Administrateur",
    icon: Shield,
    color: "bg-blue-500",
    description: "Gestion des utilisateurs et documents",
  },
  editor: {
    label: "Éditeur",
    icon: Edit,
    color: "bg-green-500",
    description: "Création et modification de documents",
  },
  reader: {
    label: "Lecteur",
    icon: Eye,
    color: "bg-gray-500",
    description: "Lecture seule des documents",
  },
};

export function UserRoleManager({
  users,
  onUpdateUserRole,
  currentUserRole,
}: UserRoleManagerProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (loading) return;

    setLoading(userId);
    setError("");

    try {
      await onUpdateUserRole(userId, newRole);
    } catch (err) {
      setError("Erreur lors de la mise à jour du rôle");
    } finally {
      setLoading(null);
    }
  };

  const canModifyRole = (userRole: UserRole): boolean => {
    // Seul le headmaster peut modifier tous les rôles
    if (currentUserRole === "headmaster") return true;

    // Les admins peuvent modifier les rôles editor et reader
    if (currentUserRole === "admin" && ["editor", "reader"].includes(userRole))
      return true;

    return false;
  };

  const getAvailableRoles = (currentRole: UserRole): UserRole[] => {
    if (currentUserRole === "headmaster") {
      return ["headmaster", "admin", "editor", "reader"];
    }

    if (currentUserRole === "admin") {
      // Les admins ne peuvent pas créer d'autres admins ou headmasters
      return ["editor", "reader"];
    }

    return [];
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Légende des rôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Rôles et permissions
          </CardTitle>
          <CardDescription>
            Gérez les rôles et permissions des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(roleConfig).map(([role, config]) => {
              const IconComponent = config.icon;
              return (
                <div
                  key={role}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Modifiez les rôles des utilisateurs (selon vos permissions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const userRoleConfig = roleConfig[user.role];
              const IconComponent = userRoleConfig.icon;
              const canModify = canModifyRole(user.role);
              const availableRoles = getAvailableRoles(user.role);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={`${userRoleConfig.color} text-white`}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {userRoleConfig.label}
                    </Badge>

                    {canModify && availableRoles.length > 0 && (
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserRole) =>
                          handleRoleChange(user.id, newRole)
                        }
                        disabled={loading === user.id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                {React.createElement(roleConfig[role].icon, {
                                  className: "w-4 h-4",
                                })}
                                {roleConfig[role].label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {!canModify && (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Non modifiable
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
