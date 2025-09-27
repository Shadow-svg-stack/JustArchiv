import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      errorId: this.state.errorId,
    };

    // Log de l'erreur
    console.error("ErrorBoundary caught an error:", errorDetails);

    // Envoyer à un service de monitoring (ex: Sentry)
    this.logErrorToService(errorDetails);

    // Callback personnalisé
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  private getUserId(): string | null {
    try {
      const userStr = localStorage.getItem("justarchiv_fallback_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || null;
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  }

  private logErrorToService(errorDetails: any) {
    // En production, envoyer vers un service comme Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      try {
        // Exemple avec fetch vers votre backend
        fetch("/api/errors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorDetails),
        }).catch(() => {
          // Fallback: stocker localement si l'envoi échoue
          const errors = JSON.parse(
            localStorage.getItem("justarchiv_errors") || "[]",
          );
          errors.push(errorDetails);
          localStorage.setItem(
            "justarchiv_errors",
            JSON.stringify(errors.slice(-10)),
          ); // Garder les 10 dernières
        });
      } catch {
        // Ignore logging errors
      }
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: "",
      });
    } else {
      window.location.reload();
    }
  };

  private handleReloadApp = () => {
    window.location.href = "/";
  };

  private handleReportBug = () => {
    const subject = encodeURIComponent(
      `Bug Report - ${this.state.error?.name || "Unknown Error"}`,
    );
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error: ${this.state.error?.message || "Unknown error"}
URL: ${window.location.href}
Time: ${new Date().toLocaleString()}
User Agent: ${navigator.userAgent}

Steps to reproduce:
1. 
2. 
3. 

Additional context:

`);

    const mailtoLink = `mailto:support@justarchiv.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  render() {
    if (this.state.hasError) {
      // Fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="border-destructive/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-destructive">
                  Oups ! Une erreur s'est produite
                </CardTitle>
                <CardDescription>
                  Nous sommes désolés, quelque chose s'est mal passé. L'erreur a
                  été automatiquement signalée à notre équipe.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Actions principales */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={this.handleRetry}
                    className="flex items-center gap-2"
                    disabled={this.retryCount >= this.maxRetries}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {this.retryCount >= this.maxRetries
                      ? "Limite atteinte"
                      : "Réessayer"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleReloadApp}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Retour à l'accueil
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleReportBug}
                    className="flex items-center gap-2"
                  >
                    <Bug className="w-4 h-4" />
                    Signaler le bug
                  </Button>
                </div>

                {/* Informations de debug (développement uniquement) */}
                {isDevelopment && this.state.error && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full">
                        Détails techniques (développement)
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="bg-muted p-4 rounded-lg space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Erreur:
                          </h4>
                          <code className="text-xs bg-background p-2 rounded block">
                            {this.state.error.name}: {this.state.error.message}
                          </code>
                        </div>

                        {this.state.error.stack && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">
                              Stack Trace:
                            </h4>
                            <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}

                        {this.state.errorInfo?.componentStack && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">
                              Component Stack:
                            </h4>
                            <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-40">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Error ID:
                          </h4>
                          <code className="text-xs bg-background p-2 rounded block">
                            {this.state.errorId}
                          </code>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Conseils pour l'utilisateur */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">
                    Que puis-je faire ?
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Vérifiez votre connexion internet</li>
                    <li>• Actualisez la page (F5)</li>
                    <li>• Vérifiez que JavaScript est activé</li>
                    <li>• Essayez de vider le cache de votre navigateur</li>
                    <li>• Si le problème persiste, contactez l'assistance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour utiliser ErrorBoundary avec les composants fonctionnels
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    // Simuler componentDidCatch
    console.error("Uncaught error:", error);

    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Log l'erreur (même logique que dans ErrorBoundary)
    if (process.env.NODE_ENV === "production") {
      fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorDetails),
      }).catch(() => {
        const errors = JSON.parse(
          localStorage.getItem("justarchiv_errors") || "[]",
        );
        errors.push(errorDetails);
        localStorage.setItem(
          "justarchiv_errors",
          JSON.stringify(errors.slice(-10)),
        );
      });
    }
  };
}
