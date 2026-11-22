# PROMPT — Site da NC Fisioterapia

> Para o Claude Code. Leia este arquivo inteiro antes de começar.
> Pasta do projeto: a pasta onde este arquivo está.

---

## 1. Objetivo

Criar o site one-page da **NC Fisioterapia**, clínica em Luziânia – GO.

- **Meta principal:** o visitante agendar uma avaliação pelo WhatsApp.
- **Metas secundárias:** passar confiança e acolhimento; aparecer em buscas locais ("fisioterapia Luziânia", "fisioterapeuta Vila Juracy").
- **Acabamento:** o mesmo nível da referência — animações fluidas, tipografia cuidadosa, muito respiro. Nada com cara de template.

---

## 2. Arquivos desta pasta

| Caminho | O que é |
|---|---|
| `referencia/cairn-agents-landing/` | Landing page de referência (React + TypeScript + GSAP, licença MIT). É o padrão de qualidade, direção de arte e animação. |
| `assets/logo-nc.jpg` | Logo oficial (1254×1254): monograma "NC" dourado + "FISIOTERAPIA" entre dois traços finos, sobre verde-oliva texturizado. |
| `PROMPT.md` | Este arquivo. |

---

## 3. Antes de escrever código

1. Leia os dois `README.md` da referência e o arquivo `cairn-agents-landing.tsx` inteiro (≈3.000 linhas — o CSS está numa string a partir da linha ~566).
2. Leia este prompt até o fim.
3. Me apresente um **plano curto**: pastas, componentes, bibliotecas e o que vai reaproveitar da referência.
4. **Espere meu OK antes de começar.**
5. Inicialize o git e faça um commit ao fim de cada etapa da seção 15.

---

## 4. O que aproveitar da referência

Adapte os **padrões**, não o conteúdo (a referência vende agentes de IA de atendimento).

| Padrão | Onde no `.tsx` (aprox.) | Uso no site da clínica |
|---|---|---|
| Título em linhas mascaradas que sobem ao carregar | `Hero`, `.cnl-line` / `data-line` (~1576) e timeline de intro (~2850) | Título do hero |
| "Janela": foto emoldurada que abre até sangrar a tela com o scroll + zoom 1.16→1 | `Vista` (~1188), animação de `--cnl-in` / `--cnl-r` (~2862) | Janela do hero |
| Cards flutuando dentro da janela com parallax do mouse por profundidade (`data-depth`) | `HeroChat` (~1443), `pointermove` (~2868) | Cards do hero (WhatsApp, endereço, horário) |
| Chips que trocam o cenário, rotação automática, pausa no hover | `HeroChat` | Chips de motivo de consulta |
| Marquee infinito com pausa no hover | `Logos` (~1708) | Faixa de especialidades |
| Frase que acende palavra por palavra no scroll | `Words` (~1293), `data-scrub` / `data-word` | Frase-manifesto |
| Seção fixada (pin) com passos, linha de progresso e clique para pular; vira acordeão < 1024px | `Canvas` (~1731) | "Como funciona o tratamento" |
| Janelas que abrem por `clip-path` + parallax da foto | loop de `.cnl-vista` (~2890) | Todas as fotos de seção |
| Fallback desenhado quando a foto não carrega | `Ridges` (~1168) | Curvas orgânicas em verde e dourado |
| CTA em "janela noturna" que abre de um quadro menor | `Cta` (~2533) | CTA final |
| Palavra gigante que sobe no rodapé | `Footer` (~2626), `data-foot-word` | "NC" gigante |
| Modal com focus trap, Esc, validação | `TalkDialog` (~2673) | Modal "Agendar avaliação" |
| Menu mobile em folha de tela cheia < 860px | `Nav` (~1309) | Menu mobile |
| `prefers-reduced-motion`: nada escondido, nada com scrub, marquee estático | `gsap.matchMedia` | Igual |
| Todo ScrollTrigger dentro de `gsap.context` / `useGSAP`, revertido no unmount | ~2846 | Igual |

