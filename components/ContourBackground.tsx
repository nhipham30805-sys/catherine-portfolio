// The site's background: faint topographic contour lines, like a trail map, fixed behind every page with the
// edges darkened. Every sixth line is a warm ember "index" line. Drawn once on the server (same lines every
// visit); a very slow drift is CSS only and stops for visitors who ask for less motion.

const rnd = (s: number) => {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const noise = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return rnd(i) * (1 - u) + rnd(i + 1) * u;
};

const LINES = Array.from({ length: 38 }, (_, k) => {
  let d = "";
  for (let x = 0; x <= 1440; x += 20) {
    const y = k * 26 + (noise(x / 220 + k * 0.37) - 0.5) * 90 + (noise(x / 90 + k * 1.3) - 0.5) * 26;
    d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }
  return { d, index: k % 6 === 0 };
});

export default function ContourBackground() {
  return (
    <div className="contour" aria-hidden>
      <svg viewBox="0 0 1440 960" preserveAspectRatio="xMidYMid slice">
        {LINES.map((l, k) => (
          <path key={k} d={l.d} className={l.index ? "contour-index" : undefined} />
        ))}
      </svg>
    </div>
  );
}
