import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// // 自动按需引入组件（暂时不用，想使用需要安装一下unplugin-vue-components）
// import Components from "unplugin-vue-components/vite";
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // // 自动按需引入组件（暂时不用，想使用需要安装一下unplugin-vue-components）
    // Components({
    //   resolvers: [
    //     AntDesignVueResolver({
    //       importStyle: false, // css in js
    //     }),
    //   ],
    // }),
  ],
  resolve: {
    // 配置别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
