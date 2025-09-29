import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/podcastshub/',
  resolve: {
    alias: {
      "@": "/src",
      "@/core": "/src/core",
      "@/infrastructure": "/src/infrastructure",
      "@/features": "/src/features",
      "@/shared": "/src/shared",
      "@/router": "/src/router",
    },
  },
  server: {
    host: true,
  },
});
