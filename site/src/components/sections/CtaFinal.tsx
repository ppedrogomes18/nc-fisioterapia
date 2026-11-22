import { Check } from "lucide-react";
import { clinica, textos } from "@/content/clinica";
import { linkMailto, linkWhatsApp } from "@/lib/whatsapp";
import { Botao } from "../ui/Botao";
import { IconeWhatsApp } from "../ui/Icones";
import { Janela } from "../ui/Janela";
import { Kicker, linhas } from "../ui/Kicker";

/** Janela noturna que abre de um quadro menor (animação em lib/animacoes.ts). */
export function CtaFinal() {
  const t = textos.cta;
  return (
    <section className="nc-cta" id="agendar" aria-labelledby="nc-cta-titulo">
      <Janela className="nc-cta-janela nc-escuro" foto={clinica.fotos.cta} cena="noite" sombra={false}>
        <div className="nc-cta-in">
          <Kicker claro>{t.kicker}</Kicker>
          <h2 className="nc-h2" id="nc-cta-titulo" data-reveal="">
            {linhas(t.titulo).map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="nc-texto" data-reveal="">
            {t.texto}
          </p>
          <div className="nc-cta-acoes" data-reveal="">
            <Botao
              rotulo={t.whatsapp}
              href={linkWhatsApp(textos.hero.whats.mensagemGeral)}
              externo
              variante="claro"
              icone={<IconeWhatsApp size={18} />}
            />
            <p className="nc-cta-email">
              {t.email}{" "}
              <a className="nc-link" href={linkMailto()}>
                {clinica.contato.email}
              </a>
            </p>
          </div>
          <ul className="nc-garantias">
            {t.garantias.map((g) => (
              <li key={g}>
                <Check size={13} strokeWidth={1.8} aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </Janela>
    </section>
  );
}
