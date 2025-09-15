import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  User, 
  Settings,
  ChevronLeft,
  Crown,
  Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ collapsed, mobileOpen, onToggle, onMobileToggle }) => {
  const { userRole } = useAuth()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: FolderOpen, label: 'Catégories', path: '/categories' },
    { icon: User, label: 'Profil', path: '/profile' },
  ]

  if (userRole === 'admin') {
    menuItems.push({ icon: Shield, label: 'Administration', path: '/admin' })
  }

  if (userRole === 'headmaster') {
    menuItems.push({ icon: Crown, label: 'Headmaster', path: '/headmaster' })
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h1 className="text-xl font-semibold text-primary">JustArchiv</h1>
          )}
          <button
            onClick={onToggle}
            className="btn btn-secondary btn-sm hidden md:flex"
          >
            <ChevronLeft 
              size={16} 
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onMobileToggle()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-surface-dark hover:text-primary'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
