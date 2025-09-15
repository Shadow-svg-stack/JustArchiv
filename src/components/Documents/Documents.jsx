import React, { useState, useEffect } from 'react'
import { Upload, Search, Filter, Grid, List, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { dbHelpers } from '../../lib/supabase'
import DocumentUpload from './DocumentUpload'
import DocumentList from './DocumentList'
import DocumentGrid from './DocumentGrid'
import DocumentFilters from './DocumentFilters'
import LoadingSpinner from '../UI/LoadingSpinner'
import Modal from '../UI/Modal'

const Documents = () => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    tags: [],
    sortBy: 'created_at:desc'
  })
  const [showUpload, setShowUpload] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [user, filters, searchTerm])

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      const [docsData, catsData, tagsData] = await Promise.all([
        dbHelpers.getUserDocuments(user.id, {
          search: searchTerm,
          category: filters.category,
          tags: filters.tags,
          sortBy: filters.sortBy
        }),
        dbHelpers.getUserCategories(user.id),
        dbHelpers.getUserTags(user.id)
      ])

      setDocuments(docsData)
      setCategories(catsData)
      setTags(tagsData)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    loadData()
  }

  const handleDocumentUpdate = () => {
    loadData()
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return <LoadingSpinner text="Chargement des documents..." />
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Documents</h1>
          <p className="text-secondary">{documents.length} document(s) trouvé(s)</p>
        </div>
        
        <button
          onClick={() => setShowUpload(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Ajouter un document
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Rechercher des documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="btn btn-secondary"
          >
            <Filter size={16} />
            Filtres
          </button>
          
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0 }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0 }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {documents.length > 0 ? (
        viewMode === 'grid' ? (
          <DocumentGrid 
            documents={documents}
            categories={categories}
            tags={tags}
            onUpdate={handleDocumentUpdate}
          />
        ) : (
          <DocumentList 
            documents={documents}
            categories={categories}
            tags={tags}
            onUpdate={handleDocumentUpdate}
          />
        )
      ) : (
        <div className="text-center py-12">
          <Upload size={48} className="mx-auto text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
          <p className="text-secondary mb-4">
            {searchTerm || filters.category || filters.tags.length > 0
              ? 'Aucun document ne correspond à vos critères de recherche'
              : 'Commencez par ajouter votre premier document'
            }
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Ajouter un document
          </button>
        </div>
      )}

      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Ajouter un document"
        size="lg"
      >
        <DocumentUpload
          categories={categories}
          tags={tags}
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUpload(false)}
        />
      </Modal>

      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtres"
      >
        <DocumentFilters
          categories={categories}
          tags={tags}
          filters={filters}
          onChange={handleFiltersChange}
          onClose={() => setShowFilters(false)}
        />
      </Modal>
    </div>
  )
}

export default Documents
