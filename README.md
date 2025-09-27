# JustArchiv — cleaned & production-ready starting point

This repository was cleaned automatically to remove sensitive values and consolidate configuration.
**Important:** Rotate any Supabase keys if they were used previously.

## Quick start (development)
1. Copy `.env.example` ➜ `.env` and fill values.
2. `npm install`
3. `npm run dev` (starts Vite)

## Build for production
- `npm run build`
- `npm run preview` to locally preview production build

## What I changed
- Removed `.env` and replaced with `.env.example`
- Merged `src/package.json` into root `package.json` and removed `src/package.json`
- Added `SECURITY.md` and `PRODUCTION_CHECKLIST.md`
- Backed up original repo to `/mnt/data/JustArchiv_backup`

See `SECURITY.md` and `PRODUCTION_CHECKLIST.md` for next steps.
