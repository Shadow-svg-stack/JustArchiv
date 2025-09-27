import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

interface UpdateNotificationProps {
  onUpdate?: () => void;
  onDismiss?: () => void;
}

export function UpdateNotification({
  onUpdate,
  onDismiss,
}: UpdateNotificationProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleServiceWorkerUpdate = async () => {
      const registration = await navigator.serviceWorker.ready;

      // Écouter les mises à jour du service worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // Une nouvelle version est disponible
            setUpdateAvailable(true);
            setWaitingWorker(newWorker);
          }
        });
      });

      // Vérifier s'il y a déjà un worker en attente
      if (registration.waiting) {
        setUpdateAvailable(true);
        setWaitingWorker(registration.waiting);
      }
    };

    handleServiceWorkerUpdate();

    // Écouter les messages du service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "CACHE_UPDATED") {
        setUpdateAvailable(true);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleUpdate = async () => {
    if (!waitingWorker) return;

    setInstalling(true);
    setInstallProgress(0);

    // Simuler le progrès de l'installation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      setInstallProgress(progress);
    }, 200);

    try {
      // Dire au service worker en attente de prendre le contrôle
      waitingWorker.postMessage({ type: "SKIP_WAITING" });

      // Attendre que le nouveau service worker prenne le contrôle
      const controllerChanged = new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => {
            resolve();
          },
          { once: true },
        );
      });

      await controllerChanged;

      // Terminer le progrès
      clearInterval(progressInterval);
      setInstallProgress(100);

      // Attendre un peu avant de recharger
      setTimeout(() => {
        if (onUpdate) {
          onUpdate();
        } else {
          window.location.reload();
        }
      }, 500);
    } catch (error) {
      console.error("Failed to update app:", error);
      clearInterval(progressInterval);
      setInstalling(false);
      setInstallProgress(0);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
      >
        <Card className="border-primary/20 bg-background/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">
                  Mise à jour disponible
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Une nouvelle version de JustArchiv est disponible avec des
                  améliorations et corrections.
                </p>

                {installing && (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Installation en cours...
                    </div>
                    <Progress value={installProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={installing}
                    className="flex-1"
                  >
                    {installing ? "Installation..." : "Mettre à jour"}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    disabled={installing}
                  >
                    Plus tard
                  </Button>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                disabled={installing}
                className="flex-shrink-0 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook pour gérer les mises à jour PWA
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        // Vérifier les mises à jour périodiquement
        setInterval(() => {
          registration.update();
        }, 60000); // Toutes les minutes

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // Mise à jour disponible
                setUpdateAvailable(true);
              } else {
                // App prête pour utilisation offline
                setOfflineReady(true);
              }
            }
          });
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerSW();
  }, []);

  const updateApp = async () => {
    if (!updateAvailable) return;

    setInstalling(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const waitingWorker = registration.waiting;

      if (waitingWorker) {
        waitingWorker.postMessage({ type: "SKIP_WAITING" });

        // Attendre le changement de contrôleur
        await new Promise<void>((resolve) => {
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => {
              resolve();
            },
            { once: true },
          );
        });

        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update app:", error);
      setInstalling(false);
    }
  };

  return {
    updateAvailable,
    installing,
    offlineReady,
    updateApp,
  };
}

export default UpdateNotification;
