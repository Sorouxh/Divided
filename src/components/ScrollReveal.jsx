import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  paragraphs,
  className = '',
  tag: Tag = 'p',
  baseColor = '#CECECE',
  activeColor = '#32404F',
  start = 'top 72%',
  end = 'bottom 52%',
}) {
  const ref = useRef(null);
  const textBlocks = useMemo(
    () => paragraphs || [String(children)],
    [children, paragraphs],
  );

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const wordElements = element.querySelectorAll('.reveal-word');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      gsap.set(wordElements, { color: activeColor });
      return undefined;
    }

    const lines = [];
    wordElements.forEach((word) => {
      const top = Math.round(word.getBoundingClientRect().top);
      const currentLine = lines.find((line) => Math.abs(line.top - top) <= 2);
      if (currentLine) currentLine.words.push(word);
      else lines.push({ top, words: [word] });
    });

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      lines.forEach((line, lineIndex) => {
        timeline.fromTo(line.words, { color: baseColor }, {
          color: activeColor,
          duration: 1,
          ease: 'none',
          stagger: 0.07,
        }, lineIndex * 0.72);
      });
    }, element);

    return () => context.revert();
  }, [activeColor, baseColor, end, start]);

  const renderWords = (text, blockIndex) => String(text).split(/(\s+)/).map((word, wordIndex) => (
    /^\s+$/.test(word)
      ? word
      : <span className="reveal-word" key={`${blockIndex}-${word}-${wordIndex}`}>{word}</span>
  ));

  if (paragraphs) {
    return (
      <Tag ref={ref} className={`scroll-reveal-group ${className}`.trim()}>
        {textBlocks.map((paragraph, index) => (
          <p className="scroll-reveal-copy" key={`${paragraph.slice(0, 24)}-${index}`}>
            {renderWords(paragraph, index)}
          </p>
        ))}
      </Tag>
    );
  }

  return <Tag ref={ref} className={`scroll-reveal-copy ${className}`.trim()}>{renderWords(textBlocks[0], 0)}</Tag>;
}
