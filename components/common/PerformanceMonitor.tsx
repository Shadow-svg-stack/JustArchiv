import React, { useEffect, useCallback } from "react";

interface PerformanceMetrics {
  navigationTiming: PerformanceNavigationTiming | null;
  resourceTiming: PerformanceResourceTiming[];
  memoryUsage: any;
  connectionInfo: any;
  vitals: {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
  };
}

interface PerformanceMonitorProps {
  onMetricsCollected?: (metrics: PerformanceMetrics) => void;
  reportInterval?: number; // en millisecondes
  enableVitals?: boolean;
}

export function PerformanceMonitor({
  onMetricsCollected,
  reportInterval = 30000, // 30 secondes par défaut
  enableVitals = true,
}: PerformanceMonitorProps) {
  const collectMetrics = useCallback((): PerformanceMetrics => {
    const metrics: PerformanceMetrics = {
      navigationTiming: null,
      resourceTiming: [],
      memoryUsage: null,
      connectionInfo: null,
      vitals: {},
    };

    // Navigation Timing
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        metrics.navigationTiming =
          navigationEntries[0] as PerformanceNavigationTiming;
      }

      // Resource Timing
      metrics.resourceTiming = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
    }

    // Memory Usage (Chrome uniquement)
    if ("memory" in performance) {
      metrics.memoryUsage = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }

    // Connection Info
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      metrics.connectionInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }

    return metrics;
  }, []);

  const collectVitals = useCallback(() => {
    if (!enableVitals || typeof window === "undefined") return;

    // First Contentful Paint
    const fcpEntries = performance.getEntriesByName("first-contentful-paint");
    if (fcpEntries.length > 0) {
      const fcp = fcpEntries[0].startTime;
      console.log("[Performance] FCP:", fcp);
    }

    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.log("[Performance] LCP:", lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime;
            console.log("[Performance] FID:", fid);
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          if (clsValue > 0) {
            console.log("[Performance] CLS:", clsValue);
          }
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (error) {
        console.warn(
          "[Performance] PerformanceObserver not fully supported:",
          error,
        );
      }
    }
  }, [enableVitals]);

  const reportMetrics = useCallback(() => {
    const metrics = collectMetrics();

    // Log des métriques en développement
    if (process.env.NODE_ENV === "development") {
      console.group("[Performance Metrics]");

      if (metrics.navigationTiming) {
        const nav = metrics.navigationTiming;
        console.log(
          "DOM Content Loaded:",
          nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          "ms",
        );
        console.log(
          "Load Complete:",
          nav.loadEventEnd - nav.loadEventStart,
          "ms",
        );
        console.log(
          "DNS Lookup:",
          nav.domainLookupEnd - nav.domainLookupStart,
          "ms",
        );
        console.log("TCP Connection:", nav.connectEnd - nav.connectStart, "ms");
        console.log(
          "Request/Response:",
          nav.responseEnd - nav.requestStart,
          "ms",
        );
      }

      if (metrics.memoryUsage) {
        const memory = metrics.memoryUsage;
        console.log(
          "JS Heap Used:",
          (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
          "MB",
        );
        console.log(
          "JS Heap Total:",
          (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
          "MB",
        );
        console.log(
          "JS Heap Limit:",
          (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
          "MB",
        );
      }

      if (metrics.connectionInfo) {
        console.log("Connection:", metrics.connectionInfo);
      }

      // Ressources lentes
      const slowResources = metrics.resourceTiming
        .filter((resource) => resource.duration > 1000) // > 1s
        .sort((a, b) => b.duration - a.duration);

      if (slowResources.length > 0) {
        console.warn("Slow Resources:");
        slowResources.slice(0, 5).forEach((resource) => {
          console.warn(`${resource.name}: ${resource.duration.toFixed(2)}ms`);
        });
      }

      console.groupEnd();
    }

    // Envoyer les métriques en production
    if (process.env.NODE_ENV === "production") {
      try {
        // Envoyer vers votre backend ou service d'analytics
        fetch("/api/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics,
          }),
        }).catch(() => {
          // Stocker localement si l'envoi échoue
          const performanceData = JSON.parse(
            localStorage.getItem("justarchiv_performance") || "[]",
          );
          performanceData.push({ timestamp: Date.now(), metrics });
          localStorage.setItem(
            "justarchiv_performance",
            JSON.stringify(performanceData.slice(-50)),
          );
        });
      } catch (error) {
        console.warn("[Performance] Failed to report metrics:", error);
      }
    }

    // Callback personnalisé
    if (onMetricsCollected) {
      onMetricsCollected(metrics);
    }
  }, [collectMetrics, onMetricsCollected]);

  const detectPerformanceIssues = useCallback(() => {
    // Détection automatique de problèmes de performance
    const metrics = collectMetrics();

    if (metrics.navigationTiming) {
      const nav = metrics.navigationTiming;
      const totalLoadTime = nav.loadEventEnd - nav.navigationStart;

      // Temps de chargement trop long
      if (totalLoadTime > 5000) {
        console.warn(
          "[Performance] Slow page load detected:",
          totalLoadTime,
          "ms",
        );
      }

      // DNS lookup lent
      const dnsTime = nav.domainLookupEnd - nav.domainLookupStart;
      if (dnsTime > 1000) {
        console.warn("[Performance] Slow DNS lookup:", dnsTime, "ms");
      }

      // Connexion TCP lente
      const tcpTime = nav.connectEnd - nav.connectStart;
      if (tcpTime > 1000) {
        console.warn("[Performance] Slow TCP connection:", tcpTime, "ms");
      }
    }

    // Mémoire excessive
    if (metrics.memoryUsage) {
      const memoryUsagePercent =
        (metrics.memoryUsage.usedJSHeapSize /
          metrics.memoryUsage.jsHeapSizeLimit) *
        100;
      if (memoryUsagePercent > 80) {
        console.warn(
          "[Performance] High memory usage:",
          memoryUsagePercent.toFixed(2),
          "%",
        );
      }
    }

    // Ressources multiples du même domaine (possible optimisation de bundling)
    const resourcesByDomain = metrics.resourceTiming.reduce(
      (acc, resource) => {
        try {
          const domain = new URL(resource.name).hostname;
          acc[domain] = (acc[domain] || 0) + 1;
        } catch {
          // Ignore invalid URLs
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    Object.entries(resourcesByDomain).forEach(([domain, count]) => {
      if (count > 10 && domain !== window.location.hostname) {
        console.warn(
          `[Performance] Many requests to ${domain}: ${count} requests`,
        );
      }
    });
  }, [collectMetrics]);

  useEffect(() => {
    // Collecter les Web Vitals au montage
    collectVitals();

    // Observer les erreurs de ressources
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      console.error(
        "[Performance] Resource failed to load:",
        target.getAttribute("src") || target.getAttribute("href"),
      );
    };

    document.addEventListener("error", handleResourceError, true);

    // Interval de reporting
    const intervalId = setInterval(() => {
      reportMetrics();
      detectPerformanceIssues();
    }, reportInterval);

    // Rapport initial après le chargement complet
    const initialReportTimeout = setTimeout(() => {
      reportMetrics();
      detectPerformanceIssues();
    }, 2000);

    // Rapport avant fermeture de page
    const handleBeforeUnload = () => {
      reportMetrics();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("error", handleResourceError, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(intervalId);
      clearTimeout(initialReportTimeout);
    };
  }, [reportInterval, reportMetrics, detectPerformanceIssues, collectVitals]);

  // Ce composant ne rend rien
  return null;
}

// Hook pour mesurer les performances d'une action spécifique
export function usePerformanceMeasure() {
  return useCallback((name: string, fn: () => void | Promise<void>) => {
    const measureName = `justarchiv-${name}`;
    const startMark = `${measureName}-start`;
    const endMark = `${measureName}-end`;

    return async () => {
      performance.mark(startMark);

      try {
        await fn();
      } finally {
        performance.mark(endMark);
        performance.measure(measureName, startMark, endMark);

        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && process.env.NODE_ENV === "development") {
          console.log(
            `[Performance] ${name}:`,
            measure.duration.toFixed(2),
            "ms",
          );
        }
      }
    };
  }, []);
}

export default PerformanceMonitor;
