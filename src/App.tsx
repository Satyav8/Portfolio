import { useEffect, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cursor, Loader, Nav, Palette } from "./components/Chrome";
import { About, Contact, DemoCall, Experience, Hero, Marquee, Media, Projects, Recognition, Skills } from "./components/Sections";

export default function App() {
  const [pal, setPal] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -60 });
    };
    document.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", onClick); lenis.destroy(); };
  }, []);

  return (
    <>
      <Loader />
      <Cursor />
      <Nav onPalette={() => setPal(true)} />
      <Palette open={pal} onClose={() => setPal(false)} />
      <main id="main">
        <Hero />
        <Marquee />
        <DemoCall />
        <About />
        <div className="weave" />
        <Projects />
        <Experience />
        <Recognition />
        <div className="weave" />
        <Media />
        <Skills />
        <Contact />
      </main>
      <footer>© 2026 BVS Satya Prabhas · satyaprabhas.dev · Built with React, Three.js &amp; GSAP</footer>
    </>
  );
}
