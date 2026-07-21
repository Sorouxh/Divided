import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SplitText from './components/SplitText.jsx';
import ScrollReveal from './components/ScrollReveal.jsx';
import AnimatedContent from './components/AnimatedContent.jsx';
import FadeContent from './components/FadeContent.jsx';
import GradualBlur from './components/GradualBlur.jsx';
import ShinyText from './components/ShinyText.jsx';
import DecryptedText from './components/DecryptedText.jsx';
import DitheringShader from './components/DitheringShader.jsx';
import DirectionalUnderline from './components/DirectionalUnderline.jsx';
import InteractiveContactButton from './components/InteractiveContactButton.jsx';

import avatar from '../assets/Images/avatar.webp';
import blockLogo from '../assets/Logos/Work 1/Icon.png';
import moqderateLogo from '../assets/Logos/Work 2/Icon Wrapper.png';
import piqoLogo from '../assets/Logos/Work 3/Icon Wrapper.png';
import blockCover from '../assets/Projects-cover/1.png';
import moqderateCover from '../assets/Projects-cover/2.png';
import piqoCover from '../assets/Projects-cover/3.png';
import pcImage from '../assets/Images/pc.png';

const services = ['Landing Page', 'Mobile Apps', 'Decks', 'Web & Mobile UI', 'Visual Design', '+More'];
const projectTags = ['Landing Page', 'Mobile Apps', 'Decks'];
const howIThinkVisual = 'swirl';
const savedHowIThinkWave = Object.freeze({
  shape: 'wave', type: '4x4', colorBack: '#ffffff', colorFront: '#cfd8e0', pxSize: 3, speed: 0.6,
});
const howIThinkSwirl = Object.freeze({
  shape: 'swirl', type: '4x4', colorBack: '#ffffff', colorFront: '#cfd8e0', pxSize: 3, speed: 0.55, zoom: 0.55,
});
const carouselImages = import.meta.glob('../assets/Images/*.png', { eager: true, query: '?url', import: 'default' });
const numberedPreviews = Object.entries(carouselImages)
  .map(([path, src]) => {
    const match = path.match(/\/(\d+)\.png$/);
    return match ? { src, number: Number(match[1]), alt: `Design preview ${match[1]}` } : null;
  })
  .filter(Boolean)
  .sort((first, second) => first.number - second.number);
const previews = [
  ...numberedPreviews.filter(({ number }) => number >= 8 && number <= 16).reverse(),
  ...numberedPreviews.filter(({ number }) => number === 1),
  ...numberedPreviews.filter(({ number }) => number >= 2 && number <= 7),
];
const carouselCenterIndex = previews.findIndex(({ number }) => number === 1);
const loopingPreviews = [...previews, ...previews, ...previews];

function getSystemDate() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
  }).formatToParts(new Date());
  const value = (type) => parts.find((part) => part.type === type)?.value || '';
  return `${value('day')} ${value('month')} ${value('year')}, ${value('weekday')}`;
}

function ConstructionBand({ className = 'construction-band' }) {
  return <div className={className} aria-hidden="true"><i /><i /></div>;
}

function FadeTitle({ children, className = '' }) {
  return (
    <FadeContent
      className="title-reveal"
      blur
      duration={1000}
      ease="power2.out"
      initialOpacity={0}
      threshold={0.2}
      delay={0.3}
    >
      <h2 className={className}>{children}</h2>
    </FadeContent>
  );
}

function DescriptionEntrance({ children, className = '' }) {
  return (
    <AnimatedContent className={`description-motion ${className}`.trim()} distance={18} direction="vertical" duration={0.7} threshold={0.05} delay={0.18}>
      {children}
    </AnimatedContent>
  );
}

