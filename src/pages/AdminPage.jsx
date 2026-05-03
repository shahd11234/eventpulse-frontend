import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EVENTS } from '../data/mockData';
import './AdminPage.css';

const AdminPage = () => {
  const { user, addNotification } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') { navigate('/login'); return null; }

  const adminStats = [
    { label: 'Total Events', value: '2,413', change: '+12%', icon: '🎉', color: '#f0a500' },
    { label: 'Total Users', value: '48,291', change: '+8%', icon: '👥', color: '#3b82f6' },
    { label: 'Revenue (AED)', value: '924,400', change: '+24%', icon: '💰', color: '#22c55e' },
    { label: 'Active Organizers', value: '512', change: '+5%', icon: '🗂️', color: '#e8445a' },
  ];

  const TABS = ['overview', 'events', 'users', 'reports'];

  return (
    <div className="page-wrapper admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="badge badge-red">Admin Panel</span>
            <h1 className="section-title" style={{ marginTop: 8 }}>System Dashboard</h1>
            <p className="section-subtitle">Monitor and manage the EventPulse platform</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn btn-dark" onClick={() => addNotification('Report exported!', 'success')}>📥 Export Report</button>
            <button className="btn btn-primary">⚙️ Settings</button>
          </div>
        </div>

        <div className="admin-stats">
          {adminStats.map((s, i) => (
            <div key={i} className="admin-stat-card" style={{ '--c': s.color }}>
              <div className="admin-stat-icon">{s.icon}</div>
              <div className="admin-stat-info">
                <p className="admin-stat-value">{s.value}</p>
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-change">↑ {s.change} this month</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-overview-grid">
            <div className="admin-card">
              <h4>Recent Activity</h4>
              <div className="activity-list">
                {[
                  { action: 'New event created', by: 'Tech Arabia', time: '2 min ago', type: '🎉' },
                  { action: 'User registered', by: 'john.doe@email.com', time: '8 min ago', type: '👤' },
                  { action: 'Ticket booked', by: 'sarah.k@email.com', time: '15 min ago', type: '🎫' },
                  { action: 'Event published', by: 'Emirates Events', time: '32 min ago', type: '✅' },
                  { action: 'Refund requested', by: 'user#4821', time: '1 hr ago', type: '💰' },
                  { action: 'New organizer approved', by: 'Dubai Arts Council', time: '2 hr ago', type: '🗂️' },
                ].map((a, i) => (
                  <div key={i} className="activity-item">
                    <span className="activity-icon">{a.type}</span>
                    <div>
                      <p className="activity-action">{a.action}</p>
                      <p className="activity-by">{a.by}</p>
                    </div>
                    <span className="activity-time">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <h4>Quick Actions</h4>
              <div className="quick-actions-grid">
                {[
                  { label: 'Approve Events', count: 7, icon: '✅', color: '#22c55e' },
                  { label: 'Pending Users', count: 23, icon: '👤', color: '#3b82f6' },
                  { label: 'Open Reports', count: 3, icon: '🚨', color: '#e8445a' },
                  { label: 'Refund Queue', count: 2, icon: '💰', color: '#f0a500' },
                ].map((q, i) => (
                  <button key={i} className="quick-action-btn" style={{ '--qa-c': q.color }}>
                    <span>{q.icon}</span>
                    <p>{q.label}</p>
                    <span className="qa-count">{q.count}</span>
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: 24 }}>Platform Health</h4>
              <div className="health-items">
                {[
                  { label: 'Server Uptime', value: '99.9%', status: 'good' },
                  { label: 'Payment Gateway', value: 'Online', status: 'good' },
                  { label: 'Email Service', value: 'Online', status: 'good' },
                  { label: 'Storage Used', value: '68%', status: 'warning' },
                ].map((h, i) => (
                  <div key={i} className="health-row">
                    <span>{h.label}</span>
                    <div className={`health-badge ${h.status}`}>{h.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="admin-events-table">
            <div className="admin-table-toolbar">
              <input type="text" placeholder="🔍 Search events..." className="admin-search" />
              <select className="admin-filter">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
            </div>
            <div className="admin-table">
              <div className="at-header">
                <span>Event</span><span>Organizer</span><span>Date</span><span>Attendance</span><span>Revenue</span><span>Status</span><span>Actions</span>
              </div>
              {EVENTS.map(event => (
                <div key={event.id} className="at-row">
                  <div className="at-event">
                    <img src={event.image} alt="" />
                    <div>
                      <p className="at-event-title">{event.title}</p>
                      <span className="badge badge-gold">{event.category}</span>
                    </div>
                  </div>
                  <span>{event.organizer}</span>
                  <span>{new Date(event.date).toLocaleDateString('en-AE', { day:'numeric', month:'short' })}</span>
                  <span>{event.attendees}/{event.capacity}</span>
                  <span style={{ color:'#22c55e', fontWeight:700 }}>AED {(event.price * event.attendees).toLocaleString()}</span>
                  <span><span className="badge badge-green">Active</span></span>
                  <div className="at-actions">
                    <button className="action-btn edit">View</button>
                    <button className="action-btn delete" onClick={() => addNotification('Event suspended', 'error')}>Suspend</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users-table">
            <div className="admin-table-toolbar">
              <input type="text" placeholder="🔍 Search users..." className="admin-search" />
              <select className="admin-filter">
                <option>All Roles</option>
                <option>User</option>
                <option>Organizer</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="admin-table">
              <div className="au-header">
                <span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Events</span><span>Actions</span>
              </div>
              {[
                { name: 'Ahmad Hassan', email: 'ahmad@email.ae', role: 'user', joined: '2024-09-10', events: 8 },
                { name: 'Sarah Al-Maktoum', email: 'sarah@email.ae', role: 'organizer', joined: '2024-06-20', events: 24 },
                { name: 'Priya Sharma', email: 'priya@corp.ae', role: 'user', joined: '2025-01-05', events: 3 },
                { name: 'Mohammed Ali', email: 'moh@email.ae', role: 'organizer', joined: '2024-11-18', events: 12 },
                { name: 'Lena Müller', email: 'lena@email.de', role: 'user', joined: '2025-02-28', events: 1 },
              ].map((u, i) => (
                <div key={i} className="au-row">
                  <div className="au-user">
                    <div className="small-avatar">{u.name.charAt(0)}</div>
                    {u.name}
                  </div>
                  <span>{u.email}</span>
                  <span><span className={`badge ${u.role === 'organizer' ? 'badge-gold' : 'badge-blue'}`}>{u.role}</span></span>
                  <span>{new Date(u.joined).toLocaleDateString('en-AE', { day:'numeric', month:'short', year:'numeric' })}</span>
                  <span>{u.events}</span>
                  <div className="at-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete" onClick={() => addNotification('User suspended', 'error')}>Suspend</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-grid">
            {[
              { title: 'Revenue Report', desc: 'Monthly and annual revenue breakdown', icon: '💰', date: 'March 2025' },
              { title: 'User Growth Report', desc: 'New registrations and churn analysis', icon: '👥', date: 'March 2025' },
              { title: 'Event Performance', desc: 'Top events by attendance and revenue', icon: '🎉', date: 'March 2025' },
              { title: 'Organizer Report', desc: 'Organizer activity and performance metrics', icon: '🗂️', date: 'March 2025' },
            ].map((r, i) => (
              <div key={i} className="report-card card">
                <span className="report-icon">{r.icon}</span>
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                  <p className="report-date">{r.date}</p>
                </div>
                <button className="btn btn-dark report-btn" onClick={() => addNotification(`${r.title} exported!`, 'success')}>📥 Export</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
