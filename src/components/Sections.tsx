import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Counter, Reveal, SectionHead, useInView } from "./ui";
import ProjectArt from "./Art";
import DemoCall from "./DemoCall";
import { HERO_DELAY } from "./Chrome";
import { studies } from "../studies";
import { experience, heroStats, marquee, moments, moreRepos, profile, projects, type Moment, type Project } from "../data";

gsap.registerPlugin(ScrollTrigger);
const HeroScene = lazy(() => import("./HeroScene"));
export { DemoCall };

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
          <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">Resume ↗</a>
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
      <div className="scroll-hint">SCROLL ↓</div>
    </section>
  );
}

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden>
      <div className="track">{items.map((m, i) => <span key={i}>{m}</span>)}</div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <Reveal>
          <div className="collage">
            <figure className="c-main"><img src="/assets/1.jpg" alt="Satya in a suit and Assamese gamosa in front of IIT Guwahati" width="1024" height="1536" loading="lazy" /><figcaption>IIT Guwahati · Graduation</figcaption></figure>
            <figure className="c-b"><img src="/assets/iitg-ceremony.webp" alt="Satya receiving a certificate on stage at the IIT Guwahati certificate distribution ceremony" width="1600" height="717" loading="lazy" /><figcaption>Certificate ceremony</figcaption></figure>
            <figure className="c-c"><img src="/assets/iitg-batch.webp" alt="The graduating batch outside the IIT Guwahati main building" width="1600" height="717" loading="lazy" /><figcaption>The batch</figcaption></figure>
            <figure className="c-d"><img src="/assets/2.jpg" alt="Satya sitting on a bench on the IIT Guwahati campus" width="1600" height="717" loading="lazy" /><figcaption>On campus</figcaption></figure>
          </div>
          </Reveal>
        <div>
          <SectionHead eyebrow="02 / About">AI that picks up the <em>phone.</em></SectionHead>
          <Reveal delay={0.1}>
            <p>
              I'm a <strong>Voice AI Engineer</strong>. I build agents that answer real calls, understand Indian accents and dialects, and get real things done: booking hospital appointments, or turning a worried parent's call into a case file a psychologist can act on.
            </p>
            <p>
              Under the hood it's ML craft: feature engineering, LightGBM, NLP and evaluation. That is what took <strong>Team Horizon to the top 1.53% at Amazon ML Challenge 2026</strong>, and why my agents ship with automated evals and test suites.
            </p>
            <p>
              I recently completed a <strong>Minor in Data Science &amp; Machine Learning at IIT Guwahati</strong> alongside my B.Tech in CSE, and I'm Vice-Chairperson of ACM x IARE Hyderabad, where I teach, organise hackathons and lead 50+ members.
            </p>
            <div className="chips">
              {["Voice AI", "Python", "FastAPI", "LLMs", "NLP", "React", "ETL"].map((c) => <span className="chip" key={c}>{c}</span>)}
            </div>
            <div className="edu">
              <div><b>IIT Guwahati: Minor in Data Science &amp; ML</b><span>September 2026</span></div>
              <div><b>Institute of Aeronautical Engineering: B.Tech CSE</b><span>CGPA 9.0 / 10 · Expected May 2027</span></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Card({ p, idx }: { p: Project; idx: number }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const [open, setOpen] = useState(false);
  const st = studies[p.id];
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--ry", `${(x - 0.5) * 4}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 4}deg`);
  };
  const reset = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  const art = p.gallery
    ? (
      <div className="viz gal">
        <div className="g-grid">
          {p.gallery.map((g, i) => <img key={g.src} className={i === 0 ? "g0" : ""} src={g.src} alt={g.alt} loading="lazy" />)}
        </div>
      </div>
    )
    : p.shot
      ? <div className="viz shot"><img src={p.shot.src} alt={p.shot.alt} loading="lazy" /></div>
      : <div className="viz" aria-hidden><ProjectArt id={p.id} /></div>;
  const flip = p.featured && idx % 2 === 1;
  return (
    <div ref={ref} className={`card reveal ${seen ? "in" : ""} ${p.featured ? "featured" : ""} ${flip ? "alt" : ""}`} onMouseMove={onMove} onMouseLeave={reset}>
      {!p.featured && art}
      <div style={flip ? { order: 2 } : undefined}>
        <div className="kicker">{p.kicker}</div>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        {p.metrics.length > 0 && <div className="metrics">{p.metrics.map((m) => <div key={m.l}><b>{m.v}</b><span>{m.l}</span></div>)}</div>}
        <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="links">
          {p.links.length ? p.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>) : <em>Case study · source is private</em>}
        </div>
      </div>
      {p.featured && art}
      {st && (
        <div className={`study ${open ? "open" : ""}`}>
          <button className="study-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "Hide case study −" : "Read case study +"}
          </button>
          <div className="study-body"><div>
            <div className="study-cols">
              <div><h5>The problem</h5><p>{st.problem}</p><h5>The result</h5><p className="res">{st.result}</p></div>
              <div><h5>How it works</h5><ul>{st.approach.map((a) => <li key={a}>{a}</li>)}</ul></div>
            </div>
            {st.why && (
              <table className="why"><tbody>{st.why.map((w) => (
                <tr key={w.layer}><td>{w.layer}</td><td>{w.choice}</td><td>{w.reason}</td></tr>
              ))}</tbody></table>
            )}
          </div></div>
        </div>
      )}
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects">
      <div className="wrap">
        <SectionHead eyebrow="03 / Selected work">Systems I've <em>built and shipped.</em></SectionHead>
        <div className="proj-grid">{projects.map((p, i) => <Card p={p} idx={i} key={p.id} />)}</div>
        <Reveal>
          <div className="repos">
            {moreRepos.map((r) => (
              <a key={r.name} href={`${profile.github}/${r.name}`} target="_blank" rel="noreferrer">{r.name}<small>{r.lang}</small></a>
            ))}
            <a href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">All 33 repos →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLElement>(null);
  useEffect(() => {
    const t = gsap.to(fill.current, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: wrapRef.current, start: "top 70%", end: "bottom 70%", scrub: true },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return (
    <section id="experience" style={{ background: "var(--bg2)" }}>
      <div className="wrap">
        <SectionHead eyebrow="04 / Experience">Four internships. <em>Shipped work.</em></SectionHead>
        <div className="timeline" ref={wrapRef}>
          <div className="rail"><i ref={fill} /></div>
          {experience.map((e) => (
            <Reveal key={e.org} className="tl-item">
              <div className="when">{e.when}</div>
              <h3>{e.org}</h3>
              <h4>{e.role}</h4>
              <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RailCard({ m }: { m: Moment }) {
  const [play, setPlay] = useState(false);
  return (
    <figure className={`moment rail-card ${m.video ? "is-video" : ""} ${m.wide ? "is-wide" : ""}`}>
      {m.video && play ? (
        <video src={m.video} poster={m.img} controls autoPlay playsInline />
      ) : (
        <img src={m.img} alt={m.title} decoding="async" draggable={false} />
      )}
      {m.video && !play && <button className="play-btn" onClick={() => setPlay(true)} aria-label={`Play: ${m.title}`}>▶</button>}
      {!(m.video && play) && <figcaption className="cap"><small>{m.tag}</small><h4>{m.title}</h4><p>{m.text}</p></figcaption>}
    </figure>
  );
}

function MomentsRail() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const dist = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
      const tween = gsap.to(track.current, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: wrap.current, pin: true, scrub: 0.6, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => mm.revert();
  }, []);
  const bar = useRef<HTMLElement>(null);
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.08, el.scrollLeft / max) : 1})`;
  };
  return (
    <>
    <div className="rail-wrap" ref={wrap} onScroll={onScroll}>
      <div className="rail-track" ref={track}>
        <div className="rail-intro">
          <div className="eyebrow">Moments</div>
          <h3>Wins, talks<br />and the <em>stage.</em></h3>
          <p>Hackathon podium, classrooms, a lecture hall and graduation. Scroll sideways.</p>
        </div>
        {moments.map((m) => <RailCard key={m.title} m={m} />)}
      </div>
    </div>
    <div className="rail-progress" aria-hidden><i ref={bar} /></div>
    </>
  );
}

export function Recognition() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  return (
    <section id="recognition" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <SectionHead eyebrow="05 / Recognition & events">Top 1.53%, a podium and <em>a stage.</em></SectionHead>
        <Reveal>
          <div className="mlc">
            <div ref={ref} className={`gauge ${seen ? "in" : ""}`}>
              <svg viewBox="0 0 200 200" aria-hidden>
                <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2b84b" /><stop offset="1" stopColor="#e0262d" /></linearGradient></defs>
                <circle className="bgc" cx="100" cy="100" r="95" pathLength={600} />
                <circle className="fg" cx="100" cy="100" r="95" pathLength={600} />
              </svg>
              <div className="mid"><b>98.47</b><span>PERCENTILE</span></div>
            </div>
            <div>
              <div className="eyebrow">Team Horizon · Harsha · Manikanta · Murali · Satya</div>
              <h3>Amazon ML Challenge 2026: score 97.0, top 1.53%.</h3>
              <p>
                Team Horizon (Harsha, Manikanta, Murali and I) finished in the top 1.53% of the Amazon ML Challenge with a score of 97.0. The solution: normalization, blocking, 41 engineered pair features, LightGBM and one-to-one assignment, running on a laptop with no GPU.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
      <MomentsRail />
      <div className="wrap" style={{ paddingTop: 60 }}>
        <Reveal>
          <div className="vc">
            <b>Vice-Chairperson, ACM x IARE Hyderabad</b>
            <span>Leading a 50+ member technical community, running AI/ML workshops and cross-campus hackathons. Represented the institute at a national-level hackathon by OpenAI.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { Media } from "./Media";
export { Skills } from "./SkillsLab";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal><div className="eyebrow" style={{ justifyContent: "center" }}>08 / Contact</div><h2 className="title">Let's build something <em>that talks back.</em></h2></Reveal>
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
            <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">Resume ↗</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
