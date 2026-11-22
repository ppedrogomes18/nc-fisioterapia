"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { clinica, textos } from "@/content/clinica";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Botao } from "../ui/Botao";
import { useAgendar } from "../ui/ModalAgendar";
import { Wordmark } from "../ui/Wordmark";

type Link = { rotulo: string; href: string };

function irPara(href: string) {
  const el = document.querySelector(href);
  if (!el) return;
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", href);
}

export function Header({ links }: { links: Link[] }) {
  const { abrir } = useAgendar();
  const [rolado, setRolado] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [menu, setMenu] = useState(false);
  const caixaLinks = useRef<HTMLElement | null>(null);
  const folha = useRef<HTMLDivElement | null>(null);
  const botaoMenu = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let ultimo = window.scrollY;
    const aoRolar = () => {
      const y = window.scrollY;
      setRolado(y > 8);
      if (y > 640 && y - ultimo > 6) setOculto(true);
      else if (ultimo - y > 6 || y < 640) setOculto(false);
      ultimo = y;
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // folha do menu: trava o scroll, Esc fecha, foco volta ao botão
  useEffect(() => {
    if (!menu) return;
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    const botao = botaoMenu.current;
    const esc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", esc);
    return () => {
      html.style.overflow = antes;
      window.removeEventListener("keydown", esc);
      botao?.focus();
    };
  }, [menu]);

  const realce = (e: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    const caixa = caixaLinks.current;
    const el = e.currentTarget;
    if (!caixa) return;
    caixa.style.setProperty("--lx", el.offsetLeft + "px");
    caixa.style.setProperty("--lw", el.offsetWidth + "px");
    caixa.style.setProperty("--lo", "1");
  };
  const semRealce = () => caixaLinks.current?.style.setProperty("--lo", "0");

  const navegar = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    window.setTimeout(() => irPara(href), 0);
  };

  const prenderFoco = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !folha.current) return;
    const els = Array.from(folha.current.querySelectorAll<HTMLElement>("a[href],button"));
    const a = els[0];
    const z = els[els.length - 1];
    if (e.shiftKey && document.activeElement === a) {
      e.preventDefault();
      z.focus();
    } else if (!e.shiftKey && document.activeElement === z) {
      e.preventDefault();
      a.focus();
    }
  };

  return (
    <header className={"nc-header" + (rolado ? " is-rolado" : "") + (oculto && !menu ? " is-oculto" : "")}>
      <a href="#inicio" aria-label={textos.nav.inicio} onClick={navegar("#inicio")}>
        <Wordmark />
      </a>

      <nav className="nc-header-links" ref={caixaLinks} aria-label={textos.nav.principal} onPointerLeave={semRealce}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onPointerEnter={realce} onFocus={realce} onBlur={semRealce} onClick={navegar(l.href)}>
            {l.rotulo}
          </a>
        ))}
      </nav>

      <div className="nc-header-fim">
        <Botao rotulo={textos.nav.acao} tamanho="sm" onClick={() => abrir()} />
        <button
          ref={botaoMenu}
          className="nc-burger is-abrir"
          type="button"
          aria-label={textos.nav.abrirMenu}
          aria-expanded={menu}
          aria-controls="nc-folha"
          onClick={() => setMenu(true)}
        >
          <Menu size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>

      {menu ? (
        <div
          id="nc-folha"
          ref={folha}
          className="nc-folha nc-grao nc-escuro"
          role="dialog"
          aria-modal="true"
          aria-label={textos.nav.menu}
          onKeyDown={prenderFoco}
        >
          <div className="nc-folha-topo">
            <Wordmark />
            <button className="nc-burger" type="button" aria-label={textos.nav.fecharMenu} onClick={() => setMenu(false)} autoFocus>
              <X size={18} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
          <nav className="nc-folha-links" aria-label={textos.nav.principal}>
            {links.map((l, k) => (
              <a key={l.href} href={l.href} onClick={navegar(l.href)} style={{ animationDelay: 60 + k * 50 + "ms" }}>
                <small>{String(k + 1).padStart(2, "0")}</small>
                {l.rotulo}
              </a>
            ))}
          </nav>
          <div className="nc-folha-fim">
            <Botao
              rotulo={textos.nav.acao}
              variante="claro"
              onClick={() => {
                setMenu(false);
                abrir();
              }}
            />
            <p>
              <a className="nc-link" href={linkWhatsApp(textos.flutuante.mensagem)} target="_blank" rel="noopener noreferrer">
                {textos.hero.whats.rotulo} {clinica.contato.whatsappExibicao}
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
