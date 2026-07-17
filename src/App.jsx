import { useEffect, useRef } from 'react';
import SplitText from './components/SplitText.jsx';
import ScrollReveal from './components/ScrollReveal.jsx';
import AnimatedContent from './components/AnimatedContent.jsx';
import ShinyText from './components/ShinyText.jsx';

import avatar from '../assets/avatar.webp';
import bankingPreview from '../assets/Images/Image.png';
import profilePreview from '../assets/Images/Image-1.png';
import healthPreview from '../assets/Images/Image-2.png';
import sportsPreview from '../assets/Images/Image-3.png';
import cardsPreview from '../assets/Images/Image-4.png';
import blockLogo from '../assets/Logos/Work 1/Icon.png';
import moqderateLogo from '../assets/Logos/Work 2/Icon Wrapper.png';
import piqoLogo from '../assets/Logos/Work 3/Icon Wrapper.png';
import blockCover from '../assets/Projects-cover/1.png';
import moqderateCover from '../assets/Projects-cover/2.png';
import piqoCover from '../assets/Projects-cover/3.png';
import pcImage from '../assets/Images/pc.png';

const services = ['Landing Page', 'Mobile Apps', 'Decks', 'Web & Mobile UI', 'Visual Design', '+More'];
const projectTags = ['Landing Page', 'Mobile Apps', 'Decks'];

function ConstructionBand({ className = 'construction-band' }) {
  return <div className={className} aria-hidden="true"><i /><i /></div>;
}

function FadeTitle({ children, className = '' }) {
  return (
    <AnimatedContent className="title-reveal" distance={36} direction="horizontal" duration={0.85} threshold={0.14}>
      <h2 className={className}>{children}</h2>
    </AnimatedContent>
  );
}

