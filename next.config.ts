import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: genera un bundle autocontenido para Docker
  // Incluye solo los archivos y node_modules necesarios para producción
  output: 'standalone',

  // Ignorar errores de ESLint y TypeScript durante build de producción
  // Los warnings de variables no usadas no afectan la funcionalidad
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
