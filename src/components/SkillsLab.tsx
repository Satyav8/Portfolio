import { useEffect, useState, type CSSProperties } from "react";
import { Reveal, SectionHead } from "./ui";

type Tool = { n: string; use: string[]; note?: string };
type Cat = { key: string; blurb: string; tools: Tool[] };

const ALL = ["2Care", "KIRO", "S.A.M", "Broca", "Recovery", "EmoLens", "ML Challenge", "Octacomm"];

const CATS: Cat[] = [
  {
    key: "Voice AI",
    blurb: "The pieces of a phone agent: orchestration, ears, brain, mouth and the line itself.",
    tools: [
      { n: "Vapi", use: ["2Care", "KIRO"], note: "Voice orchestration: turn-taking, backchanneling and tool calls." },
      { n: "Deepgram Nova-2", use: ["2Care"], note: "Speech-to-text tuned for Indian English (en-IN), about 130ms." },
      { n: "Soniox", use: ["KIRO"], note: "Transcription for parents speaking Indian languages and dialects." },
      { n: "Cartesia", use: ["KIRO"], note: "KIRO's voice." },
      { n: "Azure Neural TTS", use: ["2Care"], note: "en-IN Neerja voice for natural Indian-accented replies." },
      { n: "Twilio", use: ["2Care", "Recovery"], note: "The phone line for 2Care, and automated alerts in Recovery Intelligence." },
      { n: "Tool calling", use: ["2Care"], note: "Six tools behind a single webhook: list, check, book, reschedule, cancel, lookup." },
      { n: "Latency tuning", use: ["2Care"], note: "Sub-1.5s round trip from caller's last word to the agent's reply." },
    ],
  },
  {
    key: "LLMs",
    blurb: "Choosing the right model for the job, and building around its weak spots.",
    tools: [
      { n: "GPT-4o-mini", use: ["2Care"], note: "Fast, cheap, and follows structured flows well." },
      { n: "Gemini Flash", use: ["KIRO"], note: "KIRO's LLM, part of a stack that runs at about $0.085 per call minute." },
      { n: "Groq", use: ["Broca"], note: "Inference for Broca's chatbot and report interpretation." },
      { n: "OpenAI moderation", use: ["S.A.M"], note: "One of three independent safety layers, each failing open." },
      { n: "Prompt engineering", use: ["2Care", "KIRO", "S.A.M"], note: "Moving rules out of a 22,000-character prompt into isolated layers." },
      { n: "Retrieval (RAG)", use: ["S.A.M"], note: "FAQ retrieval from a vector store for grounded answers." },
    ],
  },
  {
    key: "ML & Data",
    blurb: "Classical ML craft: features, evaluation, and not fooling yourself.",
    tools: [
      { n: "LightGBM", use: ["ML Challenge"], note: "Gradient-boosted pair scorer, at most 500 trees, threshold tuned for macro F0.5." },
      { n: "Feature engineering", use: ["ML Challenge", "Octacomm"], note: "41 pair features for entity matching; accuracy gains at Octacomm." },
      { n: "NLP", use: ["EmoLens", "Broca", "Octacomm"] },
      { n: "Deep learning", use: ["EmoLens"], note: "Multimodal emotion detection across 7 categories." },
      { n: "OCR", use: ["Broca"], note: "Reads lab reports and grocery receipts, including noisy scans." },
      { n: "Hyperparameter tuning", use: ["Octacomm"] },
      { n: "ETL testing", use: ["Octacomm"], note: "Data validation workflows that cut data quality issues by 30%." },
      { n: "Model deployment", use: ["EmoLens", "2Care"] },
    ],
  },
  {
    key: "Backend & Web",
    blurb: "The unglamorous parts that keep an agent up at 2am.",
    tools: [
      { n: "FastAPI", use: ["2Care", "Broca", "Recovery"], note: "Thin, typed and deployable in one push." },
      { n: "PostgreSQL", use: ["2Care"], note: "On Railway in production, SQLite locally." },
      { n: "SQLite", use: ["Broca"] },
      { n: "SQLAlchemy", use: ["Recovery", "2Care"] },
      { n: "Qdrant", use: ["S.A.M"], note: "Vector store behind the FAQ retrieval." },
      { n: "Supabase", use: ["S.A.M"], note: "Storage, with a startup guard that refuses to boot on data-losing config." },
      { n: "React", use: ["Recovery"] },
      { n: "Streamlit", use: ["Broca"] },
      { n: "Railway", use: ["2Care"], note: "Hosts the 2Care backend and Postgres." },
      { n: "REST APIs", use: ["2Care", "Broca", "Recovery"] },
    ],
  },
  {
    key: "Languages & Tools",
    blurb: "The everyday toolbox.",
    tools: [
      { n: "Python", use: ALL, note: "My main language across every project here." },
      { n: "JavaScript", use: ["Recovery"] },
      { n: "Java", use: [] },
      { n: "C", use: [] },
      { n: "Git & GitHub", use: [], note: "I also taught a Git & GitHub session to students." },
      { n: "Docker", use: [] },
      { n: "Postman", use: [] },
      { n: "Jupyter", use: [] },
    ],
  },
];

