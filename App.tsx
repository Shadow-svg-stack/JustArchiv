import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { PerformanceMonitor } from "./components/common/PerformanceMonitor";
import { UpdateNotification } from "./components/common/UpdateNotification";
import SentryBlocker from "./components/common/SentryBlocker";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { LoginForm } from "./components/auth/LoginForm";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";

// Lazy loading des pages pour optimiser les performances
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const DocumentsPage = lazy(() =>
  import("./pages/DocumentsPage").then((m) => ({ default: m.DocumentsPage })),
);
const CategoriesPage = lazy(() =>
  import("./pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const UsersPage = lazy(() =>
  import("./pages/UsersPage").then((m) => ({ default: m.UsersPage })),
);
const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);
const SystemPage = lazy(() =>
  import("./pages/SystemPage").then((m) => ({ default: m.SystemPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          JustArchiv
        </h1>
        <p className="text-muted-foreground">
          Chargement de votre espace documentaire...
        </p>
      </motion.div>
    </div>
  );
}

// Composant de statut réseau
function NetworkStatus() {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("Connexion perdue", {
        description:
          "Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.",
        duration: 5000,
      });
    } else {
      toast.success("Connexion rétablie", {
        description: "Vous êtes de nouveau en ligne.",
        duration: 3000,
      });
    }
  }, [isOnline]);

  useEffect(() => {
    if (isSlowConnection) {
      toast.warning("Connexion lente détectée", {
        description:
          "Votre connexion semble lente. L'expérience peut être affectée.",
        duration: 5000,
      });
    }
  }, [isSlowConnection]);

  return (
    <div className="fixed top-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isOnline ? 0 : 1,
          scale: isOnline ? 0.8 : 1,
        }}
        className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-md shadow-lg"
      >
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Hors ligne</span>
      </motion.div>
    </div>
  );
}

// Composant de chargement pour Suspense
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Chargement...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Gestion de la navigation par raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            setActiveTab("dashboard");
            break;
          case "2":
            e.preventDefault();
            setActiveTab("documents");
            break;
          case "3":
            e.preventDefault();
            setActiveTab("categories");
            break;
          case "4":
            e.preventDefault();
            setActiveTab("users");
            break;
        }
      }

      // Raccourci pour recherche globale
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // TODO: Ouvrir une modal de recherche globale
        console.log("Global search shortcut");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Préchargement des pages pour améliorer les performances
  useEffect(() => {
    // Précharger les pages les plus utilisées après le chargement initial
    const preloadPages = async () => {
      if (user) {
        try {
          await Promise.all([
            import("./pages/DocumentsPage"),
            import("./pages/CategoriesPage"),
          ]);
        } catch (error) {
          console.warn("Failed to preload pages:", error);
        }
      }
    };

    const timeoutId = setTimeout(preloadPages, 2000);
    return () => clearTimeout(timeoutId);
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginForm />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Tableau de bord";
      case "documents":
        return "Documents";
      case "categories":
        return "Catégories";
      case "users":
        return "Utilisateurs";
      case "analytics":
        return "Analytics";
      case "admin":
        return "Administration";
      case "system":
        return "Système";
      case "settings":
        return "Paramètres";
      default:
        return "JustArchiv";
    }
  };

  const renderPage = () => {
    const pageProps = { key: activeTab };

    switch (activeTab) {
      case "dashboard":
        return <DashboardPage {...pageProps} />;
      case "documents":
        return <DocumentsPage {...pageProps} />;
      case "categories":
        return <CategoriesPage {...pageProps} />;
      case "users":
        return <UsersPage {...pageProps} />;
      case "analytics":
        return <AnalyticsPage {...pageProps} />;
      case "admin":
        return <AdminPage {...pageProps} />;
      case "system":
        return <SystemPage {...pageProps} />;
      case "settings":
        return <SettingsPage {...pageProps} />;
      default:
        return <DashboardPage {...pageProps} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background overflow-hidden">
        <NetworkStatus />

        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={getPageTitle()}
            showNewButton={["documents", "categories"].includes(activeTab)}
          />

          <main className="flex-1 overflow-auto">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>

        <UpdateNotification />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SentryBlocker />
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
          <PerformanceMonitor
            enableVitals={true}
            reportInterval={60000} // 1 minute
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
