#!/usr/bin/env node
// Gera, a partir de public/logo-nc.jpg (1254×1254):
// - src/app/favicon.ico (16/32/48), src/app/icon.png (512), src/app/apple-icon.png (180):
//   recorte do monograma "NC" centralizado sobre o verde do logo;
// - public/og.jpg (1200×630): logo centralizado sobre --verde;
// - public/logo-nc-400.webp: versão leve do logo para a seção Sobre.
// Rode com `npm run icones` quando o logo mudar.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = (p) => fileURLToPath(new URL("../" + p, import.meta.url));
const LOGO = raiz("public/logo-nc.jpg");
const VERDE = "#2E3623";

// área do "NC" no logo original (sem a linha "FISIOTERAPIA")
const MONOGRAMA = { left: 300, top: 340, width: 670, height: 490 };

async function corDeFundo() {
  const { data } = await sharp(LOGO).extract({ left: 40, top: 40, width: 80, height: 80 }).resize(1, 1).raw().toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2], alpha: 1 };
}

async function iconePng(tamanho, fundo) {
  const larguraNC = Math.round(tamanho * 0.74);
  const nc = await sharp(LOGO).extract(MONOGRAMA).resize({ width: larguraNC }).toBuffer();
  const meta = await sharp(nc).metadata();
  return sharp({ create: { width: tamanho, height: tamanho, channels: 4, background: fundo } })
    .composite([{ input: nc, left: Math.round((tamanho - larguraNC) / 2), top: Math.round((tamanho - meta.height) / 2) }])
    .png()
    .toBuffer();
}

/** ICO com entradas PNG (suportado por todos os navegadores atuais). */
function ico(pngs) {
  const cab = Buffer.alloc(6 + 16 * pngs.length);
  cab.writeUInt16LE(0, 0);
  cab.writeUInt16LE(1, 2);
  cab.writeUInt16LE(pngs.length, 4);
  let offset = cab.length;
  pngs.forEach(({ tamanho, buf }, i) => {
    const o = 6 + 16 * i;
    cab.writeUInt8(tamanho >= 256 ? 0 : tamanho, o);
    cab.writeUInt8(tamanho >= 256 ? 0 : tamanho, o + 1);
    cab.writeUInt8(0, o + 2);
    cab.writeUInt8(0, o + 3);
    cab.writeUInt16LE(1, o + 4);
    cab.writeUInt16LE(32, o + 6);
    cab.writeUInt32LE(buf.length, o + 8);
    cab.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([cab, ...pngs.map((p) => p.buf)]);
}

const fundo = await corDeFundo();

writeFileSync(raiz("src/app/icon.png"), await iconePng(512, fundo));
writeFileSync(raiz("src/app/apple-icon.png"), await iconePng(180, fundo));
const pequenos = await Promise.all([16, 32, 48].map(async (t) => ({ tamanho: t, buf: await iconePng(t, fundo) })));
writeFileSync(raiz("src/app/favicon.ico"), ico(pequenos));

// OG: logo com bordas esfumadas sobre o verde, para não marcar a emenda
const lado = 630;
const mascara = Buffer.from(
  `<svg width="${lado}" height="${lado}"><defs><radialGradient id="g"><stop offset="0.62" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${lado}" height="${lado}" fill="url(#g)"/></svg>`,
);
const logoOg = await sharp(LOGO).resize(lado, lado).ensureAlpha().composite([{ input: mascara, blend: "dest-in" }]).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: VERDE } })
  .composite([{ input: logoOg, left: (1200 - lado) / 2, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(raiz("public/og.jpg"));

await sharp(LOGO).resize(400, 400).webp({ quality: 82 }).toFile(raiz("public/logo-nc-400.webp"));

console.log("✓ favicon.ico, icon.png, apple-icon.png, og.jpg e logo-nc-400.webp gerados.");
