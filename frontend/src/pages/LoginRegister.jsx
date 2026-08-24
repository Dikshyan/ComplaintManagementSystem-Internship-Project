import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { login, register } from '../db';

export function LoginRegister() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Fields state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLoginView && !email.trim()) {
      setError('Please provide an email address.');
      return;
    }

    setLoading(true);

    // Simulate short network delay for premium feedback
    setTimeout(() => {
      try {
        if (isLoginView) {
          login(username, password);
        } else {
          register(username, email, password);
        }
        setLoading(false);
        navigate('/profile'); // Redirect to profile page
      } catch (err) {
        setError('Authentication failed. Please verify credentials.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="brutal-card yellow hover-rotate" style={{ 
        maxWidth: '480px', 
        width: '100%', 
        padding: '3rem',
        backgroundColor: 'var(--white)'
      }}>
        {/* Visual Header Toggle */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          borderBottom: 'var(--border-width) solid var(--primary-color)',
          margin: '-3rem -3rem 2.5rem -3rem',
        }}>
          <button 
            type="button"
            onClick={() => { setIsLoginView(true); setError(''); }}
            style={{
              padding: '1.5rem 0',
              fontFamily: 'var(--font-sans)',
              fontWeight: '800',
              fontSize: '1.1rem',
              backgroundColor: isLoginView ? 'var(--yellow)' : 'var(--white)',
              border: 'none',
              borderRight: 'var(--border-width) solid var(--primary-color)',
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'uppercase'
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLoginView(false); setError(''); }}
            style={{
              padding: '1.5rem 0',
              fontFamily: 'var(--font-sans)',
              fontWeight: '800',
              fontSize: '1.1rem',
              backgroundColor: !isLoginView ? 'var(--yellow)' : 'var(--white)',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'uppercase'
            }}
          >
            Register
          </button>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          {isLoginView ? "Welcome Back Citizen" : "Join the Community"}
        </h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
          {isLoginView 
            ? "Sign in to upvote issues, post comments, and track reported grievances." 
            : "Create an account to register civic complaints in your local ward."}
        </p>

        {error && (
          <div className="badge status-open" style={{ 
            width: '100%', 
            padding: '0.75rem', 
            marginBottom: '1.5rem',
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Username */}
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <User size={18} />
              </span>
              <input 
                type="text" 
                className="brutal-input" 
                placeholder="e.g. AaravMehta"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Email (only for Register view) */}
          {!isLoginView && (
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  className="brutal-input" 
                  placeholder="e.g. aarav@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required={!isLoginView}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                className="brutal-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Policy indicator for registration */}
          {!isLoginView && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--lime)' }} />
              <span>By registering, you agree that your submitted complaints will be made public to facilitate municipal coordination.</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="brutal-btn primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
          >
            <span>{loading ? 'Authenticating...' : isLoginView ? 'LOG IN' : 'REGISTER'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
