import { clinica } from "@/content/clinica";

/** Wordmark recriado em tipografia: "NC" em Cormorant + traço + "FISIOTERAPIA". Fundo transparente. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={"nc-wordmark" + (className ? " " + className : "")} aria-hidden="true">
      <b>{clinica.marca.sigla}</b>
      <i />
      <span>{clinica.marca.descritor}</span>
    </span>
  );
}
