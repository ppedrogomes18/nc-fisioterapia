import { Navigation } from "lucide-react";
import { clinica, textos } from "@/content/clinica";
import { aparece, confirmado } from "@/lib/pendente";
import { Botao } from "../ui/Botao";
import { Campo } from "../ui/Campo";
import { Kicker, linhas } from "../ui/Kicker";
import { Mapa } from "./Mapa";

export function linksMapa() {
  const q = encodeURIComponent(clinica.mapa.consulta);
  return {
    embed: `https://www.google.com/maps?q=${q}&output=embed`,
    google: confirmado(clinica.mapa.perfilGoogle) ?? `https://www.google.com/maps/search/?api=1&query=${q}`,
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
  };
}

export function Localizacao() {
  const t = textos.localizacao;
  const e = clinica.endereco;
  const links = linksMapa();
  return (
    <section className="nc-sec nc-local" id="localizacao" aria-labelledby="nc-local-titulo">
      <div className="nc-container">
        <div className="nc-sec-head is-esq">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="nc-h2" id="nc-local-titulo" data-reveal="">
            {linhas(t.titulo).map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
        </div>

        <div className="nc-local-grade">
          <Mapa src={links.embed} />

          <div className="nc-local-card nc-grao nc-escuro" data-reveal="">
            <div>
              <h3>{t.endereco}</h3>
              <address>
                <span>{e.linha1}</span>
                <span>
                  {e.linha2}
                  <br />
                  {e.linha3}
                </span>
              </address>
            </div>
            {aparece(clinica.horario.resumo) ? (
              <div>
                <h3>{t.horario}</h3>
                <p>
                  <Campo valor={clinica.horario.resumo} />
                </p>
              </div>
            ) : null}
            <div className="nc-local-acoes">
              <Botao
                rotulo={t.googleMaps}
                href={links.google}
                externo
                variante="claro"
                tamanho="sm"
                icone={<Navigation size={15} strokeWidth={1.6} />}
              />
              <Botao rotulo={t.waze} href={links.waze} externo variante="contorno-claro" tamanho="sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
