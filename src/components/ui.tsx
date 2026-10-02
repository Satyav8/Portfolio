import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12);
  return (
    <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

export function Counter({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [ref, seen] = useInView<HTMLElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - t0) / 1800, 1);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return (
    <b ref={ref}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </b>
  );
}

export function SectionHead({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <Reveal>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="title">{children}</h2>
    </Reveal>
  );
}
