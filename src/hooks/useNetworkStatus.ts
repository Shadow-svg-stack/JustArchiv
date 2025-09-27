import { useState, useEffect, useCallback } from "react";

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  effectiveType: "2g" | "3g" | "4g" | "slow-2g" | "unknown";
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => {
    const initialStatus: NetworkStatus = {
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      isSlowConnection: false,
      connectionType: "unknown",
      downlink: 0,
      rtt: 0,
      saveData: false,
      effectiveType: "unknown",
    };

    // Initialiser avec les informations de connexion si disponibles
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        initialStatus.connectionType = connection.type || "unknown";
        initialStatus.downlink = connection.downlink || 0;
        initialStatus.rtt = connection.rtt || 0;
        initialStatus.saveData = connection.saveData || false;
        initialStatus.effectiveType = connection.effectiveType || "unknown";
        initialStatus.isSlowConnection =
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g";
      }
    }

    return initialStatus;
  });

  const updateNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine;

    let connectionInfo = {
      connectionType: "unknown",
      downlink: 0,
      rtt: 0,
      saveData: false,
      effectiveType: "unknown" as const,
      isSlowConnection: false,
    };

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connectionInfo = {
          connectionType: connection.type || "unknown",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
          effectiveType: connection.effectiveType || "unknown",
          isSlowConnection:
            connection.effectiveType === "slow-2g" ||
            connection.effectiveType === "2g",
        };
      }
    }

    setNetworkStatus({
      isOnline,
      ...connectionInfo,
    });
  }, []);

  const testConnectionSpeed = useCallback(async (): Promise<{
    latency: number;
    downloadSpeed: number;
  }> => {
    const startTime = performance.now();

    try {
      // Test avec une petite image pour mesurer la latence et débit
      const testUrl = "/api/health?" + Date.now(); // Cache busting
      const response = await fetch(testUrl, {
        method: "HEAD",
        cache: "no-cache",
      });

      const endTime = performance.now();
      const latency = endTime - startTime;

      // Test de débit avec une ressource plus grande si nécessaire
      let downloadSpeed = 0;
      if (response.ok) {
        const downloadStart = performance.now();
        const downloadResponse = await fetch("/manifest.json?" + Date.now(), {
          cache: "no-cache",
        });
        const downloadEnd = performance.now();

        if (downloadResponse.ok) {
          const contentLength = downloadResponse.headers.get("content-length");
          if (contentLength) {
            const bytes = parseInt(contentLength, 10);
            const duration = (downloadEnd - downloadStart) / 1000; // en secondes
            downloadSpeed = bytes / duration; // bytes par seconde
          }
        }
      }

      return { latency, downloadSpeed };
    } catch (error) {
      console.warn("Connection speed test failed:", error);
      return { latency: Infinity, downloadSpeed: 0 };
    }
  }, []);

  useEffect(() => {
    // Listeners pour les événements online/offline
    const handleOnline = () => {
      console.log("[Network] Connection restored");
      updateNetworkStatus();
    };

    const handleOffline = () => {
      console.log("[Network] Connection lost");
      updateNetworkStatus();
    };

    // Listener pour les changements de connexion
    const handleConnectionChange = () => {
      console.log("[Network] Connection type changed");
      updateNetworkStatus();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Connection API (si supportée)
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener("change", handleConnectionChange);
      }
    }

    // Test périodique de la connexion (toutes les 30 secondes si online)
    const testInterval = setInterval(async () => {
      if (navigator.onLine) {
        try {
          const { latency } = await testConnectionSpeed();

          // Si la latence est très élevée, considérer comme connexion lente
          const wasSlowConnection = networkStatus.isSlowConnection;
          const isNowSlowConnection = latency > 2000; // 2 secondes

          if (wasSlowConnection !== isNowSlowConnection) {
            setNetworkStatus((prev) => ({
              ...prev,
              isSlowConnection: isNowSlowConnection,
            }));
          }
        } catch (error) {
          // En cas d'erreur, marquer comme offline
          if (networkStatus.isOnline) {
            setNetworkStatus((prev) => ({
              ...prev,
              isOnline: false,
            }));
          }
        }
      }
    }, 30000);

    // Nettoyage
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          connection.removeEventListener("change", handleConnectionChange);
        }
      }

      clearInterval(testInterval);
    };
  }, [
    updateNetworkStatus,
    testConnectionSpeed,
    networkStatus.isOnline,
    networkStatus.isSlowConnection,
  ]);

  return {
    ...networkStatus,
    testConnectionSpeed,
    refresh: updateNetworkStatus,
  };
}

// Hook pour gérer les actions quand offline/online
export function useOfflineActions() {
  const [offlineActions, setOfflineActions] = useState<
    Array<{
      id: string;
      action: () => Promise<void>;
      description: string;
      timestamp: number;
    }>
  >([]);

  const addOfflineAction = useCallback(
    (action: () => Promise<void>, description: string) => {
      const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setOfflineActions((prev) => [
        ...prev,
        {
          id,
          action,
          description,
          timestamp: Date.now(),
        },
      ]);

      return id;
    },
    [],
  );

  const executeOfflineActions = useCallback(async () => {
    if (offlineActions.length === 0) return;

    console.log(`[Offline] Executing ${offlineActions.length} pending actions`);

    const results = [];
    for (const actionItem of offlineActions) {
      try {
        await actionItem.action();
        results.push({ id: actionItem.id, success: true });
        console.log(
          `[Offline] Successfully executed: ${actionItem.description}`,
        );
      } catch (error) {
        results.push({ id: actionItem.id, success: false, error });
        console.error(
          `[Offline] Failed to execute: ${actionItem.description}`,
          error,
        );
      }
    }

    // Supprimer les actions réussies
    const successfulIds = results.filter((r) => r.success).map((r) => r.id);

    setOfflineActions((prev) =>
      prev.filter((action) => !successfulIds.includes(action.id)),
    );

    return results;
  }, [offlineActions]);

  const clearOfflineActions = useCallback(() => {
    setOfflineActions([]);
  }, []);

  return {
    offlineActions,
    addOfflineAction,
    executeOfflineActions,
    clearOfflineActions,
    hasOfflineActions: offlineActions.length > 0,
  };
}

// Hook combiné pour gérer le statut réseau et les actions offline
export function useNetworkManager() {
  const networkStatus = useNetworkStatus();
  const offlineActions = useOfflineActions();

  useEffect(() => {
    // Quand on revient online, exécuter les actions en attente
    if (networkStatus.isOnline && offlineActions.hasOfflineActions) {
      console.log("[Network] Back online, executing pending actions");
      offlineActions.executeOfflineActions();
    }
  }, [networkStatus.isOnline, offlineActions]);

  return {
    ...networkStatus,
    ...offlineActions,
  };
}
