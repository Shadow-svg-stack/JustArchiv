# JustArchiv

Une application web complète de gestion documentaire avec PWA, authentification sécurisée et dashboard de maintenance.

## 🚀 Fonctionnalités

### 🔐 Authentification & Permissions
- Inscription/connexion sécurisée via Supabase
- Gestion des rôles (Admin, Éditeur, Lecteur, Headmaster)
- Sessions persistantes
- Gestion des sessions actives

### 📂 Gestion des Documents
- Upload de documents (PDF, Word, images)
- Organisation par utilisateur
- Aperçu et téléchargement
- Métadonnées et catégorisation
- Recherche et filtrage avancés

### 🏷️ Catégories & Tags
- Système de catégories colorées
- Tags multi-niveaux
- Filtrage par catégories/tags

### 🎨 Interface Utilisateur
- Design moderne et responsive
- Mode sombre/clair
- Animations et transitions fluides
- PWA (installable sur mobile/desktop)

### 📊 Administration
- Panneau admin pour la gestion des utilisateurs
- Statistiques système
- Logs d'activité
- Paramètres de sécurité

### 👨‍💻 Dashboard Headmaster (Développeur)
- Monitoring système en temps réel
- Gestion de la base de données
- Suivi des erreurs
- Outils de maintenance
- Gestionnaire de sauvegardes

## 🛠️ Technologies

- **Frontend**: React 18, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: CSS personnalisé (pas de Tailwind)
- **PWA**: Vite PWA Plugin
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd justarchiv
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
```bash
cp .env.example .env
```

Remplir les variables d'environnement dans `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Configurer la base de données Supabase**

Créer les tables suivantes dans Supabase:

```sql
-- Table des profils utilisateurs
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'reader' CHECK (role IN ('reader', 'editor', 'admin', 'headmaster')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#2563eb',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tags
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#2563eb',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison documents-tags
CREATE TABLE document_tags (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **Configurer le stockage Supabase**

Créer un bucket `documents` dans Supabase Storage avec les politiques appropriées.

6. **Lancer l'application**
```bash
npm run dev
```

## 🔧 Configuration PWA

L'application est automatiquement configurée comme PWA avec:
- Manifest.json pour l'installation
- Service Worker pour le cache
- Icons pour mobile/desktop

## 🔒 Sécurité

- Authentification via Supabase Auth
- Row Level Security (RLS) sur toutes les tables
- Validation côté client et serveur
- Logs d'activité complets
- Gestion des sessions

## 👥 Rôles Utilisateurs

- **Reader**: Lecture seule de ses documents
- **Editor**: Création/modification de ses documents
- **Admin**: Gestion des utilisateurs + fonctionnalités éditeur
- **Headmaster**: Accès complet + outils de maintenance (réservé au développeur)

## 🚀 Déploiement

1. **Build de production**
```bash
npm run build
```

2. **Déploiement sur Netlify**
- Connecter le repository GitHub
- Configurer les variables d'environnement
- Déploiement automatique sur push

## 📱 PWA Installation

L'application peut être installée comme une app native sur:
- Android (Chrome, Edge, Samsung Internet)
- iOS (Safari - Add to Home Screen)
- Desktop (Chrome, Edge, Safari)

## 🔍 Monitoring & Maintenance

Le dashboard Headmaster inclut:
- Monitoring système temps réel
- Gestion base de données
- Suivi des erreurs
- Outils de maintenance
- Sauvegardes automatiques

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.
