// JustArchiv Service Worker - v4.0 ULTIMATE PERFORMANCE
// Blocage ultra-agressif des ressources lentes

const CACHE_NAME = "justarchiv-v4.0";
const STATIC_CACHE = "justarchiv-static-v4";
const DYNAMIC_CACHE = "justarchiv-dynamic-v4";

// Ressources critiques
const CRITICAL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
];

// Patterns de blocage ultra-agressifs - Précompilés pour performance maximale
const ULTIMATE_BLOCKED_PATTERNS = [
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
  /\.figma\.site.*sentry/i,
];

// Cache ultra-rapide pour les vérifications
const blockCache = new Map();

const isUltimateBlocked = (url) => {
  if (blockCache.has(url)) return blockCache.get(url);
  const blocked = ULTIMATE_BLOCKED_PATTERNS.some((pattern) =>
    pattern.test(url),
  );
  blockCache.set(url, blocked);
  // Limiter la taille du cache
  if (blockCache.size > 200) {
    const firstKey = blockCache.keys().next().value;
    blockCache.delete(firstKey);
  }
  return blocked;
};

// Installation ultra-rapide
self.addEventListener("install", (event) => {
  console.log("[SW v4.0] 🚀 ULTIMATE PERFORMANCE MODE - Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(CRITICAL_ASSETS))
      .then(() => self.skipWaiting())
      .catch((error) => console.error("[SW] Cache error:", error)),
  );
});

// Activation optimisée
self.addEventListener("activate", (event) => {
  console.log("[SW v4.0] ⚡ Activating ULTIMATE performance mode");

  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter((name) => !name.includes("v4"))
              .map((name) => caches.delete(name)),
          ),
        ),
      self.clients.claim(),
    ]),
  );
});

// INTERCEPTEUR ULTRA-AGRESSIF - Niveau maximum
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // BLOCAGE IMMÉDIAT ET DÉFINITIF
  if (isUltimateBlocked(url)) {
    console.log("[SW v4.0] 🚫 ULTIMATE BLOCK:", url);

    // Triple blocage pour être sûr
    event.respondWith(Promise.reject(new Error("ULTIMATE_PERFORMANCE_BLOCK")));

    // Empêcher même la propagation de l'événement
    event.stopImmediatePropagation();
    return;
  }

  // Pour les autres requêtes, stratégie cache-first ultra-rapide
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request)
          .then((response) => {
            // Cache seulement les réponses OK et pas d'API
            if (
              response.ok &&
              !url.includes("api") &&
              !url.includes("functions")
            ) {
              caches
                .open(DYNAMIC_CACHE)
                .then((cache) => cache.put(event.request, response.clone()))
                .catch(() => {}); // Ignorer les erreurs de cache
            }
            return response;
          })
          .catch(() => {
            // En cas d'erreur réseau, essayer de servir l'index
            return caches.match("/index.html");
          });
      }),
    );
  }
});

// Messages ultra-optimisés
self.addEventListener("message", (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;
    case "GET_VERSION":
      event.ports[0]?.postMessage({ version: "4.0-ULTIMATE" });
      break;
    case "CLEAR_CACHE":
      caches
        .keys()
        .then((names) => Promise.all(names.map((name) => caches.delete(name))));
      break;
  }
});

// Nettoyage automatique du cache de blocage
setInterval(() => {
  if (blockCache.size > 150) {
    blockCache.clear();
    console.log("[SW v4.0] 🧹 Block cache cleared");
  }
}, 30000); // Toutes les 30 secondes

console.log(
  "[SW v4.0] 🚀✅ ULTIMATE PERFORMANCE SERVICE WORKER READY - Maximum blocking active",
);

// Error handling ultra-robuste
self.addEventListener("error", (event) => {
  console.error("[SW v4.0] Error:", event.error);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("[SW v4.0] Unhandled rejection:", event.reason);
  event.preventDefault(); // Empêcher l'affichage dans la console
});