function Hero() {
  return (
    <>
      <section className="hero section-pad">
        <span className="avatar-tooltip" tabIndex="0" aria-describedby="profile-tooltip">
          <img className="avatar" src={avatar} alt="Portrait of Soroush" />
          <span className="avatar-tooltip-content" id="profile-tooltip" role="tooltip">Yeah that&apos;s me :)</span>
        </span>
        <SplitText
          tag="h1"
          className="hero-headline"
          splitType="words"
          delay={75}
          duration={0.75}
          from={{ opacity: 0, y: 32 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="0px"
        >
          Hey, I’m Soroush<br />Also <span className="headline-known">known</span> as <ShinyText text="dividedsign." shineColor="#BBC1C6" yoyo pauseOnHover />
        </SplitText>
        <DescriptionEntrance className="hero-description-motion">
          <ScrollReveal className="hero-description">UI/product designer, built on craft and intention, where function quietly becomes beautiful.</ScrollReveal>
        </DescriptionEntrance>
        <i className="hero-guide-plus hero-guide-plus-left" aria-hidden="true" />
        <i className="hero-guide-plus hero-guide-plus-right" aria-hidden="true" />
      </section>
      <section className="deliver section-pad">
        <FadeTitle>What I deliver</FadeTitle>
        <AnimatedContent className="animated-pills" distance={16} direction="vertical" duration={0.7} threshold={0.08} delay={0.16}>
          <div className="service-pills" aria-label="Services">
            {services.map((service) => <span key={service}>{service}</span>)}
          </div>
        </AnimatedContent>
      </section>
    </>
  );
}

function MagneticField() {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    const contact = contactRef.current;
    if (!card || !canvas || !contact || getComputedStyle(canvas).display === 'none') return undefined;
    const context = canvas.getContext('2d');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const columns = 24;
    const dashLength = 10;
    const idle = [207, 216, 224];
    const active = [50, 64, 79];
    const pointer = { x: 159, y: 113.5 };
    const orb = { ...pointer };
    const magnet = { x: 0, y: 0, targetX: 0, targetY: 0, scale: 1, targetScale: 1 };
    let width = 592;
    let height = 227;
    let inside = false;
    let animationFrame = 0;

    const home = () => ({ x: 106 + contact.offsetWidth / 2, y: height / 2 });
    const setHome = () => {
      const point = home();
      pointer.x = point.x;
      pointer.y = point.y;
      magnet.targetX = 0;
      magnet.targetY = 0;
      magnet.targetScale = 1;
    };
    const resize = () => {
      const bounds = card.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!inside) {
        setHome();
        orb.x = pointer.x;
        orb.y = pointer.y;
      }
    };
    const onPointerMove = (event) => {
      const bounds = card.getBoundingClientRect();
      const point = home();
      const halfWidth = contact.offsetWidth / 2;
      const halfHeight = contact.offsetHeight / 2;
      pointer.x = Math.max(halfWidth + 8, Math.min(width - halfWidth - 8, event.clientX - bounds.left));
      pointer.y = Math.max(halfHeight + 8, Math.min(height - halfHeight - 8, event.clientY - bounds.top));
      magnet.targetX = pointer.x - point.x;
      magnet.targetY = pointer.y - point.y;
      magnet.targetScale = 1.035;
      inside = true;
    };
    const onPointerLeave = () => {
      inside = false;
      setHome();
    };
    const mix = (amount) => `rgb(${idle.map((value, index) => Math.round(value + (active[index] - value) * amount)).join(',')})`;
    const frame = () => {
      const ease = reducedMotion.matches ? 1 : 0.12;
      orb.x += (pointer.x - orb.x) * ease;
      orb.y += (pointer.y - orb.y) * ease;
      magnet.x += (magnet.targetX - magnet.x) * ease;
      magnet.y += (magnet.targetY - magnet.y) * ease;
      magnet.scale += (magnet.targetScale - magnet.scale) * ease;
      contact.style.setProperty('--magnet-x', `${magnet.x}px`);
      contact.style.setProperty('--magnet-y', `${magnet.y}px`);
      contact.style.setProperty('--magnet-scale', magnet.scale.toFixed(3));
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.lineCap = 'round';
      const spacing = width / columns;
      for (let column = 0; column < columns; column += 1) {
        const x = column * spacing + spacing / 2;
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = orb.x - x;
          const dy = orb.y - y;
          const distanceSquared = dx * dx + dy * dy;
          context.strokeStyle = mix(Math.exp(-distanceSquared / (2 * 92 * 92)));
          context.save();
          context.translate(x, y);
          context.rotate(Math.atan2(dy, dx));
          context.beginPath();
          context.moveTo(-dashLength / 2, 0);
          context.lineTo(dashLength / 2, 0);
          context.stroke();
          context.restore();
        }
      }
      animationFrame = requestAnimationFrame(frame);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(card);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    resize();
    frame();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const contact = contactRef.current;
    if (!card || !contact || !matchMedia('(pointer: fine)').matches) return undefined;

    const current = { x: 0, y: 0, scale: 1 };
    const target = { x: 0, y: 0, scale: 1 };
    const radius = 150;
    const maxPull = 9;
    let frameId = 0;

    const onPointerMove = (event) => {
      const bounds = card.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / radius);
      const pull = distance > 0 ? Math.min(maxPull, distance * .24 * influence) / distance : 0;
      target.x = dx * pull;
      target.y = dy * pull;
      target.scale = 1 + influence * .015;
    };
    const reset = () => {
      target.x = 0;
      target.y = 0;
      target.scale = 1;
    };
    const animate = () => {
      current.x += (target.x - current.x) * .16;
      current.y += (target.y - current.y) * .16;
      current.scale += (target.scale - current.scale) * .16;
      contact.style.setProperty('--magnet-x', `${current.x.toFixed(2)}px`);
      contact.style.setProperty('--magnet-y', `${current.y.toFixed(2)}px`);
      contact.style.setProperty('--magnet-scale', current.scale.toFixed(3));
      frameId = requestAnimationFrame(animate);
    };

    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', reset);
    animate();
    return () => {
      cancelAnimationFrame(frameId);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div className="magnetic-card" ref={cardRef}>
      <canvas id="magneticField" ref={canvasRef} aria-hidden="true" />
      <DitheringShader
        className="mobile-feel-swirl"
        shape="swirl"
        type="4x4"
        colorBack="#ffffff"
        colorFront="#cfd8e0"
        pxSize={4}
        speed={0.9}
      />
      <InteractiveContactButton ref={contactRef} href="mailto:hi@dividedsign.com">Contact</InteractiveContactButton>
    </div>
  );
}

