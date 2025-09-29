import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // Determine base path based on environment
  const getBasePath = (): string => {
    if (env.VITE_APP_BASE_PATH) {
      return env.VITE_APP_BASE_PATH;
    }
    return mode === 'production' ? '/podcastshub/' : '/';
  };

  return {
    plugins: [react()],
    base: getBasePath(),
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
    // Ensure environment variables are properly typed
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
