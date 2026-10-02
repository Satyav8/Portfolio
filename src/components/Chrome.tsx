import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data";
import { toggleTheme, useTheme } from "../lib/theme";

const seen = (() => {
  try { return sessionStorage.getItem("seen") === "1"; } catch { return false; }
})();
/** Hero text delay: wait for the boot loader on the first visit only. */
export const HERO_DELAY = seen ? 0.05 : 0.4;

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
    const t = setTimeout(() => setDone(true), 800);
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

/** Magnetic buttons (fine pointers only). No custom cursor: the native pointer stays. */
export function Magnetic() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let mag: HTMLElement | null = null;
    const move = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest(".btn") as HTMLElement | null;
      if (mag && mag !== b) mag.style.transform = "";
      mag = b;
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      }
    };
    const leave = () => { if (mag) mag.style.transform = ""; mag = null; };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseleave", leave); };
  }, []);
  return null;
}

function useActive(rev: number) {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rev]);
  return active;
}

/** The autograph as the logo: static finished signature; writes itself again on hover/focus. */
function Logo({ onClick }: { onClick: () => void }) {
  const [play, setPlay] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const src = play && !reduce ? `/assets/signature.webp?v=${play}` : "/assets/signature-static.webp";
  return (
    <a
      href="#top"
      className="logo"
      aria-label="BVS Satya Prabhas, back to top"
      onClick={onClick}
      onMouseEnter={() => setPlay((p) => p + 1)}
      onFocus={() => setPlay((p) => p + 1)}
    >
      <img src={src} alt="" width="182" height="48" decoding="async" />
    </a>
  );
}

export function ThemeToggle() {
  const theme = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      className="theme-btn"
      aria-label={label}
      title={label}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <svg className="sun" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "recognition", label: "Recognition" },
  { id: "media", label: "Media" },
  { id: "contact", label: "Contact" },
];

export function Nav({ onPalette, rev }: { onPalette: () => void; rev: number }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const active = useActive(rev);

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

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const size = () => { if (window.innerWidth >= 900) setOpen(false); };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", size);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("resize", size); };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" ref={bar} />
      <nav className={`nav ${stuck || open ? "stuck" : ""} ${open ? "open" : ""}`} aria-label="Primary">
        <div className="wrap">
          <Logo onClick={close} />
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.id}><a href={`#${l.id}`} className={active === l.id ? "on" : ""}>{l.label}</a></li>
            ))}
          </ul>
          <div className="nav-r">
            <button className="kbd" onClick={onPalette} aria-label="Open command palette"><span>Ctrl</span><span>K</span></button>
            <ThemeToggle />
            <a className="btn primary nav-cta" href="#contact">Let&rsquo;s talk</a>
            <button className="burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}>
              <i /><i /><i />
            </button>
          </div>
        </div>
        <div className="mnav" id="mobile-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.id} className={`ml ${active === l.id ? "on" : ""}`} href={`#${l.id}`} onClick={close}>{l.label}</a>
          ))}
          <div className="m-row">
            <a className="btn primary" href="#contact" onClick={close}>Let&rsquo;s talk</a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
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
    { label: "Switch theme", hint: "Light / dark", run: () => toggleTheme() },
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
