/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_STRAPI_URL: string
    readonly VITE_STRAPI_JWT_KEY: string
    readonly VITE_STRAPI_API_TOKEN: string
    readonly NEXT_PUBLIC_SERVER_URL: string
    readonly DATABASE_URI: string
    readonly PAYLOAD_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}