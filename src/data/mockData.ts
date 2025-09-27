import { User, Document, Category, Activity, SystemStats, Tag } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@justarchiv.com",
    name: "Marie Dubois",
    role: "headmaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "2",
    email: "pierre.martin@justarchiv.com",
    name: "Pierre Martin",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
    createdAt: new Date("2024-01-05"),
    lastLogin: new Date(Date.now() - 1000 * 60 * 30),
    isActive: true,
  },
  {
    id: "3",
    email: "sophie.laurent@justarchiv.com",
    name: "Sophie Laurent",
    role: "editor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    createdAt: new Date("2024-01-10"),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isActive: true,
  },
  {
    id: "4",
    email: "jean.dupont@justarchiv.com",
    name: "Jean Dupont",
    role: "reader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isActive: true,
  },
];

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Contrats",
    description: "Documents contractuels et accords",
    color: "#3b82f6",
    icon: "FileContract",
    documentCount: 45,
    createdAt: new Date("2024-01-01"),
    isDefault: true,
  },
  {
    id: "2",
    name: "Factures",
    description: "Factures et documents comptables",
    color: "#10b981",
    icon: "Receipt",
    documentCount: 128,
    createdAt: new Date("2024-01-01"),
    isDefault: true,
  },
  {
    id: "3",
    name: "Rapports",
    description: "Rapports internes et externes",
    color: "#f59e0b",
    icon: "FileBarChart",
    documentCount: 67,
    createdAt: new Date("2024-01-01"),
    isDefault: true,
  },
  {
    id: "4",
    name: "Présentations",
    description: "Diaporamas et présentations",
    color: "#8b5cf6",
    icon: "Presentation",
    documentCount: 23,
    createdAt: new Date("2024-01-01"),
    isDefault: false,
  },
  {
    id: "5",
    name: "Documentation",
    description: "Manuels et documentation technique",
    color: "#06b6d4",
    icon: "BookOpen",
    documentCount: 34,
    createdAt: new Date("2024-01-01"),
    isDefault: false,
  },
  {
    id: "6",
    name: "Archives Personnelles",
    description: "Documents personnels archivés",
    color: "#ef4444",
    icon: "Archive",
    parentId: "1",
    documentCount: 12,
    createdAt: new Date("2024-01-15"),
    isDefault: false,
  },
];

