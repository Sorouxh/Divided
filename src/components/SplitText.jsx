import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export default function SplitText({
  text = '',
  children,
  className = '',
  delay = 70,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'words',
  from = { opacity: 0, y: 28 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-40px',
  textAlign = 'left',
  tag: Tag = 'p',
  onLetterAnimationComplete,
}) {
  const ref = useRef(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    let active = true;
    const requiredFonts = [
      document.fonts.load('400 40px "Geist"'),
      document.fonts.load('500 40px "Bitter Pro"'),
    ];
    Promise.all(requiredFonts).then(() => active && setFontsLoaded(true));
    return () => { active = false; };
  }, []);

  useGSAP(() => {
    if (!ref.current || !ref.current.textContent || !fontsLoaded) return undefined;

    const element = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const sign = marginValue === 0 ? '' : marginValue < 0
      ? `-=${Math.abs(marginValue)}${marginUnit}`
      : `+=${marginValue}${marginUnit}`;

    let targets = [];
    const split = new GSAPSplitText(element, {
      type: splitType,
      smartWrap: true,
      ignore: '.shiny-text',
      wordsClass: 'split-word',
      charsClass: 'split-char',
      linesClass: 'split-line',
      reduceWhiteSpace: false,
    });

    gsap.set(element, { visibility: 'visible' });

    if (splitType.includes('chars')) targets = split.chars;
    if (!targets.length && splitType.includes('words')) targets = split.words;
    if (!targets.length && splitType.includes('lines')) targets = split.lines;
    targets = [...targets, ...element.querySelectorAll('.shiny-text')];

    if (reducedMotion) {
      gsap.set(targets, to);
      onCompleteRef.current?.();
    } else {
      gsap.fromTo(targets, from, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
        scrollTrigger: {
          trigger: element,
          start: `top ${startPct}%${sign}`,
          once: true,
          fastScrollEnd: true,
        },
        onComplete: () => onCompleteRef.current?.(),
      });
    }

    return () => split.revert();
  }, {
    dependencies: [text, delay, duration, ease, splitType, threshold, rootMargin, fontsLoaded],
    scope: ref,
  });

  return (
    <Tag
      ref={ref}
      className={`split-parent ${className}`.trim()}
      style={{ textAlign, whiteSpace: 'pre-line' }}
    >
      {children ?? text}
    </Tag>
  );
}
