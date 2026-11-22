/** Faixa infinita (CSS). Pausa no hover; com reduced-motion vira uma linha estática. */
export function Marquee({ itens }: { itens: string[] }) {
  if (!itens.length) return null;
  // repete até ter itens suficientes para cobrir telas largas
  const base = itens.length < 6 ? [...itens, ...itens, ...itens].slice(0, Math.max(6, itens.length)) : itens;
  return (
    <div className="nc-marquee">
      <ul className="nc-trilho">
        {base.concat(base).map((t, k) => (
          <li key={k} aria-hidden={k >= itens.length ? true : undefined}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
