import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { dbHelpers } from '../../lib/supabase'
import Modal from '../UI/Modal'
import CategoryForm from './CategoryForm'
import LoadingSpinner from '../UI/LoadingSpinner'
import toast from 'react-hot-toast'

const Categories = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [user])

  const loadCategories = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await dbHelpers.getUserCategories(user.id)
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDeleteCategory = async (category) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      return
    }

    try {
      await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)

      await dbHelpers.logActivity(user.id, 'category_delete', {
        category_id: category.id,
        category_name: category.name
      })

      toast.success('Catégorie supprimée')
      loadCategories()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCategory(null)
    loadCategories()
  }

  if (loading) {
    return <LoadingSpinner text="Chargement des catégories..." />
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Catégories</h1>
          <p className="text-secondary">Organisez vos documents par catégories</p>
        </div>
        
        <button
          onClick={handleCreateCategory}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-2 md:grid-3 lg:grid-4 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="card hover-scale">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <FolderOpen 
                    size={24} 
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-medium mb-2">{category.name}</h3>
              
              {category.description && (
                <p className="text-sm text-secondary mb-3">
                  {category.description}
                </p>
              )}

              <div className="text-xs text-secondary">
                Créée le {new Date(category.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen size={48} className="mx-auto text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune catégorie</h3>
          <p className="text-secondary mb-4">
            Créez votre première catégorie pour organiser vos documents
          </p>
          <button
            onClick={handleCreateCategory}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Nouvelle catégorie
          </button>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <CategoryForm
          category={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

export default Categories
