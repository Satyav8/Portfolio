import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { Counter, Reveal } from "./ui";
import { HERO_DELAY } from "./Chrome";
import { track } from "../lib/analytics";
import { heroStats, moments, profile, type Moment } from "../data";

const HeroScene = lazy(() => import("./HeroScene"));

const ROLES = ["voice agents.", "NLP pipelines.", "ML systems.", "things that ship."];
const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Typed() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  useEffect(() => {
    const word = ROLES[i % ROLES.length];
    let n = 0, dir = 1;
    const id = setInterval(() => {
      n += dir;
      setTxt(word.slice(0, n));
      if (n === word.length) { dir = -1; clearInterval(id); setTimeout(() => setI((v) => v + 1), 1400); }
    }, 70);
    return () => clearInterval(id);
  }, [i]);
  return <span className="typed">{txt}</span>;
}

function VoiceBars() {
  return (
    <span className="vbars" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}
    </span>
  );
}

export function Hero() {
  const d = HERO_DELAY;
  return (
    <section className="hero" id="top">
      {!reduced && <Suspense fallback={null}><HeroScene /></Suspense>}
      <div className="wrap">
        <div className="hello">// hello, world — i'm</div>
        <h1>
          <span className="line"><span style={{ "--d": `${d}s` } as CSSProperties}>BVS Satya</span></span>
          <span className="line"><span className="g" style={{ "--d": `${d + 0.15}s` } as CSSProperties}>Prabhas.</span></span>
        </h1>
        <div className="role"><VoiceBars /><b>Voice AI Engineer</b><em>Voice Agent-a-thon winner</em><em>IIT Guwahati · DS &amp; ML Minor</em></div>
        <p className="sub">
          I build <Typed />
          <br />
          Voice agents that listen, reason and act, from Apollo Hospitals to a top 1.53% finish at Amazon ML Challenge 2026.
        </p>
        <div className="cta">
          <a className="btn primary" href="#demo">▶ Hear the voice agent</a>
          <a className="btn" href="#projects">View projects →</a>
          <a className="btn" href="#contact">Get in touch</a>
        </div>
        <div className="stats">
          {heroStats.map((s) => (
            <div className="stat" key={s.label}>
              <Counter to={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RailCard({ m, near }: { m: Moment; near: boolean }) {
  const [play, setPlay] = useState(false);
  return (
    <figure className={`moment rail-card ${m.video ? "is-video" : ""} ${m.wide ? "is-wide" : ""}`}>
      {m.video && play ? (
        <video src={m.video} poster={m.img} controls autoPlay playsInline />
      ) : (
        <img src={near ? m.img : undefined} alt={m.title} decoding="async" draggable={false} />
      )}
      {m.video && !play && <button className="play-btn" onClick={() => { setPlay(true); track("moment_video_play", { video: m.title }); }} aria-label={`Play: ${m.title}`}>▶</button>}
      {!(m.video && play) && <figcaption className="cap"><small>{m.tag}</small><h4>{m.title}</h4><p>{m.text}</p></figcaption>}
    </figure>
  );
}

/** Wins, talks and the stage: a swipeable row of photos and videos. */
export function MomentsRail() {
  const [near, setNear] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.06, el.scrollLeft / max) : 1})`;
  };
  const by = (dir: number) => {
    const el = wrap.current;
    if (el) el.scrollBy({ left: dir * Math.min(560, el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <div className="rail-shell">
      <div className="rail-wrap" ref={wrap} onScroll={onScroll} tabIndex={0} role="region" aria-label="Moments gallery. Swipe or use the arrows to scroll sideways.">
        <div className="rail-track">
          {moments.map((m) => <RailCard key={m.title} m={m} near={near} />)}
        </div>
      </div>
      <div className="rail-ctl">
        <div className="rail-progress" aria-hidden><i ref={bar} /></div>
        <button className="rail-btn" onClick={() => by(-1)} aria-label="Scroll moments left">←</button>
        <button className="rail-btn" onClick={() => by(1)} aria-label="Scroll moments right">→</button>
      </div>
    </div>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    track("email_copy");
    navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal><div className="eyebrow" style={{ justifyContent: "center" }}>Contact</div><h2 className="title">Let&rsquo;s build something <em>that talks back.</em></h2></Reveal>
        <Reveal delay={0.1}>
          <div className="term">
            <div className="bar"><i /><i /><i /></div>
            <div className="body">
              <div><span className="pr">$</span> whoami</div>
              <div>BVS Satya Prabhas — Voice AI Engineer</div>
              <div><span className="pr">$</span> contact --all</div>
              <div>email &nbsp;&nbsp;→ <a href={`mailto:${profile.email}`}>{profile.email}</a></div>
              <div>github &nbsp;→ <a href={profile.github} target="_blank" rel="noreferrer">github.com/Satyav8</a></div>
              <div>linkedin → <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/satyaprabhas--</a></div>
            </div>
          </div>
          <div className="cta" style={{ justifyContent: "center" }}>
            <a className="btn primary" href={`mailto:${profile.email}`}>Say hello →</a>
            <button className="btn" onClick={copy}>{copied ? "Copied ✓" : "Copy email"}</button>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
