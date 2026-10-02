import { useRef, useState } from "react";
import { Reveal, SectionHead } from "./ui";

function Eq() {
  return <span className="eq" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * -0.2}s` }} />)}</span>;
}

function Podcast() {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="feat-media">
      <video ref={v} controls={playing} preload="none" poster="/assets/nxtwave-poster.jpg" src="/assets/nxtwave-podcast.mp4" playsInline onPlay={() => setPlaying(true)} />
      {!playing && (
        <button className="feat-play" onClick={() => { setPlaying(true); v.current?.play(); }} aria-label="Play Ask an Achiever">
          <span className="play">▶</span>
        </button>
      )}
      <span className="onair"><i /> HIGHLIGHT <Eq /></span>
    </div>
  );
}

function YouTube() {
  const [on, setOn] = useState(false);
  return (
    <div className="feat-media">
      {on ? (
        <iframe src="https://www.youtube-nocookie.com/embed/E_X6gJHqB3c?autoplay=1" title="What Changed After I Started Using These 5 AI Tools?" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <>
          <img src="https://i.ytimg.com/vi/E_X6gJHqB3c/hqdefault.jpg" alt="" loading="lazy" />
          <button className="feat-play" onClick={() => setOn(true)} aria-label="Play the NxtWave YouTube video"><span className="play">▶</span></button>
        </>
      )}
      <span className="onair yt"><i /> YOUTUBE</span>
    </div>
  );
}

const TEACH = [
  { t: "AI for Entrepreneurs", s: "Session for the students of Tapasya", i: "◎" },
  { t: "Git & GitHub", s: "Hands-on session at my college", i: "⎇" },
  { t: "Machine Learning", s: "Lecture to fellow students", i: "∑" },
  { t: "ACM x IARE", s: "Vice-Chairperson, 50+ members", i: "★" },
];

export function Media() {
  return (
    <section id="media" className="media-sec">
      <div className="wrap">
        <SectionHead eyebrow="06 / In the spotlight">Featured by <em>NxtWave.</em></SectionHead>
        <Reveal>
          <p className="lead">
            After receiving multiple internship offers, I was featured by NxtWave in a full-length podcast, and later shot content with their team.
          </p>
        </Reveal>

        <Reveal>
          <article className="feat">
            <Podcast />
            <div className="feat-copy">
              <div className="ep"><span>Podcast</span><span>1 hour, full episode</span><span>57-sec highlight</span></div>
              <h3>Ask an Achiever</h3>
              <p>
                NxtWave recorded a full hour with me as an appraisal of the internship offers I'd received. The conversation went well beyond the offers.
              </p>
              <ul>
                <li>My journey, and the struggles along the way</li>
                <li>AI and its prospects</li>
                <li>The exponential growth of AI</li>
                <li>How AI is becoming interdependent with every other domain</li>
              </ul>
              <small className="clip-note">The player shows a 57-second highlight from the full episode.</small>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.05}>
          <article className="feat flip">
            <YouTube />
            <div className="feat-copy">
              <div className="ep"><span>YouTube</span><span>NxtWave channel</span></div>
              <h3>What Changed After I Started Using These 5 AI Tools?</h3>
              <p>
                Team NxtWave shot a piece of content with me about the AI tools I use, now live on their YouTube channel.
              </p>
              <a className="btn" href="https://www.youtube.com/watch?v=E_X6gJHqB3c" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="teach">
            <div className="teach-h"><div className="eyebrow">Beyond the camera</div><h4>I also teach what I learn.</h4></div>
            <div className="teach-grid">
              {TEACH.map((x) => (
                <a key={x.t} href="#recognition" className="teach-card">
                  <span>{x.i}</span><b>{x.t}</b><small>{x.s}</small>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
