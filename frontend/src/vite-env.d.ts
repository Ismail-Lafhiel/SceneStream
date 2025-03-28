/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AWS_REGION: string
    readonly VITE_USER_POOL_ID: string
    readonly VITE_USER_POOL_CLIENT_ID: string
    readonly VITE_BOOKMARKS_STORAGE_KEY: string
    readonly VITE_APP_BACKEND_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  