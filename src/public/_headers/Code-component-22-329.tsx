# Headers pour la sécurité et les performances de JustArchiv

/*
  # Sécurité
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff  
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  
  # Content Security Policy
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://images.unsplash.com wss://*.supabase.co; media-src 'self' data: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
  
  # Performance et cache (développement)
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# Assets statiques - cache long terme en production
/assets/*
  Cache-Control: public, max-age=31536000, immutable
  
/icons/*
  Cache-Control: public, max-age=31536000, immutable
  
# Service Worker - ne pas mettre en cache
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
  
# Manifest - cache court
/manifest.json
  Cache-Control: public, max-age=86400
  
# API calls - pas de cache
/api/*
  Cache-Control: no-cache, no-store, must-revalidate
  
# Fonts - cache long terme
*.woff2
  Cache-Control: public, max-age=31536000, immutable
  
*.woff
  Cache-Control: public, max-age=31536000, immutable
  
# Images - cache moyen terme
*.png
  Cache-Control: public, max-age=86400
  
*.jpg
  Cache-Control: public, max-age=86400
  
*.jpeg
  Cache-Control: public, max-age=86400
  
*.gif
  Cache-Control: public, max-age=86400
  
*.svg
  Cache-Control: public, max-age=86400
  
*.webp
  Cache-Control: public, max-age=86400

# Scripts et styles - cache avec validation
*.js
  Cache-Control: public, max-age=3600, must-revalidate
  
*.css
  Cache-Control: public, max-age=3600, must-revalidate