import { useRef, useState } from "react";

function Eq() {
  return <span className="eq" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * -0.2}s` }} />)}</span>;
}

function Podcast() {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="feat-media">
      <video ref={v} controls={playing} preload="none" poster="/assets/nxtwave-poster.webp" src="/assets/nxtwave-podcast.mp4" playsInline onPlay={() => setPlaying(true)} />
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

/** Featured by NxtWave: the podcast and the YouTube feature, side by side. */
export function MediaPair() {
  return (
    <div className="media-pair">
      <article className="mcard">
        <Podcast />
        <div className="m-copy">
          <div className="ep"><span>Podcast</span><span>1 hr episode</span><span>57-sec highlight</span></div>
          <h3>Ask an Achiever</h3>
          <p>
            A full hour with NxtWave, recorded as an appraisal of the internship offers I&rsquo;d received: my journey and struggles, AI and its prospects, its exponential growth, and how it is becoming interdependent with every other domain.
          </p>
        </div>
      </article>
      <article className="mcard">
        <YouTube />
        <div className="m-copy">
          <div className="ep"><span>YouTube</span><span>NxtWave channel</span></div>
          <h3>What Changed After I Started Using These 5 AI Tools?</h3>
          <p>
            Team NxtWave shot a piece of content with me about the AI tools I use.{" "}
            <a className="m-link" href="https://www.youtube.com/watch?v=E_X6gJHqB3c" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
          </p>
        </div>
      </article>
    </div>
  );
}
