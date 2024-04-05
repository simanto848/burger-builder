import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://burger-builder-0cyt.onrender.com",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
