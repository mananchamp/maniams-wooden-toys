'use client';

import React, { useState } from 'react';

function FlipCard({ 
  index, 
  editorialNum, 
  scale, 
  title, 
  children, 
  backTitle, 
  backPoints,
  hoveredIdx,
  setHoveredIdx
}) {
  const [flipped, setFlipped] = useState(false);

  const handleTrigger = () => {
    const nextFlipped = !flipped;
    setFlipped(nextFlipped);
    if (nextFlipped) {
      setHoveredIdx(index);
    } else if (hoveredIdx === index) {
      setHoveredIdx(null);
    }
  };

  const handleMouseEnter = () => {
    setHoveredIdx(index);
  };

  const handleMouseLeave = () => {
    setFlipped(false);
    if (hoveredIdx === index) {
      setHoveredIdx(null);
    }
  };

  const isActiveFlow = hoveredIdx === index;

  return (
    <div 
      className={`flip-card flip-card-${index + 1}${isActiveFlow ? ' active-flow' : ''}${flipped ? ' flipped' : ''}`}
      onClick={handleTrigger}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Interactive card: ${title}. Click or tap to flip.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTrigger();
        }
      }}
    >
      <div className="flip-card-inner">
        
        {/* Front Face: Luxury Editorial Card */}
        <div className="flip-card-front editorial-card-front">
          <div className="editorial-header">
            <span className="editorial-num">{editorialNum}</span>
            <span className="editorial-label">{scale}</span>
          </div>
          
          <h3 className="editorial-title">{title}</h3>
          
          <div className="editorial-graphic">
            {children}
          </div>
          
          <div className="editorial-footer">
            <span>MANIAMS LAB</span>
            <span className="editorial-prompt">Reveal Story</span>
          </div>
        </div>

        {/* Back Face: Blue Stencil Blueprint Card */}
        <div className="flip-card-back photo-text-card">
          <div className="card-back-content">
            <h4 className="card-back-title">{backTitle}</h4>
            <ul className="card-back-list">
              {backPoints.map((point, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AboutSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <>
      <section id="about" className="about-section" aria-labelledby="about-heading">
        <div className="about-container">
          
          {/* Header */}
          <header className="about-header">
            <h2 id="about-heading" className="about-title">Not Just Toys. <span>Organic Tech.</span></h2>
            <p className="about-subtitle">
              In a world dominated by screens and plastic, we return to tactile, meaningful play.
            </p>
          </header>

          {/* Cards Grid */}
          <div className="about-cards-grid">
            
            {/* Card 1: The Founder */}
            <FlipCard
              index={0}
              editorialNum="I"
              scale="DESIGNER"
              title="The Visionary Behind the Craft"
              backTitle="Kanaka Ananth"
              backPoints={[
                "Graduated from the pioneering first batch of <strong>Toy Design at NID Ahmedabad</strong>.",
                "Combines a professional background in <strong>Architecture & Industrial Design</strong>.",
                "Draws inspiration from Indian cultural heritage to build physical intelligence.",
                "Engineers sustainable toys meant to scale as <strong>generational legacy blocks</strong>."
              ]}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            >
              <svg className="editorial-svg" viewBox="0 0 300 200" aria-hidden="true">
                <line x1="150" y1="10" x2="150" y2="190" className="editorial-stroke-line" style={{ strokeDasharray: '3 5' }} />
                <line x1="20" y1="100" x2="280" y2="100" className="editorial-stroke-line" style={{ strokeDasharray: '3 5' }} />
                <circle cx="150" cy="100" r="75" className="editorial-stroke-line" />
                
                {/* Architectural Arch Outline */}
                <path d="M 110,150 L 110,95 A 40,40 0 0,1 190,95 L 190,150 Z" className="editorial-stroke-bold" />
                <path d="M 95,150 L 95,95 A 55,55 0 0,1 205,95 L 205,150 Z" className="editorial-stroke-accent" />
                <line x1="85" y1="150" x2="215" y2="150" className="editorial-stroke-bold" style={{ strokeWidth: '3px' }} />
              </svg>
            </FlipCard>

            {/* Card 2: Science of Wood */}
            <FlipCard
              index={1}
              editorialNum="II"
              scale="SENSORY"
              title="The Science of Wood"
              backTitle="Tactile Development"
              backPoints={[
                "Organic texture of natural wood <strong>builds dense neural pathways</strong> in the brain.",
                "Tactile feedback develops <strong>spatial reasoning and fine motor coordination</strong>.",
                "Stimulates mathematical planning without digital screens or flashing lights.",
                "Constructed with <strong>100% natural, non-toxic organic materials</strong>."
              ]}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            >
              <svg className="editorial-svg" viewBox="0 0 300 200" aria-hidden="true">
                <circle cx="150" cy="100" r="75" className="editorial-stroke-line" />
                <line x1="75" y1="100" x2="225" y2="100" className="editorial-stroke-line" style={{ strokeDasharray: '2 4' }} />
                
                {/* 3D isometric cube block */}
                <polygon points="150,65 195,45 240,65 195,85" className="editorial-stroke-bold" />
                <polygon points="150,65 150,125 195,145 195,85" className="editorial-stroke-bold" />
                <polygon points="195,85 195,145 240,125 240,65" className="editorial-stroke-bold" />
                
                <polygon points="150,125 105,105 60,125 105,145" className="editorial-stroke-accent" />
                <polygon points="60,125 60,185 105,205 105,145" className="editorial-stroke-accent" />
                <polygon points="105,145 105,205 150,185 150,125" className="editorial-stroke-accent" />
              </svg>
            </FlipCard>

            {/* Card 3: Inclusivity */}
            <FlipCard
              index={2}
              editorialNum="III"
              scale="INCLUSIVE"
              title="Radically Inclusive"
              backTitle="Montessori & Waldorf Principles"
              backPoints={[
                "Aligned with <strong>Montessori and Waldorf</strong> systems of hands-on, creative education.",
                "Zero battery sounds or flashing lights to prevent sensory overload.",
                "Provides a <strong>calming, tactile focus</strong> suitable for specially abled learners.",
                "Creates an inclusive play loop that builds physical confidence."
              ]}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            >
              <svg className="editorial-svg" viewBox="0 0 300 200" aria-hidden="true">
                <circle cx="150" cy="100" r="80" className="editorial-stroke-line" style={{ strokeDasharray: '4 4' }} />
                <circle cx="150" cy="100" r="60" className="editorial-stroke-line" />
                <circle cx="150" cy="100" r="40" className="editorial-stroke-line" />
                
                {/* Geometrical symmetry stars */}
                <polygon points="150,30 168,75 215,75 178,103 192,148 150,120 108,148 122,103 85,75 132,75" className="editorial-stroke-bold" />
                
                <line x1="150" y1="20" x2="150" y2="180" className="editorial-stroke-accent" />
                <line x1="50" y1="100" x2="250" y2="100" className="editorial-stroke-accent" />
              </svg>
            </FlipCard>

            {/* Card 4: NID Engineering */}
            <FlipCard
              index={3}
              editorialNum="IV"
              scale="ENGINEERED"
              title="NID Engineered Toys"
              backTitle="Structural Architecture"
              backPoints={[
                "Explicitly engineered by <strong>NID graduates</strong> to teach geometry and physics.",
                "Develops core logic in <strong>structural balance, symmetry, and load coordination</strong>.",
                "Designed to puzzle-solve via mathematical planning and structural alignment.",
                "Scalable shapes allow building <strong>unlimited real-world and fantasy models</strong>."
              ]}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            >
              <svg className="editorial-svg" viewBox="0 0 300 200" aria-hidden="true">
                <line x1="30" y1="155" x2="270" y2="155" className="editorial-stroke-line" />
                <circle cx="150" cy="100" r="75" className="editorial-stroke-line" style={{ strokeDasharray: '3 6' }} />
                
                {/* Scooter outline */}
                <circle cx="95" cy="130" r="22" className="editorial-stroke-bold" />
                <circle cx="205" cy="130" r="22" className="editorial-stroke-bold" />
                <rect x="108" y="118" width="84" height="12" className="editorial-stroke-bold" rx="2" />
                <line x1="95" y1="120" x2="95" y2="55" className="editorial-stroke-bold" style={{ strokeWidth: '3px' }} />
                <line x1="80" y1="55" x2="110" y2="55" className="editorial-stroke-bold" style={{ strokeWidth: '3px' }} />
                
                <circle cx="205" cy="130" r="32" className="editorial-stroke-accent" />
              </svg>
            </FlipCard>

          </div>

        </div>
      </section>

      {/* Infinite Scrolling Marquee */}
      <section className="marquee-section" aria-label="Awards and Certifications Marquee">
        <div className="marquee-container">
          <div className="marquee-text">
            <span>BIS CERTIFIED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>TOYCATHON WINNER <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>MONTESSORI APPROVED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>BIS CERTIFIED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>TOYCATHON WINNER <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>MONTESSORI APPROVED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>BIS CERTIFIED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>TOYCATHON WINNER <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>MONTESSORI APPROVED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>BIS CERTIFIED <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>TOYCATHON WINNER <em className="marquee-dot" aria-hidden="true">•</em></span>
            <span>MONTESSORI APPROVED <em className="marquee-dot" aria-hidden="true">•</em></span>
          </div>
        </div>
      </section>
    </>
  );
}
