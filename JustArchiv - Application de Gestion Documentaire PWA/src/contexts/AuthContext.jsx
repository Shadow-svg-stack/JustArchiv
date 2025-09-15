import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, dbHelpers } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
          if (event === 'SIGNED_IN') {
            await dbHelpers.logActivity(session.user.id, 'login')
            toast.success('Connexion réussie!')
          }
        } else {
          setUserProfile(null)
          setUserRole(null)
          if (event === 'SIGNED_OUT') {
            toast.success('Déconnexion réussie!')
          }
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const profile = await dbHelpers.getUserProfile(userId)
      setUserProfile(profile)
      setUserRole(profile.role)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          role: 'reader' // Default role
        })

        await dbHelpers.logActivity(data.user.id, 'register')
        toast.success('Inscription réussie! Vérifiez votre email.')
      }

      return { data, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      toast.error('Email ou mot de passe incorrect')
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      if (user) {
        await dbHelpers.logActivity(user.id, 'logout')
      }
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const updatedProfile = await dbHelpers.updateUserProfile(user.id, updates)
      setUserProfile(updatedProfile)
      
      await dbHelpers.logActivity(user.id, 'profile_update', { fields: Object.keys(updates) })
      toast.success('Profil mis à jour!')
      
      return { data: updatedProfile, error: null }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
      return { data: null, error }
    }
  }

  const changePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      await dbHelpers.logActivity(user.id, 'password_change')
      toast.success('Mot de passe modifié!')
      
      return { error: null }
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe')
      return { error }
    }
  }

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('No user logged in')

      // Log the account deletion
      await dbHelpers.logActivity(user.id, 'account_deletion')

      // Delete user data (handled by database triggers)
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error

      toast.success('Compte supprimé avec succès')
      return { error: null }
    } catch (error) {
      toast.error('Erreur lors de la suppression du compte')
      return { error }
    }
  }

  const getSessions = async () => {
    try {
      // This would require additional setup with Supabase
      // For now, return current session info
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessions([{
          id: session.access_token.substring(0, 8),
          device: navigator.userAgent,
          ip: 'Current session',
          last_active: new Date().toISOString(),
          current: true
        }])
      }
    } catch (error) {
      console.error('Error getting sessions:', error)
    }
  }

  const value = {
    user,
    userProfile,
    userRole,
    loading,
    sessions,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    deleteAccount,
    getSessions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
