import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env =
    mode === "development" ? loadEnv(mode, process.cwd(), "") : process.env;
  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    server: {
      port: 8080,
      host: "0.0.0.0",
    },
  };
});
