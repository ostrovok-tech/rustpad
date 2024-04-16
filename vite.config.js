import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
  },
  plugins: [wasm(), topLevelAwait(), react()],
  optimizeDeps: {
    // required for pn dev
    exclude: ["rustpad-wasm"],
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:3030",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
