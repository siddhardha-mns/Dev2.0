/**
 * Whale shark easter egg (Rhincodon typus) with a calf, built from small glyph cells.
 *
 * - No React, no dependencies: one fixed, pointer-events:none canvas appended to <body> for the
 *   duration of a swim and removed afterwards. Lives outside React so a swim survives the
 *   client-side navigation the logo link triggers.
 * - The shape is a parametric model (thickness profile along a spine, fins, lunate tail, a
 *   staggered spot lattice on the back) rasterised ONCE into cells. Every frame those cells are
 *   moved as particles with sub-pixel positions: a travelling wave along the spine, each fin
 *   rotating on its own clock, the tail lagging and foreshortening. Nothing snaps.
 * - The calf is the same model rasterised at half resolution with the same cell size, so it is
 *   a chunkier, half-length copy that keeps pace just below and behind its parent.
 * - Deep ocean blue. Over `data-nav-theme="dark"` sections a lifted palette keeps it visible.
 *
 * Tune or disable everything in WHALE_SHARK_OPTIONS below.
 */

export type WhaleSharkOptions = {
  /** Master switch. */
  enabled: boolean;
  /** Swim speed multiplier (1 ≈ 16 s to cross a desktop screen, 12 s on phones). */
  speed: number;
  /** Size multiplier on the base length (≈ 26% of the viewport width, clamped). */
  size: number;
  /** Whether the baby whale shark swims along. */
  baby: boolean;
  /** 11 shades, darkest → lightest, used over light sections. Index 10 is the spots. */
  palette: readonly string[];
  /** Same, lifted so the shark stays visible over `data-nav-theme="dark"` sections. */
  paletteOnDark: readonly string[];
  /** Overlay stacking: above page content (z ≤ 20), below the nav (z-50) and dialogs. */
  zIndex: number;
  /** What summons the shark. "logo" = clicking the DevCatalyst logo; "manual" = only summonWhaleShark(). */
  trigger: "logo" | "manual";
};

export const WHALE_SHARK_OPTIONS: WhaleSharkOptions = {
  enabled: true,
  speed: 1,
  size: 1,
  baby: true,
  // Deep ocean blue: abyss → navy → open water → foam.
  palette: [
    "#020a18", "#06162e", "#0a2244", "#0f2f5c", "#153e75", "#1d4f8f",
    "#2b65a8", "#4a85c0", "#7aa9d6", "#b3cfe8", "#f4f9fe",
  ],
  paletteOnDark: [
    "#0d2a54", "#12376b", "#184581", "#1f5396", "#2862aa", "#3573bb",
    "#4a87c9", "#689fd6", "#8fb9e2", "#bcd6ee", "#f4f9fe",
  ],
  zIndex: 40,
  trigger: "logo",
};

/* ─────────────────────────── maths helpers ─────────────────────────── */

const TAU = Math.PI * 2;
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const hash2 = (a: number, b: number) => {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const fract = (x: number) => x - Math.floor(x);
const mod4 = (n: number) => ((n % 4) + 4) % 4;

/* ─────────────────────────── the model (rest pose) ─────────────────────────── */
/* Model space: X = units behind the nose (0 → tail), Y = units downward. The adult is
   rasterised at 1 unit per cell, the calf at CALF_Q units per cell. */

const L = 60; // body length in model units (nose → caudal peduncle ≈ 0.955 L)
const S_END = 0.955;
const BOX = { x0: -1, x1: 76, y0: -19, y1: 17 }; // rest-pose bounds incl. fins & tail
const CALF_Q = 2;

const enum Mat { Body, Belly, Spot, Ring, Eye, Mouth, Gill, Fin, FinEdge }

/** Glyphs (swimming-right frame; mirrored when swimming left). */
const GLYPHS = "#@%+=*:.-,o_)(\\/|!~'";
const G = (s: string) => Array.from(s, (c) => GLYPHS.indexOf(c));
const SET_DARK = G("#@%#");
const SET_MID = G("+=*#");
const SET_LIGHT = G("+*:=");
const SET_BELLY = G(".:-,");
const SET_RING = G("=-~=");
const MIRROR: Record<string, string> = { "/": "\\", "\\": "/", "(": ")", ")": "(" };
const GLYPH_MIRROR = Array.from(GLYPHS, (c) => GLYPHS.indexOf(MIRROR[c] ?? c));

/** Back contour (units above the spine): flat broad head rising to the hump, long taper. */
function topH(s: number) {
  if (s < 0.4) return 2.7 + 4.5 * smooth(0, 0.4, s);
  const u = (s - 0.4) / (S_END - 0.4);
  return 1.0 + 6.2 * Math.pow(1 - u, 1.45);
}
/** Belly contour (units below the spine): deep mouth, flatter belly. */
function botH(s: number) {
  if (s < 0.3) return 3.3 + 2.5 * smooth(0, 0.3, s);
  const u = (s - 0.3) / (S_END - 0.3);
  return 0.95 + 4.85 * Math.pow(1 - u, 1.2);
}
/** Blunt, truncated snout: round only the very front. */
const snout = (s: number) => {
  const k = 1 - Math.min(1, s / 0.022);
  return Math.sqrt(1 - k * k);
};
const contourY = (s: number, v: number) => (v < 0 ? v * topH(s) : v * botH(s));

/**
 * The iconic spotted back, fixed to the cell lattice so every spot is exactly one cell:
 * large spots on a staggered (diamond) lattice, smaller ones in between, and a dense
 * scatter of small spots on the head. Returns 0 = none, 1 = large, 2 = small.
 */
function spotAt(gi: number, gj: number, head: boolean): number {
  if (head) return ((gi + gj) & 1) === 0 && hash2(gi + 9, gj + 2) < 0.72 ? 2 : 0;
  const stagger = (Math.floor(gj / 2) & 1) * 2;
  if ((gj & 1) === 0) return mod4(gi - stagger) === 0 && hash2(gi + 21, gj * 3) < 0.95 ? 1 : 0;
  return mod4(gi - stagger - 1) === 0 && hash2(gi + 2, gj + 40) < 0.65 ? 2 : 0;
}

type Fin = {
  /** Root (pivot) in model space. */
  x: number; y: number;
  ax: number; ay: number; cx: number; cy: number;
  H: number; C: number; sw: number; tip: number; conc: number;
  base: number; glyph: number; spots: boolean;
  /** Animation: rotation amplitude (rad), clock rate relative to the tail beat, phase. */
  amp: number; rate: number; phase: number; tail: boolean;
};

function fin(
  s: number, v: number, theta: number, up: boolean, H: number, C: number, sw: number, tip: number,
  conc: number, base: number, glyph: string, spots: boolean, amp: number, rate: number, phase: number, tail = false,
): Fin {
  const ax = Math.cos(theta), ay = Math.sin(theta);
  return {
    x: s * L - (tail ? 0.6 : 0), y: contourY(s, v) + (tail ? (up ? -0.3 : 0.3) : 0),
    ax, ay, cx: up ? ay : -ay, cy: up ? -ax : ax, // chord axis, pointing toward the nose
    H, C, sw, tip, conc, base, glyph: GLYPHS.indexOf(glyph), spots, amp, rate, phase, tail,
  };
}

const FINS: Fin[] = [
  // Caudal fin: crescent, upper lobe much longer than the lower.
  fin(S_END - 0.004, 0, -Math.PI / 2 + 0.78, true, 15.5, 5.0, 0.3, 0.6, 1, 1.9, "\\", true, 0, 1, 0, true),
  fin(S_END - 0.004, 0, Math.PI / 2 - 0.95, false, 11.5, 4.8, 0.3, 0.6, 1, 1.8, "/", true, 0, 1, 0, true),
  // First dorsal (raked back), second dorsal.
  fin(0.47, -0.88, -Math.PI / 2 + 0.52, true, 8.6, 8.0, 0.42, 0.7, 0.6, 2.0, "\\", true, 0.06, 1, -2.1),
  fin(0.8, -0.85, -Math.PI / 2 + 0.62, true, 2.8, 3.0, 0.35, 0.4, 0.4, 2.1, "\\", false, 0.09, 1, -3.0),
  // Pectoral: broad and swept, slow flap on its own clock.
  fin(0.255, 0.5, Math.PI / 2 - 0.5, false, 10.5, 8.2, 0.62, 1.4, 0.7, 2.4, "/", true, 0.16, 0.5, 0.8),
  // Pelvic and anal fins.
  fin(0.62, 0.86, Math.PI / 2 - 0.85, false, 3.5, 3.4, 0.35, 0.4, 0.5, 2.4, "/", false, 0.12, 1, 2.0),
  fin(0.81, 0.86, Math.PI / 2 - 0.9, false, 2.4, 2.5, 0.35, 0.35, 0.4, 2.2, "/", false, 0.12, 1, 2.7),
];

/** Result of the last sample call. */
const R = { lvl: 0, mat: Mat.Body as Mat, g: 0 };
const pick = (set: number[], X: number, Y: number) => set[(hash2(Math.round(X), Math.round(Y) + 911) * set.length) | 0];

/** Is (X, Y) inside fin F? Writes shading into R when `shade` is set. `q` = units per cell. */
function sampleFin(F: Fin, X: number, Y: number, shade: boolean, q: number): boolean {
  const dx = X - F.x, dy = Y - F.y;
  const t = (dx * F.ax + dy * F.ay) / F.H;
  if (t < -0.08 || t > 1) return false;
  const tc = clamp(t, 0, 1);
  const w = dx * F.cx + dy * F.cy;
  const centre = -F.sw * F.H * t;
  const width = F.C * Math.pow(1 - tc, 0.85) + F.tip * t;
  const lead = centre + width * 0.5;
  const trail = centre - width * 0.5 + F.conc * F.C * 0.35 * Math.sin(Math.PI * tc);
  if (w < trail || w > lead) return false;
  if (!shade) return true;
  const fa = (lead - w) / (lead - trail + 1e-6); // 0 at the leading edge
  const ray = fract(fa * 2.6 + t * 1.3);
  let lvl = F.base, mat = Mat.Fin;
  if (fa < 0.2) { lvl += 1.6; mat = Mat.FinEdge; }
  else if (fa > 0.88) lvl -= 0.5;
  if (ray < 0.3) lvl += 0.6;
  lvl -= 0.5 * smooth(0.6, 1, t);
  if (F.spots && fa > 0.2) {
    const gi = Math.floor(X / q), gj = Math.floor(Y / q);
    if (spotAt(gi, gj, false) && hash2(gi + 3, gj + 17) < 0.75) { lvl = 9; mat = Mat.Spot; }
  }
  R.lvl = lvl;
  R.mat = mat;
  R.g = ray < 0.5 ? F.glyph : GLYPHS.indexOf(":");
  return true;
}

/** Is (X, Y) inside the body? Writes shading into R when `shade` is set. `q` = units per cell. */
function sampleBody(X: number, Y: number, shade: boolean, q: number): boolean {
  const s = X / L;
  if (s < 0 || s > S_END) return false;
  const th = topH(s), bh = botH(s), rf = snout(s);
  const v = Y < 0 ? Y / (th * rf) : Y / (bh * rf);
  if (v < -1 || v > 1) return false;
  if (!shade) return true;

  // Counter-shading: dark back, pale belly, with a ragged boundary like the real animal.
  const vb = 0.3 + 0.09 * Math.sin(X * 0.8 + 1.3) + 0.1 * (hash2(Math.round(X), 7) - 0.5) - 0.12 * smooth(0.75, 1, s);
  let lvl: number, mat: Mat;
  if (v > vb) {
    lvl = 8.2 - 1.6 * smooth(0.5, 1, v) - 0.8 * smooth(0.7, 1, s);
    mat = Mat.Belly;
  } else {
    lvl = 1.2 + 1.9 * smooth(-1, vb, v) - 0.4 * smooth(0.72, 1, s);
    mat = Mat.Body;
    if (v < -0.8) lvl += 0.7; // light catching the ridge of the back
    if (s > 0.02 && s < 0.94 && v < vb - 0.1) {
      const spot = spotAt(Math.floor(X / q), Math.floor(Y / q), s < 0.16);
      if (spot) { lvl = spot === 1 && s < 0.8 ? 10 : 9; mat = Mat.Spot; }
    }
  }

  // Features override the pattern. Thicknesses scale with q so they survive at calf resolution.
  if (X > 0.2 && X < 5.4 && Math.abs(Y - (0.32 * bh + 0.06 * X)) < 0.48 * q) { lvl = 0; mat = Mat.Mouth; }
  const de = Math.hypot(X - 5.6, Y + 0.35);
  if (de < 0.62 * q) { lvl = 0; mat = Mat.Eye; }
  else if (de < 1.45 * q) { lvl = 7; mat = Mat.Ring; }
  const slits = q > 1.5 ? 3 : 5;
  for (let i = 0; i < slits; i++) {
    if (v > -0.55 && v < 0.5 && Math.abs(X - (9.6 + i * 1.9 * q) - 0.6 * v) < 0.4 * q) { lvl = mat === Mat.Belly ? 3 : 6; mat = Mat.Gill; break; }
  }

  R.lvl = lvl;
  R.mat = mat;
  switch (mat) {
    case Mat.Belly: R.g = pick(SET_BELLY, X, Y); break;
    case Mat.Ring: R.g = pick(SET_RING, X, Y); break;
    case Mat.Eye: R.g = GLYPHS.indexOf("@"); break;
    case Mat.Mouth: R.g = GLYPHS.indexOf("_"); break;
    case Mat.Gill: R.g = GLYPHS.indexOf(")"); break;
    default: R.g = pick(lvl < 2.6 ? SET_DARK : lvl < 4 ? SET_MID : SET_LIGHT, X, Y);
  }
  return true;
}

/** One cell of a rasterised shark; animated as a particle. Positions are in cells. */
type Cell = {
  /** Rest position relative to the nose. For fin cells, the offset from the fin root instead. */
  x: number; y: number;
  lvl: number; g: number;
  /** 0 = none, 1 = large pale spot, 2 = small one. Spots are drawn inset into a dark skin cell. */
  spot: number;
  /** Stable 0..1 hash used for the edge dissolve. */
  h: number;
};

const SUB = [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]] as const;