function Hero() {
  return (
    <>
      <section className="hero section-pad">
        <img className="avatar" src={avatar} alt="Portrait of Soroush" />
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
          Hey, I’m Soroush<br />Also known as <ShinyText text="dividedsign." yoyo pauseOnHover />
        </SplitText>
        <AnimatedContent className="hero-description-motion" distance={18} direction="vertical" duration={0.7} threshold={0.05} delay={0.18}>
          <ScrollReveal className="hero-description">UI/product designer, built on craft and intention, where function quietly becomes beautiful.</ScrollReveal>
        </AnimatedContent>
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

function ContactIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 15l6 -6" />
      <path d="M10 9h5v5" />
    </svg>
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

  return (
    <div className="magnetic-card" ref={cardRef}>
      <canvas id="magneticField" ref={canvasRef} aria-hidden="true" />
      <a className="contact-pill" ref={contactRef} href="mailto:hello@dividedsign.com">
        <ContactIcon /> Contact
      </a>
    </div>
  );
}

function Feel() {
  return (
    <section className="feel section-pad">
      <FadeTitle>How I Feel.</FadeTitle>
      <ScrollReveal className="feel-intro">Design should feel inevitable, like it couldn’t have existed any other way. Every decision has a reason, and every reason serves the person using it. That’s the standard I hold myself to on every project.</ScrollReveal>
      <MagneticField />
      <ScrollReveal
        tag="div"
        className="feel-copy"
        paragraphs={[
          'I don’t just design screens. I design certainty, the kind that makes people trust a product before they’ve even thought about why. That trust is what turns visitors into users, and users into people who stick around.',
          'Interfere goes beyond logs, metrics, and traces. It finds the root cause and explains what’s broken, why, and who it impacts.',
        ]}
      />
    </section>
  );
}

const previews = [
  [bankingPreview, 'Mobile banking product interface'],
  [cardsPreview, 'Mindfulness cards product interface'],
  [healthPreview, 'HelliHealth website on a laptop'],
  [sportsPreview, 'Sports information product interface'],
  [profilePreview, 'Profile selection mobile interface'],
];

function Showcase() {
  return (
    <section className="showcase" aria-label="Product design previews">
      <div className="showcase-track">
        {previews.map(([src, alt]) => <figure key={src}><img src={src} alt={alt} /></figure>)}
      </div>
    </section>
  );
}

function WorkCard({ logo, logoAlt, title, description, cover, coverAlt, coverClass }) {
  return (
    <article className="work-card">
      <img className="work-logo" src={logo} alt={logoAlt} />
      <div className="work-heading">
        <h3>{title}</h3>
        <ScrollReveal className="project-description">{description}</ScrollReveal>
      </div>
      <div className={`work-cover ${coverClass}`}>
        <img src={cover} alt={coverAlt} />
      </div>
      <div className="work-tags" aria-label="Project disciplines">
        {projectTags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  );
}

function SelectedWorks() {
  return (
    <section className="works">
      <ConstructionBand className="works-band" />
      <div className="works-inner">
        <FadeTitle className="works-title">Selected Works</FadeTitle>
        <WorkCard logo={blockLogo} logoAlt="O’Block logo" title="O’Block: Minimal Block Game" description="Starting in January 2024, I took on a daily challenge inspired by the Twitter community." cover={blockCover} coverAlt="2954 minimal block game interface" coverClass="cover-block" />
        <WorkCard logo={moqderateLogo} logoAlt="Moqderate logo" title="Moqderate" description="A calm moderation workspace built to turn noisy community signals into clear decisions." cover={moqderateCover} coverAlt="Moqderate content workspace interface" coverClass="cover-moqderate" />
        <WorkCard logo={piqoLogo} logoAlt="Piqo Design logo" title="Piqo Design: Digital product design" description="Designed the dashboard and chatbot experience for an AI mental health assistant. Built in Lovable." cover={piqoCover} coverAlt="Digital wallet product interface" coverClass="cover-piqo" />
      </div>
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
        <ScrollReveal
          tag="div"
          className="description-copy"
          paragraphs={[
            'Good design is quiet confidence. It doesn’t announce itself, it just works. I start with the logic before I touch the aesthetics, because beautiful design built on shaky decisions is just expensive decoration.',
            'I collaborate closely, prototype early, and care about the details most people never consciously notice, but always feel. It’s rarely the big decisions that make a product feel right, it’s the small ones, repeated consistently, that add up to something people trust.',
          ]}
        />
        <div className="motion-card"><VerticalLines /></div>
      </div>
      <div className="thinking-block quality-block">
        <FadeTitle>Why is quality so rare?</FadeTitle>
        <ScrollReveal
          tag="div"
          className="description-copy"
          paragraphs={[
            'Most products ship at the edge of good enough. Not because the people building them don’t care, but because quality is expensive in ways that don’t show up on a roadmap.',
            'It costs time when deadlines are tight. It costs opinion when everyone’s in the room. It costs restraint when the temptation to add is louder than the discipline to remove. What survives all of that pressure and still insists on being right is what I’m here to protect.',
          ]}
        />
        <div className="motion-card"><MomentumIllustration /></div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="closing">
      <div className="closing-inner section-pad">
        <img className="pc-image" src={pcImage} alt="Classic Macintosh computer" />
        <h2>Let’s build something <em>worth</em> using.</h2>
        <ScrollReveal>I’m available for product design collaborations, UI audits, and long-term partnerships. If you’re building something that deserves to look as good as it works — let’s talk.</ScrollReveal>
      </div>
      <footer className="site-footer section-pad">
        <p><strong>©2026 DividedSign,</strong> <a href="mailto:Hi@DividedSign.com">Hi@DividedSign.com</a></p>
        <nav aria-label="Social links"><a href="#x">X</a><i /> <a href="#instagram">Instagram</a><i /> <a href="#dribbble">Dribbble</a></nav>
      </footer>
      <ConstructionBand className="footer-band" />
    </section>
  );
}

export default function App() {
  return (
    <main className="page-rail">
      <header className="date-row">6 July 2026, Monday</header>
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
