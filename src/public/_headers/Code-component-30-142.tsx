/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; block-all-mixed-content; upgrade-insecure-requests; report-uri /dev/null

/sw.js
  Service-Worker-Allowed: /
  Cache-Control: public, max-age=31536000, immutable

/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=86400

# ULTIMATE PERFORMANCE - Block ALL slow domains
/api/56203/*
  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
  Cache-Control: no-store, no-cache, must-revalidate
  Status: 204

/*sentry*
  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet  
  Cache-Control: no-store, no-cache, must-revalidate
  Status: 204

/*webpack-artifacts*
  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
  Cache-Control: no-store, no-cache, must-revalidate
  Status: 204

# Block specific Sentry endpoints
/envelope/*
  Status: 204

# Cache optimization for assets
/icons/*
  Cache-Control: public, max-age=31536000, immutable
  
/assets/*
  Cache-Control: public, max-age=31536000, immutable