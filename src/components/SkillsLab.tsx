const GROUPS = [
  { k: "Voice AI", t: ["Vapi", "Deepgram", "Soniox", "Cartesia", "Azure TTS", "Twilio"] },
  { k: "Models", t: ["GPT-4o-mini", "Gemini Flash", "Groq", "LightGBM", "NLP", "OCR"] },
  { k: "Backend & data", t: ["Python", "FastAPI", "PostgreSQL", "Qdrant", "Supabase", "React"] },
  { k: "Ship", t: ["Railway", "Docker", "Git", "REST APIs"] },
];

/** Tools I reach for: one compact card, four labelled rows. */
export function ToolsCard() {
  return (
    <div className="tools">
      {GROUPS.map((g) => (
        <div className="tg" key={g.k}>
          <span className="tk">{g.k}</span>
          <div className="chips">{g.t.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
        </div>
      ))}
    </div>
  );
}
