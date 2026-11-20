"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { Role, ROLES, Work } from "@/lib/content";
import { calm } from "@/lib/motion";
import Tabs from "./Tabs";
import T from "./T";
import WhatIDid, { whatIDid } from "./WhatIDid";
import { WorkLightbox, embedOf, siteOf } from "./WorkStrip";

// The Trail: one chapter per company. Each chapter's name rises, its numbers count up, and all its work sits
// on a sideways rail; any piece opens in a viewer that steps through the rest of that company's work. "The full story" opens the company
// as its own page, with every piece of work on a wall, so a role can hold 3 samples or 50.

const slug = (r: Role) => r.org.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const when = (r: Role) => r.meta.split("·").pop()?.trim() ?? "";

// ---------- The work wall ----------

type Kind = "video" | "post" | "doc" | "photo" | "link";
const KIND_LABEL: Record<Kind, string> = { video: "Videos", post: "Posts", doc: "Docs", photo: "Photos", link: "Links" };

function kindOf(w: Work): Kind {
  const src = `${w.href ?? ""} ${w.embed ?? ""}`;
  if (w.file || w.video || /instagram\.com\/reel|drive\.google\.com\/file/.test(src)) return "video";
  if (/\.pdf($|\?)/.test(src) || /docs\.google\.com/.test(src)) return "doc";
  if (/instagram\.com|threads\.(com|net)|linkedin\.com|lnkd\.in/.test(src)) return /video/i.test(w.label) ? "video" : "post";
  if (w.slides) return w.ratio === "12 / 5" || w.ratio === "16 / 9" ? "doc" : "post"; // wide slides are report pages
  if (w.image) return "photo";
  return "link";
}

// Opens in the viewer if there's something to show there; otherwise it's a plain link out.
const opensInViewer = (w: Work) => !!(w.video || w.image || w.file || embedOf(w)) || !w.href;

