import { clinica, preencher, textos, type Servico } from "@/content/clinica";

/** Link do WhatsApp da clínica com a mensagem já preenchida (acentos codificados). */
export function linkWhatsApp(texto: string): string {
  return `https://wa.me/${clinica.contato.whatsappNumero}?text=${encodeURIComponent(texto)}`;
}

/** "Olá! Gostaria de agendar uma avaliação de {serviço}." */
export function mensagemServico(servico?: Pick<Servico, "mensagem"> | null): string {
  if (!servico) return textos.hero.whats.mensagemGeral;
  return preencher(textos.hero.whats.mensagem, { servico: servico.mensagem });
}

export type DadosAgendamento = {
  nome: string;
  servico: Pick<Servico, "mensagem"> | null;
  periodo: string;
  observacao: string;
};

/** A mensagem do modal "Agendar avaliação". */
export function mensagemAgendamento(d: DadosAgendamento): string {
  const obs = d.observacao.trim();
  const valores = {
    nome: d.nome.trim(),
    servico: d.servico ? d.servico.mensagem : "",
    periodo: d.periodo.toLocaleLowerCase("pt-BR"),
    observacao: obs ? (/[.!?]$/.test(obs) ? obs : obs + ".") : "",
  };
  const modelo = d.servico ? textos.modal.mensagem : textos.modal.mensagemSemServico;
  return preencher(modelo, valores);
}

export function linkMailto(email = clinica.contato.email): string {
  return `mailto:${email}`;
}

export function linkTelefone(tel = clinica.contato.telefone): string {
  return `tel:${tel}`;
}
