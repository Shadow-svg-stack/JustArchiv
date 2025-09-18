import React, { useState, useEffect } from 'react'
import { Menu, Moon, Sun, LogOut, Bell, Search, Settings, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Header = ({ onMenuToggle, onSidebarToggle }) => {
  const { user, userProfile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    { id: 1, title: 'Nouveau document', message: 'Document.pdf a été ajouté', time: '2 min', unread: true },
    { id: 2, title: 'Sauvegarde terminée', message: 'Tous vos fichiers sont sauvegardés', time: '1h', unread: true },
    { id: 3, title: 'Mise à jour disponible', message: 'Version 2.1.0 disponible', time: '3h', unread: false }
  ])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
      if (!event.target.closest('.notifications-container')) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg shadow-black/5 animate-fade-in">
      {/* Effet de gradient animé en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Section gauche */}
          <div className="flex items-center gap-4">
            {/* Bouton menu mobile avec animation */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-105"
            >
              <Menu size={20} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
            </button>
            
            {/* Informations utilisateur avec animation */}
            <div className="hidden md:block animate-slide-in">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bonjour, {userProfile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'} 👋
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Rôle: {userProfile?.role || 'Utilisateur'}
                </span>
                <span className="hidden lg:block">
                  {currentTime.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Barre de recherche centrale (desktop uniquement) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans JustArchiv..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 rounded border text-gray-500 dark:text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Section droite */}
          <div className="flex items-center gap-2">
            {/* Bouton recherche mobile */}
            <button className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-105">
              <Search size={18} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
            </button>

            {/* Toggle thème avec animation */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group relative overflow-hidden hover:scale-105"
              title={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            >
              <div className={`transition-all duration-300 ${theme === 'light' ? 'rotate-0' : 'rotate-180'}`}>
                {theme === 'light' ? (
                  <Moon size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                ) : (
                  <Sun size={18} className="text-gray-300 group-hover:text-yellow-400 transition-colors duration-300" />
                )}
              </div>
            </button>

            {/* Notifications avec dropdown */}
            <div className="notifications-container relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-105"
              >
                <Bell size={18} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown notifications */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50 animate-scale-in">
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{unreadCount} non lues</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                          notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {notification.title}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                              Il y a {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700">
                    <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu utilisateur avec dropdown */}
            <div className="user-menu-container relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-105"
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                
                {/* Nom (desktop uniquement) */}
                <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Utilisateur'}
                </span>
                
                {/* Icône dropdown */}
                <ChevronDown 
                  size={16} 
                  className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown menu utilisateur */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50 animate-scale-in">
                  {/* En-tête du menu */}
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-lg font-bold">
                        {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {userProfile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                        </p>
                        <p className="text-sm opacity-90">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options du menu */}
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 text-left">
                      <User size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Mon profil</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 text-left">
                      <Settings size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Paramètres</span>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-left group"
                    >
                      <LogOut size={18} className="text-red-600 dark:text-red-400" />
                      <span className="text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">
                        Se déconnecter
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ligne de progression subtile */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </header>
  )
}

export default Header
