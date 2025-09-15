import React, { useState, useEffect } from 'react'
import { AlertTriangle, Bug, Zap, RefreshCw, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const ErrorTracking = () => {
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadErrors()
  }, [])

  const loadErrors = async () => {
    try {
      setLoading(true)
      
      // Simulate error data - in real app, this would come from error tracking service
      const mockErrors = [
        {
          id: 1,
          type: 'error',
          message: 'Failed to upload document: Network timeout',
          stack: 'Error: Network timeout\n    at uploadDocument (DocumentUpload.jsx:45)\n    at handleUpload (DocumentUpload.jsx:78)',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
          user: 'user123',
          url: '/documents',
          browser: 'Chrome 118.0.0.0',
          resolved: false,
          count: 3
        },
        {
          id: 2,
          type: 'warning',
          message: 'Slow query detected: getUserDocuments took 2.3s',
          stack: null,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          user: null,
          url: '/api/documents',
          browser: null,
          resolved: false,
          count: 12
        },
        {
          id: 3,
          type: 'error',
          message: 'Authentication failed: Invalid token',
          stack: 'Error: Invalid token\n    at verifyToken (auth.js:23)\n    at middleware (auth.js:45)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          user: 'user456',
          url: '/api/profile',
          browser: 'Firefox 119.0',
          resolved: true,
          count: 1
        },
        {
          id: 4,
          type: 'info',
          message: 'Large file upload detected: 15MB file',
          stack: null,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          user: 'user789',
          url: '/documents/upload',
          browser: 'Safari 17.0',
          resolved: false,
          count: 1
        }
      ]
      
      setErrors(mockErrors)
    } catch (error) {
      console.error('Error loading errors:', error)
      toast.error('Erreur lors du chargement des erreurs')
    } finally {
      setLoading(false)
    }
  }

  const handleResolveError = async (errorId) => {
    try {
      setErrors(prev => prev.map(error => 
        error.id === errorId ? { ...error, resolved: true } : error
      ))
      toast.success('Erreur marquée comme résolue')
    } catch (error) {
      toast.error('Erreur lors de la résolution')
    }
  }

  const handleClearResolved = async () => {
    if (!confirm('Supprimer toutes les erreurs résolues ?')) return
    
    try {
      setErrors(prev => prev.filter(error => !error.resolved))
      toast.success('Erreurs résolues supprimées')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getErrorIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="text-red-600" size={20} />
      case 'warning': return <AlertTriangle className="text-yellow-600" size={20} />
      case 'info': return <Bug className="text-blue-600" size={20} />
      default: return <Bug className="text-gray-600" size={20} />
    }
  }

  const getErrorBg = (type) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const filteredErrors = errors.filter(error => {
    if (filter === 'all') return true
    if (filter === 'unresolved') return !error.resolved
    if (filter === 'resolved') return error.resolved
    return error.type === filter
  })

  const errorStats = {
    total: errors.length,
    unresolved: errors.filter(e => !e.resolved).length,
    errors: errors.filter(e => e.type === 'error').length,
    warnings: errors.filter(e => e.type === 'warning').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Chargement des erreurs...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Suivi des erreurs</h3>
        <div className="flex gap-2">
          <button
            onClick={loadErrors}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button
            onClick={handleClearResolved}
            className="btn btn-danger"
          >
            <Zap size={16} />
            Nettoyer résolues
          </button>
        </div>
      </div>

      {/* Error Stats */}
      <div className="grid grid-2 md:grid-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Total erreurs</p>
              <p className="text-2xl font-semibold">{errorStats.total}</p>
            </div>
            <Bug className="text-gray-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Non résolues</p>
              <p className="text-2xl font-semibold text-red-600">{errorStats.unresolved}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Erreurs critiques</p>
              <p className="text-2xl font-semibold text-red-600">{errorStats.errors}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Avertissements</p>
              <p className="text-2xl font-semibold text-yellow-600">{errorStats.warnings}</p>
            </div>
            <AlertTriangle className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'unresolved', label: 'Non résolues' },
          { key: 'resolved', label: 'Résolues' },
          { key: 'error', label: 'Erreurs' },
          { key: 'warning', label: 'Avertissements' },
          { key: 'info', label: 'Infos' }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`btn btn-sm ${
              filter === filterOption.key ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Error List */}
      <div className="space-y-4">
        {filteredErrors.map((error) => (
          <div key={error.id} className={`border rounded-lg p-4 ${getErrorBg(error.type)} ${error.resolved ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {getErrorIcon(error.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{error.message}</h4>
                    {error.count > 1 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {error.count}x
                      </span>
                    )}
                    {error.resolved && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Résolu
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-secondary space-y-1">
                    <p>
                      <strong>Quand:</strong> {error.timestamp.toLocaleString('fr-FR')}
                    </p>
                    {error.user && (
                      <p>
                        <strong>Utilisateur:</strong> {error.user}
                      </p>
                    )}
                    <p>
                      <strong>URL:</strong> {error.url}
                    </p>
                    {error.browser && (
                      <p>
                        <strong>Navigateur:</strong> {error.browser}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {!error.resolved && (
                <button
                  onClick={() => handleResolveError(error.id)}
                  className="btn btn-success btn-sm"
                >
                  Marquer résolu
                </button>
              )}
            </div>
            
            {error.stack && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-secondary hover:text-primary">
                  Voir la stack trace
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {filteredErrors.length === 0 && (
        <div className="text-center py-12">
          <Bug size={48} className="mx-auto text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune erreur trouvée</h3>
          <p className="text-secondary">
            {filter === 'all' ? 
              'Aucune erreur enregistrée' : 
              `Aucune erreur correspondant au filtre "${filter}"`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default ErrorTracking