/** Rasterise the rest pose once at `q` model units per cell: body cells + one list per fin. */
function buildCells(q: number): { body: Cell[]; fins: Cell[][] } {
  const body: Cell[] = [], fins: Cell[][] = FINS.map(() => []);
  const cell = (x: number, y: number, h: number): Cell => {
    const spot = R.mat === Mat.Spot ? (R.lvl >= 10 ? 1 : 2) : 0;
    return { x, y, lvl: spot ? 2 : clamp(Math.round(R.lvl), 0, 10), g: R.g, spot, h };
  };
  const covered = (test: (x: number, y: number, shade: boolean) => boolean, X: number, Y: number) => {
    let n = 0;
    for (const [sx, sy] of SUB) if (test(X + sx * q, Y + sy * q, false)) n++;
    if (test(X, Y, true)) return true;
    if (n < 2) return false;
    for (const [sx, sy] of SUB) if (test(X + sx * q, Y + sy * q, true)) return true;
    return false;
  };
  for (let j = Math.floor(BOX.y0 / q); j < Math.ceil(BOX.y1 / q); j++) {
    for (let i = Math.floor(BOX.x0 / q); i < Math.ceil(BOX.x1 / q); i++) {
      const X = (i + 0.5) * q, Y = (j + 0.5) * q, h = hash2(i + 300, j + 700);
      if (covered((x, y, shade) => sampleBody(x, y, shade, q), X, Y)) body.push(cell(X / q, Y / q, h));
      for (let f = FINS.length - 1; f >= 0; f--) {
        const F = FINS[f];
        if (!covered((x, y, shade) => sampleFin(F, x, y, shade, q), X, Y)) continue;
        fins[f].push(cell((X - F.x) / q, (Y - F.y) / q, h));
        break;
      }
    }
  }
  return { body, fins };
}

