import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { EVENTS, CATEGORIES, TESTIMONIALS, STATS } from '../data/mockData';
import { eventsAPI } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allEvents, setAllEvents] = useState(EVENTS);
  const navigate = useNavigate();
  const featured = allEvents.filter(e => e.featured).slice(0, 5);
  const featuredFallback = featured.length > 0 ? featured : allEvents.slice(0, 5);

  useEffect(() => {
    eventsAPI.getAll()
      .then(data => { if (data.length > 0) setAllEvents(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (featuredFallback.length === 0) return;
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % featuredFallback.length), 4000);
    return () => clearInterval(timer);
  }, [featuredFallback.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events?q=${searchQuery}`);
  };

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {featuredFallback.map((e, i) => (
            <div key={e._id || e.id} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${e.image})` }} />
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-label badge badge-gold">🇦🇪 Dubai & UAE's #1 Event Platform</span>
            <h1 className="hero-title">
              Discover &<br />
              <span className="hero-accent">Experience</span><br />
              Extraordinary Events
            </h1>
            <p className="hero-desc">
              From tech summits to desert festivals — find, book, and attend the most exciting events across the UAE. Your next unforgettable experience is one click away.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </div>
            </form>

            <div className="hero-chips">
              {['Technology', 'Music', 'Business', 'Food', 'Cultural'].map(c => (
                <button key={c} className="chip" onClick={() => navigate(`/events?cat=${c}`)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="hero-card-preview">
            {featured[currentSlide] && (
              <div className="preview-card">
                <img src={featured[currentSlide].image} alt="" />
                <div className="preview-info">
                  <span className="badge badge-gold">{featured[currentSlide].category}</span>
                  <h4>{featured[currentSlide].title}</h4>
                  <p>📅 {new Date(featured[currentSlide].date).toLocaleDateString('en-AE', { day: 'numeric', month: 'long' })}</p>
                  <p>📍 {featured[currentSlide].location}</p>
                  <div className="preview-price">
                    {featured[currentSlide].price === 0 ? 'FREE' : `AED ${featured[currentSlide].price}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hero-dots">
          {featured.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section container">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Explore events that match your interests</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/events?cat=${cat.name}`)}
              style={{ '--cat-color': cat.color }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.count} events</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="featured-events container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">Handpicked events you won't want to miss</p>
          </div>
          <Link to="/events" className="btn btn-dark">View All →</Link>
        </div>
        <div className="grid-3">
          {allEvents.slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <span className="badge badge-gold">🎉 Limited Time</span>
            <h2>Become an Event Organizer</h2>
            <p>Create, manage and sell tickets for your events. Join 500+ organizers already on EventPulse.</p>
            <Link to="/signup" className="btn btn-primary">Get Started Free →</Link>
          </div>
          <div className="promo-visual">
            <div className="promo-float-card">
              <span>📊</span>
              <div>
                <p>Events Created</p>
                <strong>2,400+</strong>
              </div>
            </div>
            <div className="promo-float-card delay">
              <span>🎫</span>
              <div>
                <p>Tickets Sold</p>
                <strong>180K+</strong>
              </div>
            </div>
            <div className="promo-float-card delay2">
              <span>⭐</span>
              <div>
                <p>Avg Rating</p>
                <strong>4.8/5</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section container">
        <div className="section-header">
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle">Trusted by thousands across the UAE</p>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} />
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section container">
        <div className="newsletter-box">
          <h2>Stay in the Loop 📬</h2>
          <p>Get the latest events and exclusive offers delivered to your inbox</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
