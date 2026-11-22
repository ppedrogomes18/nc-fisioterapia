import { clinica, textos } from "@/content/clinica";
import { aparece } from "@/lib/pendente";
import { Campo } from "../ui/Campo";
import { Janela } from "../ui/Janela";
import { Kicker } from "../ui/Kicker";

/** Quem atende: nome, "Fisioterapeuta — CREFITO nº" (obrigatório pelo COFFITO 424/2013) e texto. */
export function Sobre() {
  const t = textos.sobre;
  const r = clinica.responsavel;
  const numeros = clinica.sobre.numeros;
  return (
    <section className="nc-sec" id="sobre" aria-labelledby="nc-sobre-titulo">
      <div className="nc-container nc-sobre-grade">
        <div className="nc-sobre-janela-wrap">
          <Janela className="nc-sobre-janela" foto={clinica.fotos.sobre} cena="tarde" />
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
          <img
            className="nc-sobre-logo"
            src="/logo-nc-400.webp"
            alt={t.logoAlt}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            data-reveal=""
          />
        </div>

        <div>
          <Kicker>{t.kicker}</Kicker>
          <h2 className="nc-h2 nc-sobre-nome" id="nc-sobre-titulo" data-reveal="">
            <span className="nc-sr">{t.titulo}: </span>
            <Campo valor={r.nome} />
          </h2>
          <p className="nc-sobre-cargo" data-reveal="">
            <span>{r.profissao}</span>
            <i aria-hidden="true" />
            <span>
              {t.crefito} <Campo valor={r.crefito} />
            </span>
          </p>
          {aparece(clinica.sobre.texto) ? (
            <p className="nc-texto nc-sobre-texto" data-reveal="">
              <Campo valor={clinica.sobre.texto} />
            </p>
          ) : null}
          {numeros.length ? (
            <div className="nc-numeros" data-reveal="">
              {numeros.map((x) => (
                <div key={x.rotulo}>
                  <b>{x.valor}</b>
                  <span>{x.rotulo}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
