// Shared scroll timeline for The Flight. p runs 0 to 1 across the pinned section.

export type Keys = [number, number][];

export function key(p: number, keys: Keys) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i][0]) {
      const [a, av] = keys[i - 1];
      const [b, bv] = keys[i];
      const t = (p - a) / (b - a);
      return av + (bv - av) * t * t * (3 - 2 * t);
    }
  }
  return keys[keys.length - 1][1];
}

// Smooth curve through the keys with no pause at each one (monotone cubic, so it never overshoots).
// Use this for camera motion; key() eases to a stop at every key, which reads as lurching.
export function curve(p: number, keys: Keys) {
  const n = keys.length;
  if (p <= keys[0][0]) return keys[0][1];
  if (p >= keys[n - 1][0]) return keys[n - 1][1];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) slope.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const tangent = keys.map((_, i) => {
    if (i === 0) return slope[0];
    if (i === n - 1) return slope[n - 2];
    const a = slope[i - 1];
    const b = slope[i];
    if (a * b <= 0) return 0;
    const h0 = keys[i][0] - keys[i - 1][0];
    const h1 = keys[i + 1][0] - keys[i][0];
    const w1 = 2 * h1 + h0;
    const w2 = h1 + 2 * h0;
    return (w1 + w2) / (w1 / a + w2 / b);
  });
  let i = 0;
  while (p > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0];
  const t = (p - keys[i][0]) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * keys[i][1] +
    (t3 - 2 * t2 + t) * h * tangent[i] +
    (-2 * t3 + 3 * t2) * keys[i + 1][1] +
    (t3 - t2) * h * tangent[i + 1]
  );
}

// Fade in/out window, 0 to 1.
export function fade(p: number, a: number, b: number, edge = 0.015) {
  return Math.max(0, Math.min(1, (p - a) / edge, (b - p) / edge));
}

// Dwell (Catherine, Nov 2026): each place holds the scroll longer, so the flight settles before moving on.
// Raw scroll u (0 to 1) maps to flight progress p through these pieces; inside a stop, scrolling moves p about
// 2.5 times more slowly. Every track below is written in p, so they all stay in step. Stops match STATIONS
// in Terrain.tsx.
const PIECES: [number, number, number][] = [
  // [p from, p to, weight]
  [0, 0.07, 1],
  [0.07, 0.24, 1.4], // Hòa Bình
  [0.24, 0.33, 1],
  [0.33, 0.39, 3.5], // Hanoi (a shorter stop, so it gets a little more weight)
  [0.39, 0.53, 1],
  [0.53, 0.61, 2.6], // Singapore
  [0.61, 0.79, 1],
  [0.79, 0.87, 2.6], // Melbourne
  [0.87, 1, 1],
];
const TOTAL = PIECES.reduce((t, [a, b, w]) => t + (b - a) * w, 0);
// [u, p] corners of the mapping.
const DWELL: [number, number][] = (() => {
  const out: [number, number][] = [[0, 0]];
  let u = 0;
  for (const [a, b, w] of PIECES) {
    u += ((b - a) * w) / TOTAL;
    out.push([u, b]);
  }
  out[out.length - 1][0] = 1;
  return out;
})();
// How much taller the section is than before, so the flying between places keeps its old pace.
export const DWELL_STRETCH = TOTAL;

const lerpPairs = (x: number, pairs: [number, number][], from: 0 | 1) => {
  const to = from === 0 ? 1 : 0;
  if (x <= pairs[0][from]) return pairs[0][to];
  for (let i = 1; i < pairs.length; i++) {
    if (x <= pairs[i][from]) {
      const a = pairs[i - 1];
      const b = pairs[i];
      return a[to] + ((x - a[from]) / (b[from] - a[from])) * (b[to] - a[to]);
    }
  }
  return pairs[pairs.length - 1][to];
};
/** Raw scroll progress to flight progress. */
export const dwell = (u: number) => lerpPairs(u, DWELL, 0);
/** Flight progress back to raw scroll progress (for jumping to a chapter). */
export const undwell = (p: number) => lerpPairs(p, DWELL, 1);

// Scroll budget: 30 / 10 / 25 / 25 / 10.
export const LEGS = [0, 0.3, 0.4, 0.65, 0.9, 1];

// Ground covered per leg climbs steeply, so each leg reads faster than the last.
export const TRAVEL: Keys = [
  [0, 0],
  [0.3, 0.05],
  [0.4, 0.13],
  [0.65, 0.48],
  [0.9, 1],
];

export function stageAt(p: number) {
  if (p < 0.3) return 0;
  if (p < 0.4) return 1;
  if (p < 0.65) return 2;
  if (p < 0.9) return 3;
  return 4;
}

export const LOCATIONS = ["Hòa Bình", "Hanoi", "Singapore", "Melbourne", "Summit: Not yet"];

// Distance ticks up only while flying between places (Hòa Bình to Hanoi is about 60 km).
export const DISTANCE: Keys = [
  [0, 0],
  [0.27, 0],
  [0.3, 60],
  [0.42, 60],
  [0.5, 2200],
  [0.64, 2200],
  [0.76, 8300],
];
