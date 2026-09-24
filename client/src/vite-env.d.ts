/// <reference types="vite/client" />

/**
 * Ambient module declarations for assets imported by Vite.
 * (vite/client covers these too; kept explicit for editors that
 * resolve before node_modules finishes indexing.)
 */
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

/**
 * Custom Vite environment variables.
 */
interface ImportMetaEnv {
  /** Base URL of the hosted referral API, e.g. https://api.example.com */
  readonly VITE_API_BASE?: string;
  /** Repo name used for the GitHub Pages base path (default: FightingChance) */
  readonly VITE_REPO_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
