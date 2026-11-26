// Fonte única de dados e textos do site da NC Fisioterapia.
//
// - Nenhum componente tem texto fixo: tudo sai daqui.
// - Tudo que a clínica ainda não confirmou leva, literalmente, "[A CONFIRMAR]".
//   `npm run conteudo` lista as pendências; o build de produção falha enquanto
//   responsavel.nome ou responsavel.crefito estiverem pendentes.
// - Todo texto de marketing é rascunho para a clínica revisar.

export type IconeServico =
  | "avaliacao"
  | "osso"
  | "cirurgia"
  | "coluna"
  | "esporte"
  | "neuro"
  | "idoso";

export type Servico = {
  id: string;
  titulo: string;
  /** Como o serviço entra na frase "Gostaria de agendar uma avaliação de …". */
  mensagem: string;
  descricao: string;
  icone: IconeServico;
  /** Remova o campo quando a clínica confirmar que oferece o serviço. */
  status?: string;
};

export type Foto = {
  /** Caminho em /public, ex.: "/img/hero.webp". null = usa o desenho de fallback. */
  src: string | null;
  alt: string;
  largura: number;
  altura: number;
};

export type Pergunta = { pergunta: string; resposta: string };

export type Numero = { valor: string; rotulo: string };

export type Horario = {
  /** Dias no formato do schema.org: "Monday", "Tuesday"… */
  dias: string[];
  abre: string;
  fecha: string;
};

const endereco = {
  logradouro: "Av. Alfredo Nasser, Quadra 14 - Lote 14A",
  bairro: "Vila Juracy",
  cidade: "Luziânia",
  uf: "GO",
  cep: "72814-090",
  pais: "BR",
};