function Feel() {
  return (
    <section className="feel section-pad">
      <i className="feel-guide-square" aria-hidden="true" />
      <FadeTitle>How I Feel.</FadeTitle>
      <DescriptionEntrance>
      <ScrollReveal className="feel-intro">Design should feel inevitable, like it couldn’t have existed any other way. Every decision has a reason, and every reason serves the person using it. That’s the standard I hold myself to on every project.</ScrollReveal>
      </DescriptionEntrance>
      <DescriptionEntrance><MagneticField /></DescriptionEntrance>
      <DescriptionEntrance>
      <ScrollReveal
        tag="div"
        className="feel-copy"
        paragraphs={[
          'I don’t just design screens. I design certainty, the kind that makes people trust a product before they’ve even thought about why. That trust is what turns visitors into users, and users into people who stick around.',
          'Interfere goes beyond logs, metrics, and traces. It finds the root cause and explains what’s broken, why, and who it impacts.',
        ]}
      />
      </DescriptionEntrance>
      <div className="feel-bottom-guide" aria-hidden="true" />
    </section>
  );
}

function Showcase() {
  const viewportRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    targetScroll: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
    frame: 0,
    pointerId: null,
  });
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const drag = dragRef.current;
    const getSetWidth = () => viewport.scrollWidth / 3;
    const centerFirstImage = () => {
      const track = viewport.querySelector('.showcase-track');
      const centeredItem = track?.children[previews.length + carouselCenterIndex];
      if (!centeredItem) return;
      const centeredScroll = centeredItem.offsetLeft - (viewport.clientWidth - centeredItem.offsetWidth) / 2;
      viewport.scrollLeft = centeredScroll;
      drag.targetScroll = centeredScroll;
      drag.startScroll = centeredScroll;
    };
    const wrap = () => {
      const setWidth = getSetWidth();
      if (!setWidth) return;
      let shift = 0;
      if (viewport.scrollLeft < setWidth * 0.25) shift = setWidth;
      if (viewport.scrollLeft > setWidth * 1.75) shift = -setWidth;
      if (shift) {
        viewport.scrollLeft += shift;
        drag.targetScroll += shift;
        drag.startScroll += shift;
      } else if (!drag.active && !drag.frame) {
        drag.targetScroll = viewport.scrollLeft;
      }
    };
    let lastViewportWidth = viewport.clientWidth;
    const centerFrame = requestAnimationFrame(centerFirstImage);
    viewport.addEventListener('scroll', wrap, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      const nextViewportWidth = viewport.clientWidth;
      if (nextViewportWidth === lastViewportWidth) return;
      lastViewportWidth = nextViewportWidth;
      centerFirstImage();
    });
    resizeObserver.observe(viewport);
    return () => {
      cancelAnimationFrame(centerFrame);
      cancelAnimationFrame(drag.frame);
      viewport.removeEventListener('scroll', wrap);
      resizeObserver.disconnect();
    };
  }, []);

  const startDrag = (event) => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    cancelAnimationFrame(drag.frame);
    drag.frame = 0;
    drag.active = true;
    drag.moved = false;
    drag.startX = drag.lastX = event.clientX;
    drag.startScroll = drag.targetScroll = viewport.scrollLeft;
    drag.lastTime = performance.now();
    drag.velocity = 0;
    drag.pointerId = event.pointerId;
  };

  const animateDrag = () => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    if (!viewport) return;

    if (!drag.active) {
      drag.velocity *= 0.94;
      drag.targetScroll += drag.velocity;
    }

    const setWidth = viewport.scrollWidth / 3;
    if (setWidth) {
      let shift = 0;
      if (drag.targetScroll < setWidth * 0.25) shift = setWidth;
      if (drag.targetScroll > setWidth * 1.75) shift = -setWidth;
      if (shift) {
        drag.targetScroll += shift;
        drag.startScroll += shift;
        viewport.scrollLeft += shift;
      }
    }

    const distance = drag.targetScroll - viewport.scrollLeft;
    viewport.scrollLeft += distance * 0.2;
    if (drag.active || Math.abs(drag.velocity) > 0.08 || Math.abs(distance) > 0.12) {
      drag.frame = requestAnimationFrame(animateDrag);
    } else {
      viewport.scrollLeft = drag.targetScroll;
      drag.frame = 0;
    }
  };

  const scheduleDrag = () => {
    const drag = dragRef.current;
    if (!drag.frame) drag.frame = requestAnimationFrame(animateDrag);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const now = performance.now();
    const delta = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(delta) > 5) {
      drag.moved = true;
      viewportRef.current?.setPointerCapture?.(event.pointerId);
    }
    drag.targetScroll = drag.startScroll - delta;
    const nextVelocity = (drag.lastX - event.clientX) / Math.max(now - drag.lastTime, 1) * 16;
    drag.velocity = drag.velocity * 0.65 + nextVelocity * 0.35;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    scheduleDrag();
  };
  const endDrag = (event) => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (viewport.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    drag.pointerId = null;
    scheduleDrag();
  };

  return (
    <section
      className="showcase"
      ref={viewportRef}
      aria-label="Product design previews"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="showcase-track">
        {loopingPreviews.map(({ src, alt, number }, index) => (
          <figure key={`${src}-${index}`}>
            <img src={src} alt={alt} data-carousel-image={number} draggable="false" />
          </figure>
        ))}
      </div>
    </section>
  );
}

