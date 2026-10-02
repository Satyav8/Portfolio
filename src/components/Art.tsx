import { useEffect, useState, type CSSProperties } from "react";

/** Animated SVG/CSS visuals, one per project. Purely illustrative; labelled as such where they show data. */

function Wave() {
  const bars = Array.from({ length: 44 }, (_, i) => i);
  return (
    <div className="art art-wave">
      <div className="bars">
        {bars.map((i) => (
          <i key={i} style={{ "--i": i, "--h": `${30 + Math.abs(Math.sin(i * 0.7)) * 70}%` } as CSSProperties} />
        ))}
      </div>
      <div className="art-chips"><span>STT ~130ms</span><span>LLM + tools</span><span>TTS</span><b>&lt; 1.5s round trip</b></div>
    </div>
  );
}

const GREETINGS = ["नमस्ते", "నమస్కారం", "Hello", "Namaste"];
function Languages() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % GREETINGS.length), 1800);
    return () => clearInterval(t);
  }, []);
  const fields = ["child age", "family setup", "concern", "sentiment", "severity"];
  return (
    <div className="art art-kiro">
      <div className="bubble" key={i}>{GREETINGS[i]}</div>
      <div className="fields">
        {fields.map((f, k) => <span key={f} style={{ "--k": k } as CSSProperties}>{f}</span>)}
      </div>
      <small>spoken call → structured case file</small>
    </div>
  );
}

function Layers() {
  const L = [
    { t: "regex short-circuit · $0", w: 100, c: "#f2b84b" },
    { t: "isolated classifiers", w: 82, c: "#e8923a" },
    { t: "pass 1 → pass 2 (LLM)", w: 64, c: "#e0262d" },
    { t: "3 safety layers", w: 46, c: "#8f1217" },
  ];
  return (
    <div className="art art-layers">
      {L.map((l, i) => (
        <div key={l.t} className="layer" style={{ width: `${l.w}%`, background: l.c, "--i": i } as CSSProperties}>{l.t}</div>
      ))}
      <i className="drop" />
    </div>
  );
}

function Glucose() {
  const pts: [number, number][] = [[0, 70], [20, 62], [40, 72], [60, 58], [80, 52], [100, 60], [120, 66], [140, 74], [160, 80]];
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0] + 10},${p[1]}`).join(" ");
  return (
    <div className="art art-glucose">
      <svg viewBox="0 0 280 130" preserveAspectRatio="xMidYMid meet">
        <rect x="10" y="95" width="260" height="25" fill="rgba(224,38,45,.14)" />
        <line x1="10" y1="95" x2="270" y2="95" stroke="#e0262d" strokeDasharray="3 4" />
        <text x="12" y="92" fontSize="8" fill="#ff9a9e" fontFamily="monospace">low threshold</text>
        <path className="line" d={path} fill="none" stroke="#f2b84b" strokeWidth="2.4" strokeLinecap="round" />
        <path className="line fc" d="M170,80 L195,94 L220,108 L245,118" fill="none" stroke="#e0262d" strokeWidth="2.4" strokeDasharray="5 5" strokeLinecap="round" />
        <circle className="ping" cx="245" cy="118" r="5" fill="#e0262d" />
        <text x="150" y="20" fontSize="9" fill="#f6efe4" fontFamily="monospace">forecast: low in 30 min</text>
      </svg>
      <small>illustrative CGM trace</small>
    </div>
  );
}

function Risk() {
  return (
    <div className="art art-risk">
      <svg viewBox="0 0 200 120">
        <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#6aa84f" /><stop offset=".5" stopColor="#f2b84b" /><stop offset="1" stopColor="#e0262d" /></linearGradient></defs>
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="url(#rg)" strokeWidth="12" strokeLinecap="round" />
        <g className="needle"><line x1="100" y1="100" x2="100" y2="38" stroke="#f6efe4" strokeWidth="3" strokeLinecap="round" /><circle cx="100" cy="100" r="7" fill="#f6efe4" /></g>
      </svg>
      <small>risk score → alert</small>
    </div>
  );
}

function Emotions() {
  return (
    <div className="art art-emo">
      {Array.from({ length: 7 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}
      <small>7 emotion categories</small>
    </div>
  );
}

function Pipeline() {
  const N = ["normalize", "block", "41 features", "LightGBM", "assign"];
  return (
    <div className="art art-pipe">
      <div className="nodes">{N.map((n, i) => <span key={n} style={{ "--i": i } as CSSProperties}>{n}</span>)}</div>
      <i className="packet" />
      <small>one-to-one entity matching</small>
    </div>
  );
}

export default function ProjectArt({ id }: { id: string }) {
  switch (id) {
    case "2care": return <Wave />;
    case "kiro": return <Languages />;
    case "geometra": return <Layers />;
    case "broca": return <Glucose />;
    case "recovery": return <Risk />;
    case "emolens": return <Emotions />;
    case "mlc": return <Pipeline />;
    default: return null;
  }
}
