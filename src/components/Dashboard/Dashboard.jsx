import React, { useState, useEffect } from "react"
import {
  DocumentTextIcon,
  FolderIcon,
  TagIcon,
  CloudArrowUpIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"
import { useAuth } from "../../contexts/AuthContext"
import { dbHelpers } from "../../lib/supabase"
import LoadingSpinner from "../UI/LoadingSpinner"

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    documents: 0,
    categories: 0,
    tags: 0,
    storage: "0 MB",
  })
  const [recentDocuments, setRecentDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return
    try {
      setLoading(true)

      const [documents, categories, tags] = await Promise.all([
        dbHelpers.getUserDocuments(user.id, { limit: 5 }),
        dbHelpers.getUserCategories(user.id),
        dbHelpers.getUserTags(user.id),
      ])

      const totalStorage = documents.reduce(
        (sum, doc) => sum + (doc.file_size || 0),
        0
      )

      setStats({
        documents: documents.length,
        categories: categories.length,
        tags: tags.length,
        storage: dbHelpers.formatFileSize(totalStorage),
      })

      setRecentDocuments(documents.slice(0, 5))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Chargement du tableau de bord..." />
  }

  const statCards = [
    {
      title: "Documents",
      value: stats.documents,
      icon: DocumentTextIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Catégories",
      value: stats.categories,
      icon: FolderIcon,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Tags",
      value: stats.tags,
      icon: TagIcon,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Stockage",
      value: stats.storage,
      icon: CloudArrowUpIcon,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500">
          Bienvenue <span className="font-medium">{user?.email}</span>, voici un
          aperçu de votre activité.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white shadow rounded-xl p-6 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Content: Documents récents + Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents récents */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Documents récents
          </h3>
          {recentDocuments.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-gray-700">{doc.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    {doc.file_type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-6">
              Aucun document récent
            </p>
          )}
        </div>

        {/* Activité récente */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Activité récente
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-sm text-gray-700">Connexion réussie</p>
                <p className="text-xs text-gray-400">Il y a quelques minutes</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <UserCircleIcon className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <p className="text-sm text-gray-700">Profil mis à jour</p>
                <p className="text-xs text-gray-400">Aujourd'hui</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
