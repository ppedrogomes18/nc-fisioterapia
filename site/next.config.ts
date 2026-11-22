import type { NextConfig } from "next";

// `PERMITIR_PENDENTES=1 npm run build` gera uma prévia: o build passa mesmo com
// campos obrigatórios em aberto e os campos "[A CONFIRMAR]" aparecem destacados.
const previa = process.env.PERMITIR_PENDENTES === "1";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_PREVIA: previa ? "1" : "0",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
