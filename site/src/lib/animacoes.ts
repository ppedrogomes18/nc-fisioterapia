"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function topoAbsoluto(el: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
}

/**
 * Animações da página inteira. Tudo vive num gsap.context (useGSAP) e é
 * revertido no unmount. Com prefers-reduced-motion: nada escondido, nada com
 * scrub (o matchMedia simplesmente não cria as animações).
 */
export function useAnimacoesPagina(escopo: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const r = escopo.current;
      if (!r) return;
      const html = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(r);

        // intro: as linhas do título sobem das máscaras, a janela se ergue
        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => html.classList.remove("nc-intro"),
        });
        intro
          .fromTo(q(".nc-header"), { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, clearProps: "all" })
          .fromTo(q("[data-line]"), { yPercent: 115, rotate: 2.5 }, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.1 }, 0.1)
          .fromTo(q("[data-intro]"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.08 }, 0.3)
          .fromTo(
            q("[data-hero-palco]"),
            { y: 110, autoAlpha: 0, scale: 0.94 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 1.6, clearProps: "transform" },
            0.35,
          );

        // a janela do hero abre até sangrar a tela; a foto assenta do zoom 1.16 → 1
        const hv = r.querySelector<HTMLElement>(".nc-hero-janela");
        if (hv) {
          const st = {
            start: 0,
            end: () => Math.max(220, topoAbsoluto(hv) - window.innerHeight * 0.08),
            scrub: 0.6,
          };
          gsap.to(hv, { "--in": "0px", "--r": "0px", ease: "none", scrollTrigger: st });
          gsap.fromTo(hv.querySelector("[data-janela-midia]"), { scale: 1.16 }, { scale: 1, ease: "none", scrollTrigger: st });
          gsap.to(hv.querySelector("[data-hero-cena]"), {
            y: -50,
            ease: "none",
            scrollTrigger: { trigger: hv, start: "top 40%", end: "bottom top", scrub: true },
          });

          // profundidade sob o ponteiro: paisagem e cards em camadas diferentes
          const deriva = hv.querySelector("[data-janela-deriva]");
          const xTo = gsap.quickTo(deriva, "x", { duration: 1.2, ease: "power3.out" });
          const yTo = gsap.quickTo(deriva, "y", { duration: 1.2, ease: "power3.out" });
          const cards = Array.from(hv.querySelectorAll<HTMLElement>("[data-depth]"));
          const mover = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const b = hv.getBoundingClientRect();
            const nx = (e.clientX - b.left) / b.width - 0.5;
            const ny = (e.clientY - b.top) / b.height - 0.5;
            xTo(nx * -26);
            yTo(ny * -16);
            cards.forEach((el) => {
              const d = Number(el.dataset.depth || 1);
              gsap.to(el, { x: nx * d * 14, y: ny * d * 12, duration: 1, ease: "power3.out", overwrite: "auto" });
            });
          };
          hv.addEventListener("pointermove", mover);
          return () => hv.removeEventListener("pointermove", mover);
        }
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // as demais janelas abrem de um quadro menor e a foto desliza ao passar
        Array.from(r.querySelectorAll<HTMLElement>("[data-janela]"))
          .filter((v) => !v.classList.contains("nc-hero-janela"))
          .forEach((v) => {
            // dentro da seção fixada, o gatilho é a própria seção (fora do pin)
            const secaoFixada = v.closest<HTMLElement>(".nc-como-pin")?.closest("section") ?? null;
            const gatilho = secaoFixada || v;
            const grande = v.classList.contains("nc-cta-janela");
            gsap.fromTo(
              v,
              { clipPath: grande ? "inset(12% 9% 12% 9% round 44px)" : "inset(7% 5% 7% 5% round 30px)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                ease: "none",
                scrollTrigger: {
                  trigger: gatilho,
                  start: secaoFixada ? "top 85%" : "top 96%",
                  end: secaoFixada ? "top top" : grande ? "top 25%" : "top 45%",
                  scrub: 0.5,
                },
              },
            );
            gsap.fromTo(
              v.querySelector("[data-janela-midia]"),
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: { trigger: gatilho, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });

        // frase-manifesto: acende palavra por palavra
        r.querySelectorAll<HTMLElement>("[data-scrub]").forEach((h) => {
          gsap.fromTo(
            h.querySelectorAll("[data-word]"),
            { opacity: 0.14 },
            { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: h, start: "top 85%", end: "top 35%", scrub: true } },
          );
        });

        // o resto sobe uma vez ao entrar
        const itens = Array.from(r.querySelectorAll<HTMLElement>("[data-reveal]"));
        gsap.set(itens, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(itens, {
          start: "top 92%",
          once: true,
          onEnter: (lote) =>
            gsap.to(lote, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });

        // "NC" gigante do rodapé sobe com o scroll
        const fw = r.querySelector<HTMLElement>("[data-foot-word]");
        if (fw?.parentElement)
          gsap.fromTo(
            fw,
            { yPercent: 70 },
            { yPercent: 0, ease: "none", scrollTrigger: { trigger: fw.parentElement, start: "top bottom", end: "bottom bottom", scrub: true } },
          );
      });

      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      const aoCarregar = () => ScrollTrigger.refresh();
      window.addEventListener("load", aoCarregar);
      document.fonts?.ready.then(aoCarregar);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("load", aoCarregar);
        mm.revert();
        html.classList.remove("nc-intro");
      };
    },
    { scope: escopo },
  );
}
