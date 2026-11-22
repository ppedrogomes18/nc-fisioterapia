"use client";

import { useState } from "react";
import { textos, type Pergunta } from "@/content/clinica";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Campo } from "../ui/Campo";
import { Kicker } from "../ui/Kicker";

/** Acordeão acessível: botão com aria-expanded controlando a resposta. */
export function Duvidas({ perguntas }: { perguntas: Pergunta[] }) {
  const t = textos.duvidas;
  const [aberta, setAberta] = useState<number | null>(null);
  if (!perguntas.length) return null;
  return (
    <section className="nc-sec" id="duvidas" aria-labelledby="nc-duv-titulo">
      <div className="nc-container nc-duv-grade">
        <div className="nc-duv-head nc-sec-head is-esq">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="nc-h2" id="nc-duv-titulo" data-reveal="">
            {t.titulo}
          </h2>
          <p className="nc-texto" data-reveal="">
            {t.outraDuvida}{" "}
            <a className="nc-link" href={linkWhatsApp(t.mensagem)} target="_blank" rel="noopener noreferrer">
              {t.chamar}
            </a>
          </p>
        </div>

        <div className="nc-duv-lista" data-reveal="">
          {perguntas.map((p, k) => {
            const on = aberta === k;
            return (
              <div key={p.pergunta} className={"nc-duv-item" + (on ? " is-aberto" : "")}>
                <h3>
                  <button
                    type="button"
                    className="nc-duv-btn"
                    id={`nc-duv-q${k}`}
                    aria-expanded={on}
                    aria-controls={`nc-duv-r${k}`}
                    onClick={() => setAberta(on ? null : k)}
                  >
                    {p.pergunta}
                    <span className="nc-duv-mais" aria-hidden="true" />
                  </button>
                </h3>
                <div className="nc-duv-resp" id={`nc-duv-r${k}`} role="region" aria-labelledby={`nc-duv-q${k}`} inert={!on}>
                  <div>
                    <p>
                      <Campo valor={p.resposta} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