export const clinica = {
  nome: "NC Fisioterapia",
  marca: { sigla: "NC", descritor: "Fisioterapia" },

  contato: {
    whatsappExibicao: "(61) 98320-7411",
    /** Só dígitos, com DDI e DDD: usado em https://wa.me/<numero>. */
    whatsappNumero: "5561983207411",
    telefone: "+5561983207411",
    telefoneSchema: "+55-61-98320-7411",
    email: "ncfisioterapia.luziania@gmail.com",
  },

  endereco: {
    ...endereco,
    // Igual ao perfil da clínica no Google (NAP consistente):
    // "Av. Alfredo Nasser, Quadra 14 - Lote 14A – Vila Juracy, Luziânia – GO, 72814-090".
    completo: `${endereco.logradouro} – ${endereco.bairro}, ${endereco.cidade} – ${endereco.uf}, ${endereco.cep}`,
    curto: `${endereco.bairro} · ${endereco.cidade} – ${endereco.uf}`,
    linha1: endereco.logradouro,
    linha2: `${endereco.bairro}, ${endereco.cidade} – ${endereco.uf}, ${endereco.cep}`,
  },

  mapa: {
    /** Busca usada no mapa incorporado e no Waze. */
    consulta: `NC Fisioterapia, ${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`,
    /** Perfil da clínica no Google Maps. */
    perfilGoogle: "https://maps.google.com/?cid=8160308490101150477",
    /** Link para deixar uma avaliação no perfil do Google. */
    avaliarGoogle: "https://g.page/r/CQ1TFSpWPT9xEBM/review",
    geo: { latitude: -16.251872, longitude: -47.9322028 },
  },

  responsavel: {
    nome: "Natácia Costa",
    profissao: "Fisioterapeuta",
    crefito: "350597-F",
  },

  horario: {
    /** Texto exibido. Igual ao perfil do Google. */
    resumo: "Segunda a sexta, das 8h às 18h; sábado, das 8h às 12h",
    /** Só preencha quando confirmado: entra no JSON-LD (openingHoursSpecification). */
    schema: [
      {
        dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        abre: "08:00",
        fecha: "18:00",
      },
      { dias: ["Saturday"], abre: "08:00", fecha: "12:00" },
    ] as Horario[],
  },

  /** Convênios aceitos, ou "Somente particular". */
  convenios: "[A CONFIRMAR]",

  redes: {
    /** URL completa, ex.: "https://instagram.com/ncfisioterapia". */
    instagram: "https://www.instagram.com/nc_fisioterapia_/",
  },

  site: {
    /** Domínio final, com https://, sem barra no fim. */
    dominio: "https://ncfisioterapia.com.br",
    /** Data da última mudança de conteúdo (AAAA-MM-DD): vai no <lastmod> do sitemap. */
    atualizadoEm: "2026-11-25",
    /** Opcional. Ex.: "Site por Fulano". */
    creditoDesenvolvedor: "[A CONFIRMAR]",
  },

  // Serviços confirmados. Não inclua serviço que a clínica não confirmou.
  // TODO: outros serviços a confirmar com a cliente (ex.: ortopédica, coluna e
  // postura, esportiva, neurológica, idosos). Os ícones já existem em
  // components/ui/Icones.tsx: "osso", "coluna", "esporte", "neuro", "idoso".
  servicos: [
    {
      id: "avaliacao",
      titulo: "Avaliação fisioterapêutica",
      mensagem: "fisioterapia",
      descricao:
        "O primeiro passo de todo tratamento. Uma conversa sobre o que você sente, o seu histórico e a sua rotina, seguida do exame físico. A partir dela, o plano é montado para o seu caso.",
      icone: "avaliacao",
    },
    {
      id: "pos-cirurgica",
      titulo: "Reabilitação pós-cirúrgica",
      mensagem: "reabilitação pós-cirúrgica",
      descricao:
        "Acompanhamento para recuperar força e movimento depois da cirurgia, como no pós-operatório de joelho (LCA e menisco), respeitando cada fase da cicatrização.",
      icone: "cirurgia",
    },
  ] as Servico[],

  sobre: {
    texto: "[A CONFIRMAR]",
    /** Só fatos reais fornecidos pela clínica (ex.: anos de experiência). Vazio = o bloco não aparece. */
    numeros: [] as Numero[],
  },

  faq: [
    { pergunta: "Preciso de pedido médico?", resposta: "[A CONFIRMAR]" },
    { pergunta: "Vocês atendem convênio?", resposta: "[A CONFIRMAR]" },
    { pergunta: "Quanto tempo dura cada sessão?", resposta: "[A CONFIRMAR]" },
    { pergunta: "O que levar na primeira consulta?", resposta: "[A CONFIRMAR]" },
    {
      pergunta: "Como faço para agendar?",
      resposta:
        "Pelo WhatsApp (61) 98320-7411 ou pelo botão “Agendar avaliação” aqui do site. Você conta o que está sentindo, escolhe o melhor período e a gente combina o horário.",
    },
  ] as Pergunta[],

  // Fotos reais da clínica. Nunca foto de paciente sem autorização escrita.
  // Enquanto src for null, a janela mostra o desenho de fallback.
  fotos: {
    hero: { src: null, alt: "Sala de atendimento da NC Fisioterapia", largura: 2400, altura: 1400 },
    passos: [
      { src: null, alt: "Conversa de avaliação na clínica", largura: 1600, altura: 1300 },
      { src: null, alt: "Planejamento do tratamento", largura: 1600, altura: 1300 },
      { src: null, alt: "Sessão de fisioterapia", largura: 1600, altura: 1300 },
      { src: null, alt: "Orientações de exercícios para casa", largura: 1600, altura: 1300 },
    ],
    sobre: { src: null, alt: "Espaço da NC Fisioterapia", largura: 1200, altura: 1500 },
    cta: { src: null, alt: "Ambiente da clínica", largura: 2400, altura: 1400 },
  } satisfies Record<string, Foto | Foto[]>,
};

