# Production Readiness Checklist

1. **Secrets**
   - Rotate Supabase anon/service keys immediately.
   - Remove any leaked secrets from git history.

2. **Dependencies**
   - Run `npm audit` and fix vulnerabilities.
   - Lock Node engine in `package.json` if you rely on a specific version.

3. **Build & CI**
   - Add CI workflow (GitHub Actions) that lints, typechecks, builds and runs tests.
   - Add `NODE_ENV=production` build step and verify Vite build output.

4. **Tests**
   - Ensure unit tests and e2e tests are runnable. Configure Cypress to run in CI.

5. **PWA and Service Worker**
   - Audit Workbox/vite-plugin-pwa config to ensure caching and updates are correct.

6. **Accessibility & Performance**
   - Run Lighthouse and fix major issues.
   - Ensure images are optimized and use modern formats.

7. **Monitoring & Error Tracking**
   - Add Sentry (or equivalent) for frontend errors.
   - Configure uptime monitoring and logging for backend/supabase.

8. **Database & Migrations**
   - Keep SQL schema and migration scripts in `db/migrations`.
   - Back up production database before running migrations.

9. **Deployment**
   - Test `npm run build` locally and in CI. Configure preview deploys.
