import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import './ShinyText.css';

export default function ShinyText({
  text,
  disabled = false,
  speed = 2.6,
  className = '',
  color = '#878F98',
  shineColor = '#EEF2F5',
  spread = 110,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 1.2,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);
  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame((time) => {
    if (disabled || isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;
    const cycleDuration = animationDuration + delayDuration;

    if (yoyo) {
      const cycleTime = elapsedRef.current % (cycleDuration * 2);
      if (cycleTime < animationDuration) {
        const value = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? value : 100 - value);
      } else if (cycleTime < cycleDuration) {
        progress.set(directionRef.current === 1 ? 100 : 0);
      } else if (cycleTime < cycleDuration + animationDuration) {
        const value = 100 - ((cycleTime - cycleDuration) / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? value : 100 - value);
      } else {
        progress.set(directionRef.current === 1 ? 0 : 100);
      }
    } else {
      const cycleTime = elapsedRef.current % cycleDuration;
      if (cycleTime < animationDuration) {
        const value = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? value : 100 - value);
      } else {
        progress.set(directionRef.current === 1 ? 100 : 0);
      }
    }
  });

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1;
    elapsedRef.current = 0;
    progress.set(0);
  }, [direction, progress]);

  const backgroundPosition = useTransform(progress, (value) => `${150 - value * 2}% center`);
  const onMouseEnter = useCallback(() => pauseOnHover && setIsPaused(true), [pauseOnHover]);
  const onMouseLeave = useCallback(() => pauseOnHover && setIsPaused(false), [pauseOnHover]);

  return (
    <motion.span
      className={`shiny-text ${className}`.trim()}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: '200% auto',
        backgroundPosition,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {text}
    </motion.span>
  );
}
