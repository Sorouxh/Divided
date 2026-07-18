import React, { useEffect, useMemo, useRef, useState } from 'react';
import './GradualBlur.css';

const DEFAULT_CONFIG = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear',
  responsive: false,
  target: 'parent',
  className: '',
  style: {},
};

const PRESETS = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  left: { position: 'left', height: '6rem' },
  right: { position: 'right', height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 },
};

const CURVE_FUNCTIONS = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  'ease-in': (progress) => progress * progress,
  'ease-out': (progress) => 1 - (1 - progress) ** 2,
  'ease-in-out': (progress) => (progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2),
};

const directionFor = (position) => ({ top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' })[position] || 'to bottom';

function GradualBlur(props) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(props.animated !== 'scroll');
  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...(props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {}),
    ...props,
  }), [props]);

  useEffect(() => {
    if (config.animated !== 'scroll' || !containerRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [config.animated]);

  useEffect(() => {
    if (!isVisible || config.animated !== 'scroll' || !config.onAnimationComplete) return undefined;
    const timeout = window.setTimeout(config.onAnimationComplete, Number.parseFloat(config.duration) * 1000);
    return () => window.clearTimeout(timeout);
  }, [config.animated, config.duration, config.onAnimationComplete, isVisible]);

  const blurLayers = useMemo(() => {
    const increment = 100 / config.divCount;
    const strength = isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength;
    const curve = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

    return Array.from({ length: config.divCount }, (_, index) => {
      const layer = index + 1;
      const progress = curve(layer / config.divCount);
      const blur = config.exponential
        ? 2 ** (progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * config.divCount + 1) * strength;
      const p1 = Math.round((increment * layer - increment) * 10) / 10;
      const p2 = Math.round(increment * layer * 10) / 10;
      const p3 = Math.round((increment * layer + increment) * 10) / 10;
      const p4 = Math.round((increment * layer + increment * 2) * 10) / 10;
      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      return (
        <div
          key={layer}
          style={{
            position: 'absolute',
            inset: 0,
            maskImage: `linear-gradient(${directionFor(config.position)}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${directionFor(config.position)}, ${gradient})`,
            backdropFilter: `blur(${blur.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
            opacity: config.opacity,
          }}
        />
      );
    });
  }, [config, isHovered]);

  const vertical = ['top', 'bottom'].includes(config.position);
  const pageTarget = config.target === 'page';
  const containerStyle = {
    position: pageTarget ? 'fixed' : 'absolute',
    pointerEvents: config.hoverIntensity ? 'auto' : 'none',
    opacity: isVisible ? 1 : 0,
    transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
    zIndex: pageTarget ? config.zIndex + 100 : config.zIndex,
    ...(vertical
      ? { height: config.height, width: config.width || '100%', [config.position]: 0, left: 0, right: 0 }
      : { width: config.width || config.height, height: '100%', [config.position]: 0, top: 0, bottom: 0 }),
    ...config.style,
  };

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${pageTarget ? 'gradual-blur-page' : 'gradual-blur-parent'} ${config.className}`}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner">{blurLayers}</div>
    </div>
  );
}

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = 'GradualBlur';
GradualBlurMemo.PRESETS = PRESETS;
GradualBlurMemo.CURVE_FUNCTIONS = CURVE_FUNCTIONS;

export default GradualBlurMemo;
