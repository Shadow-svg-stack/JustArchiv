import { User } from "../types";

// Utilisateurs de démonstration pour le mode fallback
export const fallbackUsers: User[] = [
  {
    id: "demo-headmaster-1",
    name: "Admin JustArchiv",
    email: "admin@justarchiv.com",
    role: "headmaster",
    avatar: null,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date("2024-01-01"),
    departement: "Administration",
  },
  {
    id: "demo-admin-1",
    name: "Pierre Martin",
    email: "pierre.martin@justarchiv.com",
    role: "admin",
    avatar: null,
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    createdAt: new Date("2024-01-15"),
    departement: "Gestion",
  },
  {
    id: "demo-editor-1",
    name: "Sophie Laurent",
    email: "sophie.laurent@justarchiv.com",
    role: "editor",
    avatar: null,
    isActive: true,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date("2024-02-01"),
    departement: "Documentation",
  },
  {
    id: "demo-reader-1",
    name: "Jean Dupont",
    email: "jean.dupont@justarchiv.com",
    role: "reader",
    avatar: null,
    isActive: true,
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    createdAt: new Date("2024-02-15"),
    departement: "Consultation",
  },
];

export const authenticateUser = (
  email: string,
  password: string,
): User | null => {
  // Authentification simple pour la démo
  if (password === "demo") {
    return fallbackUsers.find((user) => user.email === email) || null;
  }
  return null;
};
