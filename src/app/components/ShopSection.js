'use client';

import React from 'react';

const products = [
  {
    id: 'aakar',
    name: 'Aakar 50',
    description: 'An open-ended storytelling and language development puzzle. Handcrafted wooden pieces to construct animals, birds, letters, and figures.',
    price: '₹1,650',
    image: 'https://m.media-amazon.com/images/I/81zNToGvbVL._AC_CR0%2C0%2C0%2C0_SX367_SY384_.jpg',
    amazonUrl: 'https://www.amazon.in/Maniams-Handmade-Communication-Development-Alphabets/dp/B09BZFKLZ5?ref_=ast_sto_dp'
  },
  {
    id: 'jharokha',
    name: 'Jharokha',
    description: 'A sustainable shape-sorter puzzle for toddlers inspired by traditional Indian balconies. Integrates textile motifs to teach geometry and colors.',
    price: '₹1,250',
    image: 'https://m.media-amazon.com/images/I/71yzs5fZstL._AC_CR0%2C0%2C0%2C0_SX367_SY384_.jpg',
    amazonUrl: 'https://www.amazon.in/Maniams-Jharokha-Activity-Multicolor-Educational/dp/B0DL5YM154?ref_=ast_sto_dp'
  },
  {
    id: 'kona',
    name: 'Kona Polyhedron',
    description: 'A 3D design toy introducing kids to structural architecture, spatial perception, and polyhedron balance through modular wooden pieces.',
    price: '₹1,950',
    image: 'https://m.media-amazon.com/images/I/91qXAOjIBwL._AC_CR0%2C0%2C0%2C0_SX367_SY384_.jpg',
    amazonUrl: 'https://www.amazon.in/Kona-Polyhedron-Wooden-Perception-Development/dp/B0D5W9SR4G?ref_=ast_sto_dp'
  },
  {
    id: 'stacking-geometric',
    name: 'Stacking Geometric',
    description: 'Designed for motor control, preschool sorting, and spatial intelligence. Handcrafted with premium organic wood and non-toxic paint.',
    price: '₹1,450',
    image: 'https://m.media-amazon.com/images/I/71W3f7Vh+UL._AC_CR0%2C0%2C0%2C0_SX367_SY384_.jpg',
    amazonUrl: 'https://www.amazon.in/Maniams-Stacking-Geometric-Preschool-Reasoning/dp/B09WR8J1ZN?ref_=ast_sto_dp'
  }
];

export default function ShopSection() {
  const generalStoreLink = "https://www.amazon.in/stores/page/F1C3BD5F-C7B6-44C8-B49E-4D27CE031689?ingress=3";

  return (
    <section id="shop" className="shop-section" aria-labelledby="shop-heading">
      <div className="shop-container">
        
        {/* Section Header */}
        <header className="shop-header">
          <h2 id="shop-heading" className="shop-title">The Core Collection</h2>
          <p className="shop-subtitle">
            Beautiful, durable, and inclusive. Every piece is crafted to fit seamlessly into the Montessori & Waldorf systems of education.
          </p>
        </header>

        {/* Featured Flatlay Banner Card */}
        <div className="shop-banner-card wood-block">
          <div className="shop-banner-img-wrap">
            <img 
              src="/products_flatlay.png" 
              alt="Maniams Design Studio Wooden Block Set Flatlay" 
              className="shop-banner-img"
              loading="lazy"
            />
          </div>
          <div className="shop-banner-content">
            <h3>Handcrafted Legacy</h3>
            <p>
              Our complete puzzle set is engineered to scale with your child's developing mind. From basic motor control and pattern-matching to complex architectural logic and structural engineering, this single collection of blocks offers infinite ways to build.
            </p>
            <a 
              href={generalStoreLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="amazon-btn"
              style={{ display: 'inline-block', padding: '0.9rem 2.2rem' }}
            >
              Explore Full Collection
            </a>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card wood-block" id={`product-${product.id}`}>
              <div className="product-img-wrap">
                <img 
                  src={product.image} 
                  alt={`${product.name} educational wooden toy`} 
                  className="product-img"
                  loading="lazy"
                />
              </div>
              <div className="product-info">
                <div className="product-meta">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price" aria-label={`Price: ${product.price}`}>{product.price}</span>
                </div>
                <p className="product-desc">{product.description}</p>
                <a 
                  href={product.amazonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="amazon-btn"
                >
                  Buy on Amazon
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Explore More Products Link */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4.5rem' }}>
          <a 
            href={generalStoreLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="amazon-btn"
            style={{ display: 'inline-block', padding: '1rem 3.5rem', fontSize: '0.8rem' }}
          >
            Explore more products
          </a>
        </div>

      </div>
    </section>
  );
}
