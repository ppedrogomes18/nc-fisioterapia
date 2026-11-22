import { ArrowRight } from "lucide-react";
import { textos, type Servico } from "@/content/clinica";
import { linkWhatsApp, mensagemServico } from "@/lib/whatsapp";
import { classePendente } from "../ui/Campo";
import { ICONES_SERVICO } from "../ui/Icones";
import { Kicker, linhas } from "../ui/Kicker";

export function Tratamentos({ servicos }: { servicos: Servico[] }) {
  if (!servicos.length) return null;
  const t = textos.tratamentos;
  return (
    <section className="nc-sec" id="tratamentos" aria-labelledby="nc-trat-titulo">
      <div className="nc-container">
        <div className="nc-sec-head">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="nc-h2" id="nc-trat-titulo" data-reveal="">
            {linhas(t.titulo).map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="nc-texto" data-reveal="">
            {t.texto}
          </p>
        </div>

        <ul className="nc-trat-grade">
          {servicos.map((s) => {
            const Icone = ICONES_SERVICO[s.icone];
            return (
              <li key={s.id} className={"nc-trat" + classePendente(s.status)} data-reveal="">
                <span className="nc-trat-ico" aria-hidden="true">
                  <Icone size={24} strokeWidth={1.25} />
                </span>
                <span className="nc-trat-traco" aria-hidden="true" />
                <h3>{s.titulo}</h3>
                <p>{s.descricao}</p>
                <a
                  className="nc-link"
                  href={linkWhatsApp(mensagemServico(s))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.agendarDe} ${s.mensagem}`}
                >
                  {t.agendar}
                  <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
