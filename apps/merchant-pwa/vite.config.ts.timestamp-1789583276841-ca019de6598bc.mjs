// vite.config.ts
import { defineConfig } from "file:///C:/Users/User/OneDrive/Desktop/forbit/projects/software/mansula-pay/node_modules/.pnpm/vite@5.4.21_@types+node@22.20.2_terser@5.51.2/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/User/OneDrive/Desktop/forbit/projects/software/mansula-pay/node_modules/.pnpm/@vitejs+plugin-react@4.7.0__9bb2120ef1dc6f04e46d803830a2b1f3/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/User/OneDrive/Desktop/forbit/projects/software/mansula-pay/node_modules/.pnpm/vite-plugin-pwa@0.20.5_vite_9749d075a613659a9e748a3682b99f1b/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\User\\OneDrive\\Desktop\\forbit\\projects\\software\\mansula-pay\\apps\\merchant-pwa";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "MS Pay",
        short_name: "MS Pay",
        description: "Your virtual currency wallet",
        theme_color: "#0F172A",
        background_color: "#0F172A",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        // Cache app shell and static assets only
        // CRITICAL: never cache or queue credit-producing API calls (PRD §6)
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
        // Explicitly DO NOT add any backgroundSync or offline fallback for API calls
        // Any attempt to queue /recharge, /pay, /approve offline is forbidden (PRD §6)
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@ms-pay/types": path.resolve(__vite_injected_original_dirname, "../../packages/types/src"),
      "@ms-pay/api-client": path.resolve(__vite_injected_original_dirname, "../../packages/api-client/src"),
      "@ms-pay/ui": path.resolve(__vite_injected_original_dirname, "../../packages/ui/src")
    }
  },
  server: {
    port: 5174
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcZm9yYml0XFxcXHByb2plY3RzXFxcXHNvZnR3YXJlXFxcXG1hbnN1bGEtcGF5XFxcXGFwcHNcXFxcbWVyY2hhbnQtcHdhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcZm9yYml0XFxcXHByb2plY3RzXFxcXHNvZnR3YXJlXFxcXG1hbnN1bGEtcGF5XFxcXGFwcHNcXFxcbWVyY2hhbnQtcHdhXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Vc2VyL09uZURyaXZlL0Rlc2t0b3AvZm9yYml0L3Byb2plY3RzL3NvZnR3YXJlL21hbnN1bGEtcGF5L2FwcHMvbWVyY2hhbnQtcHdhL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5pY28nLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdNUyBQYXknLFxuICAgICAgICBzaG9ydF9uYW1lOiAnTVMgUGF5JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdZb3VyIHZpcnR1YWwgY3VycmVuY3kgd2FsbGV0JyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMEYxNzJBJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMwRjE3MkEnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHsgc3JjOiAnL2ljb24tMTkyLnBuZycsIHNpemVzOiAnMTkyeDE5MicsIHR5cGU6ICdpbWFnZS9wbmcnIH0sXG4gICAgICAgICAgeyBzcmM6ICcvaWNvbi01MTIucG5nJywgc2l6ZXM6ICc1MTJ4NTEyJywgdHlwZTogJ2ltYWdlL3BuZycgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIC8vIENhY2hlIGFwcCBzaGVsbCBhbmQgc3RhdGljIGFzc2V0cyBvbmx5XG4gICAgICAgIC8vIENSSVRJQ0FMOiBuZXZlciBjYWNoZSBvciBxdWV1ZSBjcmVkaXQtcHJvZHVjaW5nIEFQSSBjYWxscyAoUFJEIFx1MDBBNzYpXG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmMn0nXSxcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7IGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1jYWNoZScsIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogMTAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgLy8gRXhwbGljaXRseSBETyBOT1QgYWRkIGFueSBiYWNrZ3JvdW5kU3luYyBvciBvZmZsaW5lIGZhbGxiYWNrIGZvciBBUEkgY2FsbHNcbiAgICAgICAgLy8gQW55IGF0dGVtcHQgdG8gcXVldWUgL3JlY2hhcmdlLCAvcGF5LCAvYXBwcm92ZSBvZmZsaW5lIGlzIGZvcmJpZGRlbiAoUFJEIFx1MDBBNzYpXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQG1zLXBheS90eXBlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy90eXBlcy9zcmMnKSxcbiAgICAgICdAbXMtcGF5L2FwaS1jbGllbnQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vcGFja2FnZXMvYXBpLWNsaWVudC9zcmMnKSxcbiAgICAgICdAbXMtcGF5L3VpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL3VpL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzQsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdWMsU0FBUyxvQkFBb0I7QUFDcGUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsc0JBQXNCO0FBQUEsTUFDckQsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0wsRUFBRSxLQUFLLGlCQUFpQixPQUFPLFdBQVcsTUFBTSxZQUFZO0FBQUEsVUFDNUQsRUFBRSxLQUFLLGlCQUFpQixPQUFPLFdBQVcsTUFBTSxZQUFZO0FBQUEsUUFDOUQ7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUE7QUFBQTtBQUFBLFFBR1AsY0FBYyxDQUFDLHNDQUFzQztBQUFBLFFBQ3JELGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVMsRUFBRSxXQUFXLHNCQUFzQixZQUFZLEVBQUUsWUFBWSxJQUFJLGVBQWUsS0FBSyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQUEsVUFDaEg7QUFBQSxRQUNGO0FBQUE7QUFBQTtBQUFBLE1BR0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsaUJBQWlCLEtBQUssUUFBUSxrQ0FBVywwQkFBMEI7QUFBQSxNQUNuRSxzQkFBc0IsS0FBSyxRQUFRLGtDQUFXLCtCQUErQjtBQUFBLE1BQzdFLGNBQWMsS0FBSyxRQUFRLGtDQUFXLHVCQUF1QjtBQUFBLElBQy9EO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