// ---------------------------------------------------------------------------
// Textos do site (rascunho para a clínica revisar)
// ---------------------------------------------------------------------------

export const textos = {
  seo: {
    titulo: "Fisioterapia em Luziânia | NC Fisioterapia – Natácia Costa",
    descricao:
      "Clínica de fisioterapia na Vila Juracy, em Luziânia (GO). Avaliação individual, reabilitação pós-cirúrgica e plano de tratamento com a fisioterapeuta Natácia Costa. Agende pelo WhatsApp.",
    /** Entra no JSON-LD (schema.org). */
    descricaoSchema:
      "Clínica de fisioterapia em Luziânia (GO), na Vila Juracy, com atendimento da fisioterapeuta Natácia Costa (CREFITO 350597-F). Avaliação individual, plano de tratamento personalizado e reabilitação pós-cirúrgica.",
    nomeAlternativo: "Fisioterapia Natácia Costa",
    /** Código de verificação do Google Search Console. */
    googleVerificacao: "shwkxcTAG3N4-W3ZEIRBxVZMFbY0E_537GTlhc0w0wM",
    ogAlt: "Logo da NC Fisioterapia: monograma NC dourado sobre verde",
  },

  nav: {
    links: [
      { rotulo: "Tratamentos", href: "#tratamentos" },
      { rotulo: "Como funciona", href: "#como-funciona" },
      { rotulo: "Sobre", href: "#sobre" },
      { rotulo: "Localização", href: "#localizacao" },
      { rotulo: "Dúvidas", href: "#duvidas" },
    ],
    acao: "Agendar avaliação",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    menu: "Menu",
    principal: "Navegação principal",
    inicio: "NC Fisioterapia, voltar ao início",
    pular: "Pular para o conteúdo",
  },

  hero: {
    kicker: "Fisioterapia em Luziânia – GO",
    titulo: "Movimento\ncom cuidado.",
    subtitulo: "Avaliação individual e um plano de tratamento feito para você, na Vila Juracy.",
    primario: "Agendar pelo WhatsApp",
    secundario: "Ver tratamentos",
    whats: {
      rotulo: "WhatsApp",
      escolha: "Qual o motivo da consulta?",
      enviar: "Enviar no WhatsApp",
      motivos: "Motivos de consulta",
      /** {servico} é trocado pelo campo `mensagem` do serviço. */
      mensagem: "Olá! Gostaria de agendar uma avaliação de {servico}.",
      mensagemGeral: "Olá! Gostaria de agendar uma avaliação.",
      geral: "Avaliação",
      enviada: "Mensagem pronta",
    },
    endereco: "Endereço",
    horario: "Horário",
  },

  especialidades: {
    rotulo: "Tratamentos oferecidos",
  },

  manifesto: {
    kicker: "Nosso jeito de cuidar",
    frase: "Cada corpo tem a sua história. Por isso, todo tratamento começa ouvindo você.",
  },

  tratamentos: {
    kicker: "Tratamentos",
    titulo: "Cuidado para cada\nfase do movimento.",
    texto: "Cada tratamento começa com uma avaliação. A partir dela, o plano é montado para o seu caso.",
    agendar: "Agendar",
    agendarDe: "Agendar avaliação de",
  },

  comoFunciona: {
    kicker: "Como funciona",
    titulo: "Do primeiro contato\nà alta.",
    texto: "Um caminho claro, combinado com você em cada etapa.",
    passo: "Passo",
    passos: [
      {
        titulo: "Avaliação",
        texto: "Uma conversa sobre o que você sente, o seu histórico e a sua rotina, seguida do exame físico.",
        detalhe: "Conversa, histórico e exame físico",
      },
      {
        titulo: "Plano de tratamento",
        texto: "Objetivos e frequência das sessões definidos junto com você, de forma clara.",
        detalhe: "Objetivos e frequência combinados",
      },
      {
        titulo: "Sessões",
        texto: "Cada atendimento é acompanhado de perto, e o plano se ajusta conforme a sua evolução.",
        detalhe: "Acompanhamento a cada atendimento",
      },
      {
        titulo: "Alta e prevenção",
        texto: "Você sai com orientações para cuidar do corpo em casa e manter o que conquistou.",
        detalhe: "Orientações para o dia a dia",
      },
    ],
  },

  sobre: {
    kicker: "Quem atende",
    titulo: "Sobre a clínica",
    crefito: "CREFITO",
    logoAlt: "Logo da NC Fisioterapia",
  },

  localizacao: {
    kicker: "Localização",
    titulo: "Na Vila Juracy,\nem Luziânia.",
    endereco: "Endereço",
    horario: "Horário de atendimento",
    googleMaps: "Ver no Google Maps",
    avaliar: "Avalie a clínica no Google",
    instagram: "Instagram",
    waze: "Abrir no Waze",
    verMapa: "Ver mapa",
    mapaTitulo: "Mapa com a localização da NC Fisioterapia",
    mapaCarregando: "Carregando mapa…",
    comoChegar: "Como chegar",
  },

  duvidas: {
    kicker: "Dúvidas frequentes",
    titulo: "Antes de agendar.",
    outraDuvida: "Ficou alguma dúvida?",
    chamar: "Fale com a gente no WhatsApp",
    mensagem: "Olá! Tenho uma dúvida sobre o atendimento.",
  },

  cta: {
    kicker: "Agende sua avaliação",
    titulo: "Vamos cuidar\ndo seu movimento?",
    texto: "Mande uma mensagem e a gente encontra o melhor horário para você.",
    whatsapp: "Chamar no WhatsApp",
    email: "ou escreva para",
    garantias: ["Avaliação individual", "Atendimento com hora marcada", "Vila Juracy, Luziânia"],
  },

  rodape: {
    contato: "Contato",
    ligar: "Ligar",
    endereco: "Endereço",
    horario: "Horário",
    navegacao: "Navegação",
    redes: "Redes",
    instagram: "Instagram",
    responsavel: "Responsável técnico",
    direitos: "Todos os direitos reservados.",
    voltarTopo: "Voltar ao topo",
  },

  flutuante: {
    rotulo: "Conversar com a NC Fisioterapia no WhatsApp",
    mensagem: "Olá! Gostaria de agendar uma avaliação.",
  },

  modal: {
    titulo: "Agendar avaliação",
    intro: "Preencha os campos e a mensagem fica pronta para enviar no seu WhatsApp.",
    nome: "Seu nome",
    nomeErro: "Digite seu nome para a mensagem.",
    servico: "Tratamento",
    naoSei: "Ainda não sei",
    periodo: "Melhor período",
    periodos: ["Manhã", "Tarde", "Noite"],
    observacao: "Observação",
    opcional: "opcional",
    observacaoDica: "Conte um pouco do que você está sentindo, se quiser.",
    aviso: "Seus dados não ficam salvos no site. A mensagem é enviada pelo seu WhatsApp.",
    enviar: "Abrir WhatsApp",
    fechar: "Fechar",
    mensagem:
      "Olá! Meu nome é {nome}. Gostaria de agendar uma avaliação de {servico}. Melhor período: {periodo}. {observacao}",
    mensagemSemServico:
      "Olá! Meu nome é {nome}. Gostaria de agendar uma avaliação (ainda não sei qual tratamento). Melhor período: {periodo}. {observacao}",
    pronto: "Abrimos o WhatsApp em uma nova aba com a sua mensagem. É só conferir e enviar.",
    naoAbriu: "O WhatsApp não abriu? Toque aqui.",
  },

  pendente: "Pendente",
};

/** Troca {chaves} por valores e limpa espaços sobrando. */
export function preencher(modelo: string, valores: Record<string, string>): string {
  return modelo
    .replace(/\{(\w+)\}/g, (_, k: string) => valores[k] ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
