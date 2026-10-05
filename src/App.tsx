import { useEffect, useState } from "react";
import { Loader, Magnetic, Nav, Palette } from "./components/Chrome";
import { Contact, Hero } from "./components/Sections";
import Work from "./components/Work";
import { goTo, isTabId } from "./lib/tabs";

export default function App() {
  const [pal, setPal] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Links like #projects / #about switch the tab (and bring the panel into view). Other #links scroll natively.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (id && isTabId(id)) { e.preventDefault(); goTo(id); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Loader />
      <Magnetic />
      <Nav onPalette={() => setPal(true)} rev={0} />
      <Palette open={pal} onClose={() => setPal(false)} />
      <main id="main">
        <Hero />
        <Work />
        <Contact />
      </main>
      <footer>© 2026 BVS Satya Prabhas · satyaprabhas.dev · Built with React &amp; Three.js</footer>
    </>
  );
}
