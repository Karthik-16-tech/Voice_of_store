// Procedural supermarket layout. Units are meters; store spans x -18..18, z -14..14,
// entrance on +z (front). All randomness is seeded so the store is stable.
export type V3 = [number, number, number];
export type Inst = { p: V3; s: V3; c: string; r?: number };
export type Cat = "white" | "metal" | "dark" | "wood" | "product" | "fruit" | "glass" | "glow" | "plant";

export type Sign = { text: string; p: V3; r: number; w: number };

export type StoreLayout = {
  cats: Record<Cat, Inst[]>;
  struct: Float32Array;
  detail: Float32Array;
  signs: Sign[];
};

const PRODUCT_COLORS = ["#d94f3d", "#f2b632", "#3a7bd5", "#f4f1ea", "#2f9e6b", "#e57c2f", "#7b4fa0", "#c9333b", "#f6d365", "#4fb0c6", "#e8e3d8", "#255c99"];
const BEV_COLORS = ["#1f6f43", "#c62828", "#f5f5f0", "#1565c0", "#f9a825", "#6d4c41", "#00838f"];
const HOUSE_COLORS = ["#4fc3f7", "#ffffff", "#81c784", "#ba68c8", "#ffb74d", "#e57373", "#90a4ae"];
const FRUIT = ["#d32f2f", "#f57c00", "#fbc02d", "#7cb342", "#388e3c", "#8e24aa", "#e64a19", "#c0ca33"];

