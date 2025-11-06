import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ← フロントは 3000 でOK
    proxy: {
      // /api をバックエンドへプロキシ
      "/api": {
        target: "http://localhost:4000/", // ← バックエンドのポートに合わせて
        changeOrigin: true,
      },
    },
  },
});
