import { useEffect, useState } from "react";
import { profile } from "../data";
import { Reveal, SectionHead, useInView } from "./ui";

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

export default function DemoCall() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [n, setN] = useState(0);
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!seen) return;
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= SCRIPT.length) clearInterval(id);
    }, 1200);
    return () => clearInterval(id);
  }, [seen, run]);

  return (
    <section id="demo">
      <div className="wrap">
        <SectionHead eyebrow="01 / Voice AI in action">Hear it <em>work.</em></SectionHead>
        <Reveal><p className="lead">2Care is the voice agent I built for the <strong>Voice Agent-a-thon, which I won</strong>. Watch it book a real appointment, or follow the call flow beside it.</p></Reveal>
        <div className="demo-grid" ref={ref}>
          <Reveal>
            <div className="loom">
              {loaded ? (
                <iframe
                  src={`${profile.loomEmbed}?autoplay=1&hide_owner=true&hide_share=true&hideEmbedTopBar=true`}
                  title="Apollo Voice Agent real-time appointment demo"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button className="facade" onClick={() => setLoaded(true)} aria-label="Play the Apollo voice agent demo">
                  <span className="play">▶</span>
                  <b>Apollo Voice Agent: real-time appointment demo</b>
                  <small>Screen recording of the live 2Care agent booking an appointment</small>
                </button>
              )}
            </div>
            <div className="demo-meta">
              <a href="https://web-production-c64ce.up.railway.app" target="_blank" rel="noreferrer">Live dashboard ↗</a>
              <a href={profile.loom} target="_blank" rel="noreferrer">Open on Loom ↗</a>
              <a href="https://github.com/Satyav8/2Care" target="_blank" rel="noreferrer">Source ↗</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="phone">
              <div className="phone-head"><i /> <span>Call flow · how the agent reasons</span></div>
              <div className="chat">
                {SCRIPT.slice(0, n).map((l, i) => (
                  <div key={i} className={`msg ${l.who}`}>
                    {l.who === "tool" ? <code>{l.text}</code> : l.text}
                  </div>
                ))}
                {n > 0 && n < SCRIPT.length && <div className="typing"><i /><i /><i /></div>}
              </div>
              <button className="replay" onClick={() => setRun((r) => r + 1)}>↻ Replay</button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
