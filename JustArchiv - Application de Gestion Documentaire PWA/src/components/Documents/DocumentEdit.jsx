import React, { useState } from 'react'
import { dbHelpers } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '../UI/LoadingSpinner'

const DocumentEdit = ({ document, categories, tags, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: document.name,
    description: document.description || '',
    category_id: document.category_id || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await dbHelpers.updateDocument(document.id, formData)
      
      await dbHelpers.logActivity(user.id, 'document_update', {
        document_id: document.id,
        document_name: formData.name
      })

      toast.success('Document mis à jour')
      onSuccess()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Erreur lors de la mise à jour')
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nom du document</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          rows={3}
          placeholder="Description du document..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Catégorie</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="input"
        >
          <option value="">Aucune catégorie</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : 'Sauvegarder'}
        </button>
      </div>
    </form>
  )
}

export default DocumentEdit
