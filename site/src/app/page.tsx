import { Pagina } from "@/components/Pagina";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Duvidas } from "@/components/sections/Duvidas";
import { Especialidades } from "@/components/sections/Especialidades";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Localizacao } from "@/components/sections/Localizacao";
import { Manifesto } from "@/components/sections/Manifesto";
import { Rodape } from "@/components/sections/Rodape";
import { Sobre } from "@/components/sections/Sobre";
import { Tratamentos } from "@/components/sections/Tratamentos";
import { WhatsAppFlutuante } from "@/components/ui/WhatsAppFlutuante";
import { clinica, textos } from "@/content/clinica";
import { jsonLd } from "@/lib/seo";
import { aparece, visiveis } from "@/lib/pendente";

export default function Home() {
  const servicos = visiveis(clinica.servicos);
  const perguntas = clinica.faq.filter((p) => aparece(p.resposta));
  const links = textos.nav.links.filter(
    (l) => (l.href !== "#tratamentos" || servicos.length) && (l.href !== "#duvidas" || perguntas.length),
  );

  return (
    <>
      <a className="nc-pular" href="#conteudo">
        {textos.nav.pular}
      </a>
      <Pagina servicos={servicos}>
        <Header links={links} />
        <main id="conteudo" tabIndex={-1}>
          <Hero servicos={servicos} linkSecundario={servicos.length ? "#tratamentos" : "#como-funciona"} />
          <Especialidades servicos={servicos} />
          <Manifesto />
          <Tratamentos servicos={servicos} />
          <ComoFunciona />
          <Sobre />
          <Localizacao />
          <Duvidas perguntas={perguntas} />
          <CtaFinal />
        </main>
        <Rodape links={links} />
        <WhatsAppFlutuante />
      </Pagina>
      {jsonLd().map((dados, k) => (
        <script key={k} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