/* ─────────────────────────── motion ─────────────────────────── */

const BEAT = TAU / 2.6; // adult tail-beat angular speed (one beat ≈ 2.6 s)
const WAVE_K = TAU * 0.8; // body wave number
/** Travelling wave along the spine (model units): head almost still, tail swings widest. */
const wave = (s: number, ph: number) => (0.14 + 1.5 * Math.pow(s, 2.3)) * Math.sin(WAVE_K * s - ph);

/** A rasterised shark plus its per-frame fin transforms (a, b, c, d, e, f in CSS px, per fin). */
type Creature = { q: number; amp: number; body: Cell[]; fins: Cell[][]; finM: Float64Array };
const makeCreature = (q: number, amp: number): Creature => ({ q, amp, ...buildCells(q), finM: new Float64Array(FINS.length * 6) });

/* ─────────────────────────── the overlay ─────────────────────────── */

type Particle = { x: number; y: number; age: number; life: number; g: string; vy: number; p: number };

const FONT = 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace';
const MIN_FRAME_MS = 12; // caps at ~60 fps on 120/144 Hz displays
const BUBBLE_GLYPHS = ["o", "O", "o", "°", "."];
const TRAIL_GLYPHS = [".", ":", "'", "`", ",", "-", "~"];

type Swim = { stop: () => void };
let active: Swim | null = null;

