# Headers de sécurité et performance pour JustArchiv

/*
  # Sécurité
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff  
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  
  # CSP qui bloque les domaines externes lents
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://images.unsplash.com wss://*.supabase.co; media-src 'self' data: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
  
  # Cache optimisé
  Cache-Control: no-cache, no-store, must-revalidate

# Service Worker - toujours frais
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
  
# Assets statiques - cache long
/icons/*
  Cache-Control: public, max-age=31536000, immutable
  
*.js
  Cache-Control: public, max-age=3600, must-revalidate
  
*.css  
  Cache-Control: public, max-age=3600, must-revalidate