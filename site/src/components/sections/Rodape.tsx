import { clinica, textos } from "@/content/clinica";
import { aparece } from "@/lib/pendente";
import { linkMailto, linkTelefone, linkWhatsApp } from "@/lib/whatsapp";
import { Campo } from "../ui/Campo";
import { IconeInstagram } from "../ui/Icones";
import { Wordmark } from "../ui/Wordmark";

export function Rodape({ links }: { links: { rotulo: string; href: string }[] }) {
  const t = textos.rodape;
  const c = clinica.contato;
  const e = clinica.endereco;
  const r = clinica.responsavel;
  const ano = new Date().getFullYear();
  return (
    <footer className="nc-rodape nc-grao nc-escuro">
      <div className="nc-container">
        <div className="nc-rodape-topo">
          <div className="nc-rodape-marca">
            <Wordmark />
            <p>{textos.hero.subtitulo}</p>
          </div>

          <div className="nc-rodape-col">
            <h2>{t.contato}</h2>
            <ul>
              <li>
                <a href={linkWhatsApp(textos.flutuante.mensagem)} target="_blank" rel="noopener noreferrer">
                  {textos.hero.whats.rotulo} {c.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={linkTelefone()}>
                  {t.ligar} {c.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={linkMailto()} style={{ overflowWrap: "anywhere" }}>
                  {c.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="nc-rodape-col">
            <h2>{t.endereco}</h2>
            <address>
              {e.linha1}
              <br />
              {e.linha2}
              <br />
              {e.linha3}
            </address>
            {aparece(clinica.horario.resumo) ? (
              <>
                <h2 style={{ marginTop: 26 }}>{t.horario}</h2>
                <p>
                  <Campo valor={clinica.horario.resumo} />
                </p>
              </>
            ) : null}
          </div>

          <nav className="nc-rodape-col" aria-label={t.navegacao}>
            <h2>{t.navegacao}</h2>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.rotulo}</a>
                </li>
              ))}
            </ul>
          </nav>

          {aparece(clinica.redes.instagram) ? (
            <div className="nc-rodape-col">
              <h2>{t.redes}</h2>
              <ul>
                <li>
                  <Campo valor={clinica.redes.instagram}>
                    {(url) => (
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                        <IconeInstagram size={16} />
                        {t.instagram}
                      </a>
                    )}
                  </Campo>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        <div className="nc-rodape-palavra" aria-hidden="true">
          <span data-foot-word="">{clinica.marca.sigla}</span>
        </div>

        <div className="nc-rodape-base">
          <p>
            <strong>{t.responsavel}:</strong> <Campo valor={r.nome} /> — {r.profissao} — {textos.sobre.crefito} <Campo valor={r.crefito} />
          </p>
          <p>
            © {ano} {clinica.nome}. {t.direitos}
            {aparece(clinica.site.creditoDesenvolvedor) ? (
              <>
                {" · "}
                <Campo valor={clinica.site.creditoDesenvolvedor} />
              </>
            ) : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
