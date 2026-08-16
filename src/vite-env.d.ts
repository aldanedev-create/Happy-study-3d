/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: (pattern: string, options?: { eager?: boolean; import?: string }) => Record<string, any>;
}