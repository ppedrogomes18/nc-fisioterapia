"use client";

import { gsap } from "gsap";
import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

function semMovimento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Botão em pílula: texto que rola no hover e leve atração magnética do cursor. */
export function Botao({
  rotulo,
  href,
  onClick,
  variante = "primario",
  tamanho,
  icone,
  externo,
  type = "button",
  className,
  ariaLabel,
}: {
  rotulo: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variante?: Variante;
  tamanho?: "sm";
  icone?: ReactNode;
  externo?: boolean;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const cls =
    "nc-botao is-" + variante + (tamanho ? " is-" + tamanho : "") + (className ? " " + className : "");

  const mover = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || semMovimento()) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.18,
      y: (e.clientY - r.top - r.height / 2) * 0.28,
      duration: 0.4,
      ease: "power3.out",
    });
  };
  const sair = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.45)" });
  };

  const conteudo = (
    <>
      {icone ? (
        <span className="nc-botao-ico" aria-hidden="true">
          {icone}
        </span>
      ) : null}
      <span className="nc-rola" data-t={rotulo}>
        <span>{rotulo}</span>
      </span>
    </>
  );

  if (href)
    return (
      <a
        ref={(n) => {
          ref.current = n;
        }}
        className={cls}
        href={href}
        onClick={onClick}
        onPointerMove={mover}
        onPointerLeave={sair}
        aria-label={ariaLabel}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {conteudo}
      </a>
    );

  return (
    <button
      ref={(n) => {
        ref.current = n;
      }}
      className={cls}
      type={type}
      onClick={onClick}
      onPointerMove={mover}
      onPointerLeave={sair}
      aria-label={ariaLabel}
    >
      {conteudo}
    </button>
  );
}
