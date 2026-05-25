'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────── */
/*  CONSTANTS                                                   */
/* ─────────────────────────────────────────────────────────── */

const TOTAL_FRAMES = 192;
const BASE_PATH = '/maniams-wooden-toys';

// Build the public URL for each frame (1-indexed, zero-padded to 3 digits)
const frameUrl = (n) =>
  `${BASE_PATH}/frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`;

/**
 * Scroll breakpoints for content panels.
 * Each section defines what fraction of total scroll (0–1) it occupies.
 * frameStart / frameEnd are the 1-based frame indices that are visible
 * during the TEXT section (used only for context — scrubbing is global).
 */
const SECTIONS = [
  {
    id:            'human',
    side:          'left',
    startProgress: 0.30,
    endProgress:   0.55,
    label:         'Figure 01 — Human Figure',
    title:         ['Every', 'Person', 'Starts', 'Here.'],
    titleEmIndex:  3,
    body:          'From scattered beginnings, form emerges. Simple wooden blocks assemble into a human figure — proof that creativity needs no complexity.',
    features:      ['Handcrafted oak & walnut', '47 unique geometric pieces', 'Over 100 buildable forms'],
  },
  {
    id:            'scooter',
    side:          'right',
    startProgress: 0.55,
    endProgress:   0.78,
    label:         'Figure 02 — Scooter',
    title:         ['Go', 'Anywhere', 'You', 'Imagine.'],
    titleEmIndex:  3,
    body:          'The same pieces rearrange. The same hands rebuild. A scooter emerges from what was once a person — because imagination has no limits.',
    features:      ['Precision-cut natural wood', 'Studio-grade finish', 'Designed to inspire'],
  },
  {
    id:            'bird',
    side:          'center',
    startProgress: 0.85,
    endProgress:   1.00,
    label:         null,
    title:         null,
    body:          null,
    features:      null,
  },
];

/* ─────────────────────────────────────────────────────────── */
/*  HELPERS                                                     */
/* ─────────────────────────────────────────────────────────── */

/** Clamp a number between min and max. */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Map a value in [inMin, inMax] to [outMin, outMax], then clamp. */
const mapRange = (v, inMin, inMax, outMin, outMax) => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

/* ─────────────────────────────────────────────────────────── */
/*  COMPONENT                                                   */
/* ─────────────────────────────────────────────────────────── */

