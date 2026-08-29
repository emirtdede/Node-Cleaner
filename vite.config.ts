import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Vite options tailored for Tauri development
  clearScreen: false,
  server: {
    port: 1425,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    target: "es2022",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("src/locales/langs")) {
            return "locales-bundle";
          }
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("zustand") || id.includes("clsx")) {
              return "vendor-core";
            }
            if (id.includes("@tanstack") || id.includes("lucide-react")) {
              return "vendor-ui";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
