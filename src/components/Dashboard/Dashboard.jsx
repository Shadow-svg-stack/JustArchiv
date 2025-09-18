import React, { useState, useEffect } from 'react'
import { FileText, FolderOpen, Tag, TrendingUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { dbHelpers } from '../../lib/supabase'
import LoadingSpinner from '../UI/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    documents: 0,
    categories: 0,
    tags: 0,
    storage: '0 MB'
  })
  const [recentDocuments, setRecentDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      const [documents, categories, tags] = await Promise.all([
        dbHelpers.getUserDocuments(user.id, { limit: 5 }),
        dbHelpers.getUserCategories(user.id),
        dbHelpers.getUserTags(user.id)
      ])

      const totalStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0)

      setStats({
        documents: documents.length,
        categories: categories.length,
        tags: tags.length,
        storage: dbHelpers.formatFileSize(totalStorage)
      })

      setRecentDocuments(documents.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Chargement du tableau de bord..." />
  }

  const statCards = [
    {
      title: 'Documents',
      value: stats.documents,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Catégories',
      value: stats.categories,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tags',
      value: stats.tags,
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Stockage',
      value: stats.storage,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-secondary">Vue d'ensemble de vos documents</p>
      </div>

      <div className="grid grid-2 md:grid-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="card hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Documents récents</h3>
          {recentDocuments.length > 0 ? (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-secondary">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                    {doc.file_type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary text-center py-8">
              Aucun document récent
            </p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-medium mb-4">Activité récente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface-dark rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div>
                <p className="text-sm">Connexion réussie</p>
                <p className="text-xs text-secondary">Il y a quelques minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-dark rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm">Profil mis à jour</p>
                <p className="text-xs text-secondary">Aujourd'hui</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
