import React, { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

// Composant d'écran de chargement avec CSS pur
const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center animate-fade-in">
      {/* Particules de fond animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
      
      {/* Logo et animation de chargement */}
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl animate-pulse">
          <div className="text-white text-2xl font-bold animate-spin">
            ✨
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 animate-slide-in">
          JustArchiv
        </h1>
        
        <p className="text-gray-300 mb-8 animate-fade-in">
          Chargement de votre espace de travail...
        </p>
        
        {/* Barre de progression animée */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" 
               style={{width: '100%'}} />
        </div>
      </div>
    </div>
  )
}

// Composant de breadcrumb automatique
const Breadcrumb = ({ location }) => {
  const navigate = useNavigate()
  
  const getBreadcrumbs = (pathname) => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Accueil', path: '/dashboard' }]
    
    let currentPath = ''
    paths.forEach(path => {
      currentPath += `/${path}`
      const label = path.charAt(0).toUpperCase() + path.slice(1)
      breadcrumbs.push({ label, path: currentPath })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = getBreadcrumbs(location.pathname)
  
  if (breadcrumbs.length <= 1) return null
  
  return (
    <nav className="px-6 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50 animate-fade-in">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => navigate(crumb.path)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pageTransition, setPageTransition] = useState(false)
  
  const location = useLocation()

  // Simulation du chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Gestion des changements de route avec animation
  useEffect(() => {
    setPageTransition(true)
    // Fermer le menu mobile lors du changement de route
    setMobileMenuOpen(false)
    
    const timer = setTimeout(() => {
      setPageTransition(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Raccourcis clavier intelligents
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + B pour toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setSidebarCollapsed(prev => !prev)
      }
      
      // Escape pour fermer le menu mobile
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
      
      // Ctrl/Cmd + K pour focus sur la recherche (si disponible)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Rechercher"]')
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Gestion responsive automatique
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // Callbacks optimisés
  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const handleMobileToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <>
      {/* Écran de chargement */}
      <LoadingScreen isLoading={isLoading} />
      
      {/* Layout principal avec structure corrigée */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Particules de fond décoratives */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        {/* Structure flexbox corrigée pour éviter que le header soit en bas */}
        <div className="flex min-h-screen relative z-10">
          {/* Sidebar */}
          <Sidebar 
            collapsed={sidebarCollapsed}
            mobileOpen={mobileMenuOpen}
            onToggle={handleSidebarToggle}
            onMobileToggle={handleMobileToggle}
          />
          
          {/* Zone de contenu principal - STRUCTURE CORRIGÉE */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header TOUJOURS en haut */}
            <Header 
              onMenuToggle={handleMobileToggle}
              onSidebarToggle={handleSidebarToggle}
            />
            
            {/* Breadcrumb automatique */}
            <Breadcrumb location={location} />
            
            {/* Contenu principal avec animations - flex-1 pour prendre l'espace restant */}
            <main className="flex-1 relative overflow-hidden">
              <div className={`h-full transition-all duration-300 ${pageTransition ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'}`}>
                {/* Container avec padding et effets */}
                <div className="p-6 h-full">
                  {/* Effet de verre subtil pour le contenu */}
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl shadow-black/5 min-h-full p-6 relative overflow-hidden group">
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    
                    {/* Contenu de la page */}
                    <div className="relative z-10">
                      <Outlet />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Overlay mobile amélioré */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-fade-in"
            onClick={handleMobileToggle}
          />
        )}

        {/* Indicateur de raccourcis clavier */}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm z-50 hidden lg:block opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="space-y-1">
            <div><kbd className="bg-white/20 px-1 rounded">Ctrl+B</kbd> Toggle sidebar</div>
            <div><kbd className="bg-white/20 px-1 rounded">Ctrl+K</kbd> Rechercher</div>
            <div><kbd className="bg-white/20 px-1 rounded">Esc</kbd> Fermer menu</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
