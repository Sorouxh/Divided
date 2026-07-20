import { useState } from 'react';

export default function DirectionalUnderline({ children, direction = 'left' }) {
  const [animating, setAnimating] = useState(false);

  const animate = () => {
    if (animating) return;
    setAnimating(true);
  };

  return (
    <span
      className={`footer-link-underline footer-link-underline--${direction}${animating ? ' is-animating' : ''}`}
      onMouseEnter={animate}
    >
      <span>{children}</span>
      <span className="footer-link-underline-line" aria-hidden="true" onAnimationEnd={() => setAnimating(false)} />
    </span>
  );
}
