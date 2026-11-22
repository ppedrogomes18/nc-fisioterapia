#!/usr/bin/env node
// Lista cada "[A CONFIRMAR]" em src/content/ com arquivo, linha e campo.
//
// - Campos obrigatórios (Código de Ética, COFFITO 424/2013): nome do
//   responsável técnico e nº do CREFITO. Se estiverem pendentes, o build falha.
// - Os demais só geram aviso.
// - PERMITIR_PENDENTES=1 transforma a falha em aviso (build de prévia).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const PASTA = join(RAIZ, "src", "content");
const MARCA = "[A CONFIRMAR]";
const OBRIGATORIOS = new Set(["clinica.responsavel.nome", "clinica.responsavel.crefito"]);

function arquivos(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) return arquivos(p);
    return /\.(ts|tsx|js|mjs|json|md)$/.test(nome) ? [p] : [];
  });
}

/** Caminho aproximado do campo, pela indentação: clinica.responsavel.nome, clinica.servicos[2].status… */
function varrer(arquivo) {
  const linhas = readFileSync(arquivo, "utf8").split("\n");
  const pilha = []; // { indent, chave, lista, idx }
  const achados = [];
  linhas.forEach((linha, i) => {
    const indent = linha.length - linha.trimStart().length;
    const t = linha.trim();
    if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
    while (pilha.length && indent <= pilha[pilha.length - 1].indent && !/^[}\]]/.test(t)) pilha.pop();
    if (/^[}\]]/.test(t)) {
      while (pilha.length && indent < pilha[pilha.length - 1].indent) pilha.pop();
      if (pilha.length && indent === pilha[pilha.length - 1].indent) pilha.pop();
      return;
    }
    const topo = pilha[pilha.length - 1];
    const declaracao = t.match(/^export\s+const\s+(\w+)\s*=\s*([{[])/);
    const chave = t.match(/^"?([\w$]+)"?\s*:/);
    const abreObjeto = /[{[]\s*$/.test(t);

    let nomeCampo = chave ? chave[1] : null;
    if (declaracao) {
      pilha.push({ indent, chave: declaracao[1], lista: declaracao[2] === "[", idx: -1 });
      return;
    }
    if (t === "{" && topo && topo.lista) {
      topo.idx += 1;
      pilha.push({ indent, chave: `[${topo.idx}]`, lista: false, idx: -1 });
      return;
    }
    if (t.startsWith("{") && topo && topo.lista) {
      topo.idx += 1;
      nomeCampo = `[${topo.idx}]` + (chave ? "" : "");
      const inl = t.match(/(\w+)\s*:\s*"\[A CONFIRMAR\]"/g) || [];
      inl.forEach((m) => {
        const campo = m.split(":")[0].trim();
        achados.push({ linha: i + 1, campo: caminho(pilha, `[${topo.idx}].${campo}`), texto: t });
      });
      return;
    }
    if (chave && abreObjeto) {
      pilha.push({ indent, chave: chave[1], lista: /\[\s*$/.test(t), idx: -1 });
      return;
    }
    if (linha.includes(MARCA)) {
      achados.push({ linha: i + 1, campo: caminho(pilha, nomeCampo || "?"), texto: t });
    }
  });
  return achados;
}

function caminho(pilha, folha) {
  return pilha
    .map((p) => p.chave)
    .concat(folha)
    .join(".")
    .replace(/\.\[/g, "[");
}

const todos = arquivos(PASTA).flatMap((a) => varrer(a).map((x) => ({ ...x, arquivo: relative(RAIZ, a) })));
const obrigatorios = todos.filter((x) => OBRIGATORIOS.has(x.campo));
const previa = process.env.PERMITIR_PENDENTES === "1";

const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;

if (!todos.length) {
  console.log(verde("✓ Conteúdo: nenhuma pendência [A CONFIRMAR]."));
  process.exit(0);
}

console.log(`\nConteúdo: ${todos.length} campo(s) ${MARCA}\n`);
for (const x of todos) {
  const tag = OBRIGATORIOS.has(x.campo) ? vermelho(" OBRIGATÓRIO") : "";
  console.log(`  ${amarelo("•")} ${x.arquivo}:${x.linha}  ${x.campo}${tag}`);
}
console.log("");

if (obrigatorios.length) {
  const msg = "Nome do responsável técnico e nº do CREFITO são obrigatórios (COFFITO 424/2013).";
  if (previa) {
    console.log(amarelo(`⚠ ${msg}\n  PERMITIR_PENDENTES=1: seguindo com um build de PRÉVIA (pendências destacadas).\n`));
  } else if (process.argv.includes("--so-listar")) {
    console.log(amarelo(`⚠ ${msg}\n`));
  } else {
    console.error(vermelho(`✗ ${msg}\n  Preencha em src/content/clinica.ts ou rode PERMITIR_PENDENTES=1 npm run build para uma prévia.\n`));
    process.exit(1);
  }
}