function Tile({ w, onOpen }: { w: Work; onOpen: () => void }) {
  const kind = kindOf(w);
  const placeholder = w.label.startsWith("[");
  const body = (
    <>
      {w.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={w.thumb} alt="" loading="lazy" className={/ytimg\.com/.test(w.thumb) ? "is-yt" : undefined} />
      ) : w.logo ? (
        <span className="work-logo is-tile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={w.logo} alt="" loading="lazy" />
        </span>
      ) : (
        // No picture: the title itself is the tile, set large on graph paper.
        <span className={`wall-blank ${placeholder ? "is-ph" : "graph"}`}>
          {!placeholder && (
            <>
              <span className="wall-site">{w.href && siteOf(w.href) !== "the original" ? siteOf(w.href) : KIND_LABEL[kind].replace(/s$/, "")}</span>
              <span className="wall-title">
                <T>{w.label}</T>
              </span>
            </>
          )}
        </span>
      )}
      {(kind === "video") && w.thumb && (
        <span aria-hidden className="work-play wall-play">
          <svg viewBox="0 0 10 10" width="14" height="14" aria-hidden><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
        </span>
      )}
      {(w.thumb || w.logo || placeholder) && (
      <span className="wall-cap">
        <span className="wall-kind">{KIND_LABEL[kind].replace(/s$/, "")}</span>
        <span className="wall-label">
          <T>{w.label}</T>
        </span>
      </span>
      )}
    </>
  );
  if (opensInViewer(w))
    return (
      <button type="button" onClick={onOpen} className="wall-tile" disabled={placeholder && !w.href}>
        {body}
      </button>
    );
  return (
    <a href={w.href} target="_blank" rel="noopener noreferrer" className="wall-tile">
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function WorkWall({ items, org }: { items: Work[]; org: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [filter, setFilter] = useState<"all" | Kind>("all");

  const kinds = useMemo(() => {
    const seen = new Map<Kind, number>();
    items.forEach((w) => seen.set(kindOf(w), (seen.get(kindOf(w)) ?? 0) + 1));
    return seen;
  }, [items]);
  const showFilter = kinds.size > 1 && items.length >= 5;

  const show = (i: number) => {
    setOpen(i);
    setPlaying(false);
    dialog.current?.showModal();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="label">
          The work <span className="text-muted">({items.length})</span>
        </h3>
        {showFilter && (
          <Tabs
            label={`Filter ${org} work`}
            value={filter}
            onChange={(id) => setFilter(id as "all" | Kind)}
            items={[{ id: "all", label: "All" }, ...[...kinds.keys()].map((k) => ({ id: k, label: KIND_LABEL[k] }))]}
          />
        )}
      </div>
      <ul className="wall mt-5">
        {items.map((w, i) =>
          filter === "all" || kindOf(w) === filter ? (
            <li key={w.label}>
              <Tile w={w} onOpen={() => show(i)} />
            </li>
          ) : null,
        )}
      </ul>
      <p className="mt-3 text-sm text-muted">Client details hidden for confidentiality.</p>
      <WorkLightbox
        dialog={dialog}
        current={open === null ? null : items[open]}
        playing={playing}
        setPlaying={setPlaying}
        onClosed={() => {
          setOpen(null);
          setPlaying(false);
        }}
      />
    </div>
  );
}

// ---------- The chapters ----------
// The page always scrolls normally: only the names and numbers move, once, as each chapter arrives.

const cover = (r: Role) => {
  const w = r.work.find((x) => x.image || x.thumb);
  return w?.image ?? w?.thumb;
};
const where = (r: Role) => r.meta.split("·")[0]?.trim() ?? "";
const pad = (n: number) => String(n).padStart(2, "0");

function Piece({ w, onOpen }: { w: Work; onOpen: () => void }) {
  const kind = kindOf(w);
  const placeholder = w.label.startsWith("[");
  const pic = w.thumb ?? w.image;
  const body = (
    <>
      <span className={`acc-pic${pic ? "" : w.logo ? " is-logo" : " is-doc"}`}>
        {pic ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pic} alt="" loading="lazy" className={/ytimg\.com/.test(pic) ? "is-yt" : undefined} />
        ) : w.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={w.logo} alt="" loading="lazy" />
        ) : (
          <span className={`acc-doc ${placeholder ? "is-ph" : "graph"}`}>
            <span className="acc-doc-title display">
              <T>{placeholder ? KIND_LABEL[kind].replace(/s$/, "") : w.label}</T>
            </span>
          </span>
        )}
        {kind === "video" && pic && (
          <span aria-hidden className="work-play wall-play">
            <svg viewBox="0 0 10 10" width="14" height="14" aria-hidden><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
          </span>
        )}
      </span>
      <span className="acc-cap">
        <span className="acc-kind">{w.href && siteOf(w.href) !== "the original" ? siteOf(w.href) : KIND_LABEL[kind].replace(/s$/, "")}</span>
        <span className="acc-label">
          <T>{w.label}</T>
        </span>
      </span>
    </>
  );
  if (opensInViewer(w))
    return (
      <button type="button" onClick={onOpen} className="acc-piece" disabled={placeholder && !w.href}>
        {body}
      </button>
    );
  return (
    <a href={w.href} target="_blank" rel="noopener noreferrer" className="acc-piece">
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

// Elevation with its numbers counting up once the chapter arrives. Screen readers get the plain sentence.
function Elevation({ text, on }: { text: string; on: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const parts = text.includes("[") ? [text] : text.split(/(\d+(?:\.\d+)?)/);

  useEffect(() => {
    const el = box.current;
    if (!el || !on || done.current) return;
    done.current = true;
    if (calm()) return;
    el.querySelectorAll<HTMLElement>("[data-n]").forEach((s) => {
      const end = Number(s.dataset.n);
      const dp = (s.dataset.n!.split(".")[1] ?? "").length;
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.4, ease: "power2.out", delay: 0.25, onUpdate: () => (s.textContent = o.v.toFixed(dp)) });
    });
  }, [on]);

  return (
    <p className="ch-elev">
      <span className="sr-only">
        <T>{text}</T>
      </span>
      <span ref={box} aria-hidden>
        {parts.map((p, k) =>
          k % 2 === 1 ? (
            <span key={k} data-n={p} className="ch-num">
              {p}
            </span>
          ) : (
            <T key={k}>{p}</T>
          ),
        )}
      </span>
    </p>
  );
}