const HIGHLIGHTS = [
  { i: "◆", k: "Top 1.53%", v: "Amazon ML Challenge 2026, with Team Horizon" },
  { i: "♪", k: "Voice Agent-a-thon", v: "Winner, with the 2Care voice agent" },
  { i: "★", k: "1st Place", v: "Sudhee Hackathon at CBIT" },
  { i: "⚑", k: "2care.ai", v: "Secured an internship" },
  { i: "◎", k: "OpenAI", v: "Represented IARE at a national-level hackathon by OpenAI" },
  { i: "∑", k: "IIT Guwahati", v: "Minor in Data Science & Machine Learning" },
  { i: "♛", k: "Vice-Chairperson", v: "ACM x IARE Hyderabad, leading 50+ members" },
  { i: "▶", k: "NxtWave", v: "A 1-hour podcast and a YouTube feature" },
  { i: "✦", k: "Google DevFest", v: "Hyderabad 2025" },
];

const STAGES = [
  { t: "Caller", i: "☎", d: "A patient or parent dials a normal phone number, routed through Twilio. No app, no sign-up." },
  { t: "Orchestrate", i: "◈", d: "Vapi runs the call: turn-taking, backchanneling, and routing every tool call to my backend." },
  { t: "Listen", i: "◉", d: "Deepgram Nova-2 (en-IN) in 2Care at about 130ms. Soniox in KIRO for Indian languages and dialects." },
  { t: "Think", i: "✦", d: "GPT-4o-mini (2Care) or Gemini Flash (KIRO) decides what to say and which tool to call, one question at a time." },
  { t: "Act", i: "⚙", d: "Tool calls hit a FastAPI webhook: list doctors, check slots, book, reschedule, cancel. Postgres on Railway stores the result." },
  { t: "Speak", i: "♪", d: "Azure Neerja (2Care) or Cartesia (KIRO) speaks the reply. Whole round trip: under 1.5 seconds." },
];

function Pipeline() {
  const [a, setA] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setA((v) => (v + 1) % STAGES.length), 2600);
    return () => clearInterval(t);
  }, [auto]);
  return (
    <div className="pipe">
      <div className="pipe-head">
        <div className="eyebrow">Anatomy of a voice call</div>
        <button className="replay" onClick={() => setAuto(!auto)}>{auto ? "❚❚ Pause" : "▶ Auto-play"}</button>
      </div>
      <div className="pipe-row" style={{ "--p": a / (STAGES.length - 1) } as CSSProperties}>
        <div className="pipe-line"><i /></div>
        {STAGES.map((s, i) => (
          <button key={s.t} className={`pnode ${i === a ? "on" : ""} ${i < a ? "done" : ""}`} onClick={() => { setA(i); setAuto(false); }}>
            <span className="pico">{s.i}</span>
            <b>{s.t}</b>
          </button>
        ))}
      </div>
      <p className="pipe-detail" key={a}>{STAGES[a].d}</p>
    </div>
  );
}

export function Skills() {
  const [ci, setCi] = useState(0);
  const [ti, setTi] = useState(0);
  const cat = CATS[ci];
  const tool = cat.tools[Math.min(ti, cat.tools.length - 1)];
  const total = CATS.reduce((n, c) => n + c.tools.length, 0);

  const pick = (i: number) => { setCi(i); setTi(0); };
  const glow = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="skills">
      <div className="wrap">
        <SectionHead eyebrow="07 / Toolbox">Tools I <em>reach for.</em></SectionHead>
        <Reveal><p className="lead">{total} tools I have actually shipped with, grouped by what they do. Pick one to see where I used it and why.</p></Reveal>

        <Reveal delay={0.05}><Pipeline /></Reveal>

        <Reveal delay={0.1}>
          <div className="lab">
            <div className="lab-tabs" role="tablist">
              {CATS.map((c, i) => (
                <button key={c.key} role="tab" aria-selected={i === ci} className={i === ci ? "on" : ""} onClick={() => pick(i)}>
                  {c.key}<small>{c.tools.length}</small>
                </button>
              ))}
            </div>
            <p className="lab-blurb">{cat.blurb}</p>
            <div className="lab-body">
              <div className="tiles">
                {cat.tools.map((t, i) => (
                  <button
                    key={t.n} className={`tile ${i === ti ? "on" : ""}`}
                    onMouseEnter={() => setTi(i)} onFocus={() => setTi(i)} onClick={() => setTi(i)} onMouseMove={glow}
                  >
                    <span className="tn">{t.n}</span>
                    {t.use.length > 0 && <span className="tc">{t.use.length === ALL.length ? "everywhere" : `×${t.use.length}`}</span>}
                  </button>
                ))}
              </div>
              <div className="detail" key={tool.n}>
                <div className="d-tag">{cat.key}</div>
                <h3>{tool.n}</h3>
                <p>{tool.note ?? "Part of my working toolbox."}</p>
                <div className="d-use">
                  <small>{tool.use.length ? "Used in" : "How I use it"}</small>
                  <div>
                    {tool.use.length
                      ? tool.use.map((u) => <a key={u} href="#projects" className="used">{u}</a>)
                      : <span className="used ghost">Everyday toolbox</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="hl-head"><div className="eyebrow">Profile highlights</div><h4>The short version.</h4></div>
          <div className="hl-grid">
            {HIGHLIGHTS.map((h, i) => (
              <div className="hl" key={h.k} style={{ "--i": i } as CSSProperties}>
                <span className="hl-i">{h.i}</span>
                <b>{h.k}</b>
                <small>{h.v}</small>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
