import React, { useState } from 'react'
import { Users, BarChart3, Settings, Shield } from 'lucide-react'
import UserManagement from './UserManagement'
import SystemStats from './SystemStats'
import ActivityLogs from './ActivityLogs'
import SecuritySettings from './SecuritySettings'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users')

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'logs', label: 'Logs d\'activité', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />
      case 'stats':
        return <SystemStats />
      case 'logs':
        return <ActivityLogs />
      case 'security':
        return <SecuritySettings />
      default:
        return <UserManagement />
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Administration</h1>
        <p className="text-secondary">Panneau de contrôle administrateur</p>
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

export default AdminPanel
