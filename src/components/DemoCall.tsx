import { useEffect, useRef, useState } from "react";
import { profile } from "../data";
import { track } from "../lib/analytics";

type Line = { who: "patient" | "agent" | "tool"; text: string };

// The documented 2Care booking flow (from the project README), played as a call.
const SCRIPT: Line[] = [
  { who: "patient", text: "Book with a cardiologist tomorrow at 10am." },
  { who: "tool", text: 'list_doctors(department="Cardiology")' },
  { who: "agent", text: "We have Dr. Hariprasad and Dr. Suresh Rao. Who would you like?" },
  { who: "patient", text: "Harry Prasad, please." },
  { who: "tool", text: 'fuzzy match → "Dr. K. Hariprasad" · check_slots(date)' },
  { who: "agent", text: "Available at 9am, 9:20 and 10am. Which works?" },
  { who: "patient", text: "10am. Name is Satya." },
  { who: "tool", text: "book_appointment(patient, doctor, date, time) → APL······" },
  { who: "agent", text: "Confirmed! Your code is A, P, L, then the digits, one by one." },
];

/** 2Care demo: the real Loom recording plus the call flow replayed as a chat. */
export default function DemoBody() {
  const [n, setN] = useState(0);
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const chat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= SCRIPT.length) clearInterval(id);
    }, 1100);
    return () => clearInterval(id);
  }, [run]);

  useEffect(() => { chat.current?.scrollTo({ top: chat.current.scrollHeight, behavior: "smooth" }); }, [n]);

  return (
    <div className="demo-grid">
      <div>
        <div className="loom">
          {loaded ? (
            <iframe
              src={`${profile.loomEmbed}?autoplay=1&hide_owner=true&hide_share=true&hideEmbedTopBar=true`}
              title="Apollo Voice Agent real-time appointment demo"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button className="facade" onClick={() => { setLoaded(true); track("demo_play"); }} aria-label="Play the Apollo voice agent demo">
              <span className="play">▶</span>
              <b>Apollo Voice Agent: real-time appointment demo</b>
              <small>The 2Care agent I built for the Voice Agent-a-thon, which I won</small>
            </button>
          )}
        </div>
        <div className="demo-meta">
          <a href="https://web-production-c64ce.up.railway.app" target="_blank" rel="noreferrer">Live dashboard ↗</a>
          <a href={profile.loom} target="_blank" rel="noreferrer">Open on Loom ↗</a>
          <a href="https://github.com/Satyav8/2Care" target="_blank" rel="noreferrer">Source ↗</a>
        </div>
      </div>
      <div className="phone">
        <div className="phone-head"><i /> <span>Call flow · how the agent reasons</span></div>
        <div className="chat" ref={chat}>
          {SCRIPT.slice(0, n).map((l, i) => (
            <div key={i} className={`msg ${l.who}`}>
              {l.who === "tool" ? <code>{l.text}</code> : l.text}
            </div>
          ))}
          {n > 0 && n < SCRIPT.length && <div className="typing"><i /><i /><i /></div>}
        </div>
        <button className="replay" onClick={() => setRun((r) => r + 1)}>↻ Replay</button>
      </div>
    </div>
  );
}
