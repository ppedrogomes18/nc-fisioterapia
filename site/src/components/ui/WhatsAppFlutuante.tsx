"use client";

import { useEffect, useState } from "react";
import { textos } from "@/content/clinica";
import { linkWhatsApp } from "@/lib/whatsapp";
import { IconeWhatsApp } from "./Icones";

/** Aparece depois do hero e some quando o CTA final está na tela. */
export function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const cta = document.getElementById("agendar");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const estado = { hero: true, cta: false };
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === hero) estado.hero = e.isIntersecting;
        if (e.target === cta) estado.cta = e.isIntersecting;
      }
      setVisivel(!estado.hero && !estado.cta);
    });
    io.observe(hero);
    if (cta) io.observe(cta);
    return () => io.disconnect();
  }, []);

  return (
    <a
      className="nc-flutuante"
      href={linkWhatsApp(textos.flutuante.mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={textos.flutuante.rotulo}
      data-visivel={visivel ? "true" : "false"}
      tabIndex={visivel ? undefined : -1}
      aria-hidden={visivel ? undefined : true}
    >
      <IconeWhatsApp size={26} strokeWidth={1.5} />
    </a>
  );
}
