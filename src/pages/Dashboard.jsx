import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

export const UserDashboard = () => {
  const { user, logout, bookings } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  if (!user) { navigate('/login'); return null; }

  const upcomingBookings = bookings
    .filter(b => b.status !== 'cancelled')
    .slice(0, 3);

  const SIDEBAR_LINKS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'My Bookings', icon: '🎫' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="page-wrapper dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          {/* SIDEBAR */}
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile">
              <div className="dash-avatar">{user.name?.charAt(0)}</div>
              <div>
                <p className="dash-name">{user.name}</p>
                <p className="dash-email">{user.email}</p>
                <span className="badge badge-gold">{user.role}</span>
              </div>
            </div>
            <nav className="dashboard-nav">
              {SIDEBAR_LINKS.map(link => (
                <button key={link.id} className={`dash-nav-item ${activeSection === link.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(link.id)}>
                  {link.icon} {link.label}
                </button>
              ))}
              <Link to="/events" className="dash-nav-item">🔍 Browse Events</Link>
              {user.role === 'organizer' && <Link to="/organizer" className="dash-nav-item">🗂️ Organizer Panel</Link>}
              {user.role === 'admin' && <Link to="/admin" className="dash-nav-item">⚙️ Admin Panel</Link>}
              <button className="dash-nav-item logout" onClick={() => { logout(); navigate('/'); }}>🚪 Logout</button>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className="dashboard-main">
            {activeSection === 'overview' && (
              <>
                <div className="dash-header">
                  <h2>Welcome back, {user.name?.split(' ')[0]}! 👋</h2>
                  <p>Here's what's happening with your events</p>
                </div>
                <div className="dash-stats">
                  {[
                    { label: 'Total Bookings', value: bookings.length, icon: '🎉', color: '#f0a500' },
                    { label: 'Upcoming Events', value: bookings.filter(b => b.status !== 'cancelled').length, icon: '📅', color: '#3b82f6' },
                    { label: 'Total Spent', value: `AED ${bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0)}`, icon: '💰', color: '#22c55e' },
                    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: '⭐', color: '#e8445a' },
                  ].map((s, i) => (
                    <div key={i} className="dash-stat-card" style={{ '--stat-color': s.color }}>
                      <span className="stat-icon-lg">{s.icon}</span>
                      <div>
                        <p className="dash-stat-value">{s.value}</p>
                        <p className="dash-stat-label">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dash-section-title">Recent Bookings</div>
                <div className="dash-events-list">
                  {upcomingBookings.length === 0 ? (
                    <p style={{ color: '#aaa', padding: '20px 0' }}>No bookings yet. <Link to="/events">Browse events!</Link></p>
                  ) : upcomingBookings.map((b, i) => {
                    const ev = b.event;
                    return (
                      <div key={b._id || i} className="dash-event-row">
                        {ev?.image && <img src={ev.image} alt={ev.title} />}
                        <div className="dash-event-info">
                          {ev?.category && <span className="badge badge-blue">{ev.category}</span>}
                          <h4>{ev?.title || 'Event'}</h4>
                          <p>🎫 {b.ticketType} × {b.quantity} · AED {b.totalPrice}</p>
                        </div>
                        <div className="dash-event-actions">
                          <span className="badge badge-green">{b.status || 'Confirmed'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeSection === 'bookings' && <BookingsSection />}

            {activeSection === 'profile' && <ProfileSection user={user} />}

            {activeSection === 'settings' && (
              <div className="dash-content-area">
                <h3>Account Settings</h3>
                <div className="settings-list">
                  {['Email Notifications', 'SMS Alerts', 'Marketing Emails', 'Event Reminders'].map(s => (
                    <div key={s} className="setting-row">
                      <span>{s}</span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={s !== 'Marketing Emails'} />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsSection = () => {
  const { bookings } = useApp();

  return (
    <div className="dash-content-area">
      <h3>My Bookings ({bookings.length})</h3>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <span>🎫</span>
          <p>No bookings yet. <Link to="/events">Browse events</Link> to get started!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((b, i) => (
            <div key={b._id || i} className="booking-row">
              {b.event?.image && <img src={b.event.image} alt="" />}
              <div className="booking-row-info">
                <p className="booking-id">{b._id}</p>
                <h4>{b.event?.title || 'Event'}</h4>
                <p>{b.ticketType} × {b.quantity} tickets</p>
              </div>
              <div className="booking-row-right">
                <span className={`badge ${b.status === 'cancelled' ? 'badge-red' : 'badge-green'}`}>
                  {b.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                </span>
                <p className="booking-total">AED {b.totalPrice}</p>
                <button className="btn btn-dark" style={{ padding: '6px 14px', fontSize: 12 }}>🎫 QR Code</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSection = ({ user }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone || '', bio: '' });

  return (
    <div className="dash-content-area">
      <h3>Edit Profile</h3>
      <div className="profile-edit">
        <div className="profile-avatar-large">{user.name?.charAt(0)}</div>
        <div className="profile-form">
          <div className="form-row-2">
            <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+971 XX XXX XXXX" /></div>
          <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." /></div>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