function WorkCard({ blurId, onCoverVisibility, logo, logoAlt, title, description, cover, coverAlt, coverClass, featured = false, showTags = true }) {
  const coverRef = useRef(null);

  useEffect(() => {
    const coverElement = coverRef.current;
    if (!coverElement) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      onCoverVisibility(blurId, entry.isIntersecting);
    }, { threshold: 0, rootMargin: '96px 0px 96px 0px' });
    observer.observe(coverElement);
    return () => {
      observer.disconnect();
      onCoverVisibility(blurId, false);
    };
  }, [blurId, onCoverVisibility]);

  return (
    <article className={`work-card${featured ? ' featured-work' : ''}`}>
      <DescriptionEntrance className="work-logo-motion"><img className="work-logo" src={logo} alt={logoAlt} /></DescriptionEntrance>
      <div className="work-heading">
        <DescriptionEntrance className="work-title-motion"><h3>{title}</h3></DescriptionEntrance>
        <DescriptionEntrance><p className="project-description">{description}</p></DescriptionEntrance>
      </div>
      <div className={`work-cover ${coverClass}`} ref={coverRef}>
        <img src={cover} alt={coverAlt} />
      </div>
      {showTags && <div className="work-tags" aria-label="Project disciplines">
        {projectTags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>}
    </article>
  );
}

