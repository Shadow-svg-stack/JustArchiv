import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { dbHelpers, supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import LoadingSpinner from '../UI/LoadingSpinner'

const CategoryForm = ({ category, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#2563eb'
  })

  const predefinedColors = [
    '#2563eb', '#dc2626', '#16a34a', '#ca8a04',
    '#9333ea', '#c2410c', '#0891b2', '#be123c',
    '#4338ca', '#059669', '#7c2d12', '#1e40af'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category) {
        // Update existing category
        await supabase
          .from('categories')
          .update(formData)
          .eq('id', category.id)

        await dbHelpers.logActivity(user.id, 'category_update', {
          category_id: category.id,
          category_name: formData.name
        })

        toast.success('Catégorie mise à jour')
      } else {
        // Create new category
        await dbHelpers.createCategory({
          ...formData,
          user_id: user.id
        })

        await dbHelpers.logActivity(user.id, 'category_create', {
          category_name: formData.name
        })

        toast.success('Catégorie créée')
      }

      onSuccess()
    } catch (error) {
      console.error('Category form error:', error)
      toast.error('Erreur lors de la sauvegarde')
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
        <label className="block text-sm font-medium mb-2">Nom de la catégorie</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          placeholder="Ex: Documents administratifs"
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
          placeholder="Description de la catégorie..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Couleur</label>
        <div className="flex gap-2 mb-3">
          {predefinedColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-full h-10 rounded border border-border"
        />
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

export default CategoryForm
