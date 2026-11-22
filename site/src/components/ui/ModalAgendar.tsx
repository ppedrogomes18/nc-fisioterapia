"use client";

import { Check, Lock, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { textos, type Servico } from "@/content/clinica";
import { linkWhatsApp, mensagemAgendamento } from "@/lib/whatsapp";
import { Botao } from "./Botao";
import { IconeWhatsApp } from "./Icones";

type Ctx = { abrir: (servicoId?: string) => void };

const AgendarCtx = createContext<Ctx>({ abrir: () => {} });

export function useAgendar() {
  return useContext(AgendarCtx);
}

const NAO_SEI = "__nao-sei__";

export function AgendarProvider({ servicos, children }: { servicos: Servico[]; children: ReactNode }) {
  const [aberto, setAberto] = useState<{ servico: string } | null>(null);
  const abrir = useCallback((servicoId?: string) => setAberto({ servico: servicoId || NAO_SEI }), []);
  const fechar = useCallback(() => setAberto(null), []);
  const valor = useMemo(() => ({ abrir }), [abrir]);
  return (
    <AgendarCtx.Provider value={valor}>
      {children}
      {aberto ? <ModalAgendar servicos={servicos} inicial={aberto.servico} onFechar={fechar} /> : null}
    </AgendarCtx.Provider>
  );
}

function ModalAgendar({ servicos, inicial, onFechar }: { servicos: Servico[]; inicial: string; onFechar: () => void }) {
  const t = textos.modal;
  const [nome, setNome] = useState("");
  const [servico, setServico] = useState(servicos.some((s) => s.id === inicial) ? inicial : NAO_SEI);
  const [periodo, setPeriodo] = useState(t.periodos[0]);
  const [observacao, setObservacao] = useState("");
  const [tentou, setTentou] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const caixa = useRef<HTMLDivElement | null>(null);
  const campoNome = useRef<HTMLInputElement | null>(null);
  const tituloFeito = useRef<HTMLHeadingElement | null>(null);

  // foco inicial, trava o scroll da página e devolve o foco ao fechar
  useEffect(() => {
    const quemAbriu = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    campoNome.current?.focus();
    return () => {
      html.style.overflow = antes;
      quemAbriu?.focus?.();
    };
  }, []);

  // Esc fecha mesmo se o foco tiver saído da caixa (ex.: o botão de envio sumiu)
  useEffect(() => {
    const esc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onFechar]);

  // no estado "pronto", o foco vai para o título (anunciado pelo leitor de tela)
  useEffect(() => {
    if (link) tituloFeito.current?.focus();
  }, [link]);

  const teclado = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !caixa.current) return;
    const focaveis = Array.from(
      caixa.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,select,textarea"),
    ).filter((el) => !(el instanceof HTMLInputElement && el.type === "radio" && !el.checked));
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  };

  const nomeVazio = !nome.trim();

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setTentou(true);
    if (nomeVazio) {
      campoNome.current?.focus();
      return;
    }
    const s = servicos.find((x) => x.id === servico) || null;
    const url = linkWhatsApp(mensagemAgendamento({ nome, servico: s, periodo, observacao }));
    window.open(url, "_blank", "noopener,noreferrer");
    setLink(url);
  };

  return (
    <div className="nc-modal" onMouseDown={(e) => e.target === e.currentTarget && onFechar()} onKeyDown={teclado}>
      <div className="nc-modal-caixa" ref={caixa} role="dialog" aria-modal="true" aria-labelledby="nc-modal-titulo">
        <button className="nc-modal-fechar" type="button" aria-label={t.fechar} onClick={onFechar}>
          <X size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>

        {link ? (
          <div className="nc-feito" role="status">
            <i>
              <Check size={24} strokeWidth={1.8} aria-hidden="true" />
            </i>
            <h2 id="nc-modal-titulo" ref={tituloFeito} tabIndex={-1}>
              {textos.hero.whats.enviada}
            </h2>
            <p>{t.pronto}</p>
            <a className="nc-link" href={link} target="_blank" rel="noopener noreferrer">
              {t.naoAbriu}
            </a>
            <Botao rotulo={t.fechar} variante="secundario" onClick={onFechar} />
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <h2 id="nc-modal-titulo">{t.titulo}</h2>
            <p className="nc-modal-intro">{t.intro}</p>

            <div className="nc-campos">
              <label className={"nc-campo" + (tentou && nomeVazio ? " is-erro" : "")}>
                {t.nome}
                <input
                  ref={campoNome}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="name"
                  required
                  aria-invalid={tentou && nomeVazio}
                  aria-describedby={tentou && nomeVazio ? "nc-erro-nome" : undefined}
                />
                {tentou && nomeVazio ? (
                  <em id="nc-erro-nome" role="alert">
                    {t.nomeErro}
                  </em>
                ) : null}
              </label>

              <label className="nc-campo">
                {t.servico}
                <select value={servico} onChange={(e) => setServico(e.target.value)}>
                  {servicos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titulo}
                    </option>
                  ))}
                  <option value={NAO_SEI}>{t.naoSei}</option>
                </select>
              </label>

              <fieldset className="nc-campo">
                <legend style={{ marginBottom: 7 }}>{t.periodo}</legend>
                <div className="nc-periodos">
                  {t.periodos.map((p) => (
                    <label key={p}>
                      <input
                        type="radio"
                        name="nc-periodo"
                        value={p}
                        checked={periodo === p}
                        onChange={() => setPeriodo(p)}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="nc-campo">
                <span>
                  {t.observacao} <small>({t.opcional})</small>
                </span>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder={t.observacaoDica}
                  maxLength={400}
                />
              </label>
            </div>

            <p className="nc-aviso">
              <Lock size={15} strokeWidth={1.6} aria-hidden="true" />
              {t.aviso}
            </p>

            <div className="nc-modal-fim">
              <Botao rotulo={t.enviar} type="submit" icone={<IconeWhatsApp size={18} />} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
