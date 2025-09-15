import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, dbHelpers } from '../../lib/supabase'
import toast from 'react-hot-toast'
import LoadingSpinner from '../UI/LoadingSpinner'

const DocumentUpload = ({ categories, tags, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [metadata, setMetadata] = useState({
    category_id: '',
    tags: [],
    description: ''
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => ({
        file,
        name: file.name,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      })))
    }
  })

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier')
      return
    }

    setUploading(true)

    try {
      for (const fileData of files) {
        const { file } = fileData
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Create document record
        await dbHelpers.createDocument({
          user_id: user.id,
          name: fileData.name,
          file_path: uploadData.path,
          file_type: file.type,
          file_size: file.size,
          category_id: metadata.category_id || null,
          description: metadata.description
        })

        // Log activity
        await dbHelpers.logActivity(user.id, 'document_upload', {
          document_name: fileData.name,
          file_size: file.size
        })
      }

      toast.success(`${files.length} document(s) uploadé(s) avec succès`)
      onSuccess()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-blue-50'
            : 'border-border hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="mx-auto text-secondary mb-4" />
        {isDragActive ? (
          <p>Déposez les fichiers ici...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Glissez-déposez vos fichiers ici</p>
            <p className="text-sm text-secondary">
              ou cliquez pour sélectionner (PDF, Word, Images - max 10MB)
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Fichiers sélectionnés:</h4>
          {files.map((fileData, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <div className="flex items-center gap-3">
                {fileData.preview ? (
                  <img
                    src={fileData.preview}
                    alt={fileData.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <File size={24} className="text-secondary" />
                )}
                <div>
                  <p className="font-medium">{fileData.name}</p>
                  <p className="text-sm text-secondary">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="btn btn-secondary btn-sm"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Catégorie</label>
          <select
            value={metadata.category_id}
            onChange={(e) => setMetadata(prev => ({ ...prev, category_id: e.target.value }))}
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

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            className="input"
            rows={3}
            placeholder="Description du document..."
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={uploading}
        >
          Annuler
        </button>
        <button
          onClick={handleUpload}
          className="btn btn-primary"
          disabled={uploading || files.length === 0}
        >
          {uploading ? <LoadingSpinner size="sm" text="" /> : 'Uploader'}
        </button>
      </div>
    </div>
  )
}

export default DocumentUpload
