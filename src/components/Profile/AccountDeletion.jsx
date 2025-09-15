import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'
import toast from 'react-hot-toast'

const AccountDeletion = () => {
  const { deleteAccount } = useAuth()
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper "SUPPRIMER" pour confirmer')
      return
    }

    setLoading(true)

    try {
      await deleteAccount()
    } catch (error) {
      console.error('Account deletion error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-error">Zone de danger</h3>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-red-800 mb-2">Suppression du compte</h4>
            <p className="text-sm text-red-700 mb-4">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Tous vos documents</li>
              <li>• Vos catégories et tags</li>
              <li>• Votre profil utilisateur</li>
              <li>• L'historique de vos activités</li>
            </ul>
          </div>
        </div>
      </div>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn btn-danger"
        >
          Supprimer mon compte
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tapez "SUPPRIMER" pour confirmer la suppression de votre compte:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input"
              placeholder="SUPPRIMER"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowConfirm(false)
                setConfirmText('')
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteAccount}
              className="btn btn-danger"
              disabled={loading || confirmText !== 'SUPPRIMER'}
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : 'Supprimer définitivement'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDeletion
