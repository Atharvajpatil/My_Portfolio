import { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate(${curX}px, ${curY}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      className="cursor-glow hidden md:block"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    />
  );
}
