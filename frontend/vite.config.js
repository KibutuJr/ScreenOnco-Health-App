// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ScreenOnco/", // 👈 GitHub Pages repo name path
  plugins: [react()],
  server: {
    proxy: {
      // Proxy any /api/insights call to the static JSON in public/
      "/api/insights": {
        target: "http://localhost:5174", // your vite dev server origin
        changeOrigin: true, // pretend to be same origin
        rewrite: (path) =>
          path.replace(/^\/api\/insights/, "/mock-insights.json"),
      },
    },
  },
});
