/**
 * CitySkyline — procedurally generated, realistic city buildings rendered
 * as SVG, inspired by the Durham skyline in the Fighting Chance flyers.
 *
 * Realism features, all deterministic (seeded PRNG — identical every render):
 *   - Vertical gradient facades (sun-lit face -> shaded face) + defined
 *     silhouette outline so buildings pop off the background
 *   - Floor ledges (horizontal shadow lines every few floors)
 *   - Molded cornices and parapets, spires with red beacons, water towers
 *     on legs, rooftop HVAC/setback boxes
 *   - Two window styles: punched-grid and curtain-wall columns, with
 *     occasional fully-lit floors and rare red-lit windows
 *   - Street-level band with storefront glow on the closest row
 *
 * Depth profiles:
 *   - 'back':  distant towers — thin, tall, hazy
 *   - 'mid':   mid-ground blocks — most detail lives here
 *   - 'front': dark rooftop row closest to the viewer
 *
 * Tones:
 *   - 'dark':  near-black buildings for dark hero/footer backgrounds
 *   - 'light': soft gray silhouettes for white sections of the page body
 *
 * Drawn in a 1200 x 320 viewBox anchored to the bottom edge.
 */

const VIEW_W = 1200;
const VIEW_H = 320;

/** Deterministic PRNG so the skyline never changes between renders. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = {
  dark: {
    base: ['#1e1e22', '#242428', '#1a1a1e', '#2a2a2f'],
    shade: ['#101012', '#121214', '#0d0d0f', '#16161a'],
    outline: 'rgba(0,0,0,0.6)',
    edge: 'rgba(255,255,255,0.14)',
    windowLit: '#f0e8d8',
    windowDim: '#55555a',
    ground: '#0a0a0c',
    groundGlow: 'rgba(240,190,100,0.6)',
    metal: '#333338',
  },
  light: {
    base: ['#e3e3df', '#dcdcd8', '#e9e7e3', '#d4d4d0'],
    shade: ['#c7c7c3', '#bfbfbb', '#cbcac6', '#b3b3af'],
    outline: 'rgba(120,120,116,0.35)',
    edge: 'rgba(255,255,255,0.8)',
    windowLit: '#9a9a95',
    windowDim: '#b5b5b0',
    ground: '#adada9',
    groundGlow: 'rgba(200,16,46,0.22)',
    metal: '#b8b8b4',
  },
};

const PROFILES = {
  back: {
    minW: 30, maxW: 62, minH: 190, maxH: 315, gapMin: 2, gapMax: 14,
    litChance: 0.4, tierChance: 0.4, parapetChance: 0.55,
    spireChance: 0.42, waterTowerChance: 0.04, hvacChance: 0.08,
    cols: 3, rowH: 10, groundFloor: false,
  },
  mid: {
    minW: 50, maxW: 110, minH: 130, maxH: 260, gapMin: 10, gapMax: 44,
    litChance: 0.48, tierChance: 0.5, parapetChance: 0.7,
    spireChance: 0.16, waterTowerChance: 0.26, hvacChance: 0.36,
    cols: 4, rowH: 13, groundFloor: false,
  },
  front: {
    minW: 76, maxW: 148, minH: 64, maxH: 148, gapMin: 12, gapMax: 52,
    litChance: 0.5, tierChance: 0.12, parapetChance: 0.75,
    spireChance: 0.05, waterTowerChance: 0.2, hvacChance: 0.45,
    cols: 5, rowH: 14, groundFloor: true,
  },
};

const RED = '#c8102e';

/**
 * Unique gradient id per tone so multiple skylines on one page don't
 * collide (SVG gradient ids are document-global).
 */
let gradSeq = 0;

/**
 * Per-building vertical gradient facade: lit near the top-left, shading
 * toward the base/right. Far more convincing than a flat fill.
 */
function facadeDefs(pal, uid) {
  const id = `fc-facade-${uid}-${gradSeq++}`;
  return {
    id,
    el: (
      <linearGradient id={id} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor={pal.base[0]} />
        <stop offset="1" stopColor={pal.shade[0]} />
      </linearGradient>
    ),
  };
}

/** Window grid for one facade area — returns an array of <rect> elements. */
function windows({ x, y, w, h, cols, rowH, litChance, pal, rand, allowRed }) {
  const rects = [];
  const rows = Math.max(1, Math.floor(h / rowH));
  const cellH = h / rows;
  const cellW = w / cols;
  const padX = cellW * 0.26;
  const padY = cellH * 0.3;
  const winW = Math.max(1.4, cellW - padX * 2);
  const winH = Math.max(1.6, cellH - padY * 2);

  for (let r = 0; r < rows; r += 1) {
    const floorLit = rand() < 0.06; // fully-lit floor = lobby/hallway
    for (let c = 0; c < cols; c += 1) {
      const lit = floorLit || rand() >= litChance;
      if (!lit) continue;
      const redWin = allowRed && !floorLit && rand() < 0.045;
      rects.push(
        <rect
          key={`w${r}-${c}`}
          x={+(x + c * cellW + padX).toFixed(1)}
          y={+(y + r * cellH + padY).toFixed(1)}
          width={+winW.toFixed(1)}
          height={+winH.toFixed(1)}
          fill={redWin ? RED : rand() < 0.22 ? pal.windowLit : pal.windowDim}
          opacity={redWin ? 0.9 : rand() < 0.5 ? 0.7 : 0.95}
        />
      );
    }
  }
  return rects;
}

