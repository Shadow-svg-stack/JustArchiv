import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Grid3X3, 
  List, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  MapPin,
  Tag,
  Calendar,
  User,
  Eye,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'
import { Alert, AlertDescription } from '../components/ui/alert'
import { DocumentUpload } from '../components/documents/DocumentUpload'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase/client'
import { projectId } from '../utils/supabase/info'
import { Document } from '../types'

type ViewMode = 'grid' | 'list'

export function DocumentsPage() {
  const { user, hasPermission, isBackendAvailable } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isBackendAvailable && user) {
      loadDocuments()
    } else {
      setLoading(false)
    }
  }, [isBackendAvailable, user])

  const loadDocuments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('Session expirée')
        setLoading(false)
        return
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-450d4529/documents`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors du chargement des documents')
      }
    } catch (err) {
      console.error('Documents loading error:', err)
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const canEditDocument = (document: any) => {
    if (hasPermission('edit_any_document')) return true
    if (hasPermission('edit_own_documents') && document.userId === user?.id) return true
    return false
  }

  const canDeleteDocument = (document: any) => {
    if (hasPermission('delete_any_document')) return true
    if (hasPermission('delete_own_documents') && document.userId === user?.id) return true
    return false
  }

  const handleDocumentAction = async (action: string, document: any) => {
    switch (action) {
      case 'view':
        console.log('Viewing document:', document.name)
        break
      case 'edit':
        console.log('Editing document:', document.name)
        break
      case 'delete':
        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
          await deleteDocument(document.id)
        }
        break
      case 'download':
        console.log('Downloading document:', document.name)
        break
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-450d4529/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setDocuments(docs => docs.filter(doc => doc.id !== documentId))
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors de la suppression')
      }
    } catch (err) {
      console.error('Delete document error:', err)
      setError('Erreur de connexion')
    }
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document, index) => (
        <motion.div
          key={document.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -2 }}
          className="group"
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="p-4">
              {/* Header with icon and menu */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDocumentAction('view', document)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    {canEditDocument(document) && (
                      <DropdownMenuItem onClick={() => handleDocumentAction('edit', document)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDocumentAction('download', document)}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </DropdownMenuItem>
                    {canDeleteDocument(document) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDocumentAction('delete', document)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Document name */}
              <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {document.name}
              </h3>

              {/* Physical location */}
              <div className="flex items-start gap-2 mb-3 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{document.physicalLocation || 'Non spécifié'}</span>
              </div>

              {/* Category and tags */}
              <div className="space-y-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {document.category || 'Sans catégorie'}
                </Badge>
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{document.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <Separator className="my-3" />

              {/* Footer with author and date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-xs">
                      {document.uploadedBy?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{document.uploadedBy || 'Utilisateur'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{formatFileSize(document.size || 0)}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(document.uploadedAt || document.createdAt || new Date().toISOString())}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const renderListView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-muted/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {document.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-48">{document.physicalLocation || 'Non spécifié'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(document.uploadedAt || document.createdAt || new Date().toISOString())}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{document.uploadedBy || 'Utilisateur'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags and actions */}
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {document.category || 'Sans catégorie'}
                        </Badge>
                        {document.tags && document.tags.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {document.tags.length}
                          </Badge>
                        )}
                      </div>
                      
                      <span className="text-xs text-muted-foreground min-w-0">
                        {formatFileSize(document.size || 0)}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDocumentAction('view', document)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          {canEditDocument(document) && (
                            <DropdownMenuItem onClick={() => handleDocumentAction('edit', document)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDocumentAction('download', document)}>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </DropdownMenuItem>
                          {canDeleteDocument(document) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDocumentAction('delete', document)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (!isBackendAvailable) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Le service backend n'est pas disponible. Veuillez réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Chargement des documents...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            {documents.length} documents trouvés
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {hasPermission('create_documents') && (
            <Button onClick={() => setShowUpload(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Nouveau document
            </Button>
          )}
        </div>
      </motion.div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {documents.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Aucun document trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par télécharger votre premier document.
                </p>
                {hasPermission('create_documents') && (
                  <Button onClick={() => setShowUpload(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Télécharger un document
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
      </motion.div>

      {/* Upload Modal */}
      <DocumentUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={(uploadedDocuments) => {
          console.log('Documents uploaded:', uploadedDocuments)
          loadDocuments() // Rechargement de la liste
          setShowUpload(false)
        }}
      />
    </div>
  )
}