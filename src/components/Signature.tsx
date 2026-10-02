import { useEffect, useRef, useState } from "react";

/** The hand-signed autograph. Plays once when scrolled into view and holds; click to replay. */
export default function Signature() {
  const box = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((r) => r || 1); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button ref={box} className="sig" onClick={() => setRun((r) => r + 1)} aria-label="Signature of BVS Satya Prabhas. Click to replay.">
      {reduce
        ? <img src="/assets/signature-static.webp" alt="" width="900" height="237" />
        : run > 0 && <img key={run} src={`/assets/signature.webp?v=${run}`} alt="" width="900" height="237" decoding="async" />}
      <span className="sig-hint" aria-hidden>↻ replay</span>
    </button>
  );
}
