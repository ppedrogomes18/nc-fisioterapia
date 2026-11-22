import type { MetadataRoute } from "next";
import { clinica } from "@/content/clinica";
import { confirmado } from "@/lib/pendente";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const dominio = confirmado(clinica.site.dominio);
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(dominio ? { sitemap: `${dominio}/sitemap.xml`, host: dominio } : {}),
  };
}
