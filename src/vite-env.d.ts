/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_17VIN_USERNAME: string
  readonly VITE_17VIN_PASSWORD: string
  readonly VITE_17VIN_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string

