// src/pages/CategoriesPage.tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, Folder, FileText, Edit, Trash2, MoreHorizontal, Palette, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { useAuth } from '../contexts/AuthContext'
import supabase from '../utils/supabase/client' // ajuste le chemin si nécessaire
import type { Database } from '../types/database'

type CategoryRow = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

interface CategoryFormData {
  name: string
  description?: string | null
  color: string
  icon?: string | null
}

const colorOptions = [
  { value: '#3b82f6', name: 'Bleu' },
  { value: '#10b981', name: 'Vert' },
  { value: '#f59e0b', name: 'Orange' },
  { value: '#8b5cf6', name: 'Violet' },
  { value: '#06b6d4', name: 'Cyan' },
  { value: '#ef4444', name: 'Rouge' },
  { value: '#6b7280', name: 'Gris' },
  { value: '#ec4899', name: 'Rose' }
]

const iconOptions = [
  { value: 'Folder', name: 'Dossier', icon: Folder },
  { value: 'FileText', name: 'Document', icon: FileText },
  { value: 'Archive', name: 'Archive', icon: Archive }
]

export function CategoriesPage() {
  const { hasPermission, user } = useAuth()
  const canManageCategories = hasPermission('manage_categories')

  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'Folder'
  })

  // fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setCategories(data ?? [])
    } catch (err) {
      console.error('Erreur récupération catégories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateCategory = () => {
    setFormData({ name: '', description: '', color: '#3b82f6', icon: 'Folder' })
    setEditingCategory(null)
    setShowCreateModal(true)
  }

  const handleEditCategory = (category: CategoryRow) => {
    setFormData({
      name: category.name,
      description: category.description ?? '',
      color: category.color,
      icon: category.icon ?? 'Folder'
    })
    setEditingCategory(category)
    setShowCreateModal(true)
  }

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) return

    try {
      if (editingCategory) {
        const updateData: CategoryUpdate = {
          name: formData.name,
          description: formData.description ?? null,
          color: formData.color,
          icon: formData.icon ?? null
        }

        const { data, error } = await supabase
          .from('categories')
          .update(updateData)
          .eq('id', editingCategory.id)
          .select()
          .single()

        if (error) throw error
        // update local state with returned row
        setCategories(prev => prev.map(c => (c.id === editingCategory.id ? data : c)))
      } else {
        const insertData: CategoryInsert = {
          name: formData.name,
          description: formData.description ?? null,
          color: formData.color,
          icon: formData.icon ?? null,
          document_count: 0,
          is_default: false,
          created_by: user?.id ?? null
        }

        // IMPORTANT: insert expects an array or single in many typings; pass array to be safe
        const { data, error } = await supabase
          .from('categories')
          .insert([insertData])
          .select()
          .single()

        if (error) throw error
        setCategories(prev => [...prev, data])
      }

      setShowCreateModal(false)
      setEditingCategory(null)
    } catch (err) {
      console.error('Erreur création/modification catégorie :', err)
    }
  }

  const handleDeleteCategory = async (category: CategoryRow) => {
    if (category.is_default) return
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)

      if (error) throw error
      setCategories(prev => prev.filter(c => c.id !== category.id))
    } catch (err) {
      console.error('Erreur suppression catégorie :', err)
    }
  }

  const renderCategoryIcon = (iconName: string | null | undefined, color: string) => {
    const found = iconOptions.find(o => o.value === iconName)
    const IconComponent = found?.icon ?? Folder
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: color }}>
        <IconComponent className="w-6 h-6" />
      </div>
    )
  }

  // accessibility: dialog description id
  const dialogDescriptionId = 'category-dialog-description'

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">Organisez vos documents avec des catégories personnalisées</p>
        </div>
        {canManageCategories && (
          <Button onClick={handleCreateCategory}>
            <FolderPlus className="w-4 h-4 mr-2" /> Nouvelle catégorie
          </Button>
        )}
      </motion.div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} whileHover={{ y: -2 }} className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    {renderCategoryIcon(category.icon, category.color)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{category.name}</h3>
                      {category.is_default && <Badge variant="outline" className="text-xs mt-1">Par défaut</Badge>}
                    </div>
                  </div>

                  {canManageCategories && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className="w-4 h-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        {!category.is_default && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteCategory(category)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {category.description && <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{category.document_count} documents</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent aria-describedby={dialogDescriptionId}>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
          </DialogHeader>

          {/* description for accessibility */}
          <p id={dialogDescriptionId} className="sr-only">
            Formulaire pour créer ou modifier une catégorie
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Nom de la catégorie" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description ?? ''} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Description optionnelle" rows={3} />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Palette className="w-4 h-4" /> Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === c.value ? 'border-foreground scale-110' : 'border-muted'}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="flex gap-2">
                {iconOptions.map(iconOpt => {
                  const IconComp = iconOpt.icon
                  return (
                    <button
                      key={iconOpt.value}
                      type="button"
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-105 ${formData.icon === iconOpt.value ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'}`}
                      onClick={() => setFormData(prev => ({ ...prev, icon: iconOpt.value }))}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Aperçu</Label>
              <div className="p-4 border rounded-lg bg-muted/20 flex items-center gap-3">
                {renderCategoryIcon(formData.icon, formData.color)}
                <div>
                  <h4 className="font-semibold">{formData.name || 'Nom de la catégorie'}</h4>
                  {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Annuler</Button>
              <Button onClick={handleSaveCategory} disabled={!formData.name.trim()}>{editingCategory ? 'Modifier' : 'Créer'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoriesPage
