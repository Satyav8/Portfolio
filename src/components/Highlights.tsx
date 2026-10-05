import type { CSSProperties } from "react";

const HIGHLIGHTS = [
  { i: "◆", k: "Top 1.53%", v: "Amazon ML Challenge 2026, with Team Horizon (Harsha, Manikanta, Murali and me)" },
  { i: "♪", k: "Voice Agent-a-thon", v: "Winner, with the 2Care voice agent" },
  { i: "★", k: "1st Place", v: "Sudhee Hackathon at CBIT" },
  { i: "⚑", k: "2care.ai", v: "Secured an internship" },
  { i: "◎", k: "OpenAI", v: "Represented IARE at a national-level hackathon by OpenAI" },
  { i: "∑", k: "IIT Guwahati", v: "Minor in Data Science & Machine Learning" },
  { i: "♛", k: "Vice-Chairperson", v: "ACM x IARE Hyderabad, leading 50+ members" },
  { i: "▶", k: "NxtWave", v: "A 1-hour podcast and a YouTube feature" },
  { i: "✦", k: "Google DevFest", v: "Hyderabad 2025" },
];

/** The short version: scannable proof points. */
export default function Highlights() {
  return (
    <div className="hl-grid">
      {HIGHLIGHTS.map((h, i) => (
        <div className="hl" key={h.k} style={{ "--i": i } as CSSProperties}>
          <span className="hl-i">{h.i}</span>
          <b>{h.k}</b>
          <small>{h.v}</small>
        </div>
      ))}
    </div>
  );
}