**Não trazer:** painéis do Agent Canvas (upload de arquivos, políticas, simulação, deploy), seção "Listen in" (transcrição, waveform, voz), contador de chamadas ao vivo, logos de clientes, depoimentos e números inventados.

---

## 5. Dados da clínica

Fonte única: `site/src/content/clinica.ts`. **Nenhum texto ou dado fixo dentro dos componentes.**

### Confirmados

| Campo | Valor |
|---|---|
| Nome | NC Fisioterapia |
| WhatsApp (exibição) | (61) 98320-7411 |
| WhatsApp (link) | `https://wa.me/5561983207411?text=` + mensagem com `encodeURIComponent` |
| Telefone (`tel:`) | `+5561983207411` |
| E-mail | ncfisioterapia.luziania@gmail.com |
| Endereço | Av. Alfredo Nasser, Qd. 14, Lt. 14-A, Loja 3 — Vila Juracy, Luziânia – GO, CEP 72814-090 |
| Cidade / UF | Luziânia / GO |

### A confirmar

Use literalmente o texto `[A CONFIRMAR]`. **Nunca invente** nenhum destes:

- Nome do(a) fisioterapeuta responsável e nº do CREFITO
- Horário de atendimento
- Lista de serviços/especialidades (pode criar exemplos comuns de fisioterapia, mas cada item marcado com `status: "[A CONFIRMAR]"`)
- Convênios aceitos (ou só particular)
- Instagram e outras redes
- Texto "Sobre a clínica"
- Respostas do FAQ
- Domínio do site
- Crédito do desenvolvedor no rodapé (opcional)

### Como tratar pendências

- Crie `site/scripts/check-conteudo.mjs`: varre `src/content/` e lista cada `[A CONFIRMAR]` com arquivo e linha. Rode no `prebuild`.
- O build só **falha** se nome do responsável ou CREFITO estiverem pendentes (são obrigatórios — ver seção 6). Os outros só geram aviso.
- Em `npm run dev`: mostre os campos pendentes destacados (fundo amarelo) para ficarem visíveis.
- Em produção: campo pendente some da tela (o componente não renderiza a linha).

---

## 6. Regras de conteúdo (obrigatórias)

**Código de Ética da Fisioterapia (Resolução COFFITO nº 424/2013):**

- Mostrar **nome do profissional, a profissão ("Fisioterapeuta") e o nº de inscrição no CREFITO** — no rodapé e na seção "Sobre".
- **Sem depoimentos de pacientes**, sem fotos de antes/depois, sem foto ou nome de paciente.
- **Sem promessa de resultado** ("cura garantida", "sem dor em X sessões", "tratamento infalível").
- **Sem preços** no site.
- Só títulos de especialista reconhecidos e registrados.

**LGPD:**

- O formulário não salva nada: só monta a mensagem e abre o WhatsApp. Diga isso no próprio modal.
- Sem cookies de rastreamento. Se um dia entrar analytics, entra junto um banner de consentimento.

**Tom do texto:** acolhedor e profissional. Frases curtas, "você", sem jargão técnico. Todo texto de marketing é rascunho para a clínica revisar.

---

## 7. Stack

- **Next.js** (App Router, versão estável atual) + **TypeScript** + **Tailwind CSS**
- **GSAP** + ScrollTrigger + `@gsap/react` (`useGSAP`)
- Export estático: `output: "export"`, `images: { unoptimized: true }` — deploy na Vercel, Netlify ou qualquer hospedagem
- Fontes via `next/font/google` (self-hosted, sem layout shift)
- Ícones: `lucide-react` ou SVG inline em traço fino
- Projeto criado na subpasta **`site/`** (a raiz já tem arquivos)

---

## 8. Identidade visual

### Cores (extraídas do logo)