// One sideways rail of work. Scrolls with the arrows, a trackpad, a swipe or the keyboard; a gold bar shows how far along it is.
function Rail({ name, items, count, onShow }: { name: string; items: Work[]; count: number; onShow: (items: Work[], k: number) => void }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, p: 0 });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const upd = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4, p: max > 0 ? el.scrollLeft / max : 1 });
    };
    upd();
    el.addEventListener("scroll", upd, { passive: true });
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", upd);
      ro.disconnect();
    };
  }, []);
  // Mouse drag to scroll, with a short glide on release (touch and trackpads already scroll natively).
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let down = false, moved = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, v = 0, raf = 0, safety = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || el.scrollWidth <= el.clientWidth) return;
      stop();
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = performance.now();
      v = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.style.scrollSnapType = "none"; // set straight away so the snap can't pull the row back mid-drag
        setDragging(true);
        el.setPointerCapture(e.pointerId);
      }
      if (!moved) return;
      const now = performance.now();
      v = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      let vel = Math.max(-40, Math.min(40, -v * 16));
      const done = () => {
        cancelAnimationFrame(raf);
        clearTimeout(safety);
        el.style.scrollSnapType = "";
        setDragging(false);
      };
      // Safety net: always settle, even if the browser pauses animation frames (a background tab).
      safety = window.setTimeout(done, 1200);
      const glide = () => {
        vel *= 0.92;
        const before = el.scrollLeft;
        el.scrollLeft += vel;
        // Keep gliding until it slows down or hits either end.
        if (Math.abs(vel) > 0.5 && el.scrollLeft !== before && !calm()) raf = requestAnimationFrame(glide);
        else done();
      };
      raf = requestAnimationFrame(glide);
    };
    // A drag is not a click: stop the piece under the mouse opening.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      stop();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);
  const nudge = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: calm() ? "auto" : "smooth" });
  const scrolls = !(edge.start && edge.end);

  return (
    <>
      <ul ref={rail} className={`ch-rail${dragging ? " is-dragging" : ""}${scrolls ? " can-drag" : ""}`} aria-label={`${name} work`} tabIndex={scrolls ? 0 : undefined}>
        {items.map((w, k) => (
          <li key={w.label} className={`ch-piece${!(w.thumb ?? w.image) ? " is-wide" : ""}`} style={{ ["--k" as string]: k }}>
            <Piece w={w} onOpen={() => onShow(items, k)} />
          </li>
        ))}
      </ul>
      <div className="ch-ctrl">
        <span className="text-sm text-muted">
          {count} piece{count === 1 ? "" : "s"}
        </span>
        {scrolls && (
          <>
            <span aria-hidden className="ch-prog">
              <i style={{ transform: `scaleX(${0.2 + 0.8 * edge.p})` }} />
            </span>
            <span className="ch-arrows">
              <button type="button" onClick={() => nudge(-1)} disabled={edge.start} aria-label={`Earlier ${name} work`}>
                <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden><path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              </button>
              <button type="button" onClick={() => nudge(1)} disabled={edge.end} aria-label={`More ${name} work`}>
                <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden><path d="m5 2 5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              </button>
            </span>
          </>
        )}
      </div>
    </>
  );
}

// Agency work is filed by client: each client gets its own folder, a labelled row with its own rail.
// Work without a client (in-house roles) stays as one plain rail. The viewer steps through one folder at a time.
type Folder = { client?: string; items: Work[] };
const foldersOf = (items: Work[]): Folder[] => {
  if (!items.some((w) => w.client)) return [{ items }];
  const map = new Map<string, Work[]>();
  const loose: Work[] = [];
  items.forEach((w) => (w.client ? map.set(w.client, [...(map.get(w.client) ?? []), w]) : loose.push(w)));
  const out: Folder[] = [...map].map(([client, list]) => ({ client, items: list }));
  if (loose.length) out.push({ items: loose });
  return out;
};
const realCount = (items: Work[]) => items.filter((w) => !w.label.startsWith("[")).length;

