// Système de logging pour JustArchiv
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;
  private isProduction = import.meta.env.VITE_NODE_ENV === "production";
  private logLevel: LogLevel = this.isProduction
    ? LogLevel.INFO
    : LogLevel.DEBUG;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Erreurs JavaScript globales
    window.addEventListener("error", (event) => {
      this.error("Global JavaScript Error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Promesses rejetées non gérées
    window.addEventListener("unhandledrejection", (event) => {
      this.error("Unhandled Promise Rejection", {
        reason: event.reason,
        promise: event.promise,
      });
    });

    // Erreurs de ressources
    window.addEventListener(
      "error",
      (event) => {
        if (event.target && event.target !== window) {
          const target = event.target as HTMLElement;
          this.error("Resource Load Error", {
            tagName: target.tagName,
            src: target.getAttribute("src") || target.getAttribute("href"),
            type: target.getAttribute("type"),
          });
        }
      },
      true,
    );
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: any,
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    if (context) {
      entry.context = context;
    }

    // Ajouter l'ID utilisateur si disponible
    try {
      const userStr = localStorage.getItem("justarchiv_fallback_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        entry.userId = user.id;
      }
    } catch {
      // Ignore parsing errors
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);

    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs * 0.8); // Garder 80% des logs les plus récents
    }

    // Persister les logs critiques
    if (entry.level >= LogLevel.ERROR) {
      this.persistLog(entry);
    }

    // Console output en développement
    if (!this.isProduction) {
      this.outputToConsole(entry);
    }

    // Envoyer au serveur en production
    if (this.isProduction && entry.level >= LogLevel.WARN) {
      this.sendToServer(entry);
    }
  }

  private outputToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${LogLevel[entry.level]}] ${timestamp}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context || "");
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context || "");
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context || "");
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, entry.message, entry.context || "");
        break;
    }
  }

  private persistLog(entry: LogEntry) {
    try {
      const existingLogs = JSON.parse(
        localStorage.getItem("justarchiv_error_logs") || "[]",
      );
      existingLogs.push(entry);

      // Garder seulement les 50 derniers logs d'erreur
      const recentLogs = existingLogs.slice(-50);
      localStorage.setItem("justarchiv_error_logs", JSON.stringify(recentLogs));
    } catch (error) {
      console.error("Failed to persist log:", error);
    }
  }

  private async sendToServer(entry: LogEntry) {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // En cas d'échec, stocker localement
      this.persistLog(entry);
    }
  }

  // Méthodes publiques de logging
  debug(message: string, context?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
      this.addLog(entry);
    }
  }

  info(message: string, context?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, context);
      this.addLog(entry);
    }
  }

  warn(message: string, context?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, context);
      this.addLog(entry);
    }
  }

  error(message: string, context?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, context);

      // Ajouter les détails de l'erreur si c'est un objet Error
      if (context instanceof Error) {
        entry.error = {
          name: context.name,
          message: context.message,
          stack: context.stack,
        };
        entry.context = undefined; // Éviter la duplication
      }

      this.addLog(entry);
    }
  }

  fatal(message: string, context?: any) {
    const entry = this.createLogEntry(LogLevel.FATAL, message, context);

    if (context instanceof Error) {
      entry.error = {
        name: context.name,
        message: context.message,
        stack: context.stack,
      };
      entry.context = undefined;
    }

    this.addLog(entry);
  }

  // Méthodes utilitaires
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter((log) => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem("justarchiv_error_logs");
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getLogStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      sessionId: this.sessionId,
      oldestLog: this.logs[0]?.timestamp,
      newestLog: this.logs[this.logs.length - 1]?.timestamp,
    };

    this.logs.forEach((log) => {
      const levelName = LogLevel[log.level];
      stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1;
    });

    return stats;
  }

  // Méthodes spécialisées pour JustArchiv
  logUserAction(action: string, details?: any) {
    this.info(`User Action: ${action}`, details);
  }

  logPerformance(metric: string, value: number, unit: string = "ms") {
    this.debug(`Performance: ${metric}`, { value, unit });
  }

  logApiCall(method: string, url: string, status?: number, duration?: number) {
    const context = { method, url, status, duration };

    if (status && status >= 400) {
      this.warn(`API Error: ${method} ${url}`, context);
    } else {
      this.debug(`API Call: ${method} ${url}`, context);
    }
  }

  logSecurityEvent(event: string, details?: any) {
    this.warn(`Security Event: ${event}`, details);
  }

  logBusinessEvent(event: string, details?: any) {
    this.info(`Business Event: ${event}`, details);
  }

  // Configuration dynamique
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
    this.info(`Log level changed to ${LogLevel[level]}`);
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  setMaxLogs(max: number) {
    this.maxLogs = max;
    if (this.logs.length > max) {
      this.logs = this.logs.slice(-max);
    }
  }
}

// Instance singleton
export const logger = new Logger();

// Hook React pour utiliser le logger
export function useLogger() {
  return logger;
}

// Décorateur pour logger automatiquement les erreurs de méthodes
export function logErrors(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor,
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    try {
      return method.apply(this, args);
    } catch (error) {
      logger.error(
        `Error in ${target.constructor.name}.${propertyName}`,
        error,
      );
      throw error;
    }
  };
}

// Fonction utilitaire pour les performances
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const start = performance.now();

  try {
    const result = fn();

    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        logger.logPerformance(name, duration);
      });
    } else {
      const duration = performance.now() - start;
      logger.logPerformance(name, duration);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Performance measurement failed for ${name}`, {
      error,
      duration,
    });
    throw error;
  }
}

export default logger;
