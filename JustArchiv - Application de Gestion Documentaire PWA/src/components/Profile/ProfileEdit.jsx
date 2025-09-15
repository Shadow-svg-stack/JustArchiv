import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProfileEdit = () => {
  const { user, userProfile, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    email: user?.email || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile({
        full_name: formData.full_name
      })
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nom complet</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            className="input opacity-50"
            disabled
          />
          <p className="text-xs text-secondary mt-1">
            L'email ne peut pas être modifié
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rôle</label>
          <input
            type="text"
            value={userProfile?.role || 'Utilisateur'}
            className="input opacity-50"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Membre depuis</label>
          <input
            type="text"
            value={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('fr-FR') : ''}
            className="input opacity-50"
            disabled
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : 'Sauvegarder'}
        </button>
      </form>
    </div>
  )
}

export default ProfileEdit
