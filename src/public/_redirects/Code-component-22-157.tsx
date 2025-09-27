# Redirections pour JustArchiv PWA

# SPA - toutes les routes vers index.html (sauf les assets)
/*    /index.html   200

# API calls vers Supabase
/api/*  https://PROJECT_ID.supabase.co/functions/v1/make-server-450d4529/:splat  200

# Redirections d'anciennes URLs (si nécessaire)
/login    /    302
/dashboard    /    302

# URLs courtes pour partage
/d/:id    /?document=:id    302
/u/:id    /?user=:id    302

# Force HTTPS en production
http://justarchiv.com/*    https://justarchiv.com/:splat    301!
http://www.justarchiv.com/*    https://justarchiv.com/:splat    301!

# Gestion des erreurs
/404    /index.html    404
/500    /index.html    500