import type { ReactNode } from "react";
import { textos } from "@/content/clinica";
import { MOSTRAR_PENDENTES, PENDENTE, ehPendente } from "@/lib/pendente";

/**
 * Mostra um valor de clinica.ts. Se for "[A CONFIRMAR]":
 * - em dev/prévia → marcador amarelo;
 * - em produção → nada (quem chama decide se esconde a linha inteira com `aparece()`).
 */
export function Campo({ valor, children }: { valor: string; children?: (v: string) => ReactNode }) {
  if (ehPendente(valor)) {
    if (!MOSTRAR_PENDENTES) return null;
    return (
      <mark className="nc-pendente" title={textos.pendente}>
        {PENDENTE}
      </mark>
    );
  }
  return <>{children ? children(valor) : valor}</>;
}

/** Marca visual para um item inteiro pendente (ex.: serviço com status "[A CONFIRMAR]"). */
export function classePendente(status?: string): string {
  return ehPendente(status) && MOSTRAR_PENDENTES ? " nc-pendente-item" : "";
}