| Token | Hex | Uso |
|---|---|---|
| `--verde` | `#2E3623` | Fundo de seções escuras, header sólido, botões |
| `--verde-noite` | `#1F251A` | CTA final, rodapé |
| `--dourado` | `#B0905C` | Monograma, traços, ícones, títulos grandes |
| `--dourado-claro` | `#C9AE80` | Texto pequeno dourado sobre verde, hover |
| `--dourado-texto` | `#7A6136` | Texto pequeno dourado sobre creme (kickers, links) |
| `--creme` | `#F5F1E8` | Fundo principal |
| `--tinta` | `#1E231A` | Texto principal |
| `--tinta-suave` | `#5B6152` | Texto secundário |

**Contraste (WCAG AA) — já medido:**

- `--dourado` sobre `--creme` = 2,7:1 → **só decorativo ou texto ≥ 24px**. Texto pequeno dourado em fundo claro usa `--dourado-texto` (5,2:1).
- `--dourado` sobre `--verde` = 4,2:1 → títulos grandes. Texto pequeno usa `--dourado-claro` (5,9:1).
- `--creme` sobre `--verde` = 11,2:1 · `--tinta` sobre `--creme` = 14,2:1.

### Tipografia

- **Display:** Cormorant Garamond (400/500) — serifa de alto contraste, próxima do "NC" do logo. Títulos grandes com `letter-spacing` levemente negativo.
- **Texto e UI:** Inter.
- **Kickers:** caixa alta, `letter-spacing: .25em`, entre dois traços finos dourados — o mesmo motivo de "— FISIOTERAPIA —" do logo.

### Direção de arte

- Reinterprete "a janela" da referência: cada seção abre uma janela para uma cena calma de **movimento e cuidado**, em luz quente. Cards creme e verde flutuam dentro delas.
- Sensação: premium, calma, acolhedora. Nada de azul-hospital.
- Motivos gráficos do logo: o **traço fino dourado** e a **curva do "C"** (meia-lua) como forma decorativa e máscara de imagem.
- Textura de ruído sutil (SVG, ~4% de opacidade) nos fundos verdes, lembrando o papel do logo.
- Cantos: 14–20px nos cards. Sombras suaves e quentes.

---

## 9. Seções (em ordem)

### 9.1 Header

- Wordmark recriado em SVG/CSS com fundo transparente: "NC" em Cormorant dourado + "FISIOTERAPIA" pequeno e espaçado.
- Links: Tratamentos · Como funciona · Sobre · Localização · Dúvidas.
- Botão "Agendar avaliação" (abre o modal).
- Transparente no topo; fica sólido (creme com blur) ao rolar.
- < 860px: menu em folha de tela cheia, como na referência.

### 9.2 Hero

- Kicker: "Fisioterapia em Luziânia – GO".
- Título (linhas mascaradas): `Movimento\ncom cuidado.`
- Subtítulo (rascunho): "Avaliação individual e um plano de tratamento feito para você, na Vila Juracy."
- Botões: "Agendar pelo WhatsApp" (primário) e "Ver tratamentos" (secundário).
- Janela com foto que abre com o scroll. Dentro dela, cards com parallax:
  - **Card WhatsApp:** chips com os 3–4 primeiros serviços. Cada chip muda a bolha de mensagem — ex.: "Olá! Gostaria de agendar uma avaliação de [serviço]." — e o botão "Enviar no WhatsApp" abre o `wa.me` com esse texto. Troca automática a cada ~5s, pausa no hover/foco.
  - **Card endereço:** "Vila Juracy · Luziânia – GO".
  - **Card horário:** valor de `clinica.ts`.

### 9.3 Faixa de especialidades

Marquee com os serviços em Cormorant itálico dourado, separados por um ponto ou traço dourado. Pausa no hover. Linha estática com reduced-motion.

### 9.4 Frase-manifesto

Acende palavra por palavra no scroll. Rascunho: "Cada corpo tem a sua história. Por isso, todo tratamento começa ouvindo você."

### 9.5 Tratamentos

- Grid de cards: ícone em traço fino, título, descrição curta, link "Agendar" com mensagem pré-preenchida daquele serviço.
- Hover: card sobe, traço dourado se estende.
- Dados de `clinica.ts`.

### 9.6 Como funciona

Seção fixada (pin) no desktop, como o Agent Canvas:

