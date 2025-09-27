import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Archive,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  FolderOpen,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { supabase } from "../utils/supabase/client";

interface SystemStats {
  totalDocuments: number;
  totalUsers: number;
  totalCategories: number;
  totalStorage: number;
  documentsThisMonth: number;
  activeUsers: number;
  lastBackup: string;
}

export function DashboardPage() {
  const { user, isBackendAvailable } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isBackendAvailable && user) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [isBackendAvailable, user]);

  const loadStats = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("Session expirée");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-450d4529/stats`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || "Erreur lors du chargement des statistiques",
        );
      }
    } catch (err) {
      console.error("Stats loading error:", err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const dashboardStats = stats
    ? [
        {
          title: "Documents totaux",
          value: stats.totalDocuments.toLocaleString(),
          description: "Documents stockés",
          icon: FileText,
          trend: {
            value: stats.documentsThisMonth,
            label: "ce mois",
            isPositive: true,
          },
          color: "bg-gradient-to-br from-blue-500 to-cyan-500",
        },
        {
          title: "Utilisateurs actifs",
          value: stats.activeUsers,
          description: `sur ${stats.totalUsers} comptes`,
          icon: Users,
          trend: { value: stats.totalUsers, label: "total", isPositive: true },
          color: "bg-gradient-to-br from-green-500 to-emerald-500",
        },
        {
          title: "Stockage utilisé",
          value: formatFileSize(stats.totalStorage),
          description: "Espace total",
          icon: Archive,
          color: "bg-gradient-to-br from-purple-500 to-pink-500",
        },
        {
          title: "Catégories",
          value: stats.totalCategories,
          description: "Organisations",
          icon: FolderOpen,
          color: "bg-gradient-to-br from-orange-500 to-red-500",
        },
      ]
    : [];

  if (!isBackendAvailable) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Service temporairement indisponible. Veuillez réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">
            Chargement du tableau de bord...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadStats} className="mt-4" variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getWelcomeMessage()}, {user?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Voici un aperçu de votre espace documentaire
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {user?.role}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Cartes de statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Vue d'ensemble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Activité récente */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Commencez par ajouter des documents</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu du stockage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Utilisation du stockage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats ? (
              <>
                <div className="flex justify-between text-sm">
                  <span>Utilisé</span>
                  <span>{formatFileSize(stats.totalStorage)}</span>
                </div>
                <Progress value={15} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Espace disponible illimité
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <span>Aucune donnée</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Nouveau document
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Nouvelle catégorie
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Voir les rapports
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
