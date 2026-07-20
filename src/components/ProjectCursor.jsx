import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate, motion, useMotionValue, useSpring } from 'motion/react';

export default function ProjectCursor({ targetRef, label = 'Explore', variant = 'project' }) {
  const lastPoint = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const arrowConfig = useMemo(() => ({ stiffness: 380, damping: 32, mass: .6 }), []);
  const labelConfig = useMemo(() => ({ stiffness: 220, damping: 26, mass: .7 }), []);
  const arrowX = useSpring(x, arrowConfig);
  const arrowY = useSpring(y, arrowConfig);
  const labelX = useSpring(x, labelConfig);
  const labelY = useSpring(y, labelConfig);
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { stiffness: 200, damping: 24, mass: .6 });
  const scale = useMotionValue(1);

  useEffect(() => {
    const query = matchMedia('(pointer: coarse)');
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const controls = animate(scale, pressed ? .92 : 1, {
      type: 'spring', stiffness: 500, damping: 28, mass: .5,
    });
    return () => controls.stop();
  }, [pressed, scale]);

  useEffect(() => {
    const target = targetRef?.current;
    if (!target || coarsePointer) return undefined;

    const move = (event) => {
      const nextX = event.clientX;
      const nextY = event.clientY;
      const now = performance.now();
      const previous = lastPoint.current;
      if (previous) {
        const velocity = (nextX - previous.x) / Math.max(now - previous.time, 1) * 1000;
        rotation.set(Math.max(-14, Math.min(14, velocity / 85)));
      }
      lastPoint.current = { x: nextX, y: nextY, time: now };
      x.set(nextX);
      y.set(nextY);
    };
    const enter = () => setVisible(true);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      setVisible(false);
      setPressed(false);
      lastPoint.current = null;
      rotation.set(0);
    };

    target.classList.add('has-custom-cursor');
    target.addEventListener('mouseenter', enter);
    target.addEventListener('mousemove', move);
    target.addEventListener('mousedown', down);
    target.addEventListener('mouseup', up);
    target.addEventListener('mouseleave', leave);
    return () => {
      target.classList.remove('has-custom-cursor');
      target.removeEventListener('mouseenter', enter);
      target.removeEventListener('mousemove', move);
      target.removeEventListener('mousedown', down);
      target.removeEventListener('mouseup', up);
      target.removeEventListener('mouseleave', leave);
    };
  }, [coarsePointer, rotation, targetRef, x, y]);

  if (coarsePointer) return null;

  return createPortal(
    <div className={`user-cursor-layer user-cursor-layer--${variant}`} aria-hidden="true">
      <motion.div
        className="user-cursor-label"
        style={{ x: labelX, y: labelY, rotate: smoothRotation, scale, opacity: visible ? 1 : 0 }}
      >
        {variant === 'project' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17l10 -10" />
            <path d="M7 7h10v10" />
          </svg>
        ) : label}
      </motion.div>
      {variant === 'project' && (
        <motion.svg
          className="user-cursor-arrow"
          width="26"
          height="26"
          viewBox="0 0 28 28"
          style={{ x: arrowX, y: arrowY, scale, opacity: visible ? 1 : 0 }}
        >
          <path d="M5 3 L23 14 L14 16 L11 24 Z" fill="#fff" stroke="rgba(0,0,0,.45)" strokeWidth="1" strokeLinejoin="round" />
        </motion.svg>
      )}
    </div>,
    document.body,
  );
}
