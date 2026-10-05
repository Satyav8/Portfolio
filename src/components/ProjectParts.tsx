import { useState, type ReactNode } from "react";
import ProjectArt from "./Art";
import { studies } from "../studies";
import type { Project } from "../data";

/** The visual for a project: screenshot gallery, single screenshot, or an animated illustration. */
export function projectArt(p: Project): ReactNode {
  if (p.gallery) {
    return (
      <div className="viz gal">
        <div className="g-grid">
          {p.gallery.map((g, i) => <img key={g.src} className={i === 0 ? "g0" : ""} src={g.src} alt={g.alt} loading="lazy" />)}
        </div>
      </div>
    );
  }
  if (p.shot) return <div className="viz shot"><img src={p.shot.src} alt={p.shot.alt} loading="lazy" /></div>;
  return <div className="viz" aria-hidden><ProjectArt id={p.id} /></div>;
}

/** "Read case study +" panel (problem / how it works / result). */
export function Study({ id, defaultOpen = false }: { id: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const st = studies[id];
  if (!st) return null;
  return (
    <div className={`study ${open ? "open" : ""}`}>
      <button className="study-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "Hide case study −" : "Read case study +"}
      </button>
      <div className="study-body"><div>
        <div className="study-cols">
          <div><h4>The problem</h4><p>{st.problem}</p><h4>The result</h4><p className="res">{st.result}</p></div>
          <div><h4>How it works</h4><ul>{st.approach.map((a) => <li key={a}>{a}</li>)}</ul></div>
        </div>
        {st.why && (
          <table className="why"><tbody>{st.why.map((w) => (
            <tr key={w.layer}><td>{w.layer}</td><td>{w.choice}</td><td>{w.reason}</td></tr>
          ))}</tbody></table>
        )}
      </div></div>
    </div>
  );
}

/** Compact one-line project that expands to the full details. */
export function ProjectRow({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`prow ${open ? "open" : ""}`}>
      <button className="prow-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="pr-main"><small>{p.kicker}</small><b>{p.title}</b></span>
        <span className="pr-line">{p.tagline}</span>
        <span className="pr-met">{p.metrics.slice(0, 2).map((m) => <span key={m.l}><b>{m.v}</b><small>{m.l}</small></span>)}</span>
        <span className="pr-i" aria-hidden>+</span>
      </button>
      <div className="prow-body" aria-hidden={!open}><div>
        <div className="prow-grid">
          {projectArt(p)}
          <div>
            <p>{p.summary}</p>
            <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
            <div className="links">
              {p.links.length ? p.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>{l.label} ↗</a>) : <em>Case study · source is private</em>}
            </div>
            <Study id={p.id} />
          </div>
        </div>
      </div></div>
    </div>
  );
}
