import React from "react"
import { NavLink } from "react-router-dom"
import { FileText, FolderOpen, Tag, Settings, Home } from "lucide-react"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/categories", label: "Catégories", icon: FolderOpen },
  { to: "/tags", label: "Tags", icon: Tag },
  { to: "/profile", label: "Profil", icon: Settings },
]

const Sidebar = () => {
  return (
    <aside className="w-64 bg-primary-600 text-white flex flex-col shadow-smooth">
      <div className="p-6 text-2xl font-bold tracking-tight">
        JustArchiv
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-primary-500 shadow-card"
                  : "hover:bg-primary-700"
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-xs text-primary-100">
        © {new Date().getFullYear()} JustArchiv
      </div>
    </aside>
  )
}

export default Sidebar
