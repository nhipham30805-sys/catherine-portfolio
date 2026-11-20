"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Seven skills, each drawn to the roles where Catherine earned it. Every proof line is a fact from lib/content.ts ROLES.
const ROLES = [
  { id: "prace", name: "Prace Media", where: "Melbourne" },
  { id: "bigdigital", name: "BigDigital", where: "Melbourne" },
  { id: "crowd", name: "Crowd Cypher", where: "Melbourne" },
  { id: "metbrains", name: "MetBrains", where: "Melbourne" },
  { id: "ascendant", name: "Ascendant", where: "Singapore" },
  { id: "vinuni", name: "VinUniversity", where: "Hanoi" },
  { id: "catiez", name: "@catiez.ph", where: "Hanoi" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

const SKILLS: { name: string; roles: RoleId[]; proof: string }[] = [
  {
    name: "Client and account management",
    roles: ["prace", "bigdigital", "crowd", "ascendant", "vinuni", "metbrains"],
    proof: "26 client accounts at Prace Media, 9+ at BigDigital and 25+ HNWI clients in Singapore.",
  },
  {
    name: "Content and short-form video",
    roles: ["prace", "metbrains", "vinuni", "catiez"],
    proof: "60+ scripts and 80+ videos a month, 346K views at 9% engagement.",
  },
  {
    name: "Paid social and performance",
    roles: ["bigdigital", "metbrains", "crowd"],
    proof: "Over 6× ROAS and campaign cost efficiency up 62% at BigDigital.",
  },
  {
    name: "SEO and search",
    roles: ["bigdigital", "crowd"],
    proof: "Top 3 Google Search placements and 82% traffic growth.",
  },
  {
    name: "AI-powered marketing",
    roles: ["metbrains"],
    proof: "8 AI-generated ad and content assets reaching a 40K+ combined audience.",
  },
  {
    name: "Sales and prospecting",
    roles: ["prace", "crowd", "vinuni", "metbrains", "ascendant"],
    proof: "20+ registrations and 17 partnerships from one LinkedIn pipeline.",
  },
  {
    name: "Research, data and reporting",
    roles: ["prace", "vinuni", "crowd", "metbrains", "bigdigital", "ascendant"],
    proof: "SEA market research, and a tracking system that lifted team accountability by 35%.",
  },
];

type Path = { d: string; skill: number; role: RoleId };

export default function SkillMap() {
  const [active, setActive] = useState(0);
  const [hoverRole, setHoverRole] = useState<RoleId | null>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const box = useRef<HTMLDivElement>(null);
  const skillEls = useRef<(HTMLButtonElement | null)[]>([]);
  const roleEls = useRef<Partial<Record<RoleId, HTMLLIElement | null>>>({});

  const measure = useCallback(() => {
    const b = box.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const out: Path[] = [];
    SKILLS.forEach((s, i) => {
      const a = skillEls.current[i]?.getBoundingClientRect();
      if (!a) return;
      s.roles.forEach((id) => {
        const z = roleEls.current[id]?.getBoundingClientRect();
        if (!z) return;
        const x1 = a.right - r.left, y1 = a.top + a.height / 2 - r.top;
        const x2 = z.left - r.left, y2 = z.top + z.height / 2 - r.top;
        const k = (x2 - x1) * 0.5;
        out.push({ d: `M${x1},${y1} C${x1 + k},${y1} ${x2 - k},${y2} ${x2},${y2}`, skill: i, role: id });
      });
    });
    setSize({ w: r.width, h: r.height });
    setPaths(out);
  }, []);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  // Hovering a role lights every skill it taught; otherwise the chosen skill leads.
  const litRoles = new Set<RoleId>(hoverRole ? [hoverRole] : SKILLS[active].roles);
  const litSkills = new Set<number>(hoverRole ? SKILLS.flatMap((s, i) => (s.roles.includes(hoverRole) ? [i] : [])) : [active]);
  const isLit = (p: Path) => (hoverRole ? p.role === hoverRole : p.skill === active);

  return (
    <div className="skillmap">
      <div ref={box} className="skillmap-board">
        <svg className="skillmap-lines" width={size.w} height={size.h} aria-hidden>
          <defs>
            <linearGradient id="skill-glow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#F0C27A" />
              <stop offset="1" stopColor="#D98B32" />
            </linearGradient>
          </defs>
          {paths.filter((p) => !isLit(p)).map((p) => (
            <path key={`${p.skill}-${p.role}`} d={p.d} className="skillmap-line" />
          ))}
          {paths.filter(isLit).map((p) => (
            <path key={`${p.skill}-${p.role}-${active}-${hoverRole}`} d={p.d} pathLength={1} className="skillmap-line is-lit" />
          ))}
        </svg>

        <ol className="skillmap-skills">
          {SKILLS.map((s, i) => (
            <li key={s.name}>
              <button
                ref={(el) => { skillEls.current[i] = el; }}
                type="button"
                aria-pressed={active === i}
                data-lit={litSkills.has(i) || undefined}
                className="skillmap-skill"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="skillmap-num">{String(i + 1).padStart(2, "0")}</span>
                {s.name}
              </button>
              {/* Phones: no room for lines, so the roles sit under the open skill. */}
              {active === i && (
                <div className="skillmap-inline">
                  <p>{s.roles.map((id) => ROLES.find((r) => r.id === id)!.name).join(" · ")}</p>
                  <p className="skillmap-inline-proof">{s.proof}</p>
                </div>
              )}
            </li>
          ))}
        </ol>

        <ul className="skillmap-roles" aria-label="Where I earned it">
          {ROLES.map((r) => (
            <li
              key={r.id}
              ref={(el) => { roleEls.current[r.id] = el; }}
              data-lit={litRoles.has(r.id) || undefined}
              className="skillmap-role"
              onMouseEnter={() => setHoverRole(r.id)}
              onMouseLeave={() => setHoverRole(null)}
            >
              <span className="skillmap-role-name">{r.name}</span>
              <span className="skillmap-role-where">{r.where}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="skillmap-proof" aria-live="polite">
        <span className="label !text-gold">Proof</span>
        <span>{SKILLS[active].proof}</span>
      </p>
    </div>
  );
}
