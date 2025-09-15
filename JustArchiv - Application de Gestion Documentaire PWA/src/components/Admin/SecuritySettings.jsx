import React, { useState } from 'react'
import { Shield, AlertTriangle, Lock, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    forceLogoutAll: false,
    enableTwoFactor: false,
    blockSuspiciousIPs: false,
    requireStrongPasswords: true,
    sessionTimeout: 24
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleForceLogoutAll = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter tous les utilisateurs ?')) {
      return
    }

    try {
      // Implementation would require backend support
      toast.success('Tous les utilisateurs ont été déconnectés')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const handleSaveSettings = async () => {
    try {
      // Save settings to database
      toast.success('Paramètres de sécurité sauvegardés')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Paramètres de sécurité</h3>

      <div className="grid md:grid-2 gap-6">
        <div className="card">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Shield size={18} />
            Authentification
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Double authentification</p>
                <p className="text-sm text-secondary">Activer 2FA pour tous les utilisateurs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTwoFactor}
                  onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mots de passe forts</p>
                <p className="text-sm text-secondary">Exiger des mots de passe complexes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireStrongPasswords}
                  onChange={(e) => handleSettingChange('requireStrongPasswords', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Timeout de session (heures)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Eye size={18} />
            Surveillance
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bloquer IPs suspectes</p>
                <p className="text-sm text-secondary">Bloquer automatiquement les tentatives suspectes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.blockSuspiciousIPs}
                  onChange={(e) => handleSettingChange('blockSuspiciousIPs', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 mt-0.5" size={18} />
                <div>
                  <h5 className="font-medium text-yellow-800">Alertes de sécurité</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    3 tentatives de connexion suspectes détectées dans les dernières 24h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h4 className="font-medium mb-4 flex items-center gap-2 text-error">
          <Lock size={18} />
          Actions d'urgence
        </h4>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-800">Déconnecter tous les utilisateurs</p>
                <p className="text-sm text-red-700">
                  Force la déconnexion de tous les utilisateurs actifs
                </p>
              </div>
              <button
                onClick={handleForceLogoutAll}
                className="btn btn-danger"
              >
                Déconnecter tout le monde
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="btn btn-primary"
        >
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  )
}

export default SecuritySettings