export default function CanvasSequence() {
  const canvasRef       = useRef(null);
  const containerRef    = useRef(null);
  const progressBarRef  = useRef(null);
  const framesRef       = useRef([]);          // Image[] cache
  const currentIdxRef   = useRef(0);           // last drawn frame index
  const rafRef          = useRef(null);        // pending rAF handle

  const [loadPct,      setLoadPct]      = useState(0);
  const [allLoaded,    setAllLoaded]    = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [scrollProg,   setScrollProg]   = useState(0);
  const [activeSect,   setActiveSect]   = useState(null); // section id | null
  const [scrolledNav,  setScrolledNav]  = useState(false);

  /* ── Nav click smooth scroll handler ──────────────────────── */
  const handleNavClick = useCallback((sectionId, e) => {
    e.preventDefault();
    if (sectionId === 'explore') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  /* ── Draw a specific frame (cover-fit, full-resolution with panning) ─────── */
  const drawFrame = useCallback((idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = framesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    // canvas.width / canvas.height are PHYSICAL pixels (set in resize).
    // Using them directly for cover-fit means the image is drawn at native
    // screen resolution — no blurring from up-scaling.
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;

    // Calculate scroll progress from frame index to apply smooth horizontal camera panning on mobile
    const progress = idx / (TOTAL_FRAMES - 1);
    let panFactor = 0.5; // default center

    // Panning is only needed on portrait/mobile viewports where horizontal cropping is severe
    if (cw / ch < 0.8) {
      if (progress < 0.25) {
        panFactor = 0.5;
      } else if (progress >= 0.25 && progress < 0.48) {
        panFactor = 0.5;
      } else if (progress >= 0.48 && progress < 0.72) {
        // Pan smoothly to the left to keep the scooter in frame
        const t = (progress - 0.48) / (0.72 - 0.48);
        panFactor = 0.5 + t * (0.12 - 0.5);
      } else if (progress >= 0.72 && progress < 0.82) {
        // Pan smoothly back to center/right
        const t = (progress - 0.72) / (0.82 - 0.72);
        panFactor = 0.12 + t * (0.55 - 0.12);
      } else {
        // Pan to the right to keep the bird in frame
        const t = (progress - 0.82) / (1.0 - 0.82);
        panFactor = 0.55 + t * (0.68 - 0.55);
      }
    }

    const ox = (cw - sw) * panFactor;
    const oy = (ch - sh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, sw, sh);
  }, []);

  /* ── Scroll Restoration & Top scroll on load/refresh ────── */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  /* ── Preload all frames with concurrency throttling ──────── */
  useEffect(() => {
    let done = 0;
    let indexToLoad = 0;
    const imgs = Array.from({ length: TOTAL_FRAMES }, () => null);
    framesRef.current = imgs; // set reference immediately
    let activeRequests = 0;

    const loadNext = () => {
      if (indexToLoad >= TOTAL_FRAMES) return;

      const currentIdx = indexToLoad;
      indexToLoad++;
      activeRequests++;

      const img = new window.Image();
      let hasFinished = false;

      const onFinish = () => {
        if (hasFinished) return;
        hasFinished = true;
        activeRequests--;
        done++;
        
        const pct = Math.round((done / TOTAL_FRAMES) * 100);
        setLoadPct(pct);
        
        if (done === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
        
        // Schedule next request in event loop
        setTimeout(loadNext, 0);
      };

      // Set timeout fallback in case mobile network drops request
      const timeoutId = setTimeout(() => {
        onFinish();
      }, 6000);

      img.onload = () => {
        clearTimeout(timeoutId);
        if (currentIdx === 0) {
          drawFrame(0);
        }
        onFinish();
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        onFinish();
      };

      img.src = frameUrl(currentIdx + 1);
      imgs[currentIdx] = img;
    };

    // Start loading initial batch (first frame gets loaded immediately)
    const CONCURRENCY = 6;
    for (let i = 0; i < CONCURRENCY; i++) {
      loadNext();
    }
  }, [drawFrame]);

  /* After loading finishes, fade out the loader */
  useEffect(() => {
    if (!allLoaded) return;
    const timer = setTimeout(() => setLoaderHidden(true), 800);
    return () => clearTimeout(timer);
  }, [allLoaded]);



  /* ── Resize handler (DPR-aware) ─────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // Scale the canvas BUFFER to physical pixels so every pixel on a
      // Retina / high-DPI screen maps 1-to-1. The CSS size stays at
      // viewport dimensions so the element doesn't overflow.
      const dpr = Math.round(window.devicePixelRatio || 1);
      const w   = window.innerWidth;
      const h   = window.innerHeight;
      canvas.width        = w * dpr;  // physical pixel buffer
      canvas.height       = h * dpr;
      canvas.style.width  = `${w}px`; // CSS display size
      canvas.style.height = `${h}px`;
      drawFrame(currentIdxRef.current);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  /* ── Scroll handler ──────────────────────────────────────── */
  useEffect(() => {
    if (!allLoaded) return;

    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / scrollable, 0, 1);

      setScrollProg(progress);

      /* Update sidebar progress bar */
      if (progressBarRef.current) {
        progressBarRef.current.style.height = `${progress * 100}%`;
      }

      /* Map progress → frame index, schedule a rAF draw */
      const idx = Math.round(progress * (TOTAL_FRAMES - 1));
      if (idx !== currentIdxRef.current) {
        currentIdxRef.current = idx;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }

      /* Detect active section */
      const found = SECTIONS.find(
        (s) => progress >= s.startProgress && progress <= s.endProgress
      );
      setActiveSect(found?.id ?? null);

      /* Detect if scrolled past the hero animation */
      const isScrolledPast = -rect.top > scrollable * 0.95;
      setScrolledNav(isScrolledPast);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // paint initial state
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [allLoaded, drawFrame]);

  /* ── Panel visibility helper ─────────────────────────────── */
  const panelOpacity = (section) => {
    if (!section) return 0;
    const { startProgress: sp, endProgress: ep } = section;
    const fade = (ep - sp) * 0.18; // 18% of section for fade in/out
    if (scrollProg < sp + fade) return mapRange(scrollProg, sp, sp + fade, 0, 1);
    if (scrollProg > ep - fade) return mapRange(scrollProg, ep - fade, ep, 1, 0);
    return 1;
  };

  /* ── Hero opacity (fades away as you start scrolling) ────── */
  const heroOpacity = mapRange(scrollProg, 0, 0.10, 1, 0);

  /* ── Per-section opacities ───────────────────────────────── */
  const humanSect   = SECTIONS[0];
  const scooterSect = SECTIONS[1];
  const birdSect    = SECTIONS[2];

  const humanOp   = activeSect === 'human'   ? panelOpacity(humanSect)   : 0;
  const scooterOp = activeSect === 'scooter' ? panelOpacity(scooterSect) : 0;
  const birdOp    = activeSect === 'bird'    ? panelOpacity(birdSect)    : 0;

  /* ── Panel slide + vertical centre ────────────────────────── */
  // We always translate -50% vertically (to centre on top:50%) and add a
  // small entrance offset that eases to zero as the panel fades in.
  const panelShift = (op) => `translateY(calc(-50% + ${(1 - op) * 32}px))`;

  /* ─────────────────────────────────────────────────────────── */
  /*  RENDER                                                      */
  /* ─────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Loading screen ─────────────────────────────────── */}
      <div
        className={`loader-screen${loaderHidden ? ' hidden' : ''}`}
        role="status"
        aria-live="polite"
        aria-label={`Loading: ${loadPct}%`}
      >
        <p className="loader-wordmark">Maniams</p>
        <div className="loader-bar-wrap">
          <div className="loader-bar-fill" style={{ width: `${loadPct}%` }} />
        </div>
        <p className="loader-count">{loadPct} frames loaded</p>
      </div>

      {/* ── Fixed progress bar ─────────────────────────────── */}
      <div className="progress-bar" ref={progressBarRef} aria-hidden="true" />

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#" className="nav-logo" onClick={(e) => handleNavClick('explore', e)} aria-label="Maniams home">Maniams</a>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => handleNavClick('explore', e)} id="nav-explore">Home</a></li>
          <li><a href="#shop" onClick={(e) => handleNavClick('shop', e)} id="nav-shop">Shop</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick('about', e)} id="nav-about">About Us</a></li>
        </ul>
      </nav>

      {/* ── Grain texture ──────────────────────────────────── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Main scroll container (650vh gives scroll room) ── */}
      <main
        ref={containerRef}
        className="canvas-scroll-root"
        style={{ height: '660vh' }}
        aria-label="Wooden puzzle scroll experience"
      >
        <div className="canvas-sticky-wrap">

          {/* Canvas */}
          <canvas ref={canvasRef} className="main-canvas" aria-hidden="true" />

          {/* Vignette + bottom fade */}
          <div className="vignette" aria-hidden="true" />
          <div className="bottom-fade" aria-hidden="true" />

          {/* Left reading zone — fades in with human panel */}
          <div
            className="left-zone"
            aria-hidden="true"
            style={{ opacity: humanOp }}
          />

          {/* Right reading zone — fades in with scooter panel */}
          <div
            className="right-zone"
            aria-hidden="true"
            style={{ opacity: scooterOp }}
          />

          {/* ── HERO OVERLAY ─────────────────────────────── */}
          <div
            className="hero-overlay"
            aria-hidden={heroOpacity < 0.05}
            style={{ opacity: heroOpacity }}
          >
            <p className="hero-eyebrow">Maniams · Wooden Puzzle Set</p>
            <h1 className="hero-headline">
              <span className="hl-yellow">One Set.</span>
              <span className="hl-white">Infinite</span>
              <span className="hl-yellow">Possibilities.</span>
            </h1>
            <p className="hero-sub">
              47 handcrafted wooden pieces. Endless forms. One extraordinary toy.
            </p>

            <div
              className="hero-scroll-cue"
              aria-hidden="true"
              style={{ opacity: clamp(heroOpacity - 0.2, 0, 1) }}
            >
              <div className="scroll-mouse" />
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* ── HUMAN FIGURE PANEL (LEFT) ────────────────── */}
          <section
            className="text-panel left"
            aria-label="Human figure section"
            style={{
              opacity:       humanOp,
              transform:     panelShift(humanOp),
              transition:    'opacity 0.5s ease, transform 0.5s ease',
              pointerEvents: humanOp > 0.4 ? 'auto' : 'none',
            }}
          >
            <p className="panel-label">{humanSect.label}</p>
            <h2 className="panel-title">
              {humanSect.title.map((word, i) => (
                <span key={word} style={{ display: 'block' }}>
                  {i === humanSect.titleEmIndex ? <em>{word}</em> : word}
                </span>
              ))}
            </h2>
            <p className="panel-body">{humanSect.body}</p>
            <ul className="panel-feature-list">
              {humanSect.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          {/* ── SCOOTER PANEL (RIGHT) ────────────────────── */}
          <section
            className="text-panel right"
            aria-label="Scooter section"
            style={{
              opacity:       scooterOp,
              transform:     panelShift(scooterOp),
              transition:    'opacity 0.5s ease, transform 0.5s ease',
              pointerEvents: scooterOp > 0.4 ? 'auto' : 'none',
            }}
          >
            <p className="panel-label">{scooterSect.label}</p>
            <h2 className="panel-title">
              {scooterSect.title.map((word, i) => (
                <span key={word} style={{ display: 'block' }}>
                  {i === scooterSect.titleEmIndex ? <em>{word}</em> : word}
                </span>
              ))}
            </h2>
            <p className="panel-body">{scooterSect.body}</p>
            <ul className="panel-feature-list">
              {scooterSect.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          {/* ── ENDING OVERLAY ───────────────────────────── */}
          <div
            className="ending-overlay"
            aria-hidden={birdOp < 0.05}
            style={{ opacity: birdOp, pointerEvents: birdOp > 0.5 ? 'auto' : 'none' }}
          >
            <h2 className="ending-headline">
              <span className="hl-yellow">Build</span>
              <span className="hl-white">Anything.</span>
            </h2>
            <p className="ending-sub">
              The only limit is your imagination.
            </p>
            <button
              id="cta-discover"
              className="cta-button glass-btn"
              onClick={(e) => handleNavClick('shop', e)}
            >
              Discover the Set
            </button>
          </div>

        </div>{/* /.canvas-sticky-wrap */}
      </main>
    </>
  );
}