const reducedMotion = () =>
  typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Summon one swim. Returns false when disabled, already swimming, or reduced motion is on. */
export function summonWhaleShark(overrides: Partial<WhaleSharkOptions> = {}): boolean {
  const o = { ...WHALE_SHARK_OPTIONS, ...overrides };
  if (!o.enabled || active || typeof document === "undefined" || reducedMotion()) return false;
  active = startSwim(o);
  return true;
}

/** Called by the logo: only swims when the configured trigger matches. */
export function triggerWhaleShark(source: WhaleSharkOptions["trigger"]): boolean {
  return WHALE_SHARK_OPTIONS.trigger === source && summonWhaleShark();
}

export function stopWhaleShark() {
  active?.stop();
}

function startSwim(o: WhaleSharkOptions): Swim {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let vw = window.innerWidth, vh = window.innerHeight;
  const phone = vw < 640;

  // Cell size snaps to whole device pixels so the sprites stay sharp.
  const lengthPx = clamp(vw * (phone ? 0.6 : 0.26) * o.size, 190, 400);
  const cellD = Math.max(3, Math.round((lengthPx / L) * dpr));
  const cs = cellD / dpr;
  const drawGlyphs = cellD >= 8;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.whaleShark = "";
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100vw", height: "100vh",
    pointerEvents: "none", zIndex: String(o.zIndex), userSelect: "none",
  } satisfies Partial<CSSStyleDeclaration>);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { stop: () => { active = null; } };

  const sizeCanvas = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.ceil(vw * dpr);
    canvas.height = Math.ceil(vh * dpr);
  };
  sizeCanvas();
  document.body.appendChild(canvas);

  /* Cell sprites: inset rounded square + glyph, cached per (palette, level, glyph). */
  const palettes = [o.palette, o.paletteOnDark]; // [light sections, dark sections]
  const DOT = GLYPHS.length; // pseudo-glyphs: DOT = large spot, DOT + 1 = small spot
  const sprites = new Map<number, HTMLCanvasElement>();
  const gap = Math.max(1, Math.round(cellD * 0.1));
  const sprite = (set: number, lvl: number, g: number) => {
    const key = (set * 16 + lvl) * 64 + g;
    let s = sprites.get(key);
    if (s) return s;
    const pal = palettes[set];
    s = document.createElement("canvas");
    s.width = s.height = cellD;
    const c = s.getContext("2d")!;
    // Grout in the page colour, so the cells stay legible over dark text and artwork.
    c.fillStyle = set === 0 ? "rgba(231,231,229,0.85)" : "rgba(20,20,20,0.85)";
    c.fillRect(0, 0, cellD, cellD);
    c.fillStyle = pal[lvl];
    const inner = cellD - gap;
    c.beginPath();
    if (c.roundRect) c.roundRect(gap / 2, gap / 2, inner, inner, Math.max(0.5, cellD * 0.1));
    else c.rect(gap / 2, gap / 2, inner, inner);
    c.fill();
    if (g >= DOT) {
      // A pale square set into the dark skin cell, so spots never read as holes.
      const d = Math.max(2, Math.round(cellD * (g === DOT ? 0.6 : 0.42)));
      c.fillStyle = pal[10];
      c.fillRect(Math.round((cellD - d) / 2), Math.round((cellD - d) / 2), d, d);
    } else if (drawGlyphs) {
      c.fillStyle = lvl >= 6 ? pal[Math.max(0, lvl - 5)] : pal[Math.min(9, lvl + 5)];
      c.font = `700 ${Math.round(cellD * 0.7)}px ${FONT}`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(GLYPHS[g], cellD / 2, cellD / 2 + cellD * 0.04);
    }
    sprites.set(key, s);
    return s;
  };

  const adult = makeCreature(1, 1);
  const calf = o.baby ? makeCreature(CALF_Q, 1.25) : null;

  /* Swim path. */
  const dir = Math.random() < 0.5 ? 1 : -1; // +1 = left → right
  const duration = (phone ? 12 : 16) / Math.max(0.1, o.speed);
  const margin = 3 * cs;
  const below = calf ? 28 : BOX.y1; // cells the group extends below the adult's spine
  const minY = -BOX.y0 * cs + 16, maxY = () => Math.max(minY, vh - below * cs - 16);
  const yFrac = 0.2 + Math.random() * 0.45;
  const ySlope = (Math.random() - 0.5) * 0.12;
  const wobPh = Math.random() * TAU, wobW = 0.42, wobA = () => vh * 0.03;
  const calfPh = [Math.random() * TAU, Math.random() * TAU];
  let elapsed = 0;
  let t = Math.random() * 10;

  const travel = () => vw + (BOX.x1 + 2) * cs + margin;
  const headX = () => (dir === 1 ? -margin + (elapsed / duration) * travel() : vw + margin - (elapsed / duration) * travel());
  const headY = () => clamp(vh * (yFrac + ySlope * (elapsed / duration - 0.5)) + wobA() * Math.sin(wobPh + t * wobW), minY, maxY());

  const trail: Particle[] = [];
  const bubbles: Particle[] = [];
  let bubbleIn = 1;

  const edgeBand = () => Math.min(vw * 0.14, 180);
  const reveal = (x: number) => {
    const b = edgeBand();
    return smooth(-cs, b, x) * smooth(-cs, b, vw - x);
  };

  /* Theme under the shark: switch palette over dark sections, like the nav does. */
  let inv = 0, invTarget = 0, themeIn = 0;
  const probeTheme = (x: number, y: number) => {
    const layers = document.elementsFromPoint(clamp(x, 1, vw - 1), clamp(y, 1, vh - 1));
    invTarget = layers.some((el) => el.closest<HTMLElement>("[data-nav-theme]")?.dataset.navTheme === "dark") ? 1 : 0;
  };

  const drawGrid = (cx: number, cy: number, rx: number, ry: number, alpha: number) => {
    if (alpha <= 0.01) return;
    const pitch = Math.max(4, Math.round(cs));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = inv > 0.5 ? "rgba(143,185,226,0.12)" : "rgba(15,47,92,0.11)";
    ctx.lineWidth = 1 / dpr;
    ctx.beginPath();
    const off = 0.5 / dpr;
    for (let x = Math.floor((cx - rx) / pitch) * pitch; x <= cx + rx; x += pitch) { ctx.moveTo(x + off, cy - ry); ctx.lineTo(x + off, cy + ry); }
    for (let y = Math.floor((cy - ry) / pitch) * pitch; y <= cy + ry; y += pitch) { ctx.moveTo(cx - rx, y + off); ctx.lineTo(cx + rx, y + off); }
    ctx.stroke();
    // Feather the grid into an ellipse around the sharks: no rectangular box.
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "destination-in";
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, "rgba(0,0,0,1)");
    gr.addColorStop(0.5, "rgba(0,0,0,0.5)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  };

  const drawParticles = (list: Particle[], bubble: boolean) => {
    ctx.fillStyle = inv > 0.5 ? palettes[1][8] : palettes[0][3];
    ctx.font = `700 ${Math.max(8, Math.round(cs * (bubble ? 1.7 : 1.1)))}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const q of list) {
      const k = q.age / q.life;
      const a = (bubble ? Math.min(1, q.age * 2.5) * (1 - k * k) : 1 - k) * reveal(q.x);
      if (a <= 0.02) continue;
      if (bubble) {
        ctx.globalAlpha = a * 0.75;
        ctx.fillText(BUBBLE_GLYPHS[Math.min(4, (k * 5) | 0)], q.x, q.y);
      } else {
        const sz = cs * (0.7 - 0.4 * k);
        ctx.globalAlpha = a * 0.6;
        ctx.fillRect(q.x - sz / 2, q.y - sz / 2, sz, sz);
        if (drawGlyphs) {
          ctx.globalAlpha = a * 0.5;
          ctx.fillText(q.g, q.x - dir * cs * 1.4, q.y + q.p * cs);
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  /** Draw one cell at lattice position (u, v) in the current transform (1 unit = 1 cell). */
  const drawCell = (c: Cell, u: number, v: number, a: number) => {
    const s = 0.45 + 0.55 * a; // cells grow in as they dissolve in
    const g = c.spot ? DOT + c.spot - 1 : dir === 1 ? c.g : GLYPH_MIRROR[c.g];
    if (inv < 1) {
      ctx.globalAlpha = a;
      ctx.drawImage(sprite(0, c.lvl, g), u - s / 2, v - s / 2, s, s);
    }
    if (inv > 0.01) {
      ctx.globalAlpha = a * inv;
      ctx.drawImage(sprite(1, c.lvl, g), u - s / 2, v - s / 2, s, s);
    }
  };
  /** Per-cell fade threshold for the dissolve at the screen edges. */
  const cellAlpha = (px: number, h: number) => (px < -cs || px > vw + cs ? 0 : clamp((reveal(px) * 1.3 - h) / 0.3, 0, 1));

  /**
   * Draw one shark with its nose at (hx, hy). Cells are moved, never re-rasterised:
   * body columns ride the travelling wave; each fin lattice rotates rigidly about its root
   * on its own clock; the tail lags the peduncle and foreshortens as it sweeps side to side.
   */
  const drawCreature = (C: Creature, hx: number, hy: number, ph: number, pitch: number) => {
    const k = C.amp / C.q; // wave: model units → cells
    const sp = S_END - 0.004;
    const slope = (C.amp * (wave(sp, ph) - wave(sp - 0.03, ph))) / (0.03 * L);
    const lag = ph - 0.9;
    const M = C.finM;
    for (let f = 0; f < FINS.length; f++) {
      const F = FINS[f];
      const delta = (F.tail ? Math.atan(slope) * 0.85 + 0.12 * Math.sin(lag) : F.amp * Math.sin(ph * F.rate + F.phase)) + pitch;
      const kx = F.tail ? 0.86 + 0.14 * Math.cos(2 * lag) : 1;
      const cos = Math.cos(delta), sin = Math.sin(delta), m = f * 6, fx = F.x / C.q;
      M[m] = cs * kx * cos;
      M[m + 1] = -dir * cs * kx * sin;
      M[m + 2] = dir * cs * sin;
      M[m + 3] = cs * cos;
      M[m + 4] = hx - dir * cs * fx;
      M[m + 5] = hy + cs * (F.y / C.q + wave(clamp(F.x / L, 0, 1), ph) * k + pitch * fx);
    }
    ctx.setTransform(cs * dpr, 0, 0, cs * dpr, hx * dpr, hy * dpr);
    for (let n = 0; n < C.body.length; n++) {
      const c = C.body[n];
      const u = -dir * c.x;
      const a = cellAlpha(hx + u * cs, c.h);
      if (a > 0.01) drawCell(c, u, c.y + wave((c.x * C.q) / L, ph) * k + pitch * c.x, a);
    }
    for (let f = 0; f < FINS.length; f++) {
      const m = f * 6, list = C.fins[f];
      ctx.setTransform(M[m] * dpr, M[m + 1] * dpr, M[m + 2] * dpr, M[m + 3] * dpr, M[m + 4] * dpr, M[m + 5] * dpr);
      for (let n = 0; n < list.length; n++) {
        const c = list[n];
        const u = -dir * c.x;
        const a = cellAlpha(M[m + 4] + M[m] * u + M[m + 2] * c.y, c.h);
        if (a > 0.01) drawCell(c, u, c.y, a);
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  };

  const render = (dt: number) => {
    const ph = BEAT * t;
    const hx = headX(), hy = headY();
    // Pitch: nose up while rising, down while sinking (a gentle shear, so cells stay square).
    const speedPx = travel() / duration;
    const pitch = clamp((-wobA() * wobW * Math.cos(wobPh + t * wobW)) / speedPx, -0.05, 0.05);

    themeIn -= dt;
    if (themeIn <= 0) { themeIn = 0.25; probeTheme(hx - dir * 30 * cs, hy); }
    inv += clamp(invTarget - inv, -dt * 4, dt * 4);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);

    // Faint grid behind the sharks.
    const gcx = hx - dir * 36 * cs;
    drawGrid(gcx, hy + (calf ? 4 : -1) * cs, 46 * cs, (calf ? 29 : 24) * cs, reveal(gcx));

    // Trail of small characters shed from the tail; it stays in the water.
    for (let i = trail.length - 1; i >= 0; i--) {
      const q = trail[i];
      q.age += dt;
      q.y += q.vy * dt;
      if (q.age >= q.life) trail.splice(i, 1);
    }
    drawParticles(trail, false);

    // The calf keeps station below and behind the pectoral fin, drifting a little on its own
    // and beating its tail faster than its parent.
    if (calf) {
      const cx = hx - dir * (29 + 2.2 * Math.sin(t * 0.55 + calfPh[0])) * cs;
      const cy = hy + (18.5 + 1.6 * Math.sin(t * 0.8 + calfPh[1])) * cs;
      const calfPitch = clamp(pitch + 0.03 * Math.cos(t * 0.8 + calfPh[1]), -0.07, 0.07);
      drawCreature(calf, cx, cy, BEAT * 1.7 * t + 1.3, calfPitch);
    }
    drawCreature(adult, hx, hy, ph, pitch);

    if (elapsed < duration) {
      // Shed trail particles from the outer part of the adult's tail lobes.
      if (Math.random() < dt * 34) {
        const f = Math.random() < 0.6 ? 0 : 1, m = f * 6, M = adult.finM;
        const c = adult.fins[f][(Math.random() * adult.fins[f].length) | 0];
        if (Math.hypot(c.x, c.y) > 5) {
          const u = -dir * c.x;
          trail.push({
            x: M[m + 4] + M[m] * u + M[m + 2] * c.y - dir * cs,
            y: M[m + 5] + M[m + 1] * u + M[m + 3] * c.y,
            age: 0, life: 0.8 + Math.random() * 1, g: TRAIL_GLYPHS[(Math.random() * TRAIL_GLYPHS.length) | 0],
            vy: -cs * 0.4, p: Math.random() * 2 - 1,
          });
        }
      }
      // Bubbles: released near the gills, they rise and wobble where they were left.
      bubbleIn -= dt;
      if (bubbleIn <= 0) {
        bubbleIn = 1.2 + Math.random() * 2;
        const bx = hx - dir * (6 + Math.random() * 8) * cs, by = hy - (3 + Math.random() * 3) * cs;
        if (reveal(bx) > 0.5) {
          for (let n = 1 + ((Math.random() * 3) | 0); n--;) {
            bubbles.push({ x: bx + (Math.random() - 0.5) * cs * 4, y: by - n * cs * 2, age: 0, life: 3 + Math.random() * 2.5, g: "o", vy: -cs * (2 + Math.random() * 1.5), p: Math.random() * TAU });
          }
        }
      }
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.age += dt;
      b.y += b.vy * dt * (1 + b.age * 0.3);
      b.x += Math.sin(b.age * 1.8 + b.p) * cs * 1.4 * dt;
      if (b.age >= b.life || b.y < -cs * 2) bubbles.splice(i, 1);
    }
    drawParticles(bubbles, true);
  };

  /* Loop: every display frame up to ~60 fps, paused while the tab is hidden. */
  let raf = 0, last = performance.now(), stopped = false;
  const frame = (now: number) => {
    raf = 0;
    const ms = now - last;
    if (ms >= MIN_FRAME_MS) {
      last = now;
      const dt = Math.min(0.05, ms / 1000);
      elapsed += dt;
      t += dt;
      render(dt);
      if (elapsed >= duration && trail.length === 0 && bubbles.length === 0) return stop();
    }
    raf = requestAnimationFrame(frame);
  };
  const onVisibility = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else if (!stopped && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const onResize = () => sizeCanvas();
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotion = () => { if (mq.matches) stop(); };

  function stop() {
    if (stopped) return;
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", onResize);
    mq.removeEventListener("change", onMotion);
    canvas.remove();
    sprites.clear();
    trail.length = bubbles.length = 0;
    active = null;
  }

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", onResize, { passive: true });
  mq.addEventListener("change", onMotion);
  if (!document.hidden) raf = requestAnimationFrame(frame);
  return { stop };
}