function SelectedWorks() {
  const [activeCover, setActiveCover] = useState(null);
  const visibleCoversRef = useRef(new Set());

  const handleCoverVisibility = useCallback((coverId, visible) => {
    if (visible) visibleCoversRef.current.add(coverId);
    else visibleCoversRef.current.delete(coverId);
    const visibleCovers = [...visibleCoversRef.current];
    setActiveCover(visibleCovers[visibleCovers.length - 1] ?? null);
  }, []);

  return (
    <section className="works">
      <ConstructionBand className="works-band" />
      <div className="works-inner">
        <WorkCard
          featured
          showTags={false}
          blurId="block"
          onCoverVisibility={handleCoverVisibility}
          logo={blockLogo}
          logoAlt="O’Block logo"
          title={<><span>O’Block</span><span className="featured-title-muted"> — Minimal Block Game</span></>}
          description="Starting in January 2024, I took on a daily challenge inspired by the Twitter community."
          cover={blockCover}
          coverAlt="2954 minimal block game interface"
          coverClass="cover-block"
        />
        <WorkCard
          showTags={false}
          blurId="moqderate"
          onCoverVisibility={handleCoverVisibility}
          logo={moqderateLogo}
          logoAlt="Mooderate logo"
          title={<><span>Mooderate</span><span className="featured-title-muted"> — Moodboard space</span></>}
          description="A calm moderation workspace built to turn noisy community signals into clear decisions."
          cover={moqderateCover}
          coverAlt="Mooderate moodboard workspace interface"
          coverClass="cover-moqderate"
        />
        <WorkCard
          showTags={false}
          blurId="piqo"
          onCoverVisibility={handleCoverVisibility}
          logo={piqoLogo}
          logoAlt="Piqo Design logo"
          title={<><span>Piqo Design</span><span className="featured-title-muted"> — Digital product design</span></>}
          description="Designed the dashboard and chatbot experience for an AI mental health assistant."
          cover={piqoCover}
          coverAlt="Digital wallet product interface"
          coverClass="cover-piqo"
        />
      </div>
      {createPortal(
        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={0.9}
          zIndex={20}
          className={`project-viewport-blur${activeCover ? ' is-active' : ''}`}
          style={{ opacity: activeCover ? 1 : 0 }}
        />,
        document.body,
      )}
    </section>
  );
}

function VerticalLines() {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const lineCount = 29;
    const hoverExtension = 12;
    let width = 0;
    let height = 0;
    let hoveredLine = -1;
    let activeLine = -1;
    let activeStrength = 0;
    let animationFrame = 0;
    const lines = Array.from({ length: lineCount }, (_, index) => ({
      base: (index + 0.5) / lineCount,
      x: 0,
      targetX: 0,
      emphasis: 0,
      targetEmphasis: 0,
    }));

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const pixelRatio = Math.min(devicePixelRatio || 1, 2);
      width = Math.round(bounds.width);
      height = Math.round(bounds.height) + hoverExtension * 2;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      lines.forEach((line) => {
        line.x = line.base * width;
        line.targetX = line.x;
      });
    };
    const setHoveredLine = (event) => {
      const bounds = canvas.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      hoveredLine = lines.reduce((nearest, line, index) => (
        Math.abs(line.x - pointerX) < Math.abs(lines[nearest].x - pointerX) ? index : nearest
      ), 0);
    };
    const onLeave = () => { hoveredLine = -1; };
    const mixColor = (amount) => {
      const mix = (start, end) => Math.round(start + (end - start) * amount);
      return `rgb(${mix(239, 50)}, ${mix(239, 64)}, ${mix(239, 79)})`;
    };
    const draw = () => {
      const easing = reducedMotion.matches ? 1 : 0.16;
      if (hoveredLine >= 0) {
        activeLine = activeLine < 0 ? hoveredLine : activeLine + (hoveredLine - activeLine) * easing;
        activeStrength += (1 - activeStrength) * easing;
      } else {
        activeStrength += (0 - activeStrength) * easing;
      }
      const focusX = activeLine < 0 ? 0 : ((activeLine + 0.5) / lineCount) * width;
      const spread = width * 0.16;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      lines.forEach((line) => {
        const homeX = line.base * width;
        const distance = activeLine < 0 ? Infinity : Math.abs(homeX - focusX);
        const influence = Math.exp(-(distance * distance) / (2 * spread * spread)) * activeStrength;
        line.targetX = activeLine < 0 ? homeX : homeX + (focusX - homeX) * influence * 0.58;
        line.targetEmphasis = activeLine < 0 ? 0 : influence;
        line.x += (line.targetX - line.x) * easing;
        line.emphasis += (line.targetEmphasis - line.emphasis) * easing;
        context.strokeStyle = mixColor(line.emphasis);
        const inset = hoverExtension * (1 - line.emphasis);
        context.beginPath();
        context.moveTo(Math.round(line.x) + 0.5, inset);
        context.lineTo(Math.round(line.x) + 0.5, height - inset);
        context.stroke();
      });
      animationFrame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    canvas.addEventListener('pointermove', setHoveredLine);
    canvas.addEventListener('pointerleave', onLeave);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', setHoveredLine);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div className="line-motion" ref={hostRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

function MomentumIllustration() {
  const hostRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    const count = 32;
    const rest = (count - 1) / 2;
    const namespace = 'http://www.w3.org/2000/svg';
    let hovered = -1;
    let focus = rest;
    let strength = 0;
    let animationFrame = 0;
    svg.replaceChildren();
    const bars = Array.from({ length: count }, (_, index) => {
      const path = document.createElementNS(namespace, 'path');
      svg.append(path);
      return { path, index, height: 0, light: 0, opacity: 1 };
    });
    const heightAt = (distance) => 8 + 70 * Math.exp(-distance / 2.25);
    const blend = (from, to, amount) => `rgb(${from.map((value, index) => Math.round(value + (to[index] - value) * amount)).join(',')})`;
    const onMove = (event) => {
      const box = svg.getBoundingClientRect();
      const x = (event.clientX - box.left) * 592 / box.width;
      hovered = Math.max(0, Math.min(count - 1, Math.round((458 + 57 - x) / 14.2)));
    };
    const onLeave = () => { hovered = -1; };
    const draw = () => {
      const ease = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.12;
      if (hovered >= 0) {
        focus += (hovered - focus) * ease;
        strength += (1 - strength) * ease;
      } else {
        focus += (rest - focus) * ease;
        strength += (0 - strength) * ease;
      }
      bars.forEach((bar) => {
        const distance = Math.abs(bar.index - focus);
        const targetHeight = heightAt(distance) + 8 * strength * Math.exp(-distance / 0.6);
        const targetLight = Math.exp(-distance / 3.1) * strength;
        const targetOpacity = 1 - (1 - Math.exp(-distance / 15)) * 0.28 * strength;
        bar.height += (targetHeight - bar.height) * ease;
        bar.light += (targetLight - bar.light) * ease;
        bar.opacity += (targetOpacity - bar.opacity) * ease;
        const x = 458 - bar.index * 14.2;
        const baseY = 90 + bar.index * 2.5;
        const top = baseY - bar.height;
        bar.path.setAttribute('d', `M${x} ${top}l115.7 57.8v${bar.height}l-115.7-57.8z`);
        bar.path.style.stroke = blend([239, 239, 239], [50, 64, 79], bar.light);
        bar.path.style.fill = '#ffffff';
        bar.path.style.opacity = bar.opacity;
        bar.path.style.strokeWidth = '1';
        bar.path.style.strokeLinejoin = 'round';
      });
      animationFrame = requestAnimationFrame(draw);
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    draw();
    return () => {
      cancelAnimationFrame(animationFrame);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      svg.replaceChildren();
    };
  }, []);

  return <div className="momentum" ref={hostRef} aria-hidden="true"><svg ref={svgRef} viewBox="0 0 592 227" /></div>;
}

