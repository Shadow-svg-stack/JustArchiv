import React, { useState } from 'react'
import { 
  Server, 
  Database, 
  Activity, 
  AlertTriangle, 
  Settings, 
  Download,
  RefreshCw,
  Zap
} from 'lucide-react'
import SystemMonitoring from './SystemMonitoring'
import DatabaseManagement from './DatabaseManagement'
import ErrorTracking from './ErrorTracking'
import MaintenanceTools from './MaintenanceTools'
import BackupManager from './BackupManager'

const HeadmasterDashboard = () => {
  const [activeTab, setActiveTab] = useState('monitoring')

  const tabs = [
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'database', label: 'Base de données', icon: Database },
    { id: 'errors', label: 'Erreurs', icon: AlertTriangle },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
    { id: 'backup', label: 'Sauvegardes', icon: Download }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monitoring':
        return <SystemMonitoring />
      case 'database':
        return <DatabaseManagement />
      case 'errors':
        return <ErrorTracking />
      case 'maintenance':
        return <MaintenanceTools />
      case 'backup':
        return <BackupManager />
      default:
        return <SystemMonitoring />
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Zap className="text-yellow-500" size={28} />
            Headmaster Dashboard
          </h1>
          <p className="text-secondary">Panneau de contrôle développeur - Maintenance système</p>
        </div>
        
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button className="btn btn-primary">
            <Server size={16} />
            État système
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-2 md:grid-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Uptime</p>
              <p className="text-xl font-semibold text-success">99.9%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Erreurs (24h)</p>
              <p className="text-xl font-semibold text-error">3</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">DB Taille</p>
              <p className="text-xl font-semibold">2.4 GB</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Dernière sauvegarde</p>
              <p className="text-xl font-semibold text-success">2h</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Download className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary hover:border-gray-300'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  )
}

export default HeadmasterDashboard
