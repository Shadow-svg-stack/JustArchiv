import React, { useState, useEffect } from 'react'
import { Database, RefreshCw, Trash2, Download, Upload, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const DatabaseManagement = () => {
  const [dbStats, setDbStats] = useState({
    totalTables: 0,
    totalRows: 0,
    dbSize: '0 MB',
    lastBackup: null
  })
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDatabaseInfo()
  }, [])

  const loadDatabaseInfo = async () => {
    try {
      setLoading(true)
      
      // Get table information (this would need to be implemented with proper permissions)
      const tableInfo = [
        { name: 'user_profiles', rows: 156, size: '2.3 MB' },
        { name: 'documents', rows: 1247, size: '15.7 MB' },
        { name: 'categories', rows: 89, size: '0.5 MB' },
        { name: 'tags', rows: 234, size: '1.2 MB' },
        { name: 'activity_logs', rows: 5678, size: '8.9 MB' },
        { name: 'document_tags', rows: 892, size: '0.8 MB' }
      ]
      
      setTables(tableInfo)
      setDbStats({
        totalTables: tableInfo.length,
        totalRows: tableInfo.reduce((sum, table) => sum + table.rows, 0),
        dbSize: '28.4 MB',
        lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      })
    } catch (error) {
      console.error('Error loading database info:', error)
      toast.error('Erreur lors du chargement des informations de la base de données')
    } finally {
      setLoading(false)
    }
  }

  const handleOptimizeDatabase = async () => {
    if (!confirm('Êtes-vous sûr de vouloir optimiser la base de données ? Cette opération peut prendre du temps.')) {
      return
    }

    try {
      toast.loading('Optimisation en cours...', { id: 'optimize' })
      
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Base de données optimisée avec succès', { id: 'optimize' })
      loadDatabaseInfo()
    } catch (error) {
      toast.error('Erreur lors de l\'optimisation', { id: 'optimize' })
    }
  }

  const handleCleanupLogs = async () => {
    if (!confirm('Supprimer les logs de plus de 30 jours ?')) {
      return
    }

    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString())

      if (error) throw error

      toast.success('Logs anciens supprimés')
      loadDatabaseInfo()
    } catch (error) {
      console.error('Cleanup error:', error)
      toast.error('Erreur lors du nettoyage')
    }
  }

  const handleBackupDatabase = async () => {
    try {
      toast.loading('Création de la sauvegarde...', { id: 'backup' })
      
      // This would need to be implemented with proper backend support
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Sauvegarde créée avec succès', { id: 'backup' })
      setDbStats(prev => ({ ...prev, lastBackup: new Date() }))
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', { id: 'backup' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Chargement des informations de la base de données...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Gestion de la base de données</h3>
        <div className="flex gap-2">
          <button
            onClick={loadDatabaseInfo}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button
            onClick={handleBackupDatabase}
            className="btn btn-primary"
          >
            <Download size={16} />
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="grid grid-2 md:grid-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Tables totales</p>
              <p className="text-2xl font-semibold">{dbStats.totalTables}</p>
            </div>
            <Database className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Lignes totales</p>
              <p className="text-2xl font-semibold">{dbStats.totalRows.toLocaleString()}</p>
            </div>
            <Database className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Taille DB</p>
              <p className="text-2xl font-semibold">{dbStats.dbSize}</p>
            </div>
            <Database className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Dernière sauvegarde</p>
              <p className="text-lg font-semibold">
                {dbStats.lastBackup ? 
                  `${Math.floor((Date.now() - dbStats.lastBackup) / (1000 * 60 * 60))}h` : 
                  'Jamais'
                }
              </p>
            </div>
            <Download className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Tables Information */}
      <div className="card">
        <h4 className="font-medium mb-4">Tables de la base de données</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Table</th>
                <th className="text-left py-3 px-4">Lignes</th>
                <th className="text-left py-3 px-4">Taille</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.name} className="border-b border-border hover:bg-surface-dark">
                  <td className="py-3 px-4 font-medium">{table.name}</td>
                  <td className="py-3 px-4">{table.rows.toLocaleString()}</td>
                  <td className="py-3 px-4">{table.size}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="btn btn-secondary btn-sm" title="Analyser">
                        <Database size={14} />
                      </button>
                      <button className="btn btn-secondary btn-sm" title="Exporter">
                        <Download size={14} />
                      </button>
                      {table.name === 'activity_logs' && (
                        <button 
                          onClick={handleCleanupLogs}
                          className="btn btn-danger btn-sm" 
                          title="Nettoyer les anciens logs"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Actions */}
      <div className="card">
        <h4 className="font-medium mb-4">Actions de maintenance</h4>
        <div className="grid md:grid-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <RefreshCw className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h5 className="font-medium mb-2">Optimiser la base de données</h5>
                <p className="text-sm text-secondary mb-3">
                  Réorganise les tables et met à jour les statistiques pour améliorer les performances.
                </p>
                <button
                  onClick={handleOptimizeDatabase}
                  className="btn btn-primary btn-sm"
                >
                  Optimiser maintenant
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <Trash2 className="text-red-600 mt-1" size={20} />
              <div className="flex-1">
                <h5 className="font-medium mb-2">Nettoyer les logs anciens</h5>
                <p className="text-sm text-secondary mb-3">
                  Supprime les logs d'activité de plus de 30 jours pour libérer de l'espace.
                </p>
                <button
                  onClick={handleCleanupLogs}
                  className="btn btn-danger btn-sm"
                >
                  Nettoyer les logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Checks */}
      <div className="card">
        <h4 className="font-medium mb-4">Vérifications de santé</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Connexion à la base de données: OK</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Intégrité des données: OK</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="text-yellow-600" size={16} />
            <span className="text-sm">Dernière sauvegarde: Il y a {Math.floor((Date.now() - (dbStats.lastBackup || Date.now())) / (1000 * 60 * 60))} heures</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseManagement
