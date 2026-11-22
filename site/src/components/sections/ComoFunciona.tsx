"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { clinica, textos } from "@/content/clinica";
import type { Cena } from "../ui/FallbackCurvas";
import { Janela, MidiaJanela } from "../ui/Janela";
import { Kicker, linhas } from "../ui/Kicker";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CENAS: Cena[] = ["avaliacao", "plano", "sessoes", "alta"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** Em qual dos n passos está um progresso de 0 a 1. */
const passoEm = (p: number, n: number) => clamp(Math.floor(clamp(p, 0, 1) * n), 0, n - 1);
/** Quanto do passo i já foi percorrido (0 a 1). */
const localEm = (p: number, n: number, i: number) => clamp(p * n - i, 0, 1);

/**
 * Seção fixada (pin) no desktop: o scroll percorre os passos, a linha acima do
 * passo ativo enche, e clicar num passo pula até ele. < 1024px ou com
 * reduced-motion vira acordeão.
 */
export function ComoFunciona() {
  const t = textos.comoFunciona;
  const passos = t.passos;
  const n = passos.length;
  const [ativo, setAtivo] = useState(0);
  const [fixado, setFixado] = useState(false);
  const secao = useRef<HTMLElement | null>(null);
  const pin = useRef<HTMLDivElement | null>(null);
  const gatilho = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const s = secao.current;
      const p = pin.current;
      if (!s || !p) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        setFixado(true);
        const st = ScrollTrigger.create({
          trigger: s,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * n * 0.7),
          pin: p,
          anticipatePin: 1,
          onUpdate: (self) => {
            const k = passoEm(self.progress, n);
            setAtivo((a) => (a === k ? a : k));
            s.style.setProperty("--sp", String(localEm(self.progress, n, k)));
          },
        });
        gatilho.current = st;
        return () => {
          gatilho.current = null;
          setFixado(false);
          s.style.removeProperty("--sp");
        };
      });
    },
    { scope: secao },
  );

  const escolher = (k: number) => {
    const st = gatilho.current;
    if (st) {
      const y = st.start + (st.end - st.start) * ((k + 0.12) / n);
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    setAtivo(k);
  };

  const passo = passos[ativo];
  const fotos = clinica.fotos.passos;

  return (
    <section
      ref={secao}
      className={"nc-como nc-grao nc-escuro" + (fixado ? " is-fixado" : "")}
      id="como-funciona"
      aria-labelledby="nc-como-titulo"
    >
      <div ref={pin} className="nc-container nc-como-pin">
        <div>
          <div className="nc-sec-head is-esq">
            <Kicker>{t.kicker}</Kicker>
            <h2 className="nc-h2" id="nc-como-titulo" data-reveal="">
              {linhas(t.titulo).map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
            <p className="nc-texto" data-reveal="">
              {t.texto}
            </p>
          </div>
          <ol className="nc-passos" data-reveal="">
            {passos.map((ps, k) => (
              <li key={ps.titulo} className={k === ativo ? "is-on" : ""}>
                <span className="nc-passo-barra" aria-hidden="true">
                  <i />
                </span>
                <h3>
                  <button
                    type="button"
                    className="nc-passo-btn"
                    aria-expanded={k === ativo}
                    aria-controls={`nc-passo-${k}`}
                    onClick={() => escolher(k)}
                  >
                    <span className="nc-passo-num" aria-hidden="true">
                      {String(k + 1).padStart(2, "0")}
                    </span>
                    {ps.titulo}
                  </button>
                </h3>
                <div className="nc-passo-corpo" id={`nc-passo-${k}`} role="region" aria-label={ps.titulo}>
                  <div>
                    <p>{ps.texto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Janela
          className="nc-como-janela"
          midia={CENAS.map((c, k) => (
            <div key={c} className="nc-como-cena" data-on={k === ativo ? "true" : "false"} aria-hidden={k === ativo ? undefined : true}>
              <MidiaJanela cena={c} foto={fotos[k]} />
            </div>
          ))}
        >
          <div className="nc-como-card" aria-hidden="true">
            <small>
              <span>
                {t.passo} {String(ativo + 1).padStart(2, "0")}
              </span>
              <span>
                {ativo + 1}/{n}
              </span>
            </small>
            <b key={"t" + ativo}>{passo.titulo}</b>
            <p key={"d" + ativo}>{passo.detalhe}</p>
            <div className="nc-pontos">
              {passos.map((ps, k) => (
                <i key={ps.titulo} className={k <= ativo ? "is-on" : ""} />
              ))}
            </div>
          </div>
        </Janela>
      </div>
    </section>
  );
}
