/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // ajoute ici d'autres variables VITE_ que tu pourrais utiliser
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
