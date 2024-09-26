import path from "path";
import dotenvExpand from "dotenv-expand";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import qiankun from "vite-plugin-qiankun";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevMode = mode === "development";
  // This check is important!
  if (isDevMode) {
    const env = loadEnv(mode, process.cwd(), "");
    dotenvExpand.expand({ parsed: env });
  }

  return {
    base: isDevMode ? "/" : process.env.BASE_URL,
    plugins: [
      // isDevMode ? [] : react(),
      react(),
      qiankun("micro-ipaas", {
        useDevMode: isDevMode, // 根据当前命令动态设置 useDevMode
      }),
    ],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    define: {
      "process.env": process.env,
    },
    server: {
      port: 8000,
      host: "0.0.0.0",
      origin: "http://localhost:8000",
    },
  };
});
