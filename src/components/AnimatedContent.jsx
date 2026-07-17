import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedContent({
  children,
  container,
  distance = 20,
  direction = 'horizontal',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.12,
  delay = 0,
  onComplete,
  className = '',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let scroller = container || null;
    if (typeof scroller === 'string') scroller = document.querySelector(scroller);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      gsap.set(element, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      onComplete?.();
      return undefined;
    }

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = (reverse ? -1 : 1) * distance;
    const timeline = gsap.timeline({ paused: true, delay, onComplete });

    gsap.set(element, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
      visibility: 'visible',
    });

    timeline.to(element, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      clearProps: 'transform',
    });

    const trigger = ScrollTrigger.create({
      trigger: element,
      scroller,
      start: `top ${(1 - threshold) * 100}%`,
      once: true,
      onEnter: () => timeline.play(),
    });

    return () => {
      trigger.kill();
      timeline.kill();
    };
  }, [animateOpacity, container, delay, direction, distance, duration, ease, initialOpacity, onComplete, reverse, scale, threshold]);

  return <div ref={ref} className={className} style={{ visibility: 'hidden' }} {...props}>{children}</div>;
}
