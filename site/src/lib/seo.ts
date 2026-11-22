import { clinica } from "@/content/clinica";
import { confirmado, ehPendente } from "./pendente";

/**
 * JSON-LD (schema.org). Só entra o que está confirmado:
 * url/image dependem do domínio; horário e redes só quando preenchidos;
 * FAQPage só com respostas confirmadas.
 */
export function jsonLd(): Record<string, unknown>[] {
  const dominio = confirmado(clinica.site.dominio);
  const instagram = confirmado(clinica.redes.instagram);
  const e = clinica.endereco;

  const negocio: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: clinica.nome,
    telephone: clinica.contato.telefoneSchema,
    email: clinica.contato.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.logradouro,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: e.pais,
    },
    areaServed: { "@type": "City", name: `${e.cidade} – ${e.uf}` },
  };
  if (dominio) {
    negocio.url = dominio + "/";
    negocio.image = dominio + "/logo-nc.jpg";
    negocio["@id"] = dominio + "/#clinica";
  }
  if (clinica.horario.schema.length) {
    negocio.openingHoursSpecification = clinica.horario.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    }));
  }
  if (instagram) negocio.sameAs = [instagram];

  const blocos: Record<string, unknown>[] = [negocio];

  const respondidas = clinica.faq.filter((p) => !ehPendente(p.resposta));
  if (respondidas.length) {
    blocos.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: respondidas.map((p) => ({
        "@type": "Question",
        name: p.pergunta,
        acceptedAnswer: { "@type": "Answer", text: p.resposta },
      })),
    });
  }
  return blocos;
}
