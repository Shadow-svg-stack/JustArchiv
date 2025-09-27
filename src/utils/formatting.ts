// Utilitaires de formatage pour JustArchiv
// Version production - Sans données simulées

/**
 * Formate la taille des fichiers en unités lisibles
 * @param bytes - Taille en bytes
 * @returns Chaîne formatée (ex: "2.4 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Formate les dates au format français
 * @param date - Date à formater
 * @returns Date formatée (ex: "23/09/2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formate les dates avec l'heure
 * @param date - Date à formater
 * @returns Date et heure formatées (ex: "23/09/2024 14:30")
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate une date de manière relative (ex: "il y a 2 heures")
 * @param date - Date à formater
 * @returns Chaîne relative
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "à l'instant";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `il y a ${diffInYears} an${diffInYears > 1 ? "s" : ""}`;
}

/**
 * Obtient l'extension d'un fichier
 * @param filename - Nom du fichier
 * @returns Extension en minuscules
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Obtient l'icône appropriée pour un type de fichier
 * @param mimeType - Type MIME du fichier
 * @returns Nom de l'icône Lucide React
 */
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
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  )
    return "Archive";
  return "File";
}

/**
 * Valide une adresse email
 * @param email - Email à valider
 * @returns true si l'email est valide
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Génère un identifiant unique
 * @returns Identifiant unique
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Tronque un texte à une longueur donnée
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué avec "..." si nécessaire
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param str - Chaîne à capitaliser
 * @returns Chaîne capitalisée
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convertit un nom en couleur hexadécimale consistante
 * @param name - Nom à convertir
 * @returns Couleur hexadécimale
 */
export function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param num - Nombre à formater
 * @returns Nombre formaté
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("fr-FR");
}

/**
 * Calcule la progression en pourcentage
 * @param current - Valeur actuelle
 * @param total - Valeur totale
 * @returns Pourcentage (0-100)
 */
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}
