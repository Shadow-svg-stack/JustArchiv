import React from 'react'
import { Menu, Moon, Sun, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Header = ({ onMenuToggle, onSidebarToggle }) => {
  const { user, userProfile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-surface border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="btn btn-secondary btn-sm md:hidden"
          >
            <Menu size={16} />
          </button>
          
          <div className="hidden md:block">
            <h2 className="text-lg font-medium">
              Bonjour, {userProfile?.full_name || user?.email}
            </h2>
            <p className="text-sm text-secondary">
              Rôle: {userProfile?.role || 'Utilisateur'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button className="btn btn-secondary btn-sm relative">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-xs"></span>
          </button>

          <button
            onClick={signOut}
            className="btn btn-danger btn-sm"
            title="Se déconnecter"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
