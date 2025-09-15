import React, { useState, useEffect } from 'react'
import { Users, FileText, HardDrive, TrendingUp } from 'lucide-react'
import { dbHelpers } from '../../lib/supabase'
import LoadingSpinner from '../UI/LoadingSpinner'

const SystemStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalStorage: 0,
    storageFormatted: '0 Bytes'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await dbHelpers.getSystemStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Chargement des statistiques..." />
  }

  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Documents totaux',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Stockage utilisé',
      value: stats.storageFormatted,
      icon: HardDrive,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Croissance',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Statistiques système</h3>

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
          <h4 className="font-medium mb-4">Activité récente</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <span className="text-sm">Nouveaux utilisateurs</span>
              <span className="font-medium">+5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <span className="text-sm">Documents uploadés</span>
              <span className="font-medium">+23</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <span className="text-sm">Connexions aujourd'hui</span>
              <span className="font-medium">47</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-medium mb-4">Utilisation du stockage</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Documents</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Images</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Autres</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStats
