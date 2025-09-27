
export interface User {
  id: string
  email: string
  name: string
  role: "headmaster" | "admin" | "editor" | "reader"
  avatar?: string
  createdAt: Date
  lastLogin: Date
  isActive: boolean
}

export interface Document {
  id: string
  name: string
  originalName: string
  physicalLocation: string
  description?: string
  category: string
  tags: string[]
  size: number
  mimeType: string
  url: string
  thumbnailUrl?: string
  author: User
  createdAt: Date
  updatedAt: Date
  version: number
  isArchived: boolean
  metadata: {
    extractedText?: string
    pageCount?: number
    dimensions?: { width: number; height: number }
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  parentId?: string
  children?: Category[]
  documentCount: number
  createdAt: Date
  isDefault: boolean
}

export interface Tag {
  id: string
  name: string
  color: string
  category?: string
  usageCount: number
  createdAt: Date
}

export interface Activity {
  id: string
  type:
    | "document_upload"
    | "document_edit"
    | "document_delete"
    | "user_login"
    | "user_create"
    | "category_create"
    | "system_event"
  description: string
  userId?: string
  user?: User
  documentId?: string
  document?: Document
  metadata?: Record<string, any>
  createdAt: Date
}

export interface SystemStats {
  totalDocuments: number
  totalUsers: number
  totalStorage: number
  storageUsed: number
  documentsThisMonth: number
  activeUsers: number
  categoriesCount: number
  tagsCount: number
  averageFileSize: number
  lastBackup?: Date
}

export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  author?: string
  dateFrom?: Date
  dateTo?: Date
  fileType?: string
  minSize?: number
  maxSize?: number
  isArchived?: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  documentUpload: boolean
  systemAlerts: boolean
  weeklyReport: boolean
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto"
  language: string
  timezone: string
  pageSize: number
  defaultView: "grid" | "list"
  notifications: NotificationSettings
}

export interface ApplicationSettings {
  siteName: string
  siteDescription: string
  allowRegistration: boolean
  maxFileSize: number
  allowedFileTypes: string[]
  enableVersioning: boolean
  enableFullTextSearch: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
  storageProvider: "supabase" | "s3" | "local"
  maintenanceMode: boolean
  customLogo?: string
  customColors?: {
    primary: string
    secondary: string
    accent: string
  }
}

export interface AuditLog {
  id: string
  action: string
  userId: string
  user?: User
  targetType: "document" | "user" | "category" | "system"
  targetId?: string
  oldValue?: any
  newValue?: any
  ipAddress: string
  userAgent: string
  createdAt: Date
}

export interface BackupInfo {
  id: string
  fileName: string
  size: number
  type: "full" | "incremental"
  status: "completed" | "in_progress" | "failed"
  createdAt: Date
  downloadUrl?: string
}

// Type utiles
export type UserRole = User["role"]
export type DocumentSortBy =
  | "name"
  | "createdAt"
  | "size"
  | "author"
  | "category"
export type SortOrder = "asc" | "desc"

// -----------------------------
// Typage Supabase
// -----------------------------
export interface Database {
  users: User
  documents: Document
  categories: Category
  tags: Tag
  activities: Activity
  audit_logs: AuditLog
  backups: BackupInfo
  application_settings: ApplicationSettings
  // ajoute d'autres tables ici si nécessaire
}