/** Vertical curtain-wall window columns (sleek modern tower style). */
function windowColumns({ x, y, w, h, pal, rand, litChance }) {
  const rects = [];
  const colW = Math.max(3, w * 0.14);
  const n = Math.max(2, Math.floor(w / (colW * 1.9)));
  const margin = (w - n * colW) / (n + 1);
  const rows = Math.max(2, Math.floor(h / 16));
  for (let c = 0; c < n; c += 1) {
    const cx = x + margin + c * (colW + margin);
    for (let r = 0; r < rows; r += 1) {
      if (rand() >= litChance) continue;
      rects.push(
        <rect
          key={`c${c}-${r}`}
          x={+cx.toFixed(1)}
          y={+(y + r * (h / rows) + 2).toFixed(1)}
          width={+colW.toFixed(1)}
          height={+(h / rows - 5).toFixed(1)}
          fill={rand() < 0.25 ? pal.windowLit : pal.windowDim}
          opacity={0.8}
        />
      );
    }
  }
  return rects;
}

/** Water tower: tapered tank on legs. */
function waterTower(cx, topY, s, pal, key) {
  const tw = 12 * s;
  const th = 13 * s;
  const legH = 7 * s;
  return (
    <g key={key}>
      <rect x={+(cx - 1).toFixed(1)} y={+(topY - legH).toFixed(1)} width={2} height={+legH.toFixed(1)} fill={pal.metal} />
      <rect x={+(cx + tw - 11).toFixed(1)} y={+(topY - legH).toFixed(1)} width={2} height={+legH.toFixed(1)} fill={pal.metal} />
      <path
        d={`M${(cx - tw / 2).toFixed(1)},${(topY - legH).toFixed(1)}
            L${(cx - tw / 2 + 2).toFixed(1)},${(topY - legH - th).toFixed(1)}
            L${(cx + tw / 2 - 2).toFixed(1)},${(topY - legH - th).toFixed(1)}
            L${(cx + tw / 2).toFixed(1)},${(topY - legH).toFixed(1)} Z`}
        fill={pal.metal}
      />
      <ellipse cx={cx} cy={+(topY - legH - th).toFixed(1)} rx={+(tw / 2 - 2).toFixed(1)} ry={1.8} fill={pal.metal} />
    </g>
  );
}

/** Floor ledges: subtle horizontal shadow lines every few floors. */
function floorLedges(x, w, y0, h, pal, rand) {
  const lines = [];
  const floors = Math.max(2, Math.floor(h / 26));
  for (let f = 1; f <= floors; f += 1) {
    const ly = y0 + (h / (floors + 1)) * f;
    lines.push(
      <line
        key={`fl${f}`}
        x1={+x.toFixed(1)}
        y1={+ly.toFixed(1)}
        x2={+(x + w).toFixed(1)}
        y2={+ly.toFixed(1)}
        stroke={pal.shade[1]}
        strokeWidth={1}
        opacity={0.5}
      />
    );
  }
  return lines;
}

/**
 * Draw one building: gradient facade + outline, tiers/setbacks,
 * cornice, ledges, roofline props.
 */
