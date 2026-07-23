import { forwardRef, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const InteractiveContactButton = forwardRef(function InteractiveContactButton({ children = 'Contact' }, ref) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const copiedTimer = useRef(null);
  const shimmerTimer = useRef(null);
  const shimmerFrame = useRef(null);
  const email = 'hi@dividedsign.com';

  const clearTimers = () => {
    window.clearTimeout(copiedTimer.current);
    window.clearTimeout(shimmerTimer.current);
    window.cancelAnimationFrame(shimmerFrame.current);
  };

  useEffect(() => clearTimers, []);

  const closeCard = () => {
    clearTimers();
    setIsCopied(false);
    setIsShimmering(false);
    setIsRevealed(false);
  };

  const revealCard = () => {
    setIsCopied(false);
    setIsShimmering(false);
    setIsRevealed(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Keep the visible email available when clipboard permission is unavailable.
    }
    setIsCopied(true);
    setIsShimmering(false);
    window.cancelAnimationFrame(shimmerFrame.current);
    shimmerFrame.current = window.requestAnimationFrame(() => setIsShimmering(true));
    window.clearTimeout(copiedTimer.current);
    window.clearTimeout(shimmerTimer.current);
    copiedTimer.current = window.setTimeout(() => setIsCopied(false), 1400);
    shimmerTimer.current = window.setTimeout(() => setIsShimmering(false), 480);
  };

  const handleKeyDown = (event) => {
    if (!isRevealed && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      revealCard();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`contact-pill interactive-contact${isRevealed ? ' is-revealed' : ''}`}
      animate={isRevealed
        ? { width: 256, height: 158, borderRadius: 16 }
        : { width: 86, height: 34, borderRadius: 999 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.72 }}
      onClick={isRevealed ? undefined : revealCard}
      onKeyDown={handleKeyDown}
      role={isRevealed ? undefined : 'button'}
      tabIndex={isRevealed ? -1 : 0}
      aria-label={isRevealed ? 'Contact details' : 'Reveal contact details'}
    >
      <span className="contact-fill" aria-hidden="true" />
      <span className="contact-button-label"><span className="contact-dot" aria-hidden="true" />{children}</span>
      <span className="contact-button-hover" aria-hidden="true">
        <span>{children}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
        </svg>
      </span>

      <div className="contact-card" aria-hidden={!isRevealed}>
        <div className="contact-card-header">
          <span>Let’s Connect</span>
          <button className="contact-card-close" type="button" onClick={closeCard} aria-label="Close contact details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="contact-card-row">
          <div className="contact-card-copy">
            <span className="contact-card-eyebrow">
              Email
            </span>
            <span
              className={`contact-card-value contact-email-value${isShimmering ? ' is-shimmering' : ''}`}
              data-text="Hi@Dividedsign.com"
            >
              Hi@Dividedsign.com
            </span>
          </div>
          <button className="contact-copy-control" type="button" onClick={copyEmail} aria-label={isCopied ? 'Email copied' : 'Copy email address'}>
            {isCopied ? (
              <svg className="copy-icon copy-icon-check icon-tabler-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l5 5l10 -10" />
              </svg>
            ) : (
              <>
                <svg className="copy-icon copy-icon-outline icon-tabler-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                  <path d="M5 15h-1a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1" />
                </svg>
                <svg className="copy-icon copy-icon-filled icon-tabler-copy-filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M15 2a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-1v1a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h1v-1a3 3 0 0 1 3 -3h6zm-4 6h-6a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1z" />
                </svg>
              </>
            )}
          </button>
        </div>

        <a className="contact-card-row contact-instagram" href="https://instagram.com/dividedsign" target="_blank" rel="noreferrer">
          <span className="contact-card-copy">
            <span className="contact-card-eyebrow">
              Instagram
            </span>
            <span className="contact-card-value">@Dividedsign</span>
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
});

export default InteractiveContactButton;
