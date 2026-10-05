import { useEffect, useRef, useState, type KeyboardEvent as RKeyboardEvent, type ReactNode } from "react";
import { TABS, scrollToId, setTab, startedOnTabHash, useTab, type TabId } from "../lib/tabs";
import { experience, projects, type Project } from "../data";
import DemoBody from "./DemoCall";
import Highlights from "./Highlights";
import { MediaPair } from "./Media";
import { MomentsRail } from "./Sections";
import { ToolsCard } from "./SkillsLab";
import Signature from "./Signature";
import { Study, projectArt } from "./ProjectParts";
import { track } from "../lib/analytics";

/* ---------------- projects ---------------- */

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="modal-back" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={p.title} onMouseDown={(e) => e.stopPropagation()}>
        <button ref={closeBtn} className="modal-x" onClick={onClose} aria-label="Close project details">×</button>
        <div className="kicker">{p.kicker}</div>
        <h3>{p.title}</h3>
        <div className="modal-grid">
          {projectArt(p)}
          <div>
            <p>{p.summary}</p>
            {p.metrics.length > 0 && <div className="metrics">{p.metrics.map((m) => <div key={m.l}><b>{m.v}</b><span>{m.l}</span></div>)}</div>}
            <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
            <div className="links">
              {p.links.length ? p.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>) : <em>Case study · source is private</em>}
            </div>
          </div>
        </div>
        <Study id={p.id} defaultOpen />
      </div>
    </div>
  );
}

function ProjectsPanel() {
  const [sel, setSel] = useState<Project | null>(null);
  return (
    <>
      <div className="pgrid">
        {projects.map((p) => (
          <button key={p.id} className={`pcard ${p.featured ? "flag" : ""}`} onClick={() => { setSel(p); track("project_open", { project: p.id }); }} aria-haspopup="dialog">
            <span className="pc-top"><small>{p.kicker}</small>{p.featured && <i title="Flagship project" aria-label="Flagship">★</i>}</span>
            <b className="pc-title">{p.title}</b>
            <span className="pc-line">{p.tagline}</span>
            <span className="pc-foot">
              {p.metrics[0] ? <><em>{p.metrics[0].v}</em><small>{p.metrics[0].l}</small></> : <small>{p.stack.slice(0, 2).join(" · ")}</small>}
              <span className="pc-go">Open →</span>
            </span>
          </button>
        ))}
      </div>
      {sel && <ProjectModal p={sel} onClose={() => setSel(null)} />}
    </>
  );
}

/* ---------------- other panels ---------------- */

function ExperiencePanel() {
  return (
    <div className="xgrid">
      {experience.map((e) => (
        <article className="xcard" key={e.org}>
          <div className="when">{e.when}</div>
          <h3>{e.org}</h3>
          <h4>{e.role}</h4>
          <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </article>
      ))}
    </div>
  );
}

function RecognitionPanel() {
  return (
    <div className="rpanel">
      <Highlights />
      <div className="eyebrow">Moments</div>
      <MomentsRail />
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="apanel">
      <div className="a-left">
        <div className="collage">
          <figure className="c-main"><img src="/assets/1.webp" alt="Satya in a suit and Assamese gamosa in front of IIT Guwahati" width="1024" height="1536" loading="lazy" /><figcaption>IIT Guwahati · Graduation</figcaption></figure>
          <figure className="c-b"><img src="/assets/iitg-ceremony.webp" alt="Satya receiving a certificate on stage at the IIT Guwahati certificate distribution ceremony" width="1600" height="717" loading="lazy" /><figcaption>Certificate ceremony</figcaption></figure>
          <figure className="c-c"><img src="/assets/iitg-batch.webp" alt="The graduating batch outside the IIT Guwahati main building" width="1600" height="717" loading="lazy" /><figcaption>The batch</figcaption></figure>
          <figure className="c-d"><img src="/assets/2.webp" alt="Satya sitting on a bench on the IIT Guwahati campus" width="1600" height="717" loading="lazy" /><figcaption>On campus</figcaption></figure>
        </div>
        <ToolsCard />
      </div>
      <div className="a-right">
        <p>I&rsquo;m someone who started out simply wanting to understand how things work, and somehow ended up deep in the world of AI.</p>
        <p>
          Over the past few years, I&rsquo;ve explored everything from software engineering and machine learning to LLMs, voice AI, and building things that actually work outside a notebook. I&rsquo;ve interned, built projects, broken things, fixed them, learned way more than I expected to&mdash;and slowly figured out that I enjoy being at the intersection of <strong>engineering and intelligence</strong>.
        </p>
        <p>
          I&rsquo;m still learning, still experimenting, and probably always will be. Right now, I&rsquo;m focused on becoming the kind of engineer who doesn&rsquo;t just use AI, but <strong>builds with it, understands it, and pushes it further.</strong>
        </p>
        <p>I like difficult problems, messy ideas, and turning &ldquo;what if?&rdquo; into something real.</p>
        <Signature />
      </div>
    </div>
  );
}

/* ---------------- the tabbed work panel ---------------- */

export default function Work() {
  const tab = useTab();
  const list = useRef<HTMLDivElement>(null);

  // Arrived on a link like /#about: bring the panel into view once.
  useEffect(() => {
    if (startedOnTabHash()) { const t = setTimeout(() => scrollToId("work"), 400); return () => clearTimeout(t); }
  }, []);

  // Keep the active tab visible inside the scrollable tab bar on phones (horizontal only, never moves the page).
  useEffect(() => {
    const bar = list.current;
    const el = bar?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (bar && el) bar.scrollTo({ left: el.offsetLeft - bar.clientWidth / 2 + el.offsetWidth / 2, behavior: "auto" });
  }, [tab]);

  const onKey = (e: RKeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  const panels: Record<TabId, ReactNode> = {
    projects: <ProjectsPanel />,
    demo: <DemoBody />,
    experience: <ExperiencePanel />,
    recognition: <RecognitionPanel />,
    media: <MediaPair />,
    about: <AboutPanel />,
  };

  return (
    <section id="work" className="work">
      <div className="wrap">
        <div className="tabs-wrap">
          <div className="tabs" role="tablist" aria-label="Portfolio sections" ref={list} onKeyDown={onKey}>
            {TABS.map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                className="tab"
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="panel" key={tab} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {panels[tab]}
        </div>
      </div>
    </section>
  );
}