// "The bookshelf" (chosen by Catherine Nov 2026): each client is a book spine; pulling one out opens it wide to show
// that client's work, the rest stay slim. One open at a time, the first open to start. Below 1024px the spines lie flat.
const SPINE_TONES = ["#2E3740", "#3B2A22", "#222A32", "#5C3A24", "#3E4852", "#8A4A1F", "#4F5A64", "#161B21"];
function Shelf({ org, folders, onShow }: { org: string; folders: Folder[]; onShow: (items: Work[], k: number) => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const shelf = useRef<HTMLDivElement>(null);
  const pick = (k: number, on: boolean) => {
    setOpen(on ? null : k);
    // On phones the bars stack, so bring the one just opened to the top of the screen once it has settled.
    if (!on && matchMedia("(max-width: 1023px)").matches) {
      setTimeout(() => {
        const el = shelf.current?.children[k] as HTMLElement | undefined;
        if (!el) return;
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).__lenis;
        if (lenis) lenis.scrollTo(el, { offset: -96, immediate: calm() });
        else el.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });
      }, 380);
    }
  };
  // Arrow keys move between spines, like a row of tabs.
  const onKey = (e: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(e.key) || !(e.target as HTMLElement).classList.contains("spine-btn")) return;
    e.preventDefault();
    const btns = [...(shelf.current?.querySelectorAll<HTMLButtonElement>(".spine-btn") ?? [])];
    const i = btns.indexOf(e.target as HTMLButtonElement);
    const next = (i + (keys.indexOf(e.key) < 2 ? 1 : -1) + btns.length) % btns.length;
    btns[next]?.focus();
  };
  return (
    <div ref={shelf} className="shelf" role="list" aria-label={`${org} clients`} onKeyDown={onKey}>
      {folders.map((f, k) => {
        const name = f.client ?? "Other work";
        const on = open === k;
        const id = `shelf-${slug({ org } as Role)}-${k}`;
        return (
          <div key={name} role="listitem" className={`spine${on ? " is-open" : ""}`} style={{ ["--c" as string]: SPINE_TONES[k % SPINE_TONES.length] }}>
            <button type="button" className="spine-btn" aria-expanded={on} aria-controls={id} onClick={() => pick(k, on)}>
              <span className="spine-name">{name}</span>
              <span className="spine-n">
                {realCount(f.items)}
                <span className="sr-only"> pieces</span>
              </span>
            </button>
            <div id={id} className="spine-body" hidden={!on}>
              <h3 className="spine-title display">{name}</h3>
              <Rail name={name} items={f.items} count={realCount(f.items)} onShow={onShow} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// One company: its name, role, dates and best numbers on top, then its work: one rail, or one folder row per client.
function Chapter({ r, i, on, onShow, onOpen }: { r: Role; i: number; on: boolean; onShow: (items: Work[], k: number) => void; onOpen: (i: number) => void }) {
  const real = r.work.filter((w) => !w.label.startsWith("["));
  const items = real.length ? real : r.work;
  const folders = foldersOf(items);

  return (
    <section id={`trail-${slug(r)}`} className={`ch${on ? " is-in" : ""}`} data-i={i} aria-labelledby={`ch-name-${i}`}>
      <div className="ch-top">
        <div>
          <p className="ch-kicker">
            <span className="text-gold">{pad(i + 1)}</span>
            <span className="text-muted">
              {" "}
              / {pad(ROLES.length)} · {r.camp} · {where(r)}
            </span>
          </p>
          <h2 id={`ch-name-${i}`} tabIndex={-1} className="ch-name display">
            <span className="ch-mask">
              <span>
                <T>{r.org}</T>
              </span>
            </span>
          </h2>
        </div>
        <div className="ch-text">
          <p className="ch-role">{r.role}</p>
          <p className="mt-1 text-muted">{when(r)}</p>
          {r.elevation && <Elevation text={r.elevation} on={on} />}
          <button type="button" onClick={() => onOpen(i)} className="btn btn-ghost mt-6">
            The full story<span className="sr-only"> at {r.org}</span>
          </button>
        </div>
      </div>
      {items.length > 0 &&
        (folders.length === 1 && !folders[0].client ? (
          <div className="ch-rail-wrap">
            <Rail name={r.org} items={items} count={real.length} onShow={onShow} />
          </div>
        ) : (
          <Shelf org={r.org} folders={folders} onShow={onShow} />
        ))}
    </section>
  );
}

function Chapters({ onOpen }: { onOpen: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const [set, setSet] = useState<Work[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!calm()) el.classList.add("ch-anim");
    // Each chapter's name rises and its numbers count up the first time it comes into view.
    const enter = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
          enter.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -18% 0px" },
    );
    el.querySelectorAll<HTMLElement>(".ch").forEach((s) => enter.observe(s));
    return () => enter.disconnect();
  }, []);

  const show = (items: Work[], k: number) => {
    setSet(items.filter(opensInViewer));
    setIdx(Math.max(0, items.filter(opensInViewer).indexOf(items[k])));
    setPlaying(false);
    viewer.current?.showModal();
  };

  return (
    <div ref={root} className="wrap ch-list">
      {ROLES.map((r, i) => (
        <Chapter key={r.org} r={r} i={i} on={seen.has(i)} onShow={show} onOpen={onOpen} />
      ))}

      <WorkLightbox
        dialog={viewer}
        current={set[idx] ?? null}
        playing={playing}
        setPlaying={setPlaying}
        set={set}
        index={idx}
        onStep={(k) => {
          setIdx(k);
          setPlaying(false);
        }}
        onClosed={() => {
          setSet([]);
          setPlaying(false);
        }}
      />
    </div>
  );
}

// ---------- A company's own page ----------
// Slides up over the trail. The arrows slide sideways to the next company; Esc or Close slides it away.

function Stop({ index, onGo, onClose }: { index: number | null; onGo: (i: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const n = ROLES.length;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null) {
      setDir(shown === null || index > shown ? 1 : -1);
      setShown(index);
      if (!d.open) {
        d.showModal();
        window.__lenis?.stop();
        requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add("is-in")));
      }
      d.scrollTo({ top: 0 });
    } else if (d.open) {
      d.classList.remove("is-in");
      const done = () => {
        d.close();
        window.__lenis?.start();
        setShown(null);
      };
      if (calm()) done();
      else setTimeout(done, 650);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const r = shown === null ? null : ROLES[shown];
  const lede = r ? r.climb ?? whatIDid(r) : "";
  const did = r && r.climb ? whatIDid(r) : "";
  const next = shown === null ? 0 : (shown + 1) % n;

  return (
    <dialog
      ref={dialog}
      className="stop"
      data-lenis-prevent
      aria-labelledby="stop-name"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      {r && shown !== null && (
        <>
          <div className="stop-bar">
            <p className="text-sm">
              <span className="text-gold">{r.camp}</span>
              <span className="text-muted">
                {" "}
                / stop {n - shown} of {n}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button type="button" className="stop-arrow" onClick={() => onGo((shown - 1 + n) % n)} aria-label="Previous company">
                ←
              </button>
              <button type="button" className="stop-arrow" onClick={() => onGo(next)} aria-label="Next company">
                →
              </button>
              <button type="button" className="btn btn-ghost !min-h-10 !px-4" onClick={onClose}>
                Close
              </button>
            </div>
          </div>

          <article key={r.org} className="stop-body" style={{ ["--dir" as string]: dir }}>
            <header className="stop-head">
              {cover(r) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover(r)} alt="" className="stop-cover" />
              )}
              <h2 id="stop-name" className="stop-name display" style={{ ["--len" as string]: Math.max(6, r.org.length) }}>
                <T>{r.org}</T>
              </h2>
              <p className="mt-4 text-lg font-medium">{r.role}</p>
            </header>

            <div className="wrap">
              <p className="stop-lede">
                <T>{lede}</T>
              </p>

              <dl className="stop-facts">
                <div>
                  <dt className="label">Where</dt>
                  <dd>{where(r)}</dd>
                </div>
                <div>
                  <dt className="label">When</dt>
                  <dd>{when(r)}</dd>
                </div>
                <div>
                  <dt className="label">Camp</dt>
                  <dd>{r.camp}</dd>
                </div>
              </dl>

              <div className="mx-auto mt-14 max-w-3xl space-y-8">
                {r.elevation && (
                  <div>
                    <h3 className="label">Elevation</h3>
                    <p className="mt-2 text-lg leading-relaxed text-paper/85">
                      <T>{r.elevation}</T>
                    </p>
                  </div>
                )}
                {did && <WhatIDid text={did} />}
                {r.lesson && (
                  <p className="chapter-lesson">
                    <T>{r.lesson}</T>
                  </p>
                )}
              </div>

              {r.work.length > 0 && (
                <div className="mt-20">
                  <WorkWall items={r.work} org={r.org} />
                </div>
              )}

              <button type="button" className="stop-next" onClick={() => onGo(next)}>
                <span className="label">Next stop</span>
                <span className="stop-next-name display">
                  <T>{ROLES[next].org}</T>
                </span>
              </button>
            </div>
          </article>
        </>
      )}
    </dialog>
  );
}

export default function Trail() {
  const [open, setOpen] = useState<number | null>(null);

  // /experience#prace-media opens that company's page.
  useEffect(() => {
    const i = ROLES.findIndex((r) => `#${slug(r)}` === location.hash);
    if (i >= 0) setOpen(i);
  }, []);
  const go = (i: number | null) => {
    setOpen(i);
    history.replaceState(null, "", i === null ? location.pathname : `#${slug(ROLES[i])}`);
  };

  return (
    <>
      <Chapters onOpen={go} />
      <Stop index={open} onGo={go} onClose={() => go(null)} />
    </>
  );
}