1. **Avaliação** — conversa, histórico e exame físico
2. **Plano de tratamento** — objetivos e frequência definidos com você
3. **Sessões** — acompanhamento a cada atendimento
4. **Alta e prevenção** — orientações para manter os resultados em casa

- Ao lado, uma janela com foto que troca a cada passo. Linha de progresso; clique pula para o passo.
- < 1024px: acordeão.
- Textos são rascunho para a clínica revisar.

### 9.7 Sobre / Quem atende

- Janela com foto (profissional ou espaço da clínica).
- Nome, "Fisioterapeuta — CREFITO [nº]", texto curto.
- Bloco de números **só se forem fatos reais** fornecidos pela clínica (ex.: anos de experiência). Sem dado, o bloco não aparece.

### 9.8 Localização

- Mapa: iframe do Google Maps sem chave de API — `https://www.google.com/maps?q=<endereço codificado>&output=embed`. Carrega só quando a seção chega perto da tela (ou com clique em "Ver mapa"). Tem `title` acessível.
- O pino pode cair impreciso: deixe em `clinica.ts` um campo para trocar o endereço do mapa por coordenadas ou link do perfil no Google.
- Card com endereço completo, horário e botões "Abrir no Google Maps" e "Abrir no Waze" (`https://waze.com/ul?q=<endereço>&navigate=yes`).

### 9.9 Dúvidas frequentes

- Acordeão acessível (`<details>` estilizado ou botão com `aria-expanded`).
- Perguntas: "Preciso de pedido médico?", "Vocês atendem convênio?", "Quanto tempo dura cada sessão?", "O que levar na primeira consulta?", "Como faço para agendar?".
- Respostas = `[A CONFIRMAR]`, exceto "Como faço para agendar?" (pelo WhatsApp ou pelo botão do site).

### 9.10 CTA final

- Janela verde-noite que abre de um quadro menor.
- Título: `Vamos cuidar\ndo seu movimento?`
- Botão WhatsApp + link de e-mail.
- Garantias (rascunho, revisar): "Avaliação individual" · "Atendimento com hora marcada" · "Vila Juracy, Luziânia".

### 9.11 Rodapé

- "NC" gigante em Cormorant, subindo com o scroll.
- Colunas: contato, endereço, horário, navegação, Instagram.
- Linha obrigatória: "Responsável técnico: [Nome] — Fisioterapeuta — CREFITO [nº]".
- © ano atual NC Fisioterapia.

### 9.12 Botão flutuante de WhatsApp

Canto inferior direito. Aparece depois do hero, some sobre o CTA final. Tem `aria-label`.

---

## 10. Modal "Agendar avaliação"

- Campos: nome (obrigatório), serviço (select com a lista de serviços + "Ainda não sei"), melhor período (manhã / tarde / noite), observação (opcional).
- Validação inline, focus trap, fecha com Esc e clique fora, `role="dialog"` + `aria-modal`.
- Ao enviar, monta: "Olá! Meu nome é {nome}. Gostaria de agendar uma avaliação de {serviço}. Melhor período: {período}. {observação}" e abre `wa.me` em nova aba.
- Aviso no modal: "Seus dados não ficam salvos no site. A mensagem é enviada pelo seu WhatsApp."
- Toda montagem de link fica em `src/lib/whatsapp.ts` → `linkWhatsApp(texto: string): string`.

---

## 11. Imagens e logo

### Logo

- Copie `assets/logo-nc.jpg` para `site/public/`.
- **Header e rodapé:** wordmark recriado em SVG (funciona em fundo creme e verde).
- **Arquivo original:** imagem de compartilhamento (OG) e seção Sobre.
- Gere `favicon.ico`, `icon.png` e `apple-icon.png` recortando o monograma "NC".
- Gere `og.jpg` 1200×630: logo centralizado sobre `--verde`.

### Fotos

