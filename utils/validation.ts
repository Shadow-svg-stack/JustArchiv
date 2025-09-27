import DOMPurify from "isomorphic-dompurify";

// Types pour la validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Règles de validation prédéfinies
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Au moins 8 caractères, 1 maj, 1 min, 1 chiffre
  phone: /^(\+33|0)[1-9](\d{8})$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  filename: /^[a-zA-Z0-9._-]+$/,
  slug: /^[a-z0-9-]+$/,
};

// Messages d'erreur en français
export const VALIDATION_MESSAGES = {
  required: "Ce champ est obligatoire",
  email: "Format d'email invalide",
  password:
    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  pattern: "Format invalide",
  phone: "Numéro de téléphone invalide",
  url: "URL invalide",
  filename: "Nom de fichier invalide",
  fileSize: (maxMB: number) => `Taille maximale: ${maxMB}MB`,
  fileType: (types: string[]) => `Types autorisés: ${types.join(", ")}`,
};

// Fonction principale de validation
export function validateData(
  data: Record<string, any>,
  rules: ValidationRules,
): ValidationResult {
  const errors: Record<string, string[]> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    const fieldErrors: string[] = [];

    // Vérification required
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      fieldErrors.push(VALIDATION_MESSAGES.required);
      continue; // Si requis et vide, pas besoin de vérifier les autres règles
    }

    // Si la valeur est vide et non requise, passer les autres validations
    if (
      !rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      continue;
    }

    // Vérification minLength
    if (rule.minLength && String(value).length < rule.minLength) {
      fieldErrors.push(VALIDATION_MESSAGES.minLength(rule.minLength));
    }

    // Vérification maxLength
    if (rule.maxLength && String(value).length > rule.maxLength) {
      fieldErrors.push(VALIDATION_MESSAGES.maxLength(rule.maxLength));
    }

    // Vérification pattern
    if (rule.pattern && !rule.pattern.test(String(value))) {
      // Messages spécialisés pour certains patterns
      if (rule.pattern === VALIDATION_PATTERNS.email) {
        fieldErrors.push(VALIDATION_MESSAGES.email);
      } else if (rule.pattern === VALIDATION_PATTERNS.password) {
        fieldErrors.push(VALIDATION_MESSAGES.password);
      } else if (rule.pattern === VALIDATION_PATTERNS.phone) {
        fieldErrors.push(VALIDATION_MESSAGES.phone);
      } else if (rule.pattern === VALIDATION_PATTERNS.url) {
        fieldErrors.push(VALIDATION_MESSAGES.url);
      } else {
        fieldErrors.push(VALIDATION_MESSAGES.pattern);
      }
    }

    // Validation personnalisée
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (customResult !== true) {
        fieldErrors.push(
          typeof customResult === "string"
            ? customResult
            : "Validation personnalisée échouée",
        );
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validation de fichiers
export interface FileValidationOptions {
  maxSize?: number; // en bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  maxFiles?: number;
}

export function validateFiles(
  files: FileList | File[],
  options: FileValidationOptions = {},
): ValidationResult {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB par défaut
    allowedTypes = [],
    allowedExtensions = [],
    maxFiles = 10,
  } = options;

  const errors: Record<string, string[]> = {};
  const fileArray = Array.from(files);

  // Vérifier le nombre de fichiers
  if (fileArray.length > maxFiles) {
    errors.count = [`Maximum ${maxFiles} fichiers autorisés`];
  }

  fileArray.forEach((file, index) => {
    const fieldKey = `file_${index}`;
    const fileErrors: string[] = [];

    // Vérifier la taille
    if (file.size > maxSize) {
      fileErrors.push(
        VALIDATION_MESSAGES.fileSize(Math.round(maxSize / 1024 / 1024)),
      );
    }

    // Vérifier le type MIME
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      fileErrors.push(VALIDATION_MESSAGES.fileType(allowedTypes));
    }

    // Vérifier l'extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        fileErrors.push(
          `Extensions autorisées: ${allowedExtensions.join(", ")}`,
        );
      }
    }

    // Vérifier le nom de fichier
    if (
      !VALIDATION_PATTERNS.filename.test(file.name.replace(/\.[^/.]+$/, ""))
    ) {
      fileErrors.push(
        "Nom de fichier invalide (caractères spéciaux non autorisés)",
      );
    }

    if (fileErrors.length > 0) {
      errors[fieldKey] = fileErrors;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Sanitisation des données
export function sanitizeInput(
  input: string,
  options: {
    allowHTML?: boolean;
    maxLength?: number;
    trim?: boolean;
  } = {},
): string {
  const { allowHTML = false, maxLength, trim = true } = options;

  let sanitized = input;

  // Trim par défaut
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Limiter la longueur
  if (maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Sanitisation HTML
  if (allowHTML) {
    // Autoriser certaines balises HTML sécurisées
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "u", "br", "p"],
      ALLOWED_ATTR: [],
    });
  } else {
    // Échapper tous les caractères HTML
    sanitized = sanitized
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  return sanitized;
}

// Sanitisation d'un objet complet
export function sanitizeObject(
  obj: Record<string, any>,
  rules: Record<string, { allowHTML?: boolean; maxLength?: number }> = {},
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      const rule = rules[key] || {};
      sanitized[key] = sanitizeInput(value, rule);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item, rules[key] || {}) : item,
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Validation et sanitisation combinées
export function validateAndSanitize(
  data: Record<string, any>,
  validationRules: ValidationRules,
  sanitizationRules: Record<
    string,
    { allowHTML?: boolean; maxLength?: number }
  > = {},
): {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, any>;
} {
  // D'abord sanitiser
  const sanitizedData = sanitizeObject(data, sanitizationRules);

  // Puis valider les données sanitisées
  const validation = validateData(sanitizedData, validationRules);

  return {
    ...validation,
    sanitizedData,
  };
}

// Règles de validation prédéfinies pour JustArchiv
export const JUSTARCHIV_VALIDATION_RULES = {
  user: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s-]+$/,
    },
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.email,
    },
    password: {
      required: true,
      pattern: VALIDATION_PATTERNS.password,
    },
    role: {
      required: true,
      custom: (value: string) =>
        ["admin", "editor", "reader", "headmaster"].includes(value) ||
        "Rôle invalide",
    },
  },
  document: {
    title: {
      required: true,
      minLength: 1,
      maxLength: 200,
    },
    description: {
      maxLength: 1000,
    },
    category: {
      required: true,
    },
    tags: {
      custom: (value: string[]) => {
        if (!Array.isArray(value)) return "Les tags doivent être un tableau";
        if (value.length > 10) return "Maximum 10 tags autorisés";
        return (
          value.every((tag) => typeof tag === "string" && tag.length <= 30) ||
          "Chaque tag doit faire moins de 30 caractères"
        );
      },
    },
  },
  category: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    color: {
      pattern: /^#[0-9A-Fa-f]{6}$/,
      custom: (value: string) =>
        value.startsWith("#") || "La couleur doit commencer par #",
    },
  },
};

// Options de fichiers pour JustArchiv
export const JUSTARCHIV_FILE_OPTIONS: FileValidationOptions = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ],
  allowedExtensions: [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "txt",
  ],
  maxFiles: 5,
};
