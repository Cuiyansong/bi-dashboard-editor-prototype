/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "1" after running `npm run download:figma-assets` to load icons from /public/figma */
  readonly VITE_FIGMA_ASSETS_LOCAL?: string;
}
