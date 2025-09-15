import React, { useState } from 'react'
import { MoreVertical, Download, Edit, Trash2, Eye } from 'lucide-react'
import { supabase, dbHelpers } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import Modal from '../UI/Modal'
import DocumentEdit from './DocumentEdit'

const DocumentGrid = ({ documents, categories, tags, onUpdate }) => {
  const { user } = useAuth()
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleDownload = async (document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = document.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await dbHelpers.logActivity(user.id, 'document_download', {
        document_id: document.id,
        document_name: document.name
      })

      toast.success('Téléchargement démarré')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement')
    }
  }

  const handleDelete = async (document) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${document.name}" ?`)) {
      return
    }

    try {
      // Delete from storage
      await supabase.storage
        .from('documents')
        .remove([document.file_path])

      // Delete from database
      await dbHelpers.deleteDocument(document.id)

      await dbHelpers.logActivity(user.id, 'document_delete', {
        document_id: document.id,
        document_name: document.name
      })

      toast.success('Document supprimé')
      onUpdate()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    return '📎'
  }

  const getPreviewUrl = async (document) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600)
      
      return data?.signedUrl
    } catch (error) {
      console.error('Preview error:', error)
      return null
    }
  }

  return (
    <>
      <div className="grid grid-2 md:grid-3 lg:grid-4 gap-4">
        {documents.map((document) => (
          <div key={document.id} className="card hover-scale">
            <div className="flex items-start justify-between mb-3">
              <div className="text-2xl">
                {getFileIcon(document.file_type)}
              </div>
              <div className="relative">
                <button className="btn btn-secondary btn-sm">
                  <MoreVertical size={16} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-10 hidden group-hover:block">
                  <button
                    onClick={() => {
                      setSelectedDocument(document)
                      setShowPreview(true)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-dark w-full text-left"
                  >
                    <Eye size={14} />
                    Aperçu
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-dark w-full text-left"
                  >
                    <Download size={14} />
                    Télécharger
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocument(document)
                      setShowEdit(true)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-dark w-full text-left"
                  >
                    <Edit size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(document)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-dark w-full text-left text-error"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-medium mb-2 line-clamp-2">{document.name}</h3>
            
            {document.description && (
              <p className="text-sm text-secondary mb-3 line-clamp-2">
                {document.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-secondary">
              <span>{dbHelpers.formatFileSize(document.file_size)}</span>
              <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            {document.categories && (
              <div className="mt-2">
                <span
                  className="inline-block px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: document.categories.color + '20',
                    color: document.categories.color
                  }}
                >
                  {document.categories.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Modifier le document"
      >
        {selectedDocument && (
          <DocumentEdit
            document={selectedDocument}
            categories={categories}
            tags={tags}
            onSuccess={() => {
              setShowEdit(false)
              onUpdate()
            }}
            onCancel={() => setShowEdit(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={selectedDocument?.name}
        size="xl"
      >
        {selectedDocument && (
          <DocumentPreview
            document={selectedDocument}
            onClose={() => setShowPreview(false)}
          />
        )}
      </Modal>
    </>
  )
}

const DocumentPreview = ({ document, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const loadPreview = async () => {
      try {
        const { data } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600)
        
        setPreviewUrl(data?.signedUrl)
      } catch (error) {
        console.error('Preview error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPreview()
  }, [document])

  if (loading) {
    return <div className="text-center py-8">Chargement de l'aperçu...</div>
  }

  if (!previewUrl) {
    return <div className="text-center py-8">Aperçu non disponible</div>
  }

  if (document.file_type.startsWith('image/')) {
    return (
      <div className="text-center">
        <img
          src={previewUrl}
          alt={document.name}
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      </div>
    )
  }

  if (document.file_type.includes('pdf')) {
    return (
      <iframe
        src={previewUrl}
        className="w-full h-96 border rounded-lg"
        title={document.name}
      />
    )
  }

  return (
    <div className="text-center py-8">
      <p>Aperçu non disponible pour ce type de fichier</p>
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary mt-4"
      >
        Ouvrir dans un nouvel onglet
      </a>
    </div>
  )
}

export default DocumentGrid
