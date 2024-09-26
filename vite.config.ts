import path from "path";
import dotenvExpand from "dotenv-expand";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // This check is important!
  if (mode === "development") {
    const env = loadEnv(mode, process.cwd(), "");
    console.log(env);
    dotenvExpand.expand({ parsed: env });
  }

  return {
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    define: {
      "process.env": process.env,
    },
  };
});
