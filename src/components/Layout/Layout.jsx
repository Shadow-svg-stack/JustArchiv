import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

// Import des icônes Heroicons
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline"

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Documents", path: "/documents", icon: DocumentTextIcon },
  { name: "Catégories", path: "/categories", icon: FolderIcon },
  { name: "Profil", path: "/profile", icon: UserCircleIcon },
  { name: "Admin", path: "/admin", icon: Cog6ToothIcon },
  { name: "Headmaster", path: "/headmaster", icon: AcademicCapIcon },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">JustArchiv</h1>
          <p className="text-sm text-gray-500">Bienvenue {user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
