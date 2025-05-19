import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// // 自动按需引入组件（暂时不用，想使用需要安装一下unplugin-vue-components）
// import Components from "unplugin-vue-components/vite";
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  // 添加proxy代理转发
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
          proxy.on("proxyReq", (proxyReq, req, res) => {
            // 为响应添加自定义header
            res.setHeader("x-proxy-url", options.target + req.url); // 使用标准的x-前缀来避免自定义header的命名冲突
          });
        },
        rewrite: (path) => path.replace(/^\/api/, "api"),
      },
    }
  },
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
