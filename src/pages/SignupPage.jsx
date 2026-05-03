import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

const SignupPage = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const userData = await signup({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone });
      navigate(userData.role === 'organizer' ? '/organizer' : '/dashboard');
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left signup-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">✦ EventPulse</Link>
          <h1>Join EventPulse</h1>
          <p>Create your account and start discovering or hosting incredible events across the UAE.</p>
          <div className="auth-features">
            {['Free to register', 'Instant ticket delivery', 'QR-code entry system', 'Organizer tools available'].map(f => (
              <div key={f} className="auth-feature"><span>✓</span> {f}</div>
            ))}
          </div>
          <div className="signup-roles">
            <p className="demo-label">Choose your role:</p>
            <div className={`role-card ${form.role === 'user' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'user' })}>
              <span>👤</span>
              <div><strong>Attendee</strong><p>Browse and book events</p></div>
            </div>
            <div className={`role-card ${form.role === 'organizer' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'organizer' })}>
              <span>🗂️</span>
              <div><strong>Organizer</strong><p>Create and manage events</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account ✨</h2>
            <p>Sign up to continue</p>
            <div className="step-indicators">
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line" />
              <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
            </div>
          </div>

          {step === 1 ? (
            <div className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">👤</span>
                  <input type="text" placeholder="Enter your full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={errors.name ? 'error' : ''} />
                </div>
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">✉️</span>
                  <input type="email" placeholder="Enter your email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? 'error' : ''} />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Phone (Optional)</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">📞</span>
                  <input type="tel" placeholder="+971 XX XXX XXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Account Type</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Attendee — Browse & book events</option>
                  <option value="organizer">Organizer — Create & manage events</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary auth-submit" onClick={handleNext}>
                Continue →
              </button>
              <div className="auth-divider"><span>OR Sign up with</span></div>
              <div className="social-auth">
                {['📘 Facebook', '🔴 Google', '🐦 Twitter'].map(s => (
                  <button key={s} type="button" className="social-btn">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Password</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">🔒</span>
                  <input type="password" placeholder="Enter your password" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className={errors.password ? 'error' : ''} />
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-icon-wrap">
                  <span className="input-icon">🔒</span>
                  <input type="password" placeholder="Re-enter your password" value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className={errors.confirm ? 'error' : ''} />
                </div>
                {errors.confirm && <p className="form-error">{errors.confirm}</p>}
              </div>
              <div className="password-strength">
                <div className="strength-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`strength-bar ${form.password.length >= i * 3 ? 'filled' : ''}`} />
                  ))}
                </div>
                <span>{form.password.length < 3 ? 'Too short' : form.password.length < 6 ? 'Weak' : form.password.length < 9 ? 'Good' : 'Strong'}</span>
              </div>
              {errors.submit && <p className="form-error">{errors.submit}</p>}
              <div className="form-row">
                <button type="button" className="btn btn-dark" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login!</Link>
          </p>
          <p className="auth-terms">By continuing you confirm that you agree with our <a href="#!">Terms & Conditions</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
