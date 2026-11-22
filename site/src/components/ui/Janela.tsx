"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { Foto } from "@/content/clinica";
import { FallbackCurvas, type Cena } from "./FallbackCurvas";

/** Foto (se houver) sobre o desenho de fallback. Sem estado React: a imagem se revela pelo DOM. */
export function MidiaJanela({ foto, cena, prioridade }: { foto?: Foto | null; cena: Cena; prioridade?: boolean }) {
  const id = "nc" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <>
      <FallbackCurvas cena={cena} id={id} />
      {foto && foto.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- export estático, imagens já otimizadas (WebP)
        <img
          ref={(el) => {
            if (el && el.complete && el.naturalWidth) el.dataset.ok = "true";
          }}
          className="nc-foto"
          src={foto.src}
          alt={foto.alt}
          width={foto.largura}
          height={foto.altura}
          decoding="async"
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : "auto"}
          onLoad={(e) => {
            e.currentTarget.dataset.ok = "true";
          }}
          onError={(e) => {
            e.currentTarget.hidden = true;
          }}
        />
      ) : null}
    </>
  );
}

/**
 * A "janela": um quadro que abre com o scroll (clip-path) e cuja foto
 * desliza em parallax. As animações ficam em lib/animacoes.ts.
 */
export function Janela({
  foto,
  cena = "manha",
  className,
  style,
  children,
  prioridade,
  midia,
  sombra = true,
}: {
  foto?: Foto | null;
  cena?: Cena;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  prioridade?: boolean;
  /** Substitui a mídia padrão (ex.: várias cenas que se alternam). */
  midia?: ReactNode;
  sombra?: boolean;
}) {
  return (
    <div className={"nc-janela" + (className ? " " + className : "")} style={style} data-janela="">
      <div className="nc-janela-midia" data-janela-midia="">
        <div className="nc-janela-deriva" data-janela-deriva="">
          {midia ?? <MidiaJanela foto={foto} cena={cena} prioridade={prioridade} />}
        </div>
      </div>
      {sombra ? <div className="nc-janela-sombra" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
