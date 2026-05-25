'use client';

import React from 'react';

export default function Footer() {
  const amazonLink = "https://www.amazon.in/stores/page/F1C3BD5F-C7B6-44C8-B49E-4D27CE031689?ingress=3";

  const handleScroll = (id, e) => {
    e.preventDefault();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="footer-container">
        
        {/* Brand Information */}
        <div className="footer-brand">
          <h4>Maniams</h4>
          <p>
            Architect-engineered, Montessori-approved wooden toys designed to build spatial logic and dense neural pathways. Handcrafted in India.
          </p>
        </div>

        {/* Footer Navigation Columns */}
        <div className="footer-links-wrap">
          <nav className="footer-nav" aria-label="Footer links">
            <h5>Navigation</h5>
            <ul>
              <li>
                <a href="#explore" onClick={(e) => handleScroll('top', e)}>
                  Explore
                </a>
              </li>
              <li>
                <a href="#shop" onClick={(e) => handleScroll('shop', e)}>
                  Shop
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScroll('about', e)}>
                  About
                </a>
              </li>
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Footer store links">
            <h5>Store</h5>
            <ul>
              <li>
                <a href={amazonLink} target="_blank" rel="noopener noreferrer">
                  Amazon Brand Store
                </a>
              </li>
              <li>
                <a href="#shop" onClick={(e) => handleScroll('shop', e)}>
                  Collections
                </a>
              </li>
            </ul>
          </nav>
        </div>

      </div>

      {/* Footer Bottom Fine Print */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Maniams Design Studio. All Rights Reserved.</p>
        <div className="footer-socials">
          <a href={amazonLink} target="_blank" rel="noopener noreferrer">
            Amazon Page
          </a>
          <a href="#about" onClick={(e) => handleScroll('about', e)}>
            Our Craft
          </a>
        </div>
      </div>
    </footer>
  );
}
