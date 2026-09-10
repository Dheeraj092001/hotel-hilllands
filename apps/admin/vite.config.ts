import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, "../../"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hotel/types": path.resolve(__dirname, "../../packages/types/src"),
      "@hotel/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@hotel/validation": path.resolve(__dirname, "../../packages/validation/src"),
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
});
