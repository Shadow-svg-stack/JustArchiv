import React from 'react'
import { MoreVertical, Download, Edit, Trash2, Eye } from 'lucide-react'

const DocumentList = ({ documents, categories, tags, onUpdate }) => {
  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">Nom</th>
              <th className="text-left py-3 px-4">Catégorie</th>
              <th className="text-left py-3 px-4">Taille</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b border-border hover:bg-surface-dark">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{document.name}</p>
                    {document.description && (
                      <p className="text-sm text-secondary">{document.description}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {document.categories && (
                    <span
                      className="inline-block px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: document.categories.color + '20',
                        color: document.categories.color
                      }}
                    >
                      {document.categories.name}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-secondary">
                  {(document.file_size / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="py-3 px-4 text-sm text-secondary">
                  {new Date(document.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button className="btn btn-secondary btn-sm">
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      <Download size={14} />
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-danger btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DocumentList
