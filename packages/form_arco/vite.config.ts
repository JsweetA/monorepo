import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import { vitePluginForArco } from "@arco-plugins/vite-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { visualizer } from "rollup-plugin-visualizer";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), //名字替代
      // remove i18n waring
    },
  },
  plugins: [
    visualizer(),
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    vitePluginForArco({
      style: "css",
    }),
  ],
  build: {
    // minify: "terser",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "./src/index.ts"),
      name: "form_arco",
      // the proper extensions will be added
      fileName: "form_arco",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: [
        {
          file: "./dist/form_arco.cjs",
          format: "cjs",
        },
        {
          file: "./dist/form_arco.umd.js",
          name: "form_arco",
          format: "umd",
        },
        {
          file: "./dist/form_arco.es.js",
          format: "es",
        },
      ],
      plugins: [commonjs(), terser()],
    },
  },
  css: {
    // 如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  },
  server: {
    open: "./examples/index.html",
  },
});
