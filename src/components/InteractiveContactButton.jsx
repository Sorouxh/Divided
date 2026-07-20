import { forwardRef } from 'react';
import { motion } from 'motion/react';

const InteractiveContactButton = forwardRef(function InteractiveContactButton({ href, children = 'Contact' }, ref) {
  return (
    <motion.a
      ref={ref}
      className="contact-pill interactive-contact"
      href={href}
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <span className="contact-fill" aria-hidden="true" />
      <span className="contact-button-label"><span className="contact-dot" aria-hidden="true" />{children}</span>
      <span className="contact-button-hover" aria-hidden="true">
        <span>{children}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
        </svg>
      </span>
    </motion.a>
  );
});

export default InteractiveContactButton;
