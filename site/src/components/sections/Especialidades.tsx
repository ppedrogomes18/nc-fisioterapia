import { textos, type Servico } from "@/content/clinica";
import { Marquee } from "../ui/Marquee";

export function Especialidades({ servicos }: { servicos: Servico[] }) {
  if (!servicos.length) return null;
  return (
    <section className="nc-faixa nc-grao nc-escuro" aria-label={textos.especialidades.rotulo}>
      <Marquee itens={servicos.map((s) => s.titulo)} />
    </section>
  );
}
