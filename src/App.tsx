import { useEffect, useState } from "react";
import { Loader, Magnetic, Nav, Palette } from "./components/Chrome";
import { Contact, Hero } from "./components/Sections";
import Work from "./components/Work";
import { goTo, isTabId } from "./lib/tabs";
import { initAnalytics, track } from "./lib/analytics";

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
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const raw = a.getAttribute("href")!;
      if (raw.startsWith("#")) {
        const id = raw.slice(1);
        if (id && isTabId(id)) { e.preventDefault(); goTo(id); }
        return;
      }
      if (raw.startsWith("mailto:")) { track("email_click"); return; }
      if (a.hostname && a.hostname !== location.hostname) {
        const host = a.hostname.replace(/^www\./, "");
        if (host.includes("linkedin.com")) track("linkedin_click");
        else if (host.includes("github.com")) track("github_click", { path: a.pathname.slice(0, 80) });
        else track("outbound_click", { host });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Analytics loads after the page is idle so it never affects load speed.
  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(initAnalytics, { timeout: 4000 });
    else setTimeout(initAnalytics, 2000);
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
      <footer>© 2026 BVS Satya Prabhas · satyaprabhas.dev · Built with React &amp; Three.js · Privacy-friendly analytics, no cookies</footer>
    </>
  );
}
