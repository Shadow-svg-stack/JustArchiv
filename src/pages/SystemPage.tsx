import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Database,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Upload,
  Trash2,
  HardDrive,
  Cpu,
  Wifi,
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
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { formatFileSize } from "../data/mockData";

export function SystemPage() {
  const { hasPermission } = useAuth();
  const [isRestarting, setIsRestarting] = useState(false);

  if (!hasPermission("system_maintenance")) {
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

  const systemStats = {
    uptime: "15 jours 6h 23min",
    cpu: 15,
    memory: 68,
    disk: 45,
    network: 92,
    processes: 134,
    temperature: 42,
  };

  const services = [
    { name: "Web Server", status: "running", port: 3000, memory: "256 MB" },
    { name: "Database", status: "running", port: 5432, memory: "512 MB" },
    { name: "File Storage", status: "running", port: 9000, memory: "128 MB" },
    { name: "Search Engine", status: "stopped", port: 9200, memory: "0 MB" },
    { name: "Cache Redis", status: "running", port: 6379, memory: "64 MB" },
  ];

  const logs = [
    {
      level: "info",
      message: "Application started successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      level: "warning",
      message: "High memory usage detected",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      level: "error",
      message: "Failed to connect to search service",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      level: "info",
      message: "Backup completed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      level: "info",
      message: "User session cleaned up",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
    },
  ];

  const handleRestartSystem = async () => {
    setIsRestarting(true);
    // Simulation du redémarrage
    setTimeout(() => {
      setIsRestarting(false);
    }, 3000);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getServiceBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="default" className="bg-green-500">
            En cours
          </Badge>
        );
      case "stopped":
        return <Badge variant="destructive">Arrêté</Badge>;
      case "error":
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
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
            <Server className="w-6 h-6 text-blue-600" />
            Maintenance Système
          </h1>
          <p className="text-muted-foreground">
            Surveillance et contrôle de l'infrastructure JustArchiv
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-500">
            Système opérationnel
          </Badge>
          <Button
            variant="outline"
            onClick={handleRestartSystem}
            disabled={isRestarting}
          >
            {isRestarting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Redémarrage...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Redémarrer
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemStats.cpu}%</p>
                  <p className="text-sm text-muted-foreground">CPU</p>
                  <Progress value={systemStats.cpu} className="h-1 mt-1" />
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
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemStats.memory}%</p>
                  <p className="text-sm text-muted-foreground">RAM</p>
                  <Progress value={systemStats.memory} className="h-1 mt-1" />
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
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemStats.disk}%</p>
                  <p className="text-sm text-muted-foreground">Stockage</p>
                  <Progress value={systemStats.disk} className="h-1 mt-1" />
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
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{systemStats.network}%</p>
                  <p className="text-sm text-muted-foreground">Réseau</p>
                  <Progress value={systemStats.network} className="h-1 mt-1" />
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
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Maintenance
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  État des services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              service.status === "running"
                                ? "bg-green-500"
                                : service.status === "stopped"
                                  ? "bg-gray-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <h3 className="font-semibold">{service.name}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Port: {service.port} • Mémoire: {service.memory}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getServiceBadge(service.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={service.status === "running"}
                        >
                          {service.status === "running"
                            ? "Arrêter"
                            : "Démarrer"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Temps de fonctionnement</span>
                    <span className="font-medium">{systemStats.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processus actifs</span>
                    <span className="font-medium">{systemStats.processes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Température CPU</span>
                    <span className="font-medium">
                      {systemStats.temperature}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version OS</span>
                    <span className="font-medium">Ubuntu 22.04 LTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Architecture</span>
                    <span className="font-medium">x86_64</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des ressources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>CPU</span>
                      <span>{systemStats.cpu}%</span>
                    </div>
                    <Progress value={systemStats.cpu} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>RAM</span>
                      <span>{systemStats.memory}%</span>
                    </div>
                    <Progress value={systemStats.memory} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Stockage</span>
                      <span>{systemStats.disk}%</span>
                    </div>
                    <Progress value={systemStats.disk} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Réseau</span>
                      <span>{systemStats.network}%</span>
                    </div>
                    <Progress value={systemStats.network} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Journaux système
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Nettoyer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20"
                    >
                      {getLogIcon(log.level)}
                      <div className="flex-1">
                        <p className="text-sm font-mono">{log.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.timestamp.toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.level.toUpperCase()}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Actions de maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start"
                    onClick={handleRestartSystem}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Redémarrer le système
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Créer une sauvegarde
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Restaurer une sauvegarde
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Optimiser la base de données
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Nettoyer les fichiers temporaires
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Planification des tâches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">
                          Sauvegarde quotidienne
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tous les jours à 2h00
                        </p>
                      </div>
                      <Badge variant="default">Actif</Badge>
                    </div>

                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">
                          Nettoyage des logs
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tous les dimanches à 3h00
                        </p>
                      </div>
                      <Badge variant="default">Actif</Badge>
                    </div>

                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Optimisation DB</p>
                        <p className="text-xs text-muted-foreground">
                          Tous les mois
                        </p>
                      </div>
                      <Badge variant="secondary">Inactif</Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Configurer les tâches
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
