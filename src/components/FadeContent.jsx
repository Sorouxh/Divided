import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FadeContent({
  children,
  container,
  blur = false,
  duration = 1000,
  ease = 'power2.out',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power2.in',
  onComplete,
  onDisappearanceComplete,
  className = '',
  style,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let scroller = container || document.getElementById('snap-main-container') || null;
    if (typeof scroller === 'string') scroller = document.querySelector(scroller);
    const seconds = (value) => (typeof value === 'number' && value > 10 ? value / 1000 : value);

    gsap.set(element, {
      autoAlpha: initialOpacity,
      filter: blur ? 'blur(10px)' : 'blur(0px)',
      willChange: 'opacity, filter, transform',
    });

    const timeline = gsap.timeline({
      paused: true,
      delay: seconds(delay),
      onComplete: () => {
        onComplete?.();
        if (disappearAfter > 0) {
          gsap.to(element, {
            autoAlpha: initialOpacity,
            filter: blur ? 'blur(10px)' : 'blur(0px)',
            delay: seconds(disappearAfter),
            duration: seconds(disappearDuration),
            ease: disappearEase,
            onComplete: () => onDisappearanceComplete?.(),
          });
        }
      },
    });

    timeline.to(element, { autoAlpha: 1, filter: 'blur(0px)', duration: seconds(duration), ease });
    const trigger = ScrollTrigger.create({
      trigger: element,
      scroller: scroller || window,
      start: `top ${(1 - threshold) * 100}%`,
      once: true,
      onEnter: () => timeline.play(),
    });

    return () => {
      trigger.kill();
      timeline.kill();
      gsap.killTweensOf(element);
    };
  }, []);

  return <div ref={ref} className={className} style={style} {...props}>{children}</div>;
}
