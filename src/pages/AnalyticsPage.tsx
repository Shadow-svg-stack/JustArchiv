import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download,
  Eye,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { StatsCard } from '../components/dashboard/StatsCard'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { mockDocuments, mockCategories, mockUsers } from '../data/mockData'

export function AnalyticsPage() {
  // Données simulées pour les analytics
  const monthlyStats = [
    { month: 'Jan', documents: 45, downloads: 234, users: 8 },
    { month: 'Fév', documents: 52, downloads: 267, users: 9 },
    { month: 'Mar', documents: 38, downloads: 189, users: 12 },
    { month: 'Avr', documents: 61, downloads: 312, users: 11 },
    { month: 'Mai', documents: 49, downloads: 278, users: 10 }
  ]

  const topCategories = mockCategories
    .sort((a, b) => b.documentCount - a.documentCount)
    .slice(0, 5)

  const topUsers = mockUsers
    .map(user => ({
      ...user,
      documentsCount: mockDocuments.filter(doc => doc.author.id === user.id).length
    }))
    .sort((a, b) => b.documentsCount - a.documentsCount)
    .slice(0, 5)

  const recentActivity = [
    { action: 'Upload', count: 24, percentage: 45 },
    { action: 'Téléchargements', count: 156, percentage: 78 },
    { action: 'Consultations', count: 89, percentage: 34 },
    { action: 'Modifications', count: 12, percentage: 23 }
  ]

  const fileTypeDistribution = [
    { type: 'PDF', count: 124, color: 'bg-red-500' },
    { type: 'Word', count: 67, color: 'bg-blue-500' },
    { type: 'Excel', count: 34, color: 'bg-green-500' },
    { type: 'PowerPoint', count: 20, color: 'bg-orange-500' }
  ]

  const totalFiles = fileTypeDistribution.reduce((sum, item) => sum + item.count, 0)

  const stats = [
    {
      title: "Vues ce mois",
      value: "2,345",
      description: "Pages vues",
      icon: Eye,
      trend: { value: 15, label: "vs mois dernier", isPositive: true },
      color: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "Téléchargements",
      value: "1,234",
      description: "Fichiers téléchargés",
      icon: Download,
      trend: { value: 8, label: "vs mois dernier", isPositive: true },
      color: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      title: "Activité",
      value: "89%",
      description: "Taux d'engagement",
      icon: Activity,
      trend: { value: 3, label: "vs mois dernier", isPositive: false },
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "Croissance",
      value: "+12%",
      description: "Nouveaux documents",
      icon: TrendingUp,
      trend: { value: 12, label: "vs mois dernier", isPositive: true },
      color: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Suivez les performances et l'utilisation de votre système documentaire
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter le rapport
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Activité mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-muted-foreground">{month.documents} docs</span>
                    </div>
                    <Progress value={(month.documents / 70) * 100} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Catégories populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {category.documentCount}
                      </span>
                      <div className="w-16">
                        <Progress 
                          value={(category.documentCount / Math.max(...topCategories.map(c => c.documentCount))) * 100} 
                          className="h-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Types de fichiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fileTypeDistribution.map((type, index) => (
                  <motion.div
                    key={type.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        <span className="font-medium">{type.type}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {((type.count / totalFiles) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(type.count / totalFiles) * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {type.count} fichiers
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Utilisateurs actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-xs font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {user.documentsCount} docs
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Résumé d'activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.action}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{activity.action}</span>
                      <span className="text-sm font-bold">{activity.count}</span>
                    </div>
                    <Progress value={activity.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {activity.percentage}% du total
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Résumé des performances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                <div className="text-sm text-muted-foreground">Temps de disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
                <div className="text-sm text-muted-foreground">Temps de chargement moyen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">15GB</div>
                <div className="text-sm text-muted-foreground">Données transférées ce mois</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}