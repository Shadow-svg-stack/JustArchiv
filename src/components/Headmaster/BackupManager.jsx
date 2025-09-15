import React, { useState, useEffect } from 'react'
import { Download, Upload, RefreshCw, Trash2, Calendar, HardDrive } from 'lucide-react'
import toast from 'react-hot-toast'

const BackupManager = () => {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      setLoading(true)
      
      // Simulate backup data
      const mockBackups = [
        {
          id: 1,
          name: 'backup-2024-01-15-03-00.sql',
          type: 'automatic',
          size: '45.2 MB',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          status: 'completed'
        },
        {
          id: 2,
          name: 'backup-2024-01-14-03-00.sql',
          type: 'automatic',
          size: '44.8 MB',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
          status: 'completed'
        },
        {
          id: 3,
          name: 'backup-manual-2024-01-13-15-30.sql',
          type: 'manual',
          size: '44.1 MB',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
          status: 'completed'
        },
        {
          id: 4,
          name: 'backup-2024-01-13-03-00.sql',
          type: 'automatic',
          size: '43.9 MB',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 54), // 54 hours ago
          status: 'completed'
        },
        {
          id: 5,
          name: 'backup-2024-01-12-03-00.sql',
          type: 'automatic',
          size: '43.5 MB',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 78), // 78 hours ago
          status: 'failed'
        }
      ]
      
      setBackups(mockBackups)
    } catch (error) {
      console.error('Error loading backups:', error)
      toast.error('Erreur lors du chargement des sauvegardes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      setCreating(true)
      toast.loading('Création de la sauvegarde...', { id: 'backup' })
      
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newBackup = {
        id: Date.now(),
        name: `backup-manual-${new Date().toISOString().split('T')[0]}-${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.sql`,
        type: 'manual',
        size: '45.5 MB',
        created_at: new Date(),
        status: 'completed'
      }
      
      setBackups(prev => [newBackup, ...prev])
      toast.success('Sauvegarde créée avec succès', { id: 'backup' })
    } catch (error) {
      toast.error('Erreur lors de la création de la sauvegarde', { id: 'backup' })
    } finally {
      setCreating(false)
    }
  }

  const handleDownloadBackup = async (backup) => {
    try {
      toast.loading('Préparation du téléchargement...', { id: 'download' })
      
      // Simulate download preparation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a dummy file for download
      const content = `-- JustArchiv Database Backup
-- Created: ${backup.created_at.toISOString()}
-- Size: ${backup.size}
-- Type: ${backup.type}

-- This is a simulated backup file
-- In a real application, this would contain the actual database dump
`
      
      const blob = new Blob([content], { type: 'application/sql' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = backup.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Téléchargement démarré', { id: 'download' })
    } catch (error) {
      toast.error('Erreur lors du téléchargement', { id: 'download' })
    }
  }

  const handleDeleteBackup = async (backupId, backupName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la sauvegarde "${backupName}" ?`)) {
      return
    }

    try {
      setBackups(prev => prev.filter(backup => backup.id !== backupId))
      toast.success('Sauvegarde supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleRestoreBackup = async (backup) => {
    if (!confirm(`Êtes-vous sûr de vouloir restaurer la sauvegarde "${backup.name}" ? Cette action remplacera toutes les données actuelles.`)) {
      return
    }

    try {
      toast.loading('Restauration en cours...', { id: 'restore' })
      
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      toast.success('Sauvegarde restaurée avec succès', { id: 'restore' })
    } catch (error) {
      toast.error('Erreur lors de la restauration', { id: 'restore' })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'in_progress': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100'
      case 'failed': return 'bg-red-100'
      case 'in_progress': return 'bg-blue-100'
      default: return 'bg-gray-100'
    }
  }

  const getTypeColor = (type) => {
    return type === 'manual' ? 'text-blue-600' : 'text-gray-600'
  }

  const totalSize = backups.reduce((sum, backup) => {
    const size = parseFloat(backup.size.replace(' MB', ''))
    return sum + size
  }, 0)

  const completedBackups = backups.filter(b => b.status === 'completed').length
  const failedBackups = backups.filter(b => b.status === 'failed').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Chargement des sauvegardes...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Gestionnaire de sauvegardes</h3>
        <div className="flex gap-2">
          <button
            onClick={loadBackups}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="btn btn-primary"
          >
            {creating ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Création...
              </>
            ) : (
              <>
                <Download size={16} />
                Créer sauvegarde
              </>
            )}
          </button>
        </div>
      </div>

      {/* Backup Stats */}
      <div className="grid grid-2 md:grid-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Total sauvegardes</p>
              <p className="text-2xl font-semibold">{backups.length}</p>
            </div>
            <HardDrive className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Réussies</p>
              <p className="text-2xl font-semibold text-green-600">{completedBackups}</p>
            </div>
            <Download className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Échouées</p>
              <p className="text-2xl font-semibold text-red-600">{failedBackups}</p>
            </div>
            <Trash2 className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Espace total</p>
              <p className="text-2xl font-semibold">{totalSize.toFixed(1)} MB</p>
            </div>
            <HardDrive className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Backup Schedule */}
      <div className="card">
        <h4 className="font-medium mb-4">Planification automatique</h4>
        <div className="grid md:grid-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-blue-600" size={20} />
              <h5 className="font-medium">Sauvegarde quotidienne</h5>
            </div>
            <div className="space-y-2 text-sm text-secondary">
              <p><strong>Heure:</strong> 03:00 (UTC)</p>
              <p><strong>Rétention:</strong> 30 jours</p>
              <p><strong>Statut:</strong> <span className="text-green-600">Activé</span></p>
              <p><strong>Prochaine:</strong> Demain à 03:00</p>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-purple-600" size={20} />
              <h5 className="font-medium">Sauvegarde hebdomadaire</h5>
            </div>
            <div className="space-y-2 text-sm text-secondary">
              <p><strong>Jour:</strong> Dimanche 02:00 (UTC)</p>
              <p><strong>Rétention:</strong> 12 semaines</p>
              <p><strong>Statut:</strong> <span className="text-green-600">Activé</span></p>
              <p><strong>Prochaine:</strong> Dimanche à 02:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="card">
        <h4 className="font-medium mb-4">Historique des sauvegardes</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Taille</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id} className="border-b border-border hover:bg-surface-dark">
                  <td className="py-3 px-4 font-medium">{backup.name}</td>
                  <td className="py-3 px-4">
                    <span className={`capitalize ${getTypeColor(backup.type)}`}>
                      {backup.type === 'manual' ? 'Manuelle' : 'Automatique'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{backup.size}</td>
                  <td className="py-3 px-4 text-sm text-secondary">
                    {backup.created_at.toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBg(backup.status)} ${getStatusColor(backup.status)}`}>
                      {backup.status === 'completed' ? 'Réussie' : 
                       backup.status === 'failed' ? 'Échouée' : 'En cours'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {backup.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleDownloadBackup(backup)}
                            className="btn btn-secondary btn-sm"
                            title="Télécharger"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleRestoreBackup(backup)}
                            className="btn btn-primary btn-sm"
                            title="Restaurer"
                          >
                            <Upload size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteBackup(backup.id, backup.name)}
                        className="btn btn-danger btn-sm"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {backups.length === 0 && (
        <div className="text-center py-12">
          <HardDrive size={48} className="mx-auto text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune sauvegarde</h3>
          <p className="text-secondary mb-4">
            Créez votre première sauvegarde pour sécuriser vos données
          </p>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="btn btn-primary"
          >
            <Download size={16} />
            Créer une sauvegarde
          </button>
        </div>
      )}
    </div>
  )
}

export default BackupManager
