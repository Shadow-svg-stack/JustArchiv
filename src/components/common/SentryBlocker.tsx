import { useEffect } from "react";

export function SentryBlocker() {
  useEffect(() => {
    // ULTIMATE PERFORMANCE BLOCKER - Version Production Finale
    try {
      console.log(
        "[🚀 ULTIMATE BLOCKER] Initializing maximum performance mode...",
      );

      // Patterns ultra-optimisés avec RegExp précompilées
      const BLOCKED_PATTERNS = [
        /sentry\.io/i,
        /o22594\.ingest\.us\.sentry\.io/i,
        /ingest\.sentry\.io/i,
        /js\.sentry-cdn\.com/i,
        /browser\.sentry-cdn\.com/i,
        /cdn\.ravenjs\.com/i,
        /figma\.com.*webpack/i,
        /figma\.com\/webpack-artifacts/i,
        /\bapi\/56203\b/i,
        /sentry_key=/i,
      ];

      // Cache pour les vérifications rapides
      const blockedCache = new Map();

      const isBlocked = (url) => {
        if (blockedCache.has(url)) return blockedCache.get(url);
        const blocked = BLOCKED_PATTERNS.some((pattern) => pattern.test(url));
        blockedCache.set(url, blocked);
        return blocked;
      };

      // ========== NIVEAU 1: INTERCEPTION NATIVE ==========

      // Fetch ultra-agressif
      if (typeof window !== "undefined" && window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function (resource, options) {
          try {
            const url =
              typeof resource === "string"
                ? resource
                : resource instanceof URL
                  ? resource.href
                  : resource.url || resource.toString();

            if (isBlocked(url)) {
              console.log("[🚫 ULTIMATE BLOCK] FETCH:", url);
              // Retourne une promesse qui échoue immédiatement
              return Promise.reject(new Error("BLOCKED_FOR_PERFORMANCE"));
            }

            return originalFetch.call(this, resource, options);
          } catch (error) {
            return originalFetch.call(this, resource, options);
          }
        };
      }

      // XMLHttpRequest ultra-agressif
      if (typeof window !== "undefined" && window.XMLHttpRequest) {
        const OriginalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function () {
          const xhr = new OriginalXHR();
          const originalOpen = xhr.open;
          const originalSend = xhr.send;

          xhr.open = function (method, url, ...args) {
            try {
              const urlString = url.toString();
              if (isBlocked(urlString)) {
                console.log("[🚫 ULTIMATE BLOCK] XHR:", urlString);
                // Immédiatement déclencher une erreur
                setTimeout(() => {
                  if (xhr.onerror) xhr.onerror(new ErrorEvent("error"));
                }, 0);
                return;
              }
              return originalOpen.call(this, method, url, ...args);
            } catch (error) {
              return originalOpen.call(this, method, url, ...args);
            }
          };

          xhr.send = function (data) {
            try {
              return originalSend.call(this, data);
            } catch (error) {
              if (xhr.onerror) xhr.onerror(new ErrorEvent("error"));
            }
          };

          return xhr;
        };
      }

      // ========== NIVEAU 2: SENTRY NEUTRALISATION TOTALE ==========

      const ultimateSentryMock = {
        // Core methods
        init: () => {
          console.log("[🚫 SENTRY] init() blocked");
        },
        captureException: () => {
          console.log("[🚫 SENTRY] captureException() blocked");
        },
        captureMessage: () => {
          console.log("[🚫 SENTRY] captureMessage() blocked");
        },
        captureEvent: () => {
          console.log("[🚫 SENTRY] captureEvent() blocked");
        },

        // Scope methods
        configureScope: () => {
          console.log("[🚫 SENTRY] configureScope() blocked");
        },
        withScope: (callback) => {
          console.log("[🚫 SENTRY] withScope() blocked");
          try {
            if (callback) callback({});
          } catch (e) {}
        },
        pushScope: () => {
          console.log("[🚫 SENTRY] pushScope() blocked");
        },
        popScope: () => {
          console.log("[🚫 SENTRY] popScope() blocked");
        },

        // Context methods
        setUser: () => {
          console.log("[🚫 SENTRY] setUser() blocked");
        },
        setTag: () => {
          console.log("[🚫 SENTRY] setTag() blocked");
        },
        setTags: () => {
          console.log("[🚫 SENTRY] setTags() blocked");
        },
        setContext: () => {
          console.log("[🚫 SENTRY] setContext() blocked");
        },
        setExtra: () => {
          console.log("[🚫 SENTRY] setExtra() blocked");
        },
        setExtras: () => {
          console.log("[🚫 SENTRY] setExtras() blocked");
        },

        // Breadcrumbs
        addBreadcrumb: () => {
          console.log("[🚫 SENTRY] addBreadcrumb() blocked");
        },

        // Hub methods
        getCurrentHub: () => ultimateSentryMock,
        getClient: () => null,
        close: () => {
          console.log("[🚫 SENTRY] close() blocked");
          return Promise.resolve(true);
        },
        flush: () => {
          console.log("[🚫 SENTRY] flush() blocked");
          return Promise.resolve(true);
        },

        // Integration methods
        addIntegration: () => {
          console.log("[🚫 SENTRY] addIntegration() blocked");
        },

        // Session methods
        startSession: () => {
          console.log("[🚫 SENTRY] startSession() blocked");
        },
        endSession: () => {
          console.log("[🚫 SENTRY] endSession() blocked");
        },

        // Tracing (new methods)
        startTransaction: () => {
          console.log("[🚫 SENTRY] startTransaction() blocked");
          return { finish: () => {}, setStatus: () => {}, setTag: () => {} };
        },
      };

      // Forcer la redéfinition de Sentry
      try {
        Object.defineProperty(window, "Sentry", {
          value: ultimateSentryMock,
          writable: false,
          configurable: false,
          enumerable: false,
        });
      } catch (e) {
        try {
          window.Sentry = ultimateSentryMock;
        } catch (e2) {
          console.log("[🚫 SENTRY] Could not override, using fallback");
        }
      }

      // Nettoyer les variables globales Sentry
      try {
        window.__SENTRY__ = undefined;
        window.__SENTRY_DEBUG__ = false;
        if (window.SENTRY_RELEASE) window.SENTRY_RELEASE = undefined;
      } catch (e) {}

      // ========== NIVEAU 3: PRÉVENTION DES INJECTIONS ==========

      // Observer ultra-agressif pour les scripts injectés
      let observer;
      try {
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                const element = node;

                // Bloquer les scripts
                if (element.tagName === "SCRIPT") {
                  const src = element.src || element.getAttribute("src") || "";
                  const content =
                    element.textContent || element.innerHTML || "";

                  if (
                    isBlocked(src) ||
                    BLOCKED_PATTERNS.some((p) => p.test(content))
                  ) {
                    console.log(
                      "[🚫 SCRIPT INJECTION] Blocked:",
                      src || "inline",
                    );
                    element.remove();
                    return;
                  }
                }

                // Bloquer les iframes suspects
                if (element.tagName === "IFRAME") {
                  const src = element.src || element.getAttribute("src") || "";
                  if (isBlocked(src)) {
                    console.log("[🚫 IFRAME INJECTION] Blocked:", src);
                    element.remove();
                    return;
                  }
                }

                // Bloquer les images de tracking
                if (element.tagName === "IMG") {
                  const src = element.src || element.getAttribute("src") || "";
                  if (isBlocked(src)) {
                    console.log("[🚫 IMAGE TRACKING] Blocked:", src);
                    element.remove();
                    return;
                  }
                }
              }
            });
          });
        });

        // Observer tout le document
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["src", "href"],
        });
      } catch (e) {
        console.log("[🚫 OBSERVER] Could not setup observer:", e.message);
      }

      // ========== NIVEAU 4: NETTOYAGE INITIAL ==========

      // Nettoyer les scripts existants
      setTimeout(() => {
        try {
          const scripts = document.querySelectorAll("script");
          scripts.forEach((script) => {
            const src = script.src || "";
            const content = script.textContent || script.innerHTML || "";

            if (
              isBlocked(src) ||
              BLOCKED_PATTERNS.some((p) => p.test(content))
            ) {
              console.log(
                "[🚫 CLEANUP] Removed existing script:",
                src || "inline",
              );
              script.remove();
            }
          });
        } catch (e) {
          console.log("[🚫 CLEANUP] Error during cleanup:", e.message);
        }
      }, 100);

      // ========== NIVEAU 5: SURVEILLANCE CONTINUE ==========

      // Vérification périodique
      const monitoringInterval = setInterval(() => {
        try {
          // Vérifier si Sentry a été réinjecté
          if (window.Sentry && window.Sentry !== ultimateSentryMock) {
            console.log(
              "[🔄 MONITOR] Sentry reinjection detected, blocking again",
            );
            window.Sentry = ultimateSentryMock;
          }

          // Nettoyer le cache si trop gros
          if (blockedCache.size > 100) {
            blockedCache.clear();
          }
        } catch (e) {}
      }, 5000);

      // Nettoyage au démontage
      return () => {
        try {
          if (observer) observer.disconnect();
          if (monitoringInterval) clearInterval(monitoringInterval);
          blockedCache.clear();
        } catch (e) {}
      };

      console.log("[🚀 ULTIMATE BLOCKER] ✅ Maximum performance mode ACTIVE");
    } catch (globalError) {
      console.log(
        "[🚀 ULTIMATE BLOCKER] ⚠️ Error during initialization:",
        globalError.message,
        "- continuing with basic mode",
      );
    }
  }, []);

  return null;
}

export default SentryBlocker;
