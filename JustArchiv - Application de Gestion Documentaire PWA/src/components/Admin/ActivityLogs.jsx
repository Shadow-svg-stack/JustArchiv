import React, { useState, useEffect } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import LoadingSpinner from '../UI/LoadingSpinner'

const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('')

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user_profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionLabel = (action) => {
    const labels = {
      login: 'Connexion',
      logout: 'Déconnexion',
      register: 'Inscription',
      document_upload: 'Upload document',
      document_download: 'Téléchargement document',
      document_delete: 'Suppression document',
      document_update: 'Modification document',
      category_create: 'Création catégorie',
      category_update: 'Modification catégorie',
      category_delete: 'Suppression catégorie',
      profile_update: 'Mise à jour profil',
      password_change: 'Changement mot de passe',
      account_deletion: 'Suppression compte'
    }
    return labels[action] || action
  }

  const getActionColor = (action) => {
    if (action.includes('delete') || action.includes('logout')) return 'text-red-600'
    if (action.includes('create') || action.includes('login') || action.includes('register')) return 'text-green-600'
    if (action.includes('update') || action.includes('upload')) return 'text-blue-600'
    return 'text-gray-600'
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getActionLabel(log.action).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = !filterAction || log.action === filterAction
    
    return matchesSearch && matchesFilter
  })

  const uniqueActions = [...new Set(logs.map(log => log.action))]

  if (loading) {
    return <LoadingSpinner text="Chargement des logs..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Logs d'activité</h3>
        <button className="btn btn-secondary">
          <Download size={16} />
          Exporter
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="input"
        >
          <option value="">Toutes les actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>
              {getActionLabel(action)}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Utilisateur</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Détails</th>
                <th className="text-left py-3 px-4">IP</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-surface-dark">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">
                        {log.user_profiles?.full_name || 'Utilisateur supprimé'}
                      </p>
                      <p className="text-sm text-secondary">
                        {log.user_profiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-secondary">
                      {log.details && typeof log.details === 'object' ? (
                        Object.entries(log.details).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </div>
                        ))
                      ) : (
                        log.details || '-'
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary">
                    {log.ip_address || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary">Aucun log trouvé</p>
        </div>
      )}
    </div>
  )
}

export default ActivityLogs