export function buildStore(): StoreLayout {
  let seed = 1023;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

  const cats: Record<Cat, Inst[]> = { white: [], metal: [], dark: [], wood: [], product: [], fruit: [], glass: [], glow: [], plant: [] };
  const struct: number[] = [];
  const detail: number[] = [];
  const signs: Sign[] = [];

  const edges = (p: V3, s: V3, out: number[], r = 0) => {
    const [hx, hy, hz] = [s[0] / 2, s[1] / 2, s[2] / 2];
    const cos = Math.cos(r), sin = Math.sin(r);
    const c = (x: number, y: number, z: number): V3 => [p[0] + x * cos + z * sin, p[1] + y, p[2] - x * sin + z * cos];
    const v = [c(-hx, -hy, -hz), c(hx, -hy, -hz), c(hx, -hy, hz), c(-hx, -hy, hz), c(-hx, hy, -hz), c(hx, hy, -hz), c(hx, hy, hz), c(-hx, hy, hz)];
    const idx = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
    idx.forEach((i) => out.push(...(v[i] as V3)));
  };
  const line = (a: V3, b: V3, out = struct) => out.push(...a, ...b);
  const add = (cat: Cat, p: V3, s: V3, c = "#ffffff", e?: "struct" | "detail", r = 0) => {
    cats[cat].push({ p, s, c, r });
    if (e) edges(p, s, e === "struct" ? struct : detail, r);
  };

  const H = 3.2;
  // ---------- Shell ----------
  add("white", [0, H / 2, -14], [36.2, H, 0.2], "#f3f1ec", "struct");
  add("white", [-18, H / 2, 0], [0.2, H, 28], "#f3f1ec", "struct");
  add("white", [0, 0.06, 0], [36.4, 0.12, 28.4], "#e9e5dc"); // slab lip
  // Glass right wall + front wall with posts
  const glassRun = (x0: number, z0: number, x1: number, z1: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.round(len / 3));
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n;
      const ax = x0 + (x1 - x0) * t0, az = z0 + (z1 - z0) * t0;
      const bx = x0 + (x1 - x0) * t1, bz = z0 + (z1 - z0) * t1;
      const along = x0 === x1 ? [0.06, H, Math.abs(bz - az)] : [Math.abs(bx - ax), H, 0.06];
      add("glass", [(ax + bx) / 2, H / 2, (az + bz) / 2], along as V3, "#cfe3ee");
      add("metal", [ax, H / 2, az], [0.12, H, 0.12], "#9aa1a8", "struct");
    }
    add("metal", [x1, H / 2, z1], [0.12, H, 0.12], "#9aa1a8", "struct");
    line([x0, H, z0], [x1, H, z1]);
    line([x0, 0.12, z0], [x1, 0.12, z1]);
  };
  glassRun(18, -14, 18, 14);
  glassRun(-18, 14, -7, 14);
  glassRun(-2, 14, 18, 14);

  // Architectural scaffold above walls (wire frame only)
  const top = 5.4;
  edges([0, (H + top) / 2, 0], [36, top - H, 28], struct);
  for (let x = -18; x <= 18; x += 6) {
    line([x, H, -14], [x, top, -14]);
    line([x, H, 14], [x, top, 14]);
  }
  for (let z = -14; z <= 14; z += 7) {
    line([-18, H, z], [-18, top, z]);
    line([18, H, z], [18, top, z]);
  }
  // Blueprint perimeter
  edges([0, 0.01, 0], [40, 0.001, 32], struct);
  for (let x = -20; x <= 20; x += 4) line([x, 0.01, 16], [x, 0.01, 16.6]);
  for (let z = -16; z <= 16; z += 4) line([20, 0.01, z], [20.6, 0.01, z]);

  // ---------- Entrance ----------
  add("dark", [-4.5, H - 0.25, 14], [5.6, 0.5, 0.35], "#2b2e33", "struct");
  add("metal", [-7, H / 2, 14], [0.2, H, 0.3], "#7c838a", "struct");
  add("metal", [-2, H / 2, 14], [0.2, H, 0.3], "#7c838a", "struct");
  add("glass", [-5.6, 1.4, 14.05], [1.9, 2.7, 0.05], "#d6eaf2", "detail");
  add("glass", [-3.4, 1.4, 13.95], [1.9, 2.7, 0.05], "#d6eaf2", "detail");
  signs.push({ text: "ENTRANCE", p: [-4.5, H - 0.25, 14.19], r: 0, w: 3 });
  // Carts
  for (let i = 0; i < 4; i++) {
    const x = -9.6 + i * 0.25;
    add("metal", [x, 0.65, 12.6], [0.55, 0.45, 0.9], "#aeb4ba", "detail");
  }
  // Planters & bollards outside
  [-15, -11, 3, 9, 15].forEach((x) => {
    add("white", [x, 0.3, 15.4], [2.2, 0.6, 0.9], "#ece8df", "struct");
    for (let k = 0; k < 6; k++) add("plant", [x - 0.9 + k * 0.36, 0.8 + rnd() * 0.15, 15.4], [0.5, 0.55, 0.6], pick(["#4f8a3c", "#3f7a33", "#5d9a45"]));
  });
  [-7.6, -1.4].forEach((x) => add("metal", [x, 0.45, 15.2], [0.18, 0.9, 0.18], "#6d747b", "detail"));

  // ---------- Gondola helper ----------
  const gondola = (x: number, z0: number, z1: number, colors: string[], tall = 1.9) => {
    const len = z1 - z0, cz = (z0 + z1) / 2;
    add("white", [x, 0.08, cz], [0.95, 0.16, len], "#e6e2da");
    add("metal", [x, tall / 2, cz], [0.06, tall, len], "#cfd3d6", "struct");
    add("white", [x, tall + 0.04, cz], [1, 0.08, len], "#f4f2ee");
    const levels = 4;
    for (let l = 0; l < levels; l++) {
      const y = 0.25 + l * ((tall - 0.35) / levels);
      [-1, 1].forEach((side) => {
        add("metal", [x + side * 0.24, y, cz], [0.42, 0.03, len], "#d8dbde");
        let z = z0 + 0.08;
        while (z < z1 - 0.12) {
          const w = 0.14 + rnd() * 0.18;
          const h = 0.16 + rnd() * 0.2;
          add("product", [x + side * 0.26, y + h / 2 + 0.015, z + w / 2], [0.32, h, w * 0.9], pick(colors));
          z += w;
        }
      });
    }
    edges([x, tall / 2, cz], [1, tall, len], detail);
  };
  // Grocery & household
  [-12, -9.5, -7, -4.5].forEach((x) => { gondola(x, -6, -1.5, PRODUCT_COLORS); gondola(x, -0.5, 4, PRODUCT_COLORS); });
  [-2, 0.5].forEach((x) => { gondola(x, -6, -1.5, HOUSE_COLORS); gondola(x, -0.5, 4, HOUSE_COLORS); });
  signs.push({ text: "GROCERY", p: [-8.25, 2.6, -6.3], r: 0, w: 2.6 });
  signs.push({ text: "HOUSEHOLD", p: [-0.75, 2.6, -6.3], r: 0, w: 2.6 });
  // Beverages
  [4.5, 6.5].forEach((x) => gondola(x, -5.5, 1.5, BEV_COLORS, 2));
  signs.push({ text: "BEVERAGES", p: [5.5, 2.75, 1.8], r: 0, w: 2.4 });

  // ---------- Fridge wall helper ----------
  const fridges = (x0: number, n: number, z: number, colors: string[], light: string) => {
    const w = 1.25;
    for (let i = 0; i < n; i++) {
      const x = x0 + w / 2 + i * w;
      add("dark", [x, 1.15, z], [w, 2.3, 0.9], "#3a3f45", "struct");
      add("glow", [x, 1.2, z + 0.3], [w - 0.12, 1.9, 0.04], light);
      for (let l = 0; l < 4; l++) {
        for (let k = 0; k < 4; k++) add("product", [x - 0.42 + k * 0.28, 0.45 + l * 0.45, z + 0.36], [0.22, 0.26, 0.12], pick(colors));
      }
      add("glass", [x, 1.2, z + 0.46], [w - 0.06, 2, 0.03], "#e2f1f8", "detail");
    }
  };
  fridges(-17.5, 8, -13.4, ["#ffffff", "#f3e9c6", "#7fb3e0", "#f8d7a0", "#e9edf2"], "#f4f8ff");
  signs.push({ text: "DAIRY", p: [-12.5, 2.75, -13.4], r: 0, w: 3 });
  fridges(-5.6, 9, -13.4, ["#4fa3e0", "#e05b4f", "#ffffff", "#f0c24b", "#5bb38a"], "#e8f3ff");
  signs.push({ text: "FROZEN", p: [0, 2.75, -13.4], r: 0, w: 3 });
  // Chest freezers
  [-2.4, 2.4].forEach((x) => {
    add("white", [x, 0.45, -9.8], [4, 0.9, 1.6], "#eef0f2", "struct");
    add("glow", [x, 0.91, -9.8], [3.8, 0.02, 1.4], "#dceefc");
    for (let k = 0; k < 14; k++) add("product", [x - 1.7 + k * 0.26, 0.97, -9.8 + (rnd() - 0.5) * 0.9], [0.22, 0.1, 0.3], pick(["#4fa3e0", "#e05b4f", "#ffffff", "#f0c24b"]));
    add("glass", [x, 1.05, -9.8], [4, 0.04, 1.6], "#e2f1f8", "detail");
  });

  // ---------- Meat & seafood ----------
  add("white", [-16.4, 0.5, -4], [1.2, 1, 12], "#f1efea", "struct");
  add("glow", [-16.4, 1.02, -4], [1, 0.03, 11.6], "#fff5ef");
  for (let z = -9.6; z < 1.8; z += 0.45) add("product", [-16.4, 1.07, z], [0.8, 0.07, 0.38], pick(["#c0392b", "#e57373", "#f4c7b8", "#ef8c6c", "#b0bec5"]));
  add("glass", [-15.85, 1.3, -4], [0.04, 0.55, 12], "#e2f1f8", "detail");
  add("white", [-17.8, 1.4, -4], [0.3, 2.8, 12], "#e6e1d6", "struct");
  signs.push({ text: "MEAT & SEAFOOD", p: [-17.6, 2.6, -4], r: Math.PI / 2, w: 3.6 });

  // ---------- Bakery ----------
  for (let i = 0; i < 3; i++) {
    const z = 5.5 + i * 2;
    add("wood", [-17.45, 1, z], [0.8, 2, 1.8], "#c89b6a", "struct");
    for (let l = 0; l < 3; l++) for (let k = 0; k < 4; k++) add("product", [-17.3, 0.55 + l * 0.55, z - 0.6 + k * 0.4], [0.45, 0.18, 0.32], pick(["#c98a4b", "#e0b27a", "#a86b34", "#f1d3a1"]));
  }
  add("wood", [-14.8, 0.5, 8.5], [1.4, 1, 4], "#d2a674", "struct");
  add("glass", [-14.8, 1.25, 8.5], [1.3, 0.5, 3.9], "#f1f6f8", "detail");
  for (let k = 0; k < 10; k++) add("product", [-14.8 + (rnd() - 0.5) * 0.9, 1.07, 6.8 + k * 0.36], [0.3, 0.12, 0.28], pick(["#c98a4b", "#e0b27a", "#8d5524"]));
  signs.push({ text: "BAKERY", p: [-17.6, 2.6, 7.5], r: Math.PI / 2, w: 2.4 });

  // ---------- Produce ----------
  for (let row = 0; row < 3; row++) {
    for (let c = 0; c < 2; c++) {
      const x = 10.5 + c * 3.2, z = -1.5 + row * 2.8;
      add("wood", [x, 0.4, z], [2.4, 0.8, 1.4], "#b9875a", "struct");
      for (let a = 0; a < 6; a++) for (let b = 0; b < 3; b++) {
        add("fruit", [x - 1 + a * 0.4, 0.88, z - 0.42 + b * 0.42], [0.36, 0.3, 0.36], FRUIT[(row * 2 + c + a) % FRUIT.length]);
      }
    }
  }
  // Wall display along right glass
  add("wood", [17.2, 0.9, 2], [1.2, 1.8, 9], "#c89b6a", "struct");
  for (let l = 0; l < 3; l++) for (let z = -2.2; z < 6.3; z += 0.38) add("fruit", [17 - l * 0.12, 0.5 + l * 0.5, z], [0.32, 0.28, 0.32], pick(FRUIT));
  add("white", [16.6, 2.4, 2], [0.12, 0.9, 6], "#efe9de");
  signs.push({ text: "PRODUCE", p: [16.52, 2.4, 2], r: -Math.PI / 2, w: 3 });
  // Indoor trees
  ([[8.5, 5.5], [8.5, -2.5]] as [number, number][]).forEach(([x, z]) => {
    add("white", [x, 0.3, z], [0.8, 0.6, 0.8], "#ebe6dc", "detail");
    add("wood", [x, 1.1, z], [0.12, 1.2, 0.12], "#7b5a3a");
    add("plant", [x, 2, z], [1.4, 1.2, 1.4], "#4c8a3a");
    add("plant", [x + 0.3, 2.5, z - 0.2], [0.9, 0.8, 0.9], "#5c9c47");
  });

  // ---------- Checkout ----------
  [2, 5, 8, 11].forEach((x) => {
    add("white", [x, 0.45, 10], [0.9, 0.9, 2.6], "#f2f1ee", "struct");
    add("dark", [x, 0.92, 9.6], [0.6, 0.04, 1.6], "#2d3035");
    add("metal", [x + 0.75, 0.5, 10.6], [0.5, 1, 0.8], "#c9cdd1", "detail");
    add("dark", [x + 0.75, 1.3, 10.6], [0.05, 0.38, 0.5], "#202326");
    add("glow", [x + 0.72, 1.3, 10.6], [0.02, 0.32, 0.44], "#5aa9f0");
    add("dark", [x, 1.05, 10.9], [0.3, 0.18, 0.3], "#25282c");
    add("metal", [x, 1.25, 11.3], [0.06, 2.5, 0.06], "#9aa1a8");
  });
  signs.push({ text: "CHECKOUT", p: [6.5, 2.6, 11.3], r: 0, w: 2.6 });

  // ---------- Stockroom ----------
  add("white", [8, H / 2, -12.25], [0.2, H, 3.5], "#efece6", "struct");
  add("white", [8, H / 2, -7], [0.2, H, 2], "#efece6", "struct");
  add("white", [11.5, H / 2, -6], [7, H, 0.2], "#efece6", "struct");
  add("glass", [16.5, H / 2, -6], [3, H, 0.05], "#dde9ef", "struct");
  signs.push({ text: "STOCK ROOM", p: [11.5, 2.6, -5.88], r: 0, w: 3 });
  [-12.8, -10.3].forEach((z) => {
    for (let x = 9.5; x < 17; x += 2.6) {
      add("metal", [x + 1, 1.2, z], [2.4, 2.4, 0.8], "#8f969c", "detail");
      for (let l = 0; l < 3; l++) for (let k = 0; k < 3; k++) {
        if (rnd() > 0.82) continue;
        const h = 0.35 + rnd() * 0.25;
        add("wood", [x + 0.25 + k * 0.75, 0.15 + l * 0.8 + h / 2, z], [0.62, h, 0.62], pick(["#c9a06d", "#b88b57", "#d4ad7c"]));
      }
    }
  });
  for (let i = 0; i < 6; i++) add("wood", [10 + i * 1.1, 0.25, -8], [0.8, 0.5 + (i % 2) * 0.3, 0.8], "#c49a66", "detail");

  // Wall columns
  [-6.55, 6.5, 12].forEach((x) => add("white", [x, H / 2, -13.8], [0.5, H, 0.4], "#f6f4f0", "struct"));

  return { cats, struct: new Float32Array(struct), detail: new Float32Array(detail), signs };
}
