import React from "react"
import { Bell, User } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-primary-700">
        Tableau de bord
      </h1>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:text-primary-600 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <User className="text-primary-600" size={20} />
          <span className="text-sm text-gray-700">{user?.email}</span>
        </div>

        <button
          onClick={signOut}
          className="px-3 py-1.5 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}

export default Header
