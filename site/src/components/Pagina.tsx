"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Servico } from "@/content/clinica";
import { useAnimacoesPagina } from "@/lib/animacoes";
import { AgendarProvider } from "./ui/ModalAgendar";

/** Raiz do lado do cliente: provê o modal de agendamento e roda as animações GSAP. */
export function Pagina({ servicos, children }: { servicos: Servico[]; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement | null>(null);
  useAnimacoesPagina(raiz);

  // links internos (#secao) rolam suave, exceto com reduced-motion.
  // (scroll-behavior: smooth no CSS atrapalha o ScrollTrigger.)
  useEffect(() => {
    const clique = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      const href = a?.getAttribute("href");
      if (!a || !href || href.length < 2) return;
      const alvo = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!alvo) return;
      e.preventDefault();
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      alvo.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", href);
      if (alvo.tabIndex < 0 && alvo.id === "conteudo") alvo.focus({ preventScroll: true });
    };
    document.addEventListener("click", clique);
    return () => document.removeEventListener("click", clique);
  }, []);

  return (
    <AgendarProvider servicos={servicos}>
      <div ref={raiz}>{children}</div>
    </AgendarProvider>
  );
}
