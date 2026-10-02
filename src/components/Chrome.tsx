import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data";

const seen = (() => {
  try { return sessionStorage.getItem("seen") === "1"; } catch { return false; }
})();
/** Hero text delay: wait for the boot loader on the first visit only. */
export const HERO_DELAY = seen ? 0.1 : 1.9;

export const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "demo", label: "Voice AI demo" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "recognition", label: "Recognition" },
  { id: "media", label: "Media" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Loader() {
  const [done, setDone] = useState(seen);
  useEffect(() => {
    if (seen) return;
    try { sessionStorage.setItem("seen", "1"); } catch { /* private mode */ }
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, []);
  if (seen) return null;
  return (
    <div className={`loader ${done ? "done" : ""}`} aria-hidden={done}>
      <div>
        <pre>{`> booting satya.os
> loading voice models ..... ok
> connecting agents ........ ok
> mounting projects ........ ok
> welcome.`}</pre>
        <div className="bar"><i /></div>
      </div>
    </div>
  );
}

/** Decorative cursor ring + magnetic buttons. The native cursor stays visible. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0;
    let mag: HTMLElement | null = null;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      ring.current?.classList.toggle("hot", !!t.closest("a, button, .card, .moment"));
      const b = t.closest(".btn") as HTMLElement | null;
      if (mag && mag !== b) mag.style.transform = "";
      mag = b;
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(x - r.left - r.width / 2) * 0.22}px, ${(y - r.top - r.height / 2) * 0.3}px)`;
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div className="cursor-ring" ref={ring} aria-hidden />;
}

function useActive() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav({ onPalette }: { onPalette: () => void }) {
  const [stuck, setStuck] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const active = useActive();
  useEffect(() => {
    const on = () => {
      setStuck(window.scrollY > 30);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = ["about", "projects", "experience", "recognition", "media", "contact"];
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" ref={bar} />
      <nav className={`nav ${stuck ? "stuck" : ""}`} aria-label="Primary">
        <div className="wrap">
          <a href="#top" className="logo">satya<b>.</b>dev</a>
          <ul>
            {links.map((l) => (
              <li key={l}><a href={`#${l}`} className={active === l ? "on" : ""}>{l[0].toUpperCase() + l.slice(1)}</a></li>
            ))}
          </ul>
          <div className="nav-r">
            <button className="kbd" onClick={onPalette} aria-label="Open command palette"><span>Ctrl</span><span>K</span></button>
            <a className="btn primary" href={profile.resume} target="_blank" rel="noreferrer">Resume ↗</a>
          </div>
        </div>
      </nav>
      <div className="dots" aria-hidden>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""}><span>{s.label}</span></a>
        ))}
      </div>
    </>
  );
}

type Cmd = { label: string; hint: string; run: () => void };

export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const cmds: Cmd[] = useMemo(() => [
    ...SECTIONS.map((s) => ({ label: s.label, hint: "Go to section", run: () => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }) })),
    { label: "Open resume", hint: "PDF", run: () => window.open(profile.resume, "_blank") },
    { label: "GitHub", hint: "github.com/Satyav8", run: () => window.open(profile.github, "_blank") },
    { label: "LinkedIn", hint: "linkedin.com/in/satyaprabhas--", run: () => window.open(profile.linkedin, "_blank") },
    { label: "Watch the voice agent demo", hint: "Loom", run: () => window.open(profile.loom, "_blank") },
    { label: "Copy email address", hint: profile.email, run: () => { navigator.clipboard?.writeText(profile.email); setCopied(true); } },
  ], []);
  const list = cmds.filter((c) => (c.label + c.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setCopied(false); setTimeout(() => input.current?.focus(), 30); }
  }, [open]);
  useEffect(() => setSel(0), [q]);

  if (!open) return null;
  const go = (c?: Cmd) => { if (!c) return; c.run(); if (!c.label.startsWith("Copy")) onClose(); };
  return (
    <div className="pal-back" onMouseDown={onClose}>
      <div className="pal" role="dialog" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a section or run an action…"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter") go(list[sel]);
            if (e.key === "Escape") onClose();
          }}
        />
        <ul>
          {list.map((c, i) => (
            <li key={c.label} className={i === sel ? "sel" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(c)}>
              <span>{c.label === "Copy email address" && copied ? "Copied ✓" : c.label}</span><em>{c.hint}</em>
            </li>
          ))}
          {!list.length && <li className="none">No match</li>}
        </ul>
      </div>
    </div>
  );
}
