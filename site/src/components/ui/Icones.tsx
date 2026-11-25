import {
  Accessibility,
  Bandage,
  Bone,
  Brain,
  ClipboardList,
  Footprints,
  HandHeart,
  type LucideIcon,
} from "lucide-react";
import type { IconeServico } from "@/content/clinica";

export const ICONES_SERVICO: Record<IconeServico, LucideIcon> = {
  avaliacao: ClipboardList,
  osso: Bone,
  coluna: Accessibility,
  cirurgia: Bandage,
  esporte: Footprints,
  neuro: Brain,
  idoso: HandHeart,
};

type P = { size?: number; strokeWidth?: number; className?: string };

/** Balão do WhatsApp em traço fino (lucide não traz marcas). */
export function IconeWhatsApp({ size = 18, strokeWidth = 1.6, className }: P) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.6 20.4 4.9 16.5A8.6 8.6 0 1 1 7.6 19.1Z" />
      <path d="M9.1 8.2c-.3 0-.7.1-.9.5-.3.5-.5 1.1-.3 1.8.5 1.9 2.4 3.9 4.6 4.6.7.2 1.3 0 1.8-.3.4-.2.5-.6.5-.9l-.1-.5-1.6-.8c-.2-.1-.5 0-.6.2l-.5.6c-1-.4-1.8-1.2-2.2-2.2l.6-.5c.2-.1.3-.4.2-.6l-.8-1.6z" />
    </svg>
  );
}

export function IconeInstagram({ size = 18, strokeWidth = 1.6, className }: P) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A curva do "C" do logo: meia-lua em traço fino, motivo decorativo. */
export function CurvaC({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M46 10.5A24 24 0 1 0 46 53.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 15.5A18 18 0 1 0 40 48.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
