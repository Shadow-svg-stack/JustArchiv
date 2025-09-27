import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key,
  Download,
  Trash2,
  Camera,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: ''
  })
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    documentUpload: true,
    systemAlerts: false,
    weeklyReport: true,
    pushNotifications: false
  })

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'dd/MM/yyyy',
    pageSize: '20'
  })

  const handleSaveProfile = () => {
    updateUser({
      name: userForm.name,
      email: userForm.email
    })
    console.log('Profile saved:', userForm)
  }

  const handleSaveNotifications = () => {
    console.log('Notifications saved:', notifications)
  }

  const handleSavePreferences = () => {
    console.log('Preferences saved:', preferences)
  }

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Gérez votre profil et vos préférences
          </p>
        </div>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Préférences
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Changer la photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG ou GIF. Taille max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={userForm.name}
                      onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={userForm.phone}
                      onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={userForm.location}
                      onChange={(e) => setUserForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Paris, France"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={userForm.bio}
                    onChange={(e) => setUserForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Parlez-nous de vous..."
                    rows={3}
                  />
                </div>

                {/* Role Info */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rôle actuel</p>
                      <p className="text-sm text-muted-foreground">
                        Votre niveau d'accès dans l'application
                      </p>
                    </div>
                    <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      {user?.role === 'headmaster' ? 'Headmaster' :
                       user?.role === 'admin' ? 'Administrateur' :
                       user?.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    Sauvegarder les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <p className="font-medium">Notifications par email</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications importantes par email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Upload de documents</p>
                      <p className="text-sm text-muted-foreground">
                        Être notifié quand de nouveaux documents sont ajoutés
                      </p>
                    </div>
                    <Switch
                      checked={notifications.documentUpload}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, documentUpload: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Alertes système</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les problèmes techniques
                      </p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Rapport hebdomadaire</p>
                      <p className="text-sm text-muted-foreground">
                        Résumé de l'activité chaque semaine
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Notifications push</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications en temps réel dans le navigateur
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    Sauvegarder les préférences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Apparence et thème
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Thème</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choisissez l'apparence de l'interface
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'light' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full h-20 bg-white rounded border mb-2"></div>
                        <p className="text-sm font-medium">Clair</p>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'dark' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full h-20 bg-slate-900 rounded border mb-2"></div>
                        <p className="text-sm font-medium">Sombre</p>
                      </button>
                      
                      <button
                        onClick={() => setTheme('auto')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'auto' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full h-20 bg-gradient-to-r from-white to-slate-900 rounded border mb-2"></div>
                        <p className="text-sm font-medium">Auto</p>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Préférences générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select 
                      value={preferences.language}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select 
                      value={preferences.timezone}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select 
                      value={preferences.dateFormat}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                        <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pageSize">Éléments par page</Label>
                    <Select 
                      value={preferences.pageSize}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, pageSize: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences}>
                    Sauvegarder les préférences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sécurité du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mot de passe</p>
                        <p className="text-sm text-muted-foreground">
                          Dernière modification il y a 30 jours
                        </p>
                      </div>
                      <Button variant="outline">
                        <Key className="w-4 h-4 mr-2" />
                        Changer
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-muted-foreground">
                          Sécurité supplémentaire pour votre compte
                        </p>
                      </div>
                      <Button variant="outline">
                        Configurer
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sessions actives</p>
                        <p className="text-sm text-muted-foreground">
                          Gérer vos connexions sur différents appareils
                        </p>
                      </div>
                      <Button variant="outline">
                        Voir les sessions
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-destructive">Zone de danger</h3>
                  
                  <div className="p-4 border border-destructive/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Exporter mes données</p>
                        <p className="text-sm text-muted-foreground">
                          Télécharger une copie de toutes vos données
                        </p>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-destructive/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Supprimer mon compte</p>
                        <p className="text-sm text-muted-foreground">
                          Cette action est irréversible
                        </p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}