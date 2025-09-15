import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, LogOut, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

const SessionManager = () => {
  const { getSessions, sessions } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      await getSessions()
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDeviceIcon = (userAgent) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return Smartphone
    }
    return Monitor
  }

  const getDeviceInfo = (userAgent) => {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Navigateur inconnu'
  }

  if (loading) {
    return <LoadingSpinner text="Chargement des sessions..." />
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Sessions actives</h3>
      <p className="text-secondary mb-6">
        Gérez vos sessions actives sur différents appareils
      </p>

      <div className="space-y-4">
        {sessions.map((session) => {
          const DeviceIcon = getDeviceIcon(session.device)
          
          return (
            <div key={session.id} className="flex items-center justify-between p-4 bg-surface-dark rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  <DeviceIcon className="text-primary" size={20} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{getDeviceInfo(session.device)}</p>
                    {session.current && (
                      <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                        Session actuelle
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {session.ip}
                    </span>
                    <span>
                      Dernière activité: {new Date(session.last_active).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {!session.current && (
                <button className="btn btn-danger btn-sm">
                  <LogOut size={14} />
                  Déconnecter
                </button>
              )}
            </div>
          )
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8">
          <Monitor size={48} className="mx-auto text-secondary mb-4" />
          <p className="text-secondary">Aucune session active trouvée</p>
        </div>
      )}
    </div>
  )
}

export default SessionManager