function building({ x, w, h, p, pal, rand, depth, grads, tone }) {
  const parts = [];
  const y0 = VIEW_H - h;
  const uid = `${Math.round(x)}-${Math.round(w)}`;
  const facade = facadeDefs(pal, uid);
  // Per-building tonal variety: pick from the palette pair for this building
  const toneIdx = Math.floor(rand() * pal.base.length);
  grads.push(
    <linearGradient key={facade.id} id={facade.id} x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stopColor={pal.base[toneIdx]} />
      <stop offset="1" stopColor={pal.shade[toneIdx]} />
    </linearGradient>
  );
  const fill = `url(#${facade.id})`;
  const topTone = pal.base[Math.floor(rand() * pal.base.length)];

  let topY = y0;
  let topX = x;
  let topW = w;

  // --- Tiered setbacks: stack 2-3 tiers, each narrower than the last ---
  if (rand() < p.tierChance && h > 110) {
    const n = rand() < 0.6 ? 2 : 3;
    /** @type {{ h: number, x: number, y: number, w: number }[]} */
    const tiers = [];
    let remaining = h;
    for (let t = 0; t < n; t += 1) {
      const segsLeft = n - t;
      const th = segsLeft === 1
        ? remaining
        : Math.max(26, remaining * (0.34 + rand() * 0.22));
      remaining -= th;
      tiers.push({ h: th, x: 0, y: 0, w: 0 });
    }
    let tx = x;
    let tw = w;
    for (let t = 0; t < tiers.length; t += 1) {
      tiers[t].x = tx;
      tiers[t].w = tw;
      const inset = Math.max(6, tw * (0.14 + rand() * 0.12));
      tx += inset;
      tw -= inset * 2;
    }
    let cursor = y0;
    for (let t = 0; t < tiers.length; t += 1) {
      tiers[t].y = cursor;
      cursor -= tiers[t].h;
    }
    tiers.forEach((tier, t) => {
      parts.push(
        <g key={`tier${t}-${uid}`}>
          <rect x={+tier.x.toFixed(1)} y={+tier.y.toFixed(1)} width={+tier.w.toFixed(1)} height={+tier.h.toFixed(1)} fill={fill} />
          <rect x={+tier.x.toFixed(1)} y={+tier.y.toFixed(1)} width={tier.w.toFixed(1)} height={+tier.h.toFixed(1)} fill="none" stroke={pal.outline} strokeWidth="1" />
          <rect x={+(tier.x + tier.w * 0.06).toFixed(1)} y={+tier.y.toFixed(1)} width={Math.max(1.5, tier.w * 0.05).toFixed(1)} height={+tier.h.toFixed(1)} fill={pal.edge} />
          {rand() < 0.5
            ? windows({ x: tier.x, y: tier.y + 4, w: tier.w, h: tier.h - 6, cols: Math.max(2, Math.round(tier.w / 22)), rowH: p.rowH, litChance: p.litChance, pal, rand, allowRed: depth !== 'back' })
            : windowColumns({ x: tier.x + tier.w * 0.15, y: tier.y + 4, w: tier.w * 0.7, h: tier.h - 6, pal, rand, litChance: p.litChance * 0.8 })}
        </g>
      );
    });
    const top = tiers[tiers.length - 1];
    topY = top.y;
    topX = top.x;
    topW = top.w;
  } else {
    // --- Single mass with cornice + ledges ---
    parts.push(
      <g key={`body-${uid}`}>
        <rect x={x} y={y0} width={w} height={h} fill={fill} />
        <rect x={x} y={y0} width={w} height={h} fill="none" stroke={pal.outline} strokeWidth="1" />
        <rect x={+(x + w * 0.06).toFixed(1)} y={y0} width={Math.max(1.5, w * 0.045).toFixed(1)} height={h} fill={pal.edge} />
        {rand() < 0.55
          ? windows({ x: x + w * 0.08, y: y0 + 5, w: w * 0.84, h: h - (p.groundFloor ? 20 : 8), cols: p.cols, rowH: p.rowH, litChance: p.litChance, pal, rand, allowRed: depth !== 'back' })
          : windowColumns({ x: x + w * 0.18, y: y0 + 5, w: w * 0.64, h: h - (p.groundFloor ? 20 : 8), pal, rand, litChance: p.litChance * 0.8 })}
        {rand() < 0.6 ? floorLedges(x, w, y0 + 6, h - 10, pal, rand) : null}
      </g>
    );
  }

  // --- Cornice: projecting molded band at the roofline ---
  if (rand() < p.parapetChance) {
    const ch = 3.5 + rand() * 2.5;
    const over = 2.5;
    parts.push(
      <g key={`cor-${uid}`}>
        <rect
          x={+(topX - over).toFixed(1)}
          y={+(topY - ch).toFixed(1)}
          width={+(topW + over * 2).toFixed(1)}
          height={+ch.toFixed(1)}
          fill={topTone}
          stroke={pal.outline}
          strokeWidth="0.8"
        />
        <rect
          x={+(topX + topW * 0.08).toFixed(1)}
          y={+(topY - ch - 2.2).toFixed(1)}
          width={Math.max(5, topW * 0.12).toFixed(1)}
          height={2.2}
          fill={topTone}
        />
        <rect
          x={+(topX + topW * 0.8).toFixed(1)}
          y={+(topY - ch - 2.2).toFixed(1)}
          width={Math.max(5, topW * 0.12).toFixed(1)}
          height={2.2}
          fill={topTone}
        />
      </g>
    );
    topY -= ch + 2.2;
  }

  // --- Ground floor: storefront band with warm light ---
  if (p.groundFloor) {
    const gy = VIEW_H - 18;
    parts.push(
      <g key={`gf-${uid}`}>
        <rect x={+x.toFixed(1)} y={gy} width={+w.toFixed(1)} height={18} fill={pal.ground} />
        <rect x={+(x + w * 0.38).toFixed(1)} y={+(gy + 4).toFixed(1)} width={+(w * 0.24).toFixed(1)} height={14} fill={pal.groundGlow} />
        <rect x={+(x + w * 0.1).toFixed(1)} y={+(gy + 5).toFixed(1)} width={+(w * 0.16).toFixed(1)} height={2} fill={pal.edge} />
      </g>
    );
  }

  // --- Rooftop props (mutually exclusive picks) ---
  const roll = rand();
  const cx = topX + topW / 2;
  if (roll < p.spireChance && h > 150) {
    const sh = 24 + rand() * 30;
    parts.push(
      <g key={`sp-${uid}`}>
        <path
          d={`M${(cx - topW * 0.14).toFixed(1)},${topY.toFixed(1)}
              L${cx.toFixed(1)},${(topY - sh * 0.55).toFixed(1)}
              L${(cx + topW * 0.14).toFixed(1)},${topY.toFixed(1)} Z`}
          fill={topTone}
          stroke={pal.outline}
          strokeWidth="0.8"
        />
        <line x1={cx} y1={+(topY - sh * 0.55).toFixed(1)} x2={cx} y2={+(topY - sh).toFixed(1)} stroke={pal.metal} strokeWidth={2} />
        <circle cx={cx} cy={+(topY - sh - 2).toFixed(1)} r={2.2} fill={RED} opacity={0.95} />
      </g>
    );
  } else if (roll < p.spireChance + p.waterTowerChance && h > 90) {
    parts.push(waterTower(topX + topW * (0.25 + rand() * 0.5), topY, h > 160 ? 1.15 : 0.85, pal, `wt-${uid}`));
  } else if (roll < p.spireChance + p.waterTowerChance + p.hvacChance) {
    const nBoxes = 1 + Math.floor(rand() * 2);
    for (let b = 0; b < nBoxes; b += 1) {
      const bw = 8 + rand() * 12;
      const bh = 4 + rand() * 5;
      const bx = topX + topW * (0.15 + rand() * 0.55);
      parts.push(
        <rect key={`hvac${b}-${uid}`} x={+bx.toFixed(1)} y={+(topY - bh).toFixed(1)} width={+bw.toFixed(1)} height={+bh.toFixed(1)} fill={pal.metal} />
      );
    }
  } else if (roll < p.spireChance + p.waterTowerChance + p.hvacChance + 0.22) {
    // Antenna with red beacon
    const ah = 14 + rand() * 22;
    const ax = topX + topW * (0.3 + rand() * 0.4);
    parts.push(
      <g key={`ant-${uid}`}>
        <line x1={ax} y1={+topY.toFixed(1)} x2={ax} y2={+(topY - ah).toFixed(1)} stroke={pal.metal} strokeWidth={2} />
        <circle cx={ax} cy={+(topY - ah - 1.5).toFixed(1)} r={2.1} fill={RED} opacity={0.9} />
      </g>
    );
  }

  // --- Rare red neon edge strip ---
  if (depth !== 'back' && rand() < 0.14) {
    parts.push(
      <rect
        key={`neon-${uid}`}
        x={+(x + w - 2.5).toFixed(1)}
        y={+(y0 + 6).toFixed(1)}
        width={2.2}
        height={+(h - 14).toFixed(1)}
        fill={RED}
        opacity={0.65}
      />
    );
  }

  return parts;
}

