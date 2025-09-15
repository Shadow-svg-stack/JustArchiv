import React, { useState } from 'react'
import { 
  Settings, 
  RefreshCw, 
  Trash2, 
  Download, 
  Upload, 
  Database,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const MaintenanceTools = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState({})

  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  const handleClearCache = async () => {
    if (!confirm('Vider tous les caches ? Cette action peut temporairement ralentir l\'application.')) {
      return
    }

    try {
      setLoadingState('cache', true)
      
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }
      
      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      toast.success('Cache vidé avec succès')
    } catch (error) {
      console.error('Cache clear error:', error)
      toast.error('Erreur lors du vidage du cache')
    } finally {
      setLoadingState('cache', false)
    }
  }

  const handleRestartServices = async () => {
    if (!confirm('Redémarrer les services ? Cette action peut interrompre temporairement le service.')) {
      return
    }

    try {
      setLoadingState('restart', true)
      toast.loading('Redémarrage des services...', { id: 'restart' })
      
      // Simulate service restart
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      toast.success('Services redémarrés avec succès', { id: 'restart' })
    } catch (error) {
      toast.error('Erreur lors du redémarrage', { id: 'restart' })
    } finally {
      setLoadingState('restart', false)
    }
  }

  const handleToggleMaintenanceMode = async () => {
    try {
      setLoadingState('maintenance', true)
      
      // Toggle maintenance mode
      const newMode = !maintenanceMode
      setMaintenanceMode(newMode)
      
      // Store in localStorage for persistence
      localStorage.setItem('maintenanceMode', newMode.toString())
      
      toast.success(
        newMode ? 
        'Mode maintenance activé - Les utilisateurs verront un message de maintenance' :
        'Mode maintenance désactivé - L\'application est de nouveau accessible'
      )
    } catch (error) {
      toast.error('Erreur lors du changement de mode')
    } finally {
      setLoadingState('maintenance', false)
    }
  }

  const handleOptimizeStorage = async () => {
    if (!confirm('Optimiser le stockage ? Cette opération peut prendre du temps.')) {
      return
    }

    try {
      setLoadingState('optimize', true)
      toast.loading('Optimisation du stockage...', { id: 'optimize' })
      
      // Simulate storage optimization
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Stockage optimisé - 2.3 GB libérés', { id: 'optimize' })
    } catch (error) {
      toast.error('Erreur lors de l\'optimisation', { id: 'optimize' })
    } finally {
      setLoadingState('optimize', false)
    }
  }

  const handleExportLogs = async () => {
    try {
      setLoadingState('export', true)
      
      // Simulate log export
      const logs = [
        'timestamp,level,message,user',
        '2024-01-15T10:30:00Z,INFO,User login,user123',
        '2024-01-15T10:31:00Z,ERROR,Upload failed,user456',
        '2024-01-15T10:32:00Z,WARN,Slow query detected,system'
      ].join('\n')
      
      const blob = new Blob([logs], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Logs exportés avec succès')
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    } finally {
      setLoadingState('export', false)
    }
  }

  const handleRunHealthCheck = async () => {
    try {
      setLoadingState('health', true)
      toast.loading('Vérification de l\'état du système...', { id: 'health' })
      
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const healthResults = [
        { service: 'Base de données', status: 'OK', responseTime: '45ms' },
        { service: 'Stockage', status: 'OK', responseTime: '12ms' },
        { service: 'API', status: 'OK', responseTime: '23ms' },
        { service: 'Cache', status: 'WARNING', responseTime: '156ms' }
      ]
      
      const hasWarnings = healthResults.some(r => r.status === 'WARNING')
      const hasErrors = healthResults.some(r => r.status === 'ERROR')
      
      if (hasErrors) {
        toast.error('Problèmes détectés dans le système', { id: 'health' })
      } else if (hasWarnings) {
        toast.success('Système fonctionnel avec quelques avertissements', { id: 'health' })
      } else {
        toast.success('Tous les services fonctionnent correctement', { id: 'health' })
      }
      
      // Show detailed results
      console.table(healthResults)
    } catch (error) {
      toast.error('Erreur lors de la vérification', { id: 'health' })
    } finally {
      setLoadingState('health', false)
    }
  }

  const maintenanceTools = [
    {
      title: 'Vider le cache',
      description: 'Supprime tous les caches pour forcer le rechargement des ressources',
      icon: RefreshCw,
      action: handleClearCache,
      loading: loading.cache,
      color: 'blue'
    },
    {
      title: 'Redémarrer les services',
      description: 'Redémarre tous les services backend pour appliquer les changements',
      icon: Zap,
      action: handleRestartServices,
      loading: loading.restart,
      color: 'orange'
    },
    {
      title: 'Optimiser le stockage',
      description: 'Nettoie les fichiers temporaires et optimise l\'espace disque',
      icon: Database,
      action: handleOptimizeStorage,
      loading: loading.optimize,
      color: 'green'
    },
    {
      title: 'Exporter les logs',
      description: 'Télécharge tous les logs système au format CSV',
      icon: Download,
      action: handleExportLogs,
      loading: loading.export,
      color: 'purple'
    },
    {
      title: 'Vérification système',
      description: 'Lance un diagnostic complet de tous les services',
      icon: CheckCircle,
      action: handleRunHealthCheck,
      loading: loading.health,
      color: 'indigo'
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Outils de maintenance</h3>

      {/* Maintenance Mode Toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${maintenanceMode ? 'bg-red-100' : 'bg-green-100'}`}>
              {maintenanceMode ? 
                <AlertTriangle className="text-red-600" size={20} /> :
                <CheckCircle className="text-green-600" size={20} />
              }
            </div>
            <div>
              <h4 className="font-medium">Mode maintenance</h4>
              <p className="text-sm text-secondary">
                {maintenanceMode ? 
                  'L\'application est en maintenance - Les utilisateurs voient un message d\'indisponibilité' :
                  'L\'application est accessible normalement'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggleMaintenanceMode}
            disabled={loading.maintenance}
            className={`btn ${maintenanceMode ? 'btn-success' : 'btn-danger'}`}
          >
            {loading.maintenance ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <>
                {maintenanceMode ? 'Désactiver' : 'Activer'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Maintenance Tools Grid */}
      <div className="grid md:grid-2 gap-4">
        {maintenanceTools.map((tool, index) => (
          <div key={index} className="card hover-scale">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-${tool.color}-100`}>
                <tool.icon className={`text-${tool.color}-600`} size={24} />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium mb-2">{tool.title}</h4>
                <p className="text-sm text-secondary mb-4">{tool.description}</p>
                
                <button
                  onClick={tool.action}
                  disabled={tool.loading}
                  className="btn btn-primary btn-sm"
                >
                  {tool.loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={14} />
                      En cours...
                    </>
                  ) : (
                    <>
                      <tool.icon size={14} />
                      Exécuter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Information */}
      <div className="card">
        <h4 className="font-medium mb-4">Informations système</h4>
        <div className="grid md:grid-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary">Version de l'application:</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Dernière mise à jour:</span>
              <span className="font-medium">15/01/2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Environnement:</span>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Région:</span>
              <span className="font-medium">Europe (Paris)</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary">Temps de fonctionnement:</span>
              <span className="font-medium">15j 7h 23m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Dernière sauvegarde:</span>
              <span className="font-medium">Il y a 2h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Prochaine maintenance:</span>
              <span className="font-medium">Dimanche 3h00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Support technique:</span>
              <span className="font-medium">Actif 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h4 className="font-medium mb-4">Actions rapides</h4>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            Redémarrer Nginx
          </button>
          <button className="btn btn-secondary btn-sm">
            <Database size={14} />
            Vider les sessions
          </button>
          <button className="btn btn-secondary btn-sm">
            <Trash2 size={14} />
            Nettoyer les logs
          </button>
          <button className="btn btn-secondary btn-sm">
            <Upload size={14} />
            Déployer mise à jour
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceTools
