import { Clock, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { clinica, textos, type Servico } from "@/content/clinica";
import { aparece } from "@/lib/pendente";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Botao } from "../ui/Botao";
import { Campo } from "../ui/Campo";
import { IconeWhatsApp } from "../ui/Icones";
import { Janela } from "../ui/Janela";
import { linhas } from "../ui/Kicker";
import { HeroWhatsApp } from "./HeroWhatsApp";

export function Hero({ servicos, linkSecundario }: { servicos: Servico[]; linkSecundario: string }) {
  const t = textos.hero;
  const titulo = linhas(t.titulo);
  return (
    <section className="nc-hero" id="inicio" aria-labelledby="nc-h1">
      <div className="nc-hero-copy">
        <p className="nc-kicker" data-intro="" style={{ "--i": 0 } as CSSProperties}>
          {t.kicker}
        </p>
        <h1 className="nc-titulo" id="nc-h1" aria-label={titulo.join(" ")}>
          {titulo.map((l, k) => (
            <span key={k} className="nc-linha" aria-hidden="true">
              <span className="nc-linha-in" data-line="" style={{ "--i": k } as CSSProperties}>
                {k === titulo.length - 1 && titulo.length > 1 ? <em>{l}</em> : l}
              </span>
            </span>
          ))}
        </h1>
        <p className="nc-sub" data-intro="" style={{ "--i": 1 } as CSSProperties}>
          {t.subtitulo}
        </p>
        <div className="nc-hero-acoes" data-intro="" style={{ "--i": 2 } as CSSProperties}>
          <Botao
            rotulo={t.primario}
            href={linkWhatsApp(textos.hero.whats.mensagemGeral)}
            externo
            icone={<IconeWhatsApp size={18} />}
          />
          <Botao rotulo={t.secundario} href={linkSecundario} variante="secundario" />
        </div>
      </div>

      <div className="nc-hero-palco" data-hero-palco="">
        <Janela className="nc-hero-janela" foto={clinica.fotos.hero} cena="manha" prioridade>
          <div className="nc-hero-cena" data-hero-cena="">
            <p className="nc-mini is-endereco" data-depth="1.6">
              <span aria-hidden="true">
                <MapPin size={18} strokeWidth={1.5} />
              </span>
              <span>
                <small>{t.endereco}</small>
                <b>{clinica.endereco.curto}</b>
              </span>
            </p>
            <HeroWhatsApp servicos={servicos} />
            {aparece(clinica.horario.resumo) ? (
              <p className="nc-mini is-horario" data-depth="1.1">
                <span aria-hidden="true">
                  <Clock size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <small>{t.horario}</small>
                  <b>
                    <Campo valor={clinica.horario.resumo} />
                  </b>
                </span>
              </p>
            ) : null}
          </div>
        </Janela>
      </div>
    </section>
  );
}