- Pasta: `site/public/img/` — `hero.jpg`, `passo-1.jpg` a `passo-4.jpg`, `sobre.jpg`, `cta.jpg`.
- Enquanto não houver foto real: fallback desenhado (gradiente verde/dourado com curvas orgânicas, como o `Ridges`). **A página tem que parecer pronta sem nenhuma foto.**
- Prioridade: fotos reais da clínica. Nunca foto de paciente sem autorização escrita.
- Hero com `fetchpriority="high"`; o resto `loading="lazy"`. Todas com `width`/`height`. WebP, até ~300 KB.

---

## 12. SEO local

- `lang="pt-BR"`.
- Title: "NC Fisioterapia | Fisioterapia em Luziânia – GO".
- Meta description (~155 caracteres), canonical (domínio `[A CONFIRMAR]`), Open Graph e Twitter Card com `og.jpg`.
- JSON-LD `Physiotherapy` (schema.org): nome, `PostalAddress` (Luziânia, GO, 72814-090, BR), telefone `+55 61 98320-7411`, e-mail, URL, imagem. `openingHoursSpecification` e `sameAs` só quando confirmados.
- JSON-LD `FAQPage` só com respostas confirmadas.
- `sitemap.xml` e `robots.txt` estáticos.
- Um único `<h1>`; hierarquia de headings correta.

---

## 13. Acessibilidade e desempenho

- Contraste AA (seção 8), navegação por teclado, foco visível (anel dourado), link "Pular para o conteúdo", `alt` em toda imagem com conteúdo.
- `prefers-reduced-motion`: sem scrub, sem pin, sem marquee em movimento; tudo visível.
- Mobile-first. Testar em 360px, 768px, 1024px e 1440px.
- Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO.
- Sem CLS: fontes via `next/font`, imagens com dimensões, mapa com altura reservada.

---

## 14. Estrutura sugerida

```
site/
  scripts/check-conteudo.mjs
  public/  (logo, og.jpg, img/)
  src/
    app/        layout.tsx, page.tsx, globals.css, sitemap, robots, ícones
    components/
      sections/ Header, Hero, Especialidades, Manifesto, Tratamentos,
                ComoFunciona, Sobre, Localizacao, Duvidas, CtaFinal, Rodape
      ui/       Janela, FallbackCurvas, Botao, Kicker, ModalAgendar,
                WhatsAppFlutuante, Marquee
    content/    clinica.ts
    lib/        whatsapp.ts, animacoes.ts
```

---

## 15. Ordem de trabalho

1. Plano → meu OK.
2. Scaffold em `site/`, tokens de cor, fontes, `clinica.ts`, `whatsapp.ts`, `check-conteudo.mjs`.
3. Todas as seções **sem animação**, responsivas.
4. Animações GSAP (intro, janelas, pin, marquee, palavras, rodapé).
5. Modal de agendamento e botão flutuante.
6. SEO, ícones, OG.
7. Revisão: `npm run lint`, `tsc --noEmit`, `npm run build`, teste em 360px, teste com reduced-motion, teste de todos os links `wa.me`.

---

## 16. Critérios de aceite

- [ ] Todo link de WhatsApp abre `wa.me/5561983207411` com o texto certo (acentos codificados).
- [ ] E-mail com `mailto:` correto; telefone com `tel:` correto.
- [ ] Endereço idêntico em hero, localização, rodapé e JSON-LD.
- [ ] Nenhum depoimento, preço, antes/depois ou promessa de resultado.
- [ ] Nenhum dado inventado: tudo que não está na seção 5 aparece como `[A CONFIRMAR]`.
- [ ] Página fica completa e bonita sem nenhuma foto.
- [ ] Funciona com teclado e com reduced-motion.
- [ ] `npm run build` gera o site estático em `site/out/`.
- [ ] Sem erros no console.

---

## 17. Entrega final

Ao terminar, me responda com:

1. O que foi feito (curto).
2. **Lista de pendências** — saída do `check-conteudo` — para eu pedir à clínica.
3. Lista de fotos que faltam, com o tamanho ideal de cada uma.
4. Como rodar (`cd site && npm run dev`) e como publicar (Vercel ou Netlify).
