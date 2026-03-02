import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: genera un bundle autocontenido para Docker
  // Incluye solo los archivos y node_modules necesarios para producción
  output: 'standalone',
};

export default nextConfig;
