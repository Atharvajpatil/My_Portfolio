import { useEffect, useState } from 'react';

const LOG_LINES = [
  '> initializing portfolio.module',
  '> loading design tokens... ok',
  '> mounting aurora renderer... ok',
  '> calibrating vibe engine... ok',
  '> ready',
];

const PARTICLES = Array.from({ length: 18 });

export default function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [logIdx, setLogIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIdx((i) => {
        if (i >= LOG_LINES.length - 1) {
          clearInterval(logTimer);
          return i;
        }
        return i + 1;
      });
    }, 460);

    const finish = setTimeout(() => {
      setDone(true);
      setExiting(true);
      setTimeout(onDone, 850);
    }, 2900);

    return () => {
      clearInterval(logTimer);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <div className={`boot-overlay ${exiting ? 'boot-exit' : ''}`} aria-hidden={done}>
      <div className="boot-grid" />
      <div className="boot-scanline" />
      {PARTICLES.map((_, i) => (
        <span
          key={i}
          className="boot-particle"
          style={{
            left: `${(i * 5.3 + 8) % 100}%`,
            bottom: `${10 + ((i * 37) % 60)}%`,
            animationDelay: `${(i * 0.18) % 3.2}s`,
            background: i % 3 === 0 ? 'var(--accent-2)' : i % 3 === 1 ? 'var(--accent-3)' : 'var(--accent-1)',
            boxShadow: `0 0 12px ${i % 3 === 0 ? 'var(--accent-2)' : i % 3 === 1 ? 'var(--accent-3)' : 'var(--accent-1)'}`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <span className="boot-word">atharva.dev</span>

        <div className="boot-name">
          Atharva
          <span className="glitch" aria-hidden>Atharva</span>
          <span className="glitch-2" aria-hidden>Atharva</span>
        </div>

        <div className="boot-bar">
          <div className="boot-bar-fill" />
        </div>

        <div className="boot-log">
          <span className="log-line">{LOG_LINES[logIdx]}</span>
        </div>
      </div>
    </div>
  );
}
