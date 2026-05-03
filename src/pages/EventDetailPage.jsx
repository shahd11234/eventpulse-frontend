import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { eventsAPI } from '../services/api';
import { EVENTS } from '../data/mockData';
import './EventDetailPage.css';

const TICKET_TYPES = [
  { type: 'General', multiplier: 1 },
  { type: 'VIP', multiplier: 2.5 },
  { type: 'Group (x5)', multiplier: 4.5 },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const { addToCart, user } = useApp();
  const navigate = useNavigate();
  const [event, setEvent] = useState(() => EVENTS.find(e => String(e.id) === String(id)) || null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('General');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getOne(id)
      .then(async (data) => {
        setEvent(data);
        const all = await eventsAPI.getAll();
        setRelatedEvents(all.filter(e => e.category === data.category && e._id !== id).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !event) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
      <p>Loading event...</p>
    </div>
  );

  if (!event) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
      <h2>Event not found</h2>
      <Link to="/events" className="btn btn-primary" style={{ marginTop: 20 }}>← Back to Events</Link>
    </div>
  );
  const ticketPrice = event.price === 0 ? 0 : Math.round(event.price * TICKET_TYPES.find(t => t.type === selectedTicket).multiplier);
  const total = ticketPrice * qty;
  const capacityPct = Math.round((event.attendees / event.capacity) * 100);

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(event, selectedTicket, qty);
    navigate('/cart');
  };

  return (
    <div className="page-wrapper event-detail-page">
      {/* HERO */}
      <div className="detail-hero" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="detail-hero-overlay" />
        <div className="container detail-hero-content">
          <Link to="/events" className="back-link">← Back to Events</Link>
          <span className="badge badge-gold">{event.category}</span>
          <h1>{event.title}</h1>
          <div className="detail-meta">
            <span>📅 {new Date(event.date).toLocaleDateString('en-AE', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</span>
            <span>⏰ {event.time}</span>
            <span>📍 {event.location}</span>
            <span>⭐ {event.rating} ({event.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        {/* MAIN CONTENT */}
        <div className="detail-main">
          {/* TABS */}
          <div className="detail-tabs">
            {['about', 'schedule', 'reviews'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <div className="tab-content">
              <h3>About This Event</h3>
              <p>{event.description}</p>
              <p>Join thousands of attendees at this premier event. Whether you're a professional looking to network, an enthusiast wanting to learn, or someone just looking for a great experience — this event has something for everyone.</p>

              <h3>Tags & Topics</h3>
              <div className="event-tags-large">
                {event.tags.map(t => <span key={t} className="badge badge-blue">{t}</span>)}
              </div>

              <h3>Event Highlights</h3>
              <div className="highlights-grid">
                {['World-class speakers', 'Networking sessions', 'Live demonstrations', 'Q&A panels'].map(h => (
                  <div key={h} className="highlight-item"><span>✓</span> {h}</div>
                ))}
              </div>

              <h3>Organizer</h3>
              <div className="organizer-info">
                <div className="org-avatar">{event.organizer.charAt(0)}</div>
                <div>
                  <p className="org-name">{event.organizer}</p>
                  <p className="org-sub">Verified Organizer ✓</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="tab-content">
              <h3>Event Schedule</h3>
              {[
                { time: '09:00 AM', title: 'Registration & Welcome', desc: 'Check-in and collect your event kit' },
                { time: '10:00 AM', title: 'Opening Keynote', desc: 'Special address from the organizers and guest speakers' },
                { time: '11:30 AM', title: 'Panel Discussion', desc: 'Industry leaders share insights and experiences' },
                { time: '01:00 PM', title: 'Networking Lunch', desc: 'Connect with fellow attendees over a catered lunch' },
                { time: '02:30 PM', title: 'Workshops', desc: 'Hands-on sessions with industry experts' },
                { time: '05:00 PM', title: 'Closing Ceremony', desc: 'Awards, acknowledgements, and farewell' },
              ].map((s, i) => (
                <div key={i} className="schedule-item">
                  <div className="schedule-time">{s.time}</div>
                  <div className="schedule-connector"><div className="schedule-dot" /><div className="schedule-line" /></div>
                  <div className="schedule-info">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-content">
              <div className="reviews-summary">
                <div className="rating-big">
                  <span className="rating-number">{event.rating}</span>
                  <div className="rating-stars">{'★'.repeat(Math.floor(event.rating))}{'☆'.repeat(5 - Math.floor(event.rating))}</div>
                  <p>{event.reviews} reviews</p>
                </div>
                <div className="rating-bars">
                  {[5,4,3,2,1].map(n => (
                    <div key={n} className="rating-bar-row">
                      <span>{n}★</span>
                      <div className="rating-bar-bg">
                        <div className="rating-bar-fill" style={{ width: n === 5 ? '70%' : n === 4 ? '20%' : n === 3 ? '7%' : '2%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reviews-list">
                {[
                  { name: 'Ahmad K.', rating: 5, date: '2 weeks ago', text: 'Absolutely incredible event! The organization was flawless and the speakers were top-notch.' },
                  { name: 'Sarah M.', rating: 5, date: '1 month ago', text: 'Great networking opportunities. Met some amazing people in my industry.' },
                  { name: 'Raj P.', rating: 4, date: '1 month ago', text: 'Very well organized. The venue was excellent and the content was highly relevant.' },
                ].map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{r.name.charAt(0)}</div>
                      <div>
                        <p className="reviewer-name">{r.name}</p>
                        <p className="review-date">{r.date}</p>
                      </div>
                      <div className="review-stars">{'★'.repeat(r.rating)}</div>
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELATED */}
          {relatedEvents.length > 0 && (
            <div className="related-section">
              <h3>You Might Also Like</h3>
              <div className="related-grid">
                {relatedEvents.map(e => (
                  <Link to={`/events/${e.id}`} key={e.id} className="related-card">
                    <img src={e.image} alt={e.title} />
                    <div className="related-info">
                      <h4>{e.title}</h4>
                      <p>📅 {new Date(e.date).toLocaleDateString('en-AE', { day:'numeric', month:'short' })}</p>
                      <p className="related-price">{e.price === 0 ? 'FREE' : `AED ${e.price}`}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOOKING SIDEBAR */}
        <div className="booking-sidebar">
          <div className="booking-card">
            <h3>Book Your Ticket</h3>

            <div className="ticket-type-select">
              {TICKET_TYPES.map(t => (
                <button
                  key={t.type}
                  className={`ticket-type-btn ${selectedTicket === t.type ? 'active' : ''}`}
                  onClick={() => setSelectedTicket(t.type)}
                >
                  <span>{t.type}</span>
                  <span>{event.price === 0 ? 'FREE' : `AED ${Math.round(event.price * t.multiplier)}`}</span>
                </button>
              ))}
            </div>

            <div className="qty-control">
              <label>Quantity</label>
              <div className="qty-btns">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-row"><span>Ticket Price</span><span>AED {ticketPrice}</span></div>
              <div className="summary-row"><span>Quantity</span><span>×{qty}</span></div>
              <div className="summary-row"><span>Service Fee</span><span>AED {Math.round(total * 0.05)}</span></div>
              <div className="summary-total"><span>Total</span><span>AED {total + Math.round(total * 0.05)}</span></div>
            </div>

            <div className="capacity-info">
              <div className="capacity-bar"><div className="capacity-fill" style={{ width: `${capacityPct}%` }} /></div>
              <p>{event.attendees.toLocaleString()} / {event.capacity.toLocaleString()} registered — {100 - capacityPct}% remaining</p>
            </div>

            <button className="btn btn-primary booking-btn" onClick={handleBook}>
              {user ? (event.price === 0 ? '🎟️ Register Free' : `🛒 Add to Cart`) : '🔐 Login to Book'}
            </button>
            <p className="booking-note">✅ Instant QR ticket delivery after payment</p>
          </div>

          <div className="share-card">
            <h4>Share Event</h4>
            <div className="share-btns">
              {['📘 Facebook', '🐦 Twitter', '🔗 Copy Link'].map(s => (
                <button key={s} className="share-btn">{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
