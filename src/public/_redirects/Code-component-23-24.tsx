# Redirections pour JustArchiv

# SPA - toutes les routes vers index.html
/*    /index.html   200

# Force HTTPS
http://justarchiv.com/*    https://justarchiv.com/:splat    301!

# Gestion des erreurs
/404    /index.html    404
/500    /index.html    500