import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Strict CSP injected at build time only (the dev server needs inline
// scripts for HMR). connect-src 'self' is the technical enforcement of the
// "no upload" promise: the browser itself blocks any cross-origin request.
// img-src data: covers the logo the user loads via FileReader (dataURL) and
// the QR previews rendered to <canvas>/<img>. style-src-attr covers the
// inline style attributes qr-code-styling sets on its rendered container.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "connect-src 'self'",
  "font-src 'self'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
].join("; ");

function injectCsp(): Plugin {
  return {
    name: "inject-csp",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        "<meta charset=\"UTF-8\" />",
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      );
    },
  };
}

// Deployed under /outils/qr/ on the CDS site; base must stay relative so the
// same build also works on GitHub Pages or a local preview.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    injectCsp(),
    VitePWA({
      registerType: "autoUpdate",
      // External registerSW.js file, not an inline script: keeps the strict
      // CSP (script-src 'self') intact.
      injectRegister: "script-defer",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
      manifest: {
        name: "QR Studio local",
        short_name: "QR Studio",
        description:
          "Generate static QR codes entirely in your browser. URL, Wi-Fi, vCard, SEPA and more. No upload.",
        theme_color: "#ff6b00",
        background_color: "#0b0b0d",
        display: "standalone",
        icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
    }),
  ],
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
