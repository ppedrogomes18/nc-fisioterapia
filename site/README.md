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

## Publicar (GitHub Pages)

O site é publicado pelo **GitHub Pages**, de graça e sem selo de propaganda, em
**https://ncfisioterapia.com.br**. O workflow `.github/workflows/pages.yml` (na raiz do
repositório) roda `npm run build` na pasta `site/` e publica `site/out` a cada push na
`main`:

```bash
git add -A
git commit -m "Descreva a alteração"
git push
```

Em 1 a 2 minutos o site atualiza. Dá para acompanhar em **Actions** no repositório.
O build falha de propósito se nome/CREFITO voltarem a ficar "[A CONFIRMAR]".

**Configuração única no GitHub:** *Settings → Pages → Source* = **GitHub Actions**;
*Custom domain* = `ncfisioterapia.com.br`; depois que o certificado sair, marque
**Enforce HTTPS**. O arquivo `public/CNAME` também registra o domínio.

`site.dominio` em `src/content/clinica.ts` liga o canonical, o `sitemap.xml`, a linha
`Sitemap:` do `robots.txt` e as URLs do JSON-LD. Se trocar de domínio, mude lá e no
`public/CNAME`.

## Domínio (ncfisioterapia.com.br)

- **Registro:** Registro.br, no CPF ou CNPJ da clínica, com vencimento anual. Renove todo
  ano para não perder o domínio.
- **DNS** (no próprio Registro.br, em *Editar zona*):
  - `A` em `ncfisioterapia.com.br` → `185.199.108.153`, `185.199.109.153`,
    `185.199.110.153` e `185.199.111.153` (GitHub Pages)
  - `AAAA` em `ncfisioterapia.com.br` → `2606:50c0:8000::153`, `2606:50c0:8001::153`,
    `2606:50c0:8002::153` e `2606:50c0:8003::153`
  - `CNAME` em `www` → `ppedrogomes18.github.io`
- **HTTPS:** emitido de graça pelo GitHub (*Settings → Pages → Enforce HTTPS*).

A versão antiga em https://nc-fisioterapia.vercel.app pode ser apagada na Vercel depois
que o domínio estiver no ar.
