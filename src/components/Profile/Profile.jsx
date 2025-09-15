import React, { useState } from 'react'
import { User, Lock, Trash2, Smartphone, Monitor } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ProfileEdit from './ProfileEdit'
import PasswordChange from './PasswordChange'
import SessionManager from './SessionManager'
import AccountDeletion from './AccountDeletion'

const Profile = () => {
  const { userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'sessions', label: 'Sessions', icon: Monitor },
    { id: 'danger', label: 'Zone de danger', icon: Trash2 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileEdit />
      case 'password':
        return <PasswordChange />
      case 'sessions':
        return <SessionManager />
      case 'danger':
        return <AccountDeletion />
      default:
        return <ProfileEdit />
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Profil utilisateur</h1>
        <p className="text-secondary">Gérez vos informations personnelles et paramètres</p>
      </div>

      <div className="grid md:grid-4 gap-6">
        <div className="card">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-surface-dark hover:text-primary'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
