import { textos } from "@/content/clinica";
import { CurvaC } from "../ui/Icones";
import { Kicker } from "../ui/Kicker";

/** Frase que acende palavra por palavra com o scroll (data-scrub / data-word). */
export function Manifesto() {
  const t = textos.manifesto;
  const palavras = t.frase.split(/\s+/).filter(Boolean);
  return (
    <section className="nc-sec nc-manifesto" aria-labelledby="nc-manifesto">
      <div className="nc-container">
        <Kicker>{t.kicker}</Kicker>
        <h2 className="nc-manifesto-frase" id="nc-manifesto" data-scrub="">
          {palavras.map((p, k) => (
            <span key={k}>
              <span data-word="">{p}</span>
              {k < palavras.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
        <CurvaC size={56} className="nc-curva-c" />
      </div>
    </section>
  );
}
