import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for assets when deployed to GitHub Pages at
  // https://sevinda-herath.github.io/portfolio-new/
  base: "/portfolio-new/",
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
