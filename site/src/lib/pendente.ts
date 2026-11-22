// Campos que a clínica ainda precisa confirmar levam, literalmente, o texto
// "[A CONFIRMAR]" em src/content/. Aqui fica a regra de exibição:
// - em `npm run dev` e na prévia (PERMITIR_PENDENTES=1), aparecem destacados;
// - no build de produção, o componente não renderiza a linha.

export const PENDENTE = "[A CONFIRMAR]" as const;

export type Pendente = typeof PENDENTE;

export const MOSTRAR_PENDENTES =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_PREVIA === "1";

export function ehPendente(v: unknown): v is Pendente {
  return typeof v === "string" && v.includes(PENDENTE);
}

/** O valor confirmado, ou null se ainda está pendente. */
export function confirmado<T>(v: T | Pendente | null | undefined): T | null {
  if (v == null || ehPendente(v)) return null;
  return v as T;
}

/** Itens de lista com `status: "[A CONFIRMAR]"` só aparecem quando os pendentes estão visíveis. */
export function visiveis<T extends { status?: string }>(itens: readonly T[]): T[] {
  return itens.filter((i) => !ehPendente(i.status) || MOSTRAR_PENDENTES);
}

/** O campo deve aparecer na tela? (confirmado, ou pendente em modo de prévia) */
export function aparece(v: unknown): boolean {
  if (v == null || v === "") return false;
  return !ehPendente(v) || MOSTRAR_PENDENTES;
}
