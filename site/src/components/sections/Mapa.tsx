"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { textos } from "@/content/clinica";
import { Botao } from "../ui/Botao";
import { MidiaJanela } from "../ui/Janela";

/** Iframe do Google Maps (sem chave de API) que só carrega perto da tela ou no clique. Altura reservada: sem CLS. */
export function Mapa({ src }: { src: string }) {
  const t = textos.localizacao;
  const caixa = useRef<HTMLDivElement | null>(null);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {
    const el = caixa.current;
    if (!el || carregar || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCarregar(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [carregar]);

  return (
    <div className="nc-mapa" ref={caixa} data-reveal="">
      {carregar ? (
        <iframe src={src} title={t.mapaTitulo} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="nc-mapa-capa">
          <MidiaJanela cena="verde" />
          <span className="nc-mapa-pino" aria-hidden="true">
            <MapPin size={24} strokeWidth={1.5} />
          </span>
          <Botao rotulo={t.verMapa} variante="claro" tamanho="sm" onClick={() => setCarregar(true)} />
        </div>
      )}
    </div>
  );
}
