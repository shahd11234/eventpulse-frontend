import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EVENTS } from '../data/mockData';
import './OrganizerPage.css';

const OrganizerPage = () => {
  const { user, addNotification } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Technology', date: '', time: '', location: '', price: '', capacity: '', description: '' });

  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    navigate('/login'); return null;
  }

  const orgEvents = EVENTS.slice(0, 5);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    addNotification('Event created successfully! 🎉', 'success');
    setShowCreateModal(false);
    setNewEvent({ title: '', category: 'Technology', date: '', time: '', location: '', price: '', capacity: '', description: '' });
  };

  const stats = [
    { label: 'Total Events', value: orgEvents.length, icon: '🎉', color: '#f0a500' },
    { label: 'Total Attendees', value: orgEvents.reduce((a, e) => a + e.attendees, 0).toLocaleString(), icon: '👥', color: '#3b82f6' },
    { label: 'Revenue (AED)', value: orgEvents.reduce((a, e) => a + e.price * e.attendees, 0).toLocaleString(), icon: '💰', color: '#22c55e' },
    { label: 'Avg Rating', value: (orgEvents.reduce((a, e) => a + e.rating, 0) / orgEvents.length).toFixed(1), icon: '⭐', color: '#e8445a' },
  ];

  return (
    <div className="page-wrapper organizer-page">
      <div className="container">
        <div className="organizer-header">
          <div>
            <h1 className="section-title">Organizer Panel</h1>
            <p className="section-subtitle">Manage your events, track attendance, and grow your audience</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            ＋ Create New Event
          </button>
        </div>

        {/* Stats */}
        <div className="org-stats">
          {stats.map((s, i) => (
            <div key={i} className="org-stat-card" style={{ '--c': s.color }}>
              <span>{s.icon}</span>
              <div>
                <p className="org-stat-val">{s.value}</p>
                <p className="org-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="org-tabs">
          {['events', 'analytics', 'attendees'].map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t === 'events' ? '📅' : t === 'analytics' ? '📊' : '👥'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'events' && (
          <div className="org-events-table">
            <div className="table-header">
              <span>Event</span><span>Date</span><span>Attendees</span><span>Revenue</span><span>Status</span><span>Actions</span>
            </div>
            {orgEvents.map(event => (
              <div key={event.id} className="table-row">
                <div className="table-event-cell">
                  <img src={event.image} alt="" />
                  <div>
                    <p className="table-event-title">{event.title}</p>
                    <span className="badge badge-gold">{event.category}</span>
                  </div>
                </div>
                <span>{new Date(event.date).toLocaleDateString('en-AE', { day:'numeric', month:'short', year:'numeric' })}</span>
                <span>
                  <div className="mini-bar"><div className="mini-fill" style={{ width: `${(event.attendees / event.capacity) * 100}%` }} /></div>
                  {event.attendees}/{event.capacity}
                </span>
                <span className="revenue">AED {(event.price * event.attendees).toLocaleString()}</span>
                <span><span className="badge badge-green">Active</span></span>
                <div className="table-actions">
                  <button className="action-btn edit">✏️ Edit</button>
                  <button className="action-btn delete">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Bookings This Month</h4>
              <div className="bar-chart">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
                  <div key={d} className="bar-col">
                    <div className="bar" style={{ height: `${30 + Math.random() * 70}%` }} />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="analytics-card">
              <h4>Category Breakdown</h4>
              <div className="category-breakdown">
                {[{ label: 'Technology', pct: 38, color: '#0a0f2e' }, { label: 'Music', pct: 24, color: '#e8445a' }, { label: 'Business', pct: 20, color: '#3b82f6' }, { label: 'Other', pct: 18, color: '#22c55e' }].map(c => (
                  <div key={c.label} className="breakdown-row">
                    <span>{c.label}</span>
                    <div className="breakdown-bar-bg"><div className="breakdown-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} /></div>
                    <span>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="analytics-card">
              <h4>Revenue Trend</h4>
              <p className="analytics-big">AED {(orgEvents.reduce((a,e) => a + e.price * e.attendees, 0)).toLocaleString()}</p>
              <p className="analytics-sub">↑ 18% from last month</p>
            </div>
            <div className="analytics-card">
              <h4>Avg Ticket Price</h4>
              <p className="analytics-big">AED {Math.round(orgEvents.filter(e=>e.price>0).reduce((a,e)=>a+e.price,0)/orgEvents.filter(e=>e.price>0).length)}</p>
              <p className="analytics-sub">Across all paid events</p>
            </div>
          </div>
        )}

        {activeTab === 'attendees' && (
          <div className="attendees-table">
            <div className="table-header-2">
              <span>Name</span><span>Event</span><span>Ticket Type</span><span>Date</span><span>Status</span>
            </div>
            {[
              { name: 'Ahmad Hassan', event: 'Dubai Tech Summit 2025', ticket: 'VIP', date: '2025-07-10', status: 'Confirmed' },
              { name: 'Sarah Ahmed', event: 'Desert Music Festival', ticket: 'General', date: '2025-06-22', status: 'Confirmed' },
              { name: 'Priya Sharma', event: 'Arabian Business Forum', ticket: 'Group', date: '2025-05-15', status: 'Checked In' },
              { name: 'Mohammed Ali', event: 'Dubai Tech Summit 2025', ticket: 'General', date: '2025-07-10', status: 'Confirmed' },
            ].map((a, i) => (
              <div key={i} className="attendee-row">
                <div className="attendee-cell">
                  <div className="small-avatar">{a.name.charAt(0)}</div>
                  {a.name}
                </div>
                <span>{a.event}</span>
                <span><span className="badge badge-gold">{a.ticket}</span></span>
                <span>{new Date(a.date).toLocaleDateString('en-AE', { day:'numeric', month:'short' })}</span>
                <span><span className={`badge ${a.status === 'Checked In' ? 'badge-green' : 'badge-blue'}`}>{a.status}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Event</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form className="modal-form" onSubmit={handleCreateEvent}>
              <div className="form-group"><label>Event Title *</label><input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Enter event title" /></div>
              <div className="form-row-2">
                <div className="form-group"><label>Category</label>
                  <select value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                    {['Technology', 'Music', 'Business', 'Cultural', 'Health', 'Arts', 'Food', 'Sports'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Price (AED)</label><input type="number" min={0} value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: e.target.value })} placeholder="0 for free" /></div>
              </div>
              <div className="form-row-2">
                <div className="form-group"><label>Date *</label><input required type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} /></div>
                <div className="form-group"><label>Time *</label><input required type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Location *</label><input required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="Venue name, City" /></div>
              <div className="form-group"><label>Capacity</label><input type="number" min={1} value={newEvent.capacity} onChange={e => setNewEvent({ ...newEvent, capacity: e.target.value })} placeholder="Max attendees" /></div>
              <div className="form-group"><label>Description</label><textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Describe your event..." /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-dark" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">✓ Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerPage;
