import React, { useState, useEffect } from 'react'
import { Search, MoreVertical, UserCheck, UserX, Trash2 } from 'lucide-react'
import { dbHelpers, supabase } from '../../lib/supabase'
import LoadingSpinner from '../UI/LoadingSpinner'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await dbHelpers.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)

      toast.success('Rôle mis à jour')
      loadUsers()
    } catch (error) {
      console.error('Role change error:', error)
      toast.error('Erreur lors du changement de rôle')
    }
  }

  const handleUserToggle = async (userId, isActive) => {
    try {
      await supabase
        .from('user_profiles')
        .update({ is_active: !isActive })
        .eq('id', userId)

      toast.success(isActive ? 'Utilisateur désactivé' : 'Utilisateur activé')
      loadUsers()
    } catch (error) {
      console.error('User toggle error:', error)
      toast.error('Erreur lors de la modification')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      return
    }

    try {
      await supabase.auth.admin.deleteUser(userId)
      toast.success('Utilisateur supprimé')
      loadUsers()
    } catch (error) {
      console.error('Delete user error:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner text="Chargement des utilisateurs..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Gestion des utilisateurs</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Utilisateur</th>
                <th className="text-left py-3 px-4">Rôle</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Inscription</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-surface-dark">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{user.full_name || 'Sans nom'}</p>
                      <p className="text-sm text-secondary">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="input text-sm"
                    >
                      <option value="reader">Lecteur</option>
                      <option value="editor">Éditeur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      user.is_active !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active !== false ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleUserToggle(user.id, user.is_active !== false)}
                        className={`btn btn-sm ${
                          user.is_active !== false ? 'btn-secondary' : 'btn-primary'
                        }`}
                        title={user.is_active !== false ? 'Désactiver' : 'Activer'}
                      >
                        {user.is_active !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                        className="btn btn-danger btn-sm"
                        title="Supprimer"
                      >
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  )
}

export default UserManagement
