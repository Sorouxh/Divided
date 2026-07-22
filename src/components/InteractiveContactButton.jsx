import { forwardRef, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const InteractiveContactButton = forwardRef(function InteractiveContactButton({ href, children = 'Contact' }, ref) {
  const [isRevealed, setIsRevealed] = useState(false);
  const resetTimer = useRef(null);
  const email = 'hi@dividedsign.com';

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const scheduleReset = () => {
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setIsRevealed(false), 5000);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (isRevealed) {
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // The visible email remains selectable if clipboard access is unavailable.
      }
    } else {
      setIsRevealed(true);
      scheduleReset();
    }
  };

  return (
    <motion.a
      ref={ref}
      className={`contact-pill interactive-contact${isRevealed ? ' is-revealed' : ''}`}
      href={href}
      onClick={handleClick}
      aria-label={isRevealed ? 'Copy hi@dividedsign.com' : 'Reveal contact email'}
    >
      <span className="contact-fill" aria-hidden="true" />
      <span className="contact-button-label"><span className="contact-dot" aria-hidden="true" />{children}</span>
      <span className="contact-button-hover" aria-hidden="true">
        <span>{children}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
        </svg>
      </span>
      <span className="contact-email-state">
        <span>Hi@Dividedsign.com</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="8" y="8" width="10" height="10" rx="1.5" />
          <path d="M16 8V6.5A1.5 1.5 0 0 0 14.5 5h-8A1.5 1.5 0 0 0 5 6.5v8A1.5 1.5 0 0 0 6.5 16H8" />
        </svg>
      </span>
    </motion.a>
  );
});

export default InteractiveContactButton;
