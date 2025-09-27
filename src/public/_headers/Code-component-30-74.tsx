/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; block-all-mixed-content; upgrade-insecure-requests

/sw.js
  Service-Worker-Allowed: /

/manifest.json
  Content-Type: application/manifest+json

# Block known slow domains at CDN level
/api/56203/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store, no-cache
  
/*sentry*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store, no-cache