import { useEffect, useState, type ReactNode } from "react";
import { Loader, Magnetic, Nav, Palette } from "./components/Chrome";
import { About, Contact, DemoCall, Experience, Hero, Marquee, Media, Projects, Recognition, Skills } from "./components/Sections";

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };

/** Below-the-fold blocks, mounted one at a time while the browser is idle so the hero paints first. */
const STAGES: ReactNode[] = [
  <DemoCall key="demo" />,
  <About key="about" />,
  <div key="w1" className="weave" />,
  <Projects key="projects" />,
  <Experience key="exp" />,
  <Recognition key="rec" />,
  <div key="w2" className="weave" />,
  <Media key="media" />,
  <Skills key="skills" />,
  <Contact key="contact" />,
];

export default function App() {
  const [pal, setPal] = useState(false);
  const [mounted, setMounted] = useState(0);
  const total = STAGES.length;

  // Mount one more block per idle slot (after the first paint).
  useEffect(() => {
    if (mounted >= total) return;
    const w = window as IdleWindow;
    let id = 0;
    const next = () => setMounted((m) => Math.min(m + 1, total));
    if (mounted === 0) {
      id = window.setTimeout(next, 60);
      return () => clearTimeout(id);
    }
    if (w.requestIdleCallback) {
      id = w.requestIdleCallback(next, { timeout: 250 });
      return () => (window as unknown as { cancelIdleCallback?: (i: number) => void }).cancelIdleCallback?.(id);
    }
    id = window.setTimeout(next, 30);
    return () => clearTimeout(id);
  }, [mounted, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Pause CSS animations in sections that are off-screen (big win for style/layout cost).
  useEffect(() => {
    const els = document.querySelectorAll("section, .marquee");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)),
      { rootMargin: "120px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted]);

  // Anchor links use native smooth scrolling. If the target block isn't mounted yet, mount everything first.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const sel = a.getAttribute("href")!;
      if (document.querySelector(sel)) return; // native scroll handles it
      e.preventDefault();
      setMounted(total);
      setTimeout(() => document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" }), 150);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [total]);

  return (
    <>
      <Loader />
      <Magnetic />
      <Nav onPalette={() => setPal(true)} rev={mounted} />
      <Palette open={pal} onClose={() => setPal(false)} />
      <main id="main">
        <Hero />
        <Marquee />
        {STAGES.slice(0, mounted)}
      </main>
      <footer>© 2026 BVS Satya Prabhas · satyaprabhas.dev · Built with React, Three.js &amp; GSAP</footer>
    </>
  );
}
