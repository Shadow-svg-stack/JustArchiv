// Données d'exemple pour la démonstration de JustArchiv

export const mockDocuments = [
  {
    id: "doc_1",
    name: "Contrat_Commercial_2024.pdf",
    type: "application/pdf",
    size: 2457600, // 2.4 MB
    uploadedAt: "2024-01-15T10:30:00Z",
    category: "contrats",
    tags: ["commercial", "2024", "important"],
    uploadedBy: "marie.dubois@entreprise.com",
    url: "#",
  },
  {
    id: "doc_2",
    name: "Rapport_Trimestriel_Q4.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1843200, // 1.8 MB
    uploadedAt: "2024-01-14T14:15:00Z",
    category: "rapports",
    tags: ["Q4", "trimestriel", "finances"],
    uploadedBy: "pierre.martin@entreprise.com",
    url: "#",
  },
  {
    id: "doc_3",
    name: "Facture_Fournisseur_001.pdf",
    type: "application/pdf",
    size: 524288, // 512 KB
    uploadedAt: "2024-01-13T09:45:00Z",
    category: "factures",
    tags: ["fournisseur", "comptabilité"],
    uploadedBy: "sophie.laurent@entreprise.com",
    url: "#",
  },
  {
    id: "doc_4",
    name: "Presentation_Produit_V2.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 5242880, // 5 MB
    uploadedAt: "2024-01-12T16:20:00Z",
    category: "presentations",
    tags: ["produit", "marketing", "v2"],
    uploadedBy: "jean.dupont@entreprise.com",
    url: "#",
  },
  {
    id: "doc_5",
    name: "Logo_Entreprise.png",
    type: "image/png",
    size: 102400, // 100 KB
    uploadedAt: "2024-01-11T11:00:00Z",
    category: "autres",
    tags: ["logo", "branding"],
    uploadedBy: "marie.dubois@entreprise.com",
    url: "#",
  },
];

export const mockStats = {
  totalDocuments: mockDocuments.length,
  totalUsers: 12,
  totalStorage: mockDocuments.reduce((sum, doc) => sum + doc.size, 0),
  documentsThisMonth: 3,
  categoriesCount: {
    contrats: 1,
    factures: 1,
    rapports: 1,
    presentations: 1,
    autres: 1,
  },
};

export const mockUsers = [
  {
    id: "user_1",
    name: "Marie Dubois",
    email: "marie.dubois@entreprise.com",
    role: "admin",
    createdAt: "2023-12-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
    documentsCount: 15,
    active: true,
  },
  {
    id: "user_2",
    name: "Pierre Martin",
    email: "pierre.martin@entreprise.com",
    role: "editor",
    createdAt: "2023-12-05T00:00:00Z",
    lastLogin: "2024-01-14T14:15:00Z",
    documentsCount: 8,
    active: true,
  },
  {
    id: "user_3",
    name: "Sophie Laurent",
    email: "sophie.laurent@entreprise.com",
    role: "editor",
    createdAt: "2023-12-10T00:00:00Z",
    lastLogin: "2024-01-13T09:45:00Z",
    documentsCount: 12,
    active: true,
  },
  {
    id: "user_4",
    name: "Jean Dupont",
    email: "jean.dupont@entreprise.com",
    role: "reader",
    createdAt: "2023-12-15T00:00:00Z",
    lastLogin: "2024-01-12T16:20:00Z",
    documentsCount: 3,
    active: true,
  },
];

export const mockActivities = [
  {
    id: "activity_1",
    type: "upload" as const,
    user: "Marie Dubois",
    description: 'a téléchargé "Contrat_Commercial_2024.pdf"',
    timestamp: "2024-01-15T10:30:00Z",
    metadata: { fileName: "Contrat_Commercial_2024.pdf", category: "contrats" },
  },
  {
    id: "activity_2",
    type: "download" as const,
    user: "Pierre Martin",
    description: 'a téléchargé "Rapport_Trimestriel_Q4.docx"',
    timestamp: "2024-01-14T14:15:00Z",
    metadata: { fileName: "Rapport_Trimestriel_Q4.docx" },
  },
  {
    id: "activity_3",
    type: "edit" as const,
    user: "Sophie Laurent",
    description: "a modifié les métadonnées d'un document",
    timestamp: "2024-01-13T09:45:00Z",
  },
  {
    id: "activity_4",
    type: "user_added" as const,
    user: "Admin",
    description: "a ajouté un nouvel utilisateur",
    timestamp: "2024-01-12T16:20:00Z",
  },
  {
    id: "activity_5",
    type: "upload" as const,
    user: "Jean Dupont",
    description: "a téléchargé 3 nouveaux documents",
    timestamp: "2024-01-11T11:00:00Z",
    metadata: { category: "presentations" },
  },
];

export const mockCategories = [
  {
    id: "cat_1",
    name: "contrats",
    label: "Contrats",
    color: "blue",
    description: "Documents contractuels et accords",
    documentsCount: 1,
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: "cat_2",
    name: "factures",
    label: "Factures",
    color: "green",
    description: "Factures clients et fournisseurs",
    documentsCount: 1,
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: "cat_3",
    name: "rapports",
    label: "Rapports",
    color: "purple",
    description: "Rapports d'activité et analyses",
    documentsCount: 1,
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: "cat_4",
    name: "presentations",
    label: "Présentations",
    color: "orange",
    description: "Supports de présentation",
    documentsCount: 1,
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: "cat_5",
    name: "autres",
    label: "Autres",
    color: "gray",
    description: "Documents divers",
    documentsCount: 1,
    createdAt: "2023-12-01T00:00:00Z",
  },
];
