import { clinica, textos } from "@/content/clinica";
import { confirmado, ehPendente } from "./pendente";

/**
 * JSON-LD (schema.org) da clínica. Segue o bloco combinado para o Google
 * (Physiotherapy): os dados saem de src/content/clinica.ts.
 * O FAQPage só entra com respostas confirmadas.
 */
export function jsonLd(): Record<string, unknown>[] {
  const dominio = clinica.site.dominio;
  const instagram = confirmado(clinica.redes.instagram);
  const perfil = clinica.mapa.perfilGoogle;
  const e = clinica.endereco;
  const r = clinica.responsavel;

  const negocio: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    "@id": `${dominio}/#clinica`,
    name: clinica.nome,
    alternateName: textos.seo.nomeAlternativo,
    description: textos.seo.descricaoSchema,
    url: `${dominio}/`,
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
    geo: { "@type": "GeoCoordinates", ...clinica.mapa.geo },
    hasMap: perfil,
    areaServed: { "@type": "City", name: e.cidade },
    openingHoursSpecification: clinica.horario.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.length === 1 ? h.dias[0] : h.dias,
      opens: h.abre,
      closes: h.fecha,
    })),
    availableService: clinica.servicos
      .filter((s) => !ehPendente(s.status))
      .map((s) => ({ "@type": "MedicalTherapy", name: s.titulo })),
    employee: {
      "@type": "Person",
      name: r.nome,
      jobTitle: r.profissao,
      identifier: { "@type": "PropertyValue", propertyID: "CREFITO", value: r.crefito },
    },
    sameAs: [perfil, ...(instagram ? [instagram] : [])],
  };

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
