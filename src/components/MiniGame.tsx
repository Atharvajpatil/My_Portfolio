import { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2, Trophy, Play, RotateCcw, Pause } from 'lucide-react';
import { SectionHeading } from './About';

const GRID = 18;
const CELL = 18;
const SIZE = GRID * CELL;
const SPEED = 130; // ms per step

type Pt = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';

const DIRS: Record<Dir, Pt> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPP: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

const randFood = (snake: Pt[]): Pt => {
  let f: Pt;
  do {
    f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
};

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<Pt[]>([{ x: 9, y: 9 }]);
  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir>('right');
  const foodRef = useRef<Pt>({ x: 4, y: 9 });
  const rafRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(0);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem('snake-best') ?? '0'));

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // grid
    ctx.strokeStyle = 'rgba(99,102,241,0.06)';
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(SIZE, i * CELL);
      ctx.stroke();
    }

    const food = foodRef.current;
    // food glow
    ctx.shadowBlur = 16;
    ctx.shadowColor = 'rgba(45,212,191,0.9)';
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // snake
    snakeRef.current.forEach((s, i) => {
      const head = i === 0;
      const t = i / Math.max(snakeRef.current.length, 1);
      ctx.shadowBlur = head ? 18 : 8;
      ctx.shadowColor = head ? 'rgba(129,140,248,0.95)' : 'rgba(34,211,238,0.6)';
      ctx.fillStyle = head ? '#a5b4fc' : `rgba(34,211,238,${0.85 - t * 0.5})`;
      const pad = head ? 1.5 : 2.5;
      const r = head ? 5 : 3;
      roundRect(ctx, s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, r);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const step = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const d = DIRS[dirRef.current];
    const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };

    // wall or self collision
    if (
      head.x < 0 ||
      head.x >= GRID ||
      head.y < 0 ||
      head.y >= GRID ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      setRunning(false);
      setDead(true);
      return;
    }

    const next = [head, ...snake];
    const food = foodRef.current;
    if (head.x === food.x && head.y === food.y) {
      foodRef.current = randFood(next);
      setScore((s) => {
        const ns = s + 1;
        if (ns > best) {
          setBest(ns);
          localStorage.setItem('snake-best', String(ns));
        }
        return ns;
      });
    } else {
      next.pop();
    }
    snakeRef.current = next;
  }, [best]);

  const loop = useCallback(
    (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!running || paused) {
        lastStepRef.current = ts;
        return;
      }
      if (ts - lastStepRef.current >= SPEED) {
        lastStepRef.current = ts;
        step();
      }
      draw();
    },
    [running, paused, step, draw]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  // keep drawing when paused/dead so the board stays visible
  useEffect(() => {
    draw();
  }, [draw, running, paused, dead, score]);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 9, y: 9 }];
    dirRef.current = 'right';
    nextDirRef.current = 'right';
    foodRef.current = randFood([{ x: 9, y: 9 }]);
    setScore(0);
    setDead(false);
    setPaused(false);
    setRunning(true);
  }, []);

  const start = useCallback(() => {
    if (dead) reset();
    else setRunning(true);
  }, [dead, reset]);

  const turn = useCallback((d: Dir) => {
    if (OPP[dirRef.current] === d) return;
    nextDirRef.current = d;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
        W: 'up',
        S: 'down',
        A: 'left',
        D: 'right',
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        turn(d);
        if (!running && !dead) setRunning(true);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (dead) reset();
        else setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [turn, running, dead, reset]);

  // swipe controls
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 'right' : 'left');
    else turn(dy > 0 ? 'down' : 'up');
    if (!running && !dead) setRunning(true);
    touchStart.current = null;
  };

  const DPad = () => (
    <div className="grid grid-cols-3 gap-1.5 w-40 mx-auto sm:hidden">
      <span />
      <DPadBtn dir="up" onClick={turn} />
      <span />
      <DPadBtn dir="left" onClick={turn} />
      <DPadBtn dir="down" onClick={turn} />
      <DPadBtn dir="right" onClick={turn} />
    </div>
  );

  return (
    <section id="game" className="relative py-32 px-5 z-10">
      <div className="mx-auto max-w-4xl">
        <SectionHeading index="04" title="Snake" kicker="play it live" />

        <p className="mt-6 text-slate-400 max-w-2xl fade-up leading-relaxed">
          Proof of the 'built from scratch' story above — a hand-rolled snake game on raw canvas,
          no game engine. Use arrow keys or WASD, swipe on mobile, space to pause.
        </p>

        <div className="mt-10 hairline p-3 sm:p-8 fade-up flex flex-col items-center gap-5 sm:gap-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-indigo-300">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-600">Score</span>
                <span className="font-mono text-xl font-medium tabular-nums">{score}</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Trophy size={15} />
                <span className="font-mono text-xl font-medium tabular-nums">{best}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {running && !dead && (
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="grid h-9 w-9 place-items-center rounded-lg surface text-slate-400 hover:text-indigo-300 hover:scale-110 transition-all"
                  title={paused ? 'Resume' : 'Pause'}
                >
                  {paused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              )}
              <button
                onClick={dead ? reset : start}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-all"
              >
                {dead ? <RotateCcw size={15} /> : <Play size={15} />}
                {dead ? 'Play again' : running ? 'Restart' : 'Start'}
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-[340px]">
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="rounded-xl border border-indigo-500/20 bg-[#070610]/80 touch-none w-full"
              style={{ height: 'auto', aspectRatio: '1 / 1' }}
            />
            {(!running || dead) && (
              <div className="absolute inset-0 grid place-items-center rounded-xl bg-[#07060d]/70 backdrop-blur-sm">
                <div className="text-center px-4">
                  {dead ? (
                    <>
                      <p className="font-display text-2xl text-slate-100">Game Over</p>
                      <p className="mt-1 font-mono text-sm text-indigo-300">You scored {score}</p>
                    </>
                  ) : (
                    <>
                      <Gamepad2 size={28} className="mx-auto text-indigo-300" />
                      <p className="mt-3 font-display text-lg text-slate-200">Ready to play?</p>
                      <p className="mt-1 text-xs text-slate-500 font-mono">arrow keys · WASD · swipe</p>
                    </>
                  )}
                </div>
              </div>
            )}
            {paused && running && (
              <div className="absolute inset-0 grid place-items-center rounded-xl bg-[#07060d]/60 backdrop-blur-sm">
                <p className="font-display text-xl text-slate-100">Paused</p>
              </div>
            )}
          </div>

          <DPad />
        </div>
      </div>
    </section>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function DPadBtn({ dir, onClick }: { dir: Dir; onClick: (d: Dir) => void }) {
  const labels: Record<Dir, string> = { up: '↑', down: '↓', left: '←', right: '→' };
  return (
    <button
      onPointerDown={() => onClick(dir)}
      className="grid h-12 w-12 place-items-center rounded-xl surface text-indigo-300 text-xl active:scale-90 transition-transform"
    >
      {labels[dir]}
    </button>
  );
}
