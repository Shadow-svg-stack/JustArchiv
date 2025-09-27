import { User } from "../types";

export const formatUserFromProfile = (profile: any): User => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatar: profile.avatar_url,
    isActive: profile.isActive !== false,
    lastLogin: profile.lastLogin ? new Date(profile.lastLogin) : new Date(),
    createdAt: new Date(profile.created_at),
  
  };
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const roleLabels = {
  headmaster: "Headmaster",
  admin: "Administrateur",
  editor: "Éditeur",
  reader: "Lecteur",
};

export const roleColors = {
  headmaster: "bg-gradient-to-r from-purple-500 to-pink-500",
  admin: "bg-gradient-to-r from-blue-500 to-cyan-500",
  editor: "bg-gradient-to-r from-green-500 to-emerald-500",
  reader: "bg-gradient-to-r from-gray-500 to-slate-500",
};

export const roleDescriptions = {
  headmaster: "Accès complet au système et à l'administration",
  admin: "Gestion des utilisateurs et documents, analytics",
  editor: "Création et modification de documents, catégories",
  reader: "Lecture seule des documents",
};
