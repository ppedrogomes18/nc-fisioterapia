// Desenho que aparece quando a foto não existe ou não carrega: céu em luz
// quente, colinas em curvas orgânicas verdes, o traço fino dourado do logo e a
// meia-lua do "C". Determinístico (mesmo SVG no servidor e no navegador).

export type Cena = "manha" | "avaliacao" | "plano" | "sessoes" | "alta" | "tarde" | "noite" | "verde";

type Paleta = {
  ceu: [string, string, string];
  camadas: [string, string, string, string];
  lua: { x: number; y: number; r: number; cor: string; brilho: number };
  traco: string;
  semente: number;
  estrelas?: boolean;
};

const CENAS: Record<Cena, Paleta> = {
  manha: {
    ceu: ["#f1e8d4", "#e5d3ae", "#d3b885"],
    camadas: ["#b8b08a", "#8a8e66", "#5c6744", "#343d26"],
    lua: { x: 1190, y: 250, r: 118, cor: "#c9ae80", brilho: 0.55 },
    traco: "#b0905c",
    semente: 7,
  },
  avaliacao: {
    ceu: ["#f2eadb", "#e7d8bb", "#d9c39b"],
    camadas: ["#bdb592", "#929470", "#66704b", "#3a4429"],
    lua: { x: 560, y: 230, r: 96, cor: "#c9ae80", brilho: 0.45 },
    traco: "#b0905c",
    semente: 19,
  },
  plano: {
    ceu: ["#ece3cd", "#dccca6", "#c7ae80"],
    camadas: ["#a9a67f", "#808660", "#58633f", "#313a23"],
    lua: { x: 1110, y: 210, r: 104, cor: "#c9ae80", brilho: 0.5 },
    traco: "#a7864f",
    semente: 31,
  },
  sessoes: {
    ceu: ["#f4ecdc", "#eadcc0", "#dcc6a0"],
    camadas: ["#c3ba94", "#9b9b73", "#6d7650", "#414b2e"],
    lua: { x: 800, y: 210, r: 110, cor: "#cdb489", brilho: 0.5 },
    traco: "#b0905c",
    semente: 43,
  },
  alta: {
    ceu: ["#eddcbf", "#dcbf93", "#c59c6a"],
    camadas: ["#a08f68", "#77744f", "#505838", "#2e3623"],
    lua: { x: 1080, y: 320, r: 120, cor: "#e0c597", brilho: 0.6 },
    traco: "#c9ae80",
    semente: 59,
  },
  tarde: {
    ceu: ["#efe4cc", "#e1caa2", "#cbab7b"],
    camadas: ["#ada27c", "#83815b", "#5a603f", "#323a24"],
    lua: { x: 720, y: 260, r: 112, cor: "#d4ba8c", brilho: 0.55 },
    traco: "#b0905c",
    semente: 71,
  },
  noite: {
    ceu: ["#141811", "#1f251a", "#2c3422"],
    camadas: ["#39432e", "#2d3624", "#232a1b", "#181d13"],
    lua: { x: 1180, y: 230, r: 104, cor: "#c9ae80", brilho: 0.4 },
    traco: "#b0905c",
    semente: 83,
    estrelas: true,
  },
  verde: {
    ceu: ["#323b26", "#2a3220", "#232a1b"],
    camadas: ["#3d4731", "#343e29", "#2b3322", "#21281a"],
    lua: { x: 1220, y: 210, r: 90, cor: "#b0905c", brilho: 0.25 },
    traco: "#b0905c",
    semente: 97,
  },
};

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 900;
const f = (n: number) => n.toFixed(1);

/** Uma linha suave (Catmull-Rom → Bézier) de x=0 a x=W. */
function linha(seed: number, base: number, amp: number, n = 6) {
  const rnd = mulberry32(seed);
  const fase = rnd() * Math.PI * 2;
  const freq = 0.75 + rnd() * 0.5;
  const pts: [number, number][] = [];
  for (let i = -1; i <= n + 1; i++) {
    const y = base - amp * (0.62 * Math.sin(i * freq + fase) + 0.38 * Math.sin(i * freq * 2.1 + fase * 1.7));
    pts.push([(i / n) * W, y]);
  }
  let d = `M${f(pts[1][0])} ${f(pts[1][1])}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

const fechar = (d: string) => `${d} L${W} ${H} L0 ${H} Z`;

export function FallbackCurvas({ cena = "manha", id }: { cena?: Cena; id: string }) {
  const p = CENAS[cena];
  const s = p.semente;
  const l1 = linha(s + 1, 470, 46);
  const l2 = linha(s + 2, 560, 58);
  const l3 = linha(s + 3, 660, 52);
  const l4 = linha(s + 4, 770, 44);
  const rnd = mulberry32(s * 13);
  const estrelas = p.estrelas
    ? Array.from({ length: 46 }, () => ({ x: rnd() * W, y: rnd() * 420, r: 0.8 + rnd() * 1.6, o: 0.25 + rnd() * 0.55 }))
    : [];
  const { lua } = p;

  return (
    <svg className="nc-curvas" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-ceu`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.ceu[0]} />
          <stop offset="0.45" stopColor={p.ceu[1]} />
          <stop offset="0.8" stopColor={p.ceu[2]} />
        </linearGradient>
        <radialGradient id={`${id}-brilho`}>
          <stop offset="0" stopColor={lua.cor} stopOpacity={lua.brilho} />
          <stop offset="1" stopColor={lua.cor} stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-lua`}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={lua.x + lua.r * 0.42} cy={lua.y - lua.r * 0.16} r={lua.r * 0.9} fill="#000" />
        </mask>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-ceu)`} />
      {estrelas.map((e, k) => (
        <circle key={k} cx={f(e.x)} cy={f(e.y)} r={f(e.r)} fill="#e7d6b4" opacity={f(e.o)} />
      ))}
      <g className="nc-lua" data-lado={lua.x > 1000 ? "direita" : lua.x < 600 ? "esquerda" : "centro"}>
        <circle cx={lua.x} cy={lua.y} r={lua.r * 3.2} fill={`url(#${id}-brilho)`} />
        <circle cx={lua.x} cy={lua.y} r={lua.r} fill={lua.cor} mask={`url(#${id}-lua)`} />
      </g>
      <path d={fechar(l1)} fill={p.camadas[0]} opacity="0.8" />
      <path d={l1} fill="none" stroke={p.traco} strokeWidth="1.4" opacity="0.5" />
      <path d={fechar(l2)} fill={p.camadas[1]} opacity="0.92" />
      <path d={fechar(l3)} fill={p.camadas[2]} />
      <path d={l3} fill="none" stroke={p.traco} strokeWidth="1.6" opacity="0.55" />
      <path d={fechar(l4)} fill={p.camadas[3]} />
    </svg>
  );
}
