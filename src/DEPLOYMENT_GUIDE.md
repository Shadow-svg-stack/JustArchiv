# Guide de Déploiement JustArchiv - Production

## 📋 Vue d'ensemble

Ce guide couvre la mise en production complète de JustArchiv avec Supabase et Netlify, incluant la configuration des bases de données, l'authentification, le déploiement PWA, et la maintenance.

## 🗃️ Étape 1 : Configuration Supabase

### 1.1 Création du projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte
2. Créez un nouveau projet :
   - Nom : `justarchiv-production`
   - Base de données : choisissez une région proche de vos utilisateurs
   - Mot de passe fort pour la base de données

### 1.2 Création des tables principales

Dans l'onglet SQL Editor de Supabase, exécutez ces requêtes :

```sql
-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des rôles utilisateur
CREATE TYPE user_role AS ENUM ('Admin', 'Éditeur', 'Lecteur', 'Headmaster');

-- Table des utilisateurs (complète la table auth.users de Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'Lecteur',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tags
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#10B981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  physical_location TEXT, -- Emplacement physique pour retrouver les archives
  shelf_reference TEXT,   -- Référence étagère/boîte
  category_id UUID REFERENCES categories(id),
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison documents-tags (many-to-many)
CREATE TABLE document_tags (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- Table d'activité/logs
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'download'
  entity_type TEXT NOT NULL, -- 'document', 'category', 'user'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres système (pour le dashboard headmaster)
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour les performances
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

### 1.3 Configuration de la sécurité RLS (Row Level Security)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins and Headmaster can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Headmaster')
  )
);

-- Politiques pour categories
CREATE POLICY "Everyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Editors and above can manage categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Éditeur', 'Headmaster')
  )
);

-- Politiques pour documents
CREATE POLICY "Everyone can view documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Editors and above can create documents" ON documents FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Éditeur', 'Headmaster')
  )
);
CREATE POLICY "Users can update their own documents or admins can update all" ON documents FOR UPDATE USING (
  uploaded_by = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Headmaster')
  )
);
CREATE POLICY "Admins and Headmaster can delete documents" ON documents FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Headmaster')
  )
);

-- Politiques pour system_settings (Headmaster seulement)
CREATE POLICY "Only headmaster can access system settings" ON system_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'Headmaster'
  )
);
```

### 1.4 Triggers pour la maintenance automatique

```sql
-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers sur les tables principales
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'), 'Lecteur');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.5 Configuration du Storage

1. Dans l'onglet Storage de Supabase, créez un bucket :
   - Nom : `documents`
   - Public : Non (privé)
   
2. Ajoutez les politiques de storage :

```sql
-- Politique pour télécharger des fichiers (tout le monde peut voir)
CREATE POLICY "Anyone can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

-- Politique pour uploader des fichiers (éditeurs et plus)
CREATE POLICY "Editors can upload documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Éditeur', 'Headmaster')
  )
);

-- Politique pour supprimer des fichiers (admins seulement)
CREATE POLICY "Admins can delete documents" ON storage.objects FOR DELETE USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('Admin', 'Headmaster')
  )
);
```

## 🔐 Étape 2 : Configuration de l'authentification

### 2.1 Paramètres généraux

Dans Authentication > Settings :

1. **Site URL** : `https://votre-domaine.netlify.app`
2. **Redirect URLs** : 
   - `https://votre-domaine.netlify.app/**`
   - `http://localhost:5173/**` (pour le développement)

### 2.2 Configuration des providers (optionnel)

Pour activer Google OAuth :
1. Authentication > Providers > Google
2. Activez et configurez avec vos clés OAuth Google
3. Ajoutez l'URL de callback : `https://[votre-projet].supabase.co/auth/v1/callback`

### 2.3 Modèles d'emails

Personnalisez les templates dans Authentication > Email Templates :

**Template de confirmation** :
```html
<h2>Bienvenue sur JustArchiv !</h2>
<p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour confirmer votre email :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
```

## 🚀 Étape 3 : Déploiement sur Netlify

### 3.1 Préparation du projet

1. **Variables d'environnement** - Créez un fichier `.env.production` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

2. **Configuration du build** - Créez `netlify.toml` :

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/*.js"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.woff2"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"
```

### 3.2 Déploiement

1. **Connectez votre repo GitHub à Netlify**
2. **Configurez les variables d'environnement** dans Netlify :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Déployez** - Netlify détectera automatiquement Vite

### 3.3 Domaine personnalisé (optionnel)

1. Dans Domain settings, ajoutez votre domaine
2. Configurez les DNS selon les instructions Netlify
3. Activez HTTPS (automatique avec Netlify)

## 📱 Étape 4 : Configuration PWA

### 4.1 Service Worker

Créez `/public/sw.js` :

```javascript
const CACHE_NAME = 'justarchiv-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

### 4.2 Manifeste PWA

Mettez à jour `/public/manifest.json` :

```json
{
  "name": "JustArchiv - Gestion Documentaire",
  "short_name": "JustArchiv",
  "description": "Application de gestion documentaire moderne avec authentification et gestion des rôles",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#030213",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["productivity", "business"],
  "screenshots": [
    {
      "src": "/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshot-mobile.png",
      "sizes": "375x812", 
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## 🔧 Étape 5 : Optimisations de production

### 5.1 Configuration Vite optimisée

Mettez à jour `vite.config.ts` :

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'JustArchiv',
        short_name: 'JustArchiv', 
        description: 'Gestion documentaire moderne',
        theme_color: '#030213',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'motion/react']
        }
      }
    }
  }
})
```

### 5.2 Optimisation des images

1. **Utilisez des formats modernes** : WebP, AVIF
2. **Implémentez le lazy loading**
3. **Compressez les assets** avec un outil comme TinyPNG

## 📊 Étape 6 : Monitoring et maintenance

### 6.1 Analytics et monitoring

1. **Ajoutez Google Analytics 4** :

```typescript
// utils/analytics.ts
import { createClient } from '@supabase/supabase-js'

export const trackEvent = (event: string, properties?: any) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', event, properties)
  }
}

export const trackPageView = (page: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: page
    })
  }
}
```

2. **Monitoring d'erreurs avec Sentry** (optionnel)

### 6.2 Backup et sécurité

1. **Backup automatique** : Configurez les backups dans Supabase
2. **SSL/TLS** : Automatique avec Netlify
3. **Headers de sécurité** dans `netlify.toml` :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
```

## 🎯 Étape 7 : Tests et validation

### 7.1 Checklist de pré-production

- [ ] Toutes les fonctionnalités testées
- [ ] Authentification fonctionnelle
- [ ] Upload de documents opérationnel  
- [ ] Permissions des rôles correctes
- [ ] PWA installable
- [ ] Responsive design validé
- [ ] Performance (Lighthouse > 90)
- [ ] SEO optimisé

### 7.2 Tests utilisateurs

1. **Créez un utilisateur de test pour chaque rôle**
2. **Testez tous les parcours utilisateur**
3. **Validez sur mobile et desktop**

## 🚀 Mise en ligne finale

1. **Mergez sur la branche main**
2. **Attendez le déploiement automatique Netlify**
3. **Vérifiez le site en production**
4. **Créez votre compte Headmaster via l'interface**
5. **Configurez les paramètres système**

## 📞 Support et ressources

- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Netlify** : https://docs.netlify.com
- **Performance Web** : https://web.dev
- **PWA Guide** : https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

Votre application JustArchiv est maintenant prête pour la production ! 🎉