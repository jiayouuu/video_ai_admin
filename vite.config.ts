import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-oxc";
import { createHtmlPlugin } from "vite-plugin-html";
import { resolve, join } from "path";
import { name, title } from "./package.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    define: {
      "import.meta.env.VITE_ENABLE_UPDATE":
        process.argv.includes("--enable-update"),
    },
    base: env.VITE_PUBLIC_BASE,
    build: {
      outDir: name,
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        template: "public/index.html",
        entry: "/src/main.tsx",
        inject: {
          data: {
            title,
          },
          tags: [
            {
              tag: "div",
              attrs: { id: "root" },
              injectTo: "body-prepend",
            },
          ],
        },
      }),
    ],
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
        generateScopedName: "[local]-[hash:base64:10]",
      },
    },
    server: {
      port: 8888,
      open: true,
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  };
});