function Thinking() {
  return (
    <section className="thinking section-pad">
      <div className="thinking-block">
        <FadeTitle>How I think</FadeTitle>
        <DescriptionEntrance>
        <ScrollReveal
          tag="div"
          className="description-copy"
          paragraphs={[
            'Good design is quiet confidence. It doesn’t announce itself, it just works. I start with the logic before I touch the aesthetics, because beautiful design built on shaky decisions is just expensive decoration.',
            'I collaborate closely, prototype early, and care about the details most people never consciously notice, but always feel. It’s rarely the big decisions that make a product feel right, it’s the small ones, repeated consistently, that add up to something people trust.',
          ]}
        />
        </DescriptionEntrance>
      </div>
      <div className="thinking-block quality-block">
        <FadeTitle>Why is quality so rare?</FadeTitle>
        <DescriptionEntrance>
        <ScrollReveal
          tag="div"
          className="description-copy"
          paragraphs={[
            'Most products ship at the edge of good enough. Not because the people building them don’t care, but because quality is expensive in ways that don’t show up on a roadmap.',
            'It costs time when deadlines are tight. It costs opinion when everyone’s in the room. It costs restraint when the temptation to add is louder than the discipline to remove. What survives all of that pressure and still insists on being right is what I’m here to protect.',
          ]}
        />
        </DescriptionEntrance>
        <div className="motion-card">
          {howIThinkVisual === 'wave'
            ? <DitheringShader className="mobile-thinking-wave" {...savedHowIThinkWave} />
            : <DitheringShader className="mobile-thinking-wave" {...howIThinkSwirl} />}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="closing">
      <div className="closing-inner section-pad">
        <img className="pc-image" src={pcImage} alt="Classic Macintosh computer" />
        <DescriptionEntrance>
        <h2>Let’s build something <em>worth</em> using.</h2>
        <ScrollReveal start="top 88%" end="top 64%">Available for product design collaborations, UI audits, and long-term partnerships. Building something that deserves to look as good as it works? Let's talk.</ScrollReveal>
        <a className="closing-cta" href="mailto:hi@dividedsign.com">Get in touch <span aria-hidden="true">→</span></a>
        </DescriptionEntrance>
      </div>
      <div className="closing-buffer" aria-hidden="true" />
      <footer className="site-footer section-pad">
        <p><strong>©2026 DividedSign,</strong> <a href="mailto:hi@dividedsign.com">hi@dividedsign.com</a></p>
        <nav aria-label="Social links">
          <a href="https://x.com/dividedsign" target="_blank" rel="noreferrer"><DirectionalUnderline>X (Twitter)</DirectionalUnderline></a><i />
          <a href="https://instagram.com/dividedsign" target="_blank" rel="noreferrer"><DirectionalUnderline direction="right">Instagram</DirectionalUnderline></a><i />
          <a href="https://dribbble.com/dividedsign" target="_blank" rel="noreferrer"><DirectionalUnderline>Dribbble</DirectionalUnderline></a>
        </nav>
      </footer>
      <ConstructionBand className="footer-band" />
    </section>
  );
}

export default function App() {
  return (
    <main className="page-rail">
      <header className="date-row">
        <DecryptedText
          text={getSystemDate()}
          speed={32}
          sequential
          revealDirection="start"
          animateOn="inViewHover"
          characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,"
          parentClassName="date-decrypt"
          encryptedClassName="date-encrypted"
        />
      </header>
      <ConstructionBand />
      <Hero />
      <Feel />
      <Showcase />
      <SelectedWorks />
      <Thinking />
      <ContactSection />
    </main>
  );
}
