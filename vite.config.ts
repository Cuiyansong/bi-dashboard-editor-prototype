import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function normalizeBase(raw: string | undefined): "/" | (string & {}) {
  if (!raw || raw === "/") return "/";
  let b = raw.trim();
  if (!b.startsWith("/")) b = `/${b}`;
  if (!b.endsWith("/")) b = `${b}/`;
  return b;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const base = normalizeBase(process.env.VITE_BASE || env.VITE_BASE);
  return {
    plugins: [react()],
    /** 部署在子路径时：构建前 set VITE_BASE=/your-path/ */
    base: normalizeBase(env.VITE_BASE),
    /** 允许局域网通过本机 IP（如 172.31.x.x）访问 dev / preview */
    server: {
      host: true,
      port: 5173,
    },
    preview: {
      host: true,
      port: 4173,
    },
  };
});
