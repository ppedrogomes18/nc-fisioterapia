import type { MetadataRoute } from "next";
import { clinica } from "@/content/clinica";
import { confirmado } from "@/lib/pendente";

export const dynamic = "force-static";

// Sitemap exige URL absoluta: enquanto o domínio estiver "[A CONFIRMAR]",
// sai vazio (válido) e o check-conteudo avisa.
export default function sitemap(): MetadataRoute.Sitemap {
  const dominio = confirmado(clinica.site.dominio);
  if (!dominio) return [];
  return [
    {
      url: `${dominio}/`,
      lastModified: clinica.site.atualizadoEm,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