export const mockTags: Tag[] = [
  {
    id: "1",
    name: "Urgent",
    color: "#ef4444",
    usageCount: 23,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Confidentiel",
    color: "#f59e0b",
    usageCount: 45,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "En cours",
    color: "#3b82f6",
    usageCount: 67,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Validé",
    color: "#10b981",
    usageCount: 34,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Archive 2024",
    color: "#6b7280",
    usageCount: 89,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    name: "Juridique",
    color: "#8b5cf6",
    usageCount: 12,
    createdAt: new Date("2024-01-01"),
  },
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Contrat Commercial 2024",
    originalName: "Contrat_Commercial_2024.pdf",
    physicalLocation: 'Armoire A - Étagère 2 - Dossier "Contrats 2024"',
    description:
      "Contrat principal avec notre partenaire commercial pour l'année 2024",
    category: "Contrats",
    tags: ["Urgent", "Confidentiel"],
    size: 2457600, // 2.4 MB
    mimeType: "application/pdf",
    url: "/files/contrat-commercial-2024.pdf",
    thumbnailUrl: "/thumbnails/contrat-commercial-2024.jpg",
    author: mockUsers[0],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    version: 1,
    isArchived: false,
    metadata: {
      pageCount: 12,
      extractedText: "Contrat commercial entre...",
    },
  },
  {
    id: "2",
    name: "Rapport Trimestriel Q4",
    originalName: "Rapport_Trimestriel_Q4.docx",
    physicalLocation: 'Armoire B - Étagère 1 - Classeur "Rapports 2024"',
    description: "Bilan des activités du quatrième trimestre 2024",
    category: "Rapports",
    tags: ["Validé", "Archive 2024"],
    size: 1887436, // 1.8 MB
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    url: "/files/rapport-trimestriel-q4.docx",
    author: mockUsers[1],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    version: 1,
    isArchived: false,
    metadata: {},
  },
  {
    id: "3",
    name: "Facture Fournisseur 001",
    originalName: "Facture_Fournisseur_001.pdf",
    physicalLocation: 'Armoire C - Tiroir du bas - Pochette "Factures Janvier"',
    description:
      "Facture du fournisseur principal pour les fournitures de bureau",
    category: "Factures",
    tags: ["En cours"],
    size: 524288, // 512 KB
    mimeType: "application/pdf",
    url: "/files/facture-fournisseur-001.pdf",
    author: mockUsers[2],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    version: 1,
    isArchived: false,
    metadata: {
      pageCount: 1,
    },
  },
  {
    id: "4",
    name: "Présentation Produit V2",
    originalName: "Presentation_Produit_V2.pptx",
    physicalLocation:
      'Bureau principal - Classeur rouge - Section "Présentations"',
    description: "Présentation mise à jour de notre gamme de produits",
    category: "Présentations",
    tags: ["En cours", "Urgent"],
    size: 5452595, // 5.2 MB
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    url: "/files/presentation-produit-v2.pptx",
    author: mockUsers[3],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    version: 2,
    isArchived: false,
    metadata: {},
  },
  {
    id: "5",
    name: "Manuel Utilisateur",
    originalName: "Manuel_Utilisateur.pdf",
    physicalLocation: "Bibliothèque - Étagère technique - Reliure bleue",
    description: "Guide complet d'utilisation de l'application JustArchiv",
    category: "Documentation",
    tags: ["Validé", "Archive 2024"],
    size: 3251511, // 3.1 MB
    mimeType: "application/pdf",
    url: "/files/manuel-utilisateur.pdf",
    author: mockUsers[2],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    version: 1,
    isArchived: false,
    metadata: {
      pageCount: 45,
    },
  },
  {
    id: "6",
    name: "Budget 2024",
    originalName: "Budget_2024.xlsx",
    physicalLocation: 'Coffre-fort - Dossier comptabilité - Chemise "Budget"',
    description: "Prévisions budgétaires détaillées pour l'exercice 2024",
    category: "Rapports",
    tags: ["Confidentiel", "Validé"],
    size: 876543, // 856 KB
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    url: "/files/budget-2024.xlsx",
    author: mockUsers[0],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    version: 1,
    isArchived: false,
    metadata: {},
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "document_upload",
    description: "Nouveau document ajouté : Contrat Commercial 2024",
    userId: "1",
    user: mockUsers[0],
    documentId: "1",
    document: mockDocuments[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: "2",
    type: "user_login",
    description: "Connexion de Pierre Martin",
    userId: "2",
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "3",
    type: "document_edit",
    description: "Document modifié : Budget 2024",
    userId: "1",
    user: mockUsers[0],
    documentId: "6",
    document: mockDocuments[5],
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: "4",
    type: "category_create",
    description: "Nouvelle catégorie créée : Archives Personnelles",
    userId: "1",
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "5",
    type: "system_event",
    description: "Sauvegarde automatique effectuée",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
];

export const mockSystemStats: SystemStats = {
  totalDocuments: 245,
  totalUsers: 12,
  totalStorage: 1073741824, // 1 GB
  storageUsed: 268435456, // 256 MB
  documentsThisMonth: 24,
  activeUsers: 8,
  categoriesCount: 6,
  tagsCount: 15,
  averageFileSize: 1048576, // 1 MB
  lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6),
};

// Fonction utilitaire pour formater la taille des fichiers
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Fonction utilitaire pour formater les dates
export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Fonction utilitaire pour formater les dates avec l'heure
export function formatDateTime(date: Date): string {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Fonction utilitaire pour obtenir l'extension d'un fichier
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

// Fonction utilitaire pour obtenir l'icône d'un type de fichier
export function getFileIcon(mimeType: string): string {
  if (mimeType.includes("pdf")) return "FileText";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "FileText";
  if (mimeType.includes("sheet") || mimeType.includes("excel"))
    return "FileSpreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "Presentation";
  if (mimeType.includes("image")) return "Image";
  if (mimeType.includes("video")) return "Video";
  if (mimeType.includes("audio")) return "Music";
  return "File";
}
