import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const API_TARGET = "https://rest-test.machineheads.ru";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  server: {
    port: 5176,
    proxy: {
      "^/(auth|profile|manage)": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false
      }
    }
  }
});
