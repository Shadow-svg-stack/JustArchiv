import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Settings,
  Key,
  FileText,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  HardDrive,
  Cpu,
  Network,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { formatFileSize, formatDateTime } from "../data/mockData";

export function AdminPage() {
  const { user, hasPermission } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Redirection si pas les permissions
  if (!hasPermission("view_admin_dashboard")) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous n'avez pas les permissions pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const systemHealth = {
    status: "healthy",
    uptime: "99.9%",
    cpu: 23,
    memory: 67,
    disk: 45,
    network: 89,
  };

  const securityAlerts = [
    {
      id: "1",
      type: "warning",
      message: "Tentative de connexion échouée détectée",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resolved: false,
    },
    {
      id: "2",
      type: "info",
      message: "Mise à jour de sécurité disponible",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resolved: false,
    },
    {
      id: "3",
      type: "success",
      message: "Sauvegarde automatique effectuée",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      resolved: true,
    },
  ];

  const auditLogs = [
    {
      id: "1",
      action: "USER_LOGIN",
      user: "Marie Dubois",
      details: "Connexion réussie",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      ip: "192.168.1.100",
    },
    {
      id: "2",
      action: "DOCUMENT_UPLOAD",
      user: "Pierre Martin",
      details: 'Upload de "Contrat_2024.pdf"',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      ip: "192.168.1.105",
    },
    {
      id: "3",
      action: "USER_CREATE",
      user: "Marie Dubois",
      details: "Création d'un nouvel utilisateur",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      ip: "192.168.1.100",
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            Administration Headmaster
          </h1>
          <p className="text-muted-foreground">
            Contrôle total de votre système JustArchiv
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              systemHealth.status === "healthy" ? "default" : "destructive"
            }
          >
            {systemHealth.status === "healthy"
              ? "Système sain"
              : "Problème détecté"}
          </Badge>
          <Button
            variant={maintenanceMode ? "destructive" : "outline"}
            onClick={() => setMaintenanceMode(!maintenanceMode)}
          >
            {maintenanceMode ? "Désactiver maintenance" : "Mode maintenance"}
          </Button>
        </div>
      </motion.div>

      {/* Maintenance Alert */}
      {maintenanceMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Mode maintenance activé. Les utilisateurs ne peuvent pas accéder
              au système.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{systemHealth.uptime}</p>
                  <p className="text-sm text-muted-foreground">Disponibilité</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemHealth.cpu}%</p>
                  <p className="text-sm text-muted-foreground">CPU</p>
                  <Progress value={systemHealth.cpu} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemHealth.memory}%</p>
                  <p className="text-sm text-muted-foreground">Mémoire</p>
                  <Progress value={systemHealth.memory} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemHealth.network}%</p>
                  <p className="text-sm text-muted-foreground">Réseau</p>
                  <Progress value={systemHealth.network} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Audit
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Sauvegarde
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Alertes de sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`p-3 rounded-lg border ${
                          alert.resolved
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(alert.timestamp)}
                            </p>
                          </div>
                          {!alert.resolved && (
                            <Button size="sm" variant="outline">
                              Résoudre
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Paramètres de sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Authentification à deux facteurs
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Protection supplémentaire des comptes
                      </p>
                    </div>
                    <Badge variant="outline">Recommandé</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Politique de mots de passe</p>
                      <p className="text-sm text-muted-foreground">
                        Minimum 8 caractères, complexité requise
                      </p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Blocage IP automatique</p>
                      <p className="text-sm text-muted-foreground">
                        Après 5 tentatives échouées
                      </p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Journalisation détaillée</p>
                      <p className="text-sm text-muted-foreground">
                        Enregistrement de toutes les actions
                      </p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Journal d'audit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.user} • {log.details}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(log.timestamp)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.ip}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center pt-4">
                  <Button variant="outline">Charger plus d'entrées</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Sauvegardes automatiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Fréquence</p>
                      <p className="text-sm text-muted-foreground">
                        Quotidienne à 2h00
                      </p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dernière sauvegarde</p>
                      <p className="text-sm text-muted-foreground">
                        Il y a 6 heures
                      </p>
                    </div>
                    <Badge variant="default">Succès</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Taille</p>
                      <p className="text-sm text-muted-foreground">2.3 GB</p>
                    </div>
                  </div>

                  <Button className="w-full">
                    Créer une sauvegarde maintenant
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique des sauvegardes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 6),
                        size: "2.3 GB",
                        status: "success",
                      },
                      {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 30),
                        size: "2.1 GB",
                        status: "success",
                      },
                      {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 54),
                        size: "2.0 GB",
                        status: "success",
                      },
                      {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 78),
                        size: "1.9 GB",
                        status: "failed",
                      },
                    ].map((backup, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <div className="flex items-center gap-2">
                          {backup.status === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {formatDateTime(backup.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {backup.size}
                          </span>
                          <Button size="sm" variant="ghost">
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Paramètres généraux</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Nom du site</span>
                        <span className="text-muted-foreground">
                          JustArchiv
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Version</span>
                        <span className="text-muted-foreground">v2.1.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Environnement</span>
                        <Badge variant="default">Production</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Base de données</span>
                        <Badge variant="default">PostgreSQL 15</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Limites système</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Taille max fichier</span>
                        <span className="text-muted-foreground">10 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilisateurs max</span>
                        <span className="text-muted-foreground">100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stockage max</span>
                        <span className="text-muted-foreground">1 TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sessions simultanées</span>
                        <span className="text-muted-foreground">50</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button>Modifier la configuration</Button>
                  <Button variant="outline">Exporter la configuration</Button>
                  <Button variant="outline">Redémarrer le système</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
