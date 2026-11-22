"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clinica, textos, type Servico } from "@/content/clinica";
import { linkWhatsApp, mensagemServico } from "@/lib/whatsapp";
import { classePendente } from "../ui/Campo";
import { IconeWhatsApp } from "../ui/Icones";

gsap.registerPlugin(useGSAP);

const DURACAO = 5;

function Palavras({ texto }: { texto: string }) {
  const ws = texto.split(/\s+/).filter(Boolean);
  return (
    <>
      {ws.map((w, k) => (
        <span key={k}>
          <span data-w="">{w}</span>
          {k < ws.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/**
 * Card de WhatsApp dentro da janela do hero. Cada chip (motivo de consulta)
 * troca a mensagem; troca sozinho a cada ~5s, pausa no hover, no foco e fora da tela.
 */
export function HeroWhatsApp({ servicos }: { servicos: Servico[] }) {
  const t = textos.hero.whats;
  const opcoes = servicos.slice(0, 4);
  const cenarios = opcoes.length
    ? opcoes.map((s) => ({ id: s.id, rotulo: s.titulo, texto: mensagemServico(s), status: s.status }))
    : [{ id: "geral", rotulo: t.geral, texto: mensagemServico(null), status: undefined }];
  const n = cenarios.length;

  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const card = useRef<HTMLDivElement | null>(null);
  const bolha = useRef<HTMLDivElement | null>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const atual = cenarios[i % n];

  useEffect(() => {
    const el = card.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const c = card.current;
      const b = bolha.current;
      if (!c || !b) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          b,
          { autoAlpha: 0, y: 14, scale: 0.96, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out", clearProps: "filter" },
        );
        gsap.fromTo(
          b.querySelectorAll("[data-w]"),
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.035, ease: "power2.out", delay: 0.2 },
        );
        if (n > 1) {
          const p = { v: 0 };
          c.style.setProperty("--cp", "0");
          timer.current = gsap.to(p, {
            v: 1,
            duration: DURACAO,
            ease: "none",
            onUpdate: () => c.style.setProperty("--cp", String(p.v)),
            onComplete: () => setI((k) => (k + 1) % n),
          });
        }
        return () => {
          timer.current = null;
        };
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        c.style.setProperty("--cp", "1");
      });
    },
    { dependencies: [i, n], scope: card, revertOnUpdate: true },
  );

  useEffect(() => {
    const x = timer.current;
    if (!x) return;
    if (pausa || !visivel) x.pause();
    else x.resume();
  }, [pausa, visivel, i]);

  return (
    <div
      className="nc-whats"
      ref={card}
      data-depth="0.7"
      onPointerEnter={() => setPausa(true)}
      onPointerLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausa(false);
      }}
    >
      <div className="nc-whats-topo">
        <span className="nc-avatar" aria-hidden="true">
          {clinica.marca.sigla}
        </span>
        <div>
          <b>{clinica.nome}</b>
          <span>
            <IconeWhatsApp size={13} strokeWidth={1.8} />
            {t.rotulo} · {clinica.contato.whatsappExibicao}
          </span>
        </div>
      </div>

      <div className="nc-whats-conversa">
        <div className="nc-bolha" ref={bolha} key={atual.id}>
          <p>
            <Palavras texto={atual.texto} />
          </p>
          <small aria-hidden="true">
            <CheckCheck size={14} strokeWidth={1.8} />
          </small>
        </div>
      </div>

      <div className="nc-whats-corpo">
        {n > 1 ? (
          <>
            <p id="nc-motivos">{t.escolha}</p>
            <div className="nc-chips" role="group" aria-labelledby="nc-motivos">
              {cenarios.map((c, k) => (
                <button
                  key={c.id}
                  type="button"
                  className={"nc-chip" + classePendente(c.status)}
                  aria-pressed={k === i}
                  onClick={() => setI(k)}
                >
                  {c.rotulo}
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        ) : null}
        <a
          className="nc-botao is-primario nc-whats-enviar"
          href={linkWhatsApp(atual.texto)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="nc-botao-ico" aria-hidden="true">
            <IconeWhatsApp size={18} />
          </span>
          {t.enviar}
        </a>
      </div>
    </div>
  );
}
