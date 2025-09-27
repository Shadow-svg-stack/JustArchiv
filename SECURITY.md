# SECURITY & SECRETS
- The repository contained a `.env` file with Supabase keys. **These keys are sensitive** and MUST be rotated immediately.
- Remove any secrets from the repo history (use `git filter-repo` or BFG) before publishing.
- Add secrets to environment variables in your deployment platform (Netlify, Vercel, Docker secrets, etc).
- Add `.env` to `.gitignore` (already present) and keep `.env.example` in repo with placeholder values.
