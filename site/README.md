# Site da NC Fisioterapia

One-page estático (Next.js 16 + TypeScript + Tailwind 4 + GSAP), exportado em `out/`.

## Rodar

```bash
cd site
npm install
npm run dev          # http://localhost:3000 — campos [A CONFIRMAR] aparecem em amarelo
```

> Nesta máquina o Node foi instalado em `~/.local/node`. Se `npm` não for
> encontrado: `export PATH="$HOME/.local/node/bin:$PATH"`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Desenvolvimento, com pendências destacadas |
| `npm run conteudo` | Lista todo `[A CONFIRMAR]` de `src/content/` (arquivo e linha) |
| `npm run build` | Build de produção em `out/`. **Falha** se nome do responsável técnico ou CREFITO estiverem pendentes |
| `PERMITIR_PENDENTES=1 npm run build` | Build de **prévia**: passa com pendências e as mostra destacadas |
| `npm start` | Serve `out/` localmente |
| `npm run lint` / `npm run typecheck` | Verificações |
| `npm run icones` | Regera favicon, ícones, `og.jpg` e logo leve a partir de `public/logo-nc.jpg` |

## Editar conteúdo

Tudo (dados e textos) está em **`src/content/clinica.ts`**. Nenhum componente tem texto fixo.

- Campo confirmado: troque `"[A CONFIRMAR]"` pelo valor.
- Serviço confirmado: apague a linha `status: "[A CONFIRMAR]"`. Serviço que a clínica não oferece: apague o item.
- No build de produção, campo ou item ainda pendente **não aparece** no site.
- Horário: preencha `horario.resumo` (texto exibido) e, se quiser no Google, `horario.schema`.
- Números do "Sobre" (`sobre.numeros`): só fatos reais. Vazio = o bloco não aparece.

Regras (COFFITO 424/2013 e LGPD): sem depoimentos, antes/depois, preços ou promessa de
resultado; nome, "Fisioterapeuta" e CREFITO no rodapé e no Sobre; o formulário não guarda
dados (só monta a mensagem do WhatsApp).

## Fotos

Coloque em `public/img/` (WebP, até ~300 KB) e aponte o `src` em `clinica.fotos`
(ex.: `src: "/img/hero.webp"`). Sem foto, a janela mostra o desenho de fallback.
Nunca use foto de paciente sem autorização escrita.

| Arquivo | Tamanho ideal | Observação |
|---|---|---|
| `hero.webp` | 2400 × 1400 | Paisagem; o centro fica coberto pelo card de WhatsApp e o celular recorta o meio |
| `passo-1.webp` a `passo-4.webp` | 1600 × 1300 | Avaliação, plano, sessão, orientações para casa |
| `sobre.webp` | 1200 × 1500 | Retrato 4:5: profissional ou espaço da clínica |
| `cta.webp` | 2400 × 1400 | É escurecida automaticamente (texto claro por cima) |

## Publicar

**Publicado hoje em:** https://nc-fisioterapia.vercel.app (projeto `nc-fisioterapia` na
Vercel, sem Git conectado). Versão para a cliente aprovar o visual: pendências ocultas,
sem nome/CREFITO.

Para atualizar o mesmo endereço (CLI da Vercel instalada em `~/.local/vercel-cli`):

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd site && rm -rf .next out && npm run build      # com nome e CREFITO preenchidos
cd out && ~/.local/vercel-cli/node_modules/.bin/vercel deploy --prod --yes --project nc-fisioterapia
```

**Vercel:** importe o repositório, defina *Root Directory* = `site`. O preset Next.js já
usa `output: "export"`. Para publicar uma prévia antes do CREFITO, adicione a variável
`PERMITIR_PENDENTES=1` no projeto (e remova quando os dados chegarem).

**Netlify:** *Base directory* = `site`, *Build command* = `npm run build`,
*Publish directory* = `site/out` (mesma variável para prévia).

**Qualquer hospedagem:** rode `npm run build` e envie o conteúdo de `out/`.

Quando o domínio for confirmado, preencha `site.dominio` (com `https://`): isso liga o
canonical, o `sitemap.xml`, a linha `Sitemap:` do `robots.txt` e as URLs do JSON-LD.