/**
 * @param {{
 *   seed?: number,
 *   depth?: 'back'|'mid'|'front',
 *   tone?: 'dark'|'light',
 *   flip?: boolean,
 *   fit?: 'meet'|'slice',
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function CitySkyline({
  seed = 7,
  depth = 'mid',
  tone = 'dark',
  flip = false,
  fit = 'meet',
  className = '',
  style,
}) {
  const p = PROFILES[depth] || PROFILES.mid;
  const pal = PALETTES[tone] || PALETTES.dark;
  const rand = mulberry32(seed + depth.length * 1013);

  const grads = [];
  const buildings = [];
  let x = -26;
  let i = 0;
  while (x < VIEW_W + 26) {
    const w = Math.round(p.minW + rand() * (p.maxW - p.minW));
    const h = Math.round(p.minH + rand() * (p.maxH - p.minH));
    buildings.push(
      <g key={`b${i}`}>{building({ x, w, h, p, pal, rand, depth, grads, tone })}</g>
    );
    x += w + (p.gapMin + rand() * (p.gapMax - p.gapMin));
    i += 1;
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio={fit === 'slice' ? 'xMidYMax slice' : 'xMidYMax meet'}
      className={className}
      style={{ ...style, transform: flip ? 'scaleX(-1)' : style?.transform }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>{grads}</defs>
      {buildings}
    </svg>
  );
}
