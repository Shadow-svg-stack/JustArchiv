import React, { useState } from 'react'

const DocumentFilters = ({ categories, tags, filters, onChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => {
    onChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      category: '',
      tags: [],
      sortBy: 'created_at:desc'
    }
    setLocalFilters(resetFilters)
    onChange(resetFilters)
    onClose()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Catégorie</label>
        <select
          value={localFilters.category}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
          className="input"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Trier par</label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          className="input"
        >
          <option value="created_at:desc">Plus récent</option>
          <option value="created_at:asc">Plus ancien</option>
          <option value="name:asc">Nom (A-Z)</option>
          <option value="name:desc">Nom (Z-A)</option>
          <option value="file_size:desc">Taille (plus grand)</option>
          <option value="file_size:asc">Taille (plus petit)</option>
        </select>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={handleReset}
          className="btn btn-secondary"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApply}
          className="btn btn-primary"
        >
          Appliquer
        </button>
      </div>
    </div>
  )
}

export default DocumentFilters
