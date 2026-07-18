import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

const styles = {
  wrapper: { display: 'inline-block', whiteSpace: 'pre-wrap' },
  srOnly: {
    position: 'absolute', width: '1px', height: '1px', padding: 0,
    margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0,
  },
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
  const [direction, setDirection] = useState('forward');
  const containerRef = useRef(null);
  const orderRef = useRef([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => (
    useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
      : characters.split('')
  ), [characters, text, useOriginalCharsOnly]);

  const shuffleText = useCallback((originalText, currentRevealed) => (
    originalText.split('').map((char, index) => {
      if (char === ' ') return ' ';
      if (currentRevealed.has(index)) return originalText[index];
      return availableChars[Math.floor(Math.random() * availableChars.length)];
    }).join('')
  ), [availableChars]);

  const computeOrder = useCallback((length) => {
    if (revealDirection === 'start') return Array.from({ length }, (_, index) => index);
    if (revealDirection === 'end') return Array.from({ length }, (_, index) => length - 1 - index);
    const order = [];
    const middle = Math.floor(length / 2);
    let offset = 0;
    while (order.length < length) {
      const index = offset % 2 === 0 ? middle + offset / 2 : middle - Math.ceil(offset / 2);
      if (index >= 0 && index < length) order.push(index);
      offset += 1;
    }
    return order;
  }, [revealDirection]);

  const fillAllIndices = useCallback(() => new Set(Array.from({ length: text.length }, (_, index) => index)), [text]);

  const removeRandomIndices = useCallback((set, count) => {
    const indices = Array.from(set);
    for (let index = 0; index < count && indices.length; index += 1) {
      indices.splice(Math.floor(Math.random() * indices.length), 1);
    }
    return new Set(indices);
  }, []);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
    }
    setRevealedIndices(new Set());
    setDirection('forward');
    setIsAnimating(true);
  }, [computeOrder, sequential, text.length]);

  const triggerReverse = useCallback(() => {
    const allIndices = fillAllIndices();
    if (sequential) {
      orderRef.current = computeOrder(text.length).reverse();
      pointerRef.current = 0;
    }
    setRevealedIndices(allIndices);
    setDisplayText(shuffleText(text, allIndices));
    setDirection('reverse');
    setIsAnimating(true);
  }, [computeOrder, fillAllIndices, sequential, shuffleText, text]);

  useEffect(() => {
    if (!isAnimating) return undefined;
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      setRevealedIndices((previous) => {
        if (sequential && direction === 'forward') {
          if (pointerRef.current < orderRef.current.length) {
            const next = new Set(previous);
            next.add(orderRef.current[pointerRef.current]);
            pointerRef.current += 1;
            setDisplayText(shuffleText(text, next));
            return next;
          }
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(true);
          setDisplayText(text);
          return previous;
        }

        if (sequential && direction === 'reverse') {
          if (pointerRef.current < orderRef.current.length) {
            const next = new Set(previous);
            next.delete(orderRef.current[pointerRef.current]);
            pointerRef.current += 1;
            setDisplayText(shuffleText(text, next));
            return next;
          }
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(false);
          return previous;
        }

        iteration += 1;
        if (direction === 'forward') {
          setDisplayText(shuffleText(text, previous));
          if (iteration >= maxIterations) {
            clearInterval(intervalRef.current);
            setIsAnimating(false);
            setIsDecrypted(true);
            setDisplayText(text);
          }
          return previous;
        }

        const current = previous.size ? previous : fillAllIndices();
        const next = removeRandomIndices(current, Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations))));
        setDisplayText(shuffleText(text, next));
        if (!next.size || iteration >= maxIterations) {
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(false);
        }
        return next;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [direction, fillAllIndices, isAnimating, maxIterations, removeRandomIndices, sequential, shuffleText, speed, text]);

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;
    setDisplayText(text);
    triggerDecrypt();
  }, [isAnimating, text, triggerDecrypt]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return undefined;
    const element = containerRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        triggerDecrypt();
        setHasAnimated(true);
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, triggerDecrypt]);

  useEffect(() => {
    setDisplayText(text);
    setRevealedIndices(new Set());
    setIsDecrypted(animateOn !== 'click');
    setDirection('forward');
  }, [animateOn, text]);

  const handleClick = () => {
    if (animateOn !== 'click') return;
    if (clickMode === 'toggle' && isDecrypted) triggerReverse();
    else if (!isDecrypted) triggerDecrypt();
  };

  const animateProps = animateOn === 'hover' || animateOn === 'inViewHover'
    ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
    : animateOn === 'click' ? { onClick: handleClick } : {};

  return (
    <motion.span ref={containerRef} className={parentClassName} style={styles.wrapper} {...animateProps} {...props}>
      <span style={styles.srOnly}>{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const revealed = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return <span className={revealed ? className : encryptedClassName} key={`${index}-${char}`}>{char}</span>;
        })}
      </span>
    </motion.span>
  );
}
