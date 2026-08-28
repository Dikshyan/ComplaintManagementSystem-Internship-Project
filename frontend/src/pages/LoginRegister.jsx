import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, register, getCurrentUser, fetchCurrentUser } from '../services/client';
import { motion, AnimatePresence } from 'framer-motion';

const AVATAR_OPTIONS = [
  { emoji: '🦁', color: 'var(--yellow)', label: 'Lion' },
  { emoji: '🦉', color: 'var(--lavender)', label: 'Owl' },
  { emoji: '🐼', color: 'var(--lime)', label: 'Panda' },
  { emoji: '🦊', color: 'var(--coral)', label: 'Fox' },
  { emoji: '🐸', color: 'var(--white)', label: 'Frog' },
  { emoji: '🦄', color: 'var(--lavender)', label: 'Unicorn' }
];

export function LoginRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginView = location.pathname === '/login';

  // State fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & Loading state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  // Clear inputs and errors when changing between login/register
  useEffect(() => {
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!username.trim()) {
      setError('Please fill in the Username field.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!password) {
      setError('Please provide a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!isLoginView) {
      // Registration specific validations
      if (!email.trim()) {
        setError('Please provide an email address.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please provide a valid email format.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
    }

    setLoading(true);

    try {
      let loggedUser;
      if (isLoginView) {
        loggedUser = await login(username, password);
      } else {
        loggedUser = await register(username, email, password, selectedAvatar.emoji);
      }
      setLoading(false);
      if (loggedUser && loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="brutal-card yellow" style={{ padding: '2rem', fontSize: '1.2rem', fontWeight: '800' }}>
          VERIFYING SESSION...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '5rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="login-layout-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '3rem',
        maxWidth: '1000px',
        width: '100%',
        alignItems: 'stretch'
      }}>
        {/* Left Side: Campaign / Info Panel */}
        <div className="brutal-card coral login-sidebar-panel" style={{ 
          padding: '3rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          color: 'var(--primary-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="badge" style={{ backgroundColor: 'var(--yellow)', color: 'var(--primary-color)', fontWeight: '800' }}>
                CITIZEN FORUM
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--lime)', color: 'var(--primary-color)', fontWeight: '800' }}>
                #THECIVICVOICE
              </span>
            </div>
            
            <h1 style={{ 
              fontSize: '3.2rem', 
              color: 'var(--primary-color)', 
              lineHeight: '1.05', 
              textTransform: 'uppercase', 
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-display)'
            }}>
              TAKE BACK<br />YOUR STREETS.
            </h1>
            
            <p style={{ color: 'var(--primary-color)', fontSize: '1.1rem', fontWeight: '500', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Reporting municipal problems shouldn't feel like sending messages into a black hole. Log in to claim ownership, build support with neighbors, and force municipal accountability.
            </p>
          </div>
          
          {/* Highlight Points */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            borderTop: '3px solid var(--primary-color)', 
            paddingTop: '2.5rem' 
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: 'var(--yellow)', 
                border: '2px solid var(--primary-color)', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>1</div>
              <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>Post Infrastructure Grievances</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: 'var(--lime)', 
                border: '2px solid var(--primary-color)', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>2</div>
              <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>Gather Community Endorsements</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: 'var(--lavender)', 
                border: '2px solid var(--primary-color)', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>3</div>
              <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>Get Direct Verification & Resolution</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="brutal-card" style={{ 
          padding: '3rem', 
          backgroundColor: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* Custom Tab Toggles */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              borderBottom: 'var(--border-width) solid var(--primary-color)',
              margin: '-3rem -3rem 2.5rem -3rem',
            }}>
              <button 
                type="button"
                onClick={() => navigate('/login')}
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
                onClick={() => navigate('/register')}
                style={{
                  padding: '1.5rem 0',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  backgroundColor: !isLoginView ? 'var(--lime)' : 'var(--white)',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              >
                Register
              </button>
            </div>

            {/* Header Text */}
            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {isLoginView ? "Welcome Back, Citizen" : "Assemble with Neighbors"}
            </h3>
            <p style={{ fontSize: '0.95rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              {isLoginView 
                ? "Sign in to access your dashboard, file complaints, or support active civic campaigns." 
                : "Create a local account to report utility damage, sanitation issues, and coordinate repairs."}
            </p>

            {/* Error alerts */}
            {error && (
              <div className="badge status-open" style={{ 
                width: '100%', 
                padding: '0.85rem', 
                marginBottom: '1.5rem',
                textAlign: 'left',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                boxShadow: '3px 3px 0px var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoginView ? 'login-fields' : 'register-fields'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  {/* Username */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Citizen Username
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
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  {/* Email (Registration view only) */}
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
                          autoComplete="email"
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
                        type={showPassword ? "text" : "password"} 
                        className="brutal-input" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                        required
                        autoComplete={isLoginView ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Registration view only) */}
                  {!isLoginView && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Confirm Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                          <Lock size={18} />
                        </span>
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          className="brutal-input" 
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                          required={!isLoginView}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Avatar Selection (Registration view only) */}
                  {!isLoginView && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Select Profile Emblem
                      </label>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(6, 1fr)', 
                        gap: '0.5rem' 
                      }}>
                        {AVATAR_OPTIONS.map((opt) => {
                          const isSelected = selectedAvatar.emoji === opt.emoji;
                          return (
                            <button
                              key={opt.emoji}
                              type="button"
                              onClick={() => setSelectedAvatar(opt)}
                              style={{
                                padding: '0.5rem 0',
                                fontSize: '1.5rem',
                                backgroundColor: opt.color,
                                border: '2px solid var(--primary-color)',
                                boxShadow: isSelected ? '2px 2px 0px var(--primary-color)' : 'none',
                                transform: isSelected ? 'translate(-1px, -1px)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.1s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={opt.label}
                            >
                              {opt.emoji}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Policy alert for registration */}
              {!isLoginView && (
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'flex-start', 
                  fontSize: '0.8rem', 
                  color: 'var(--text-secondary)',
                  marginTop: '0.25rem',
                  lineHeight: '1.4'
                }}>
                  <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--coral)' }} />
                  <span>By registering, you verify that your submissions represent real civic issues. Duplicate submissions are automatically flagged.</span>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`brutal-btn ${isLoginView ? 'primary' : 'lime'}`} 
                disabled={loading}
                style={{ width: '100%', marginTop: '1.25rem', padding: '1rem' }}
              >
                <span>{loading ? 'AUTHENTICATING...' : isLoginView ? 'SIGN IN AS CITIZEN' : 'CREATE ACCOUNT'}</span>
                {!loading && <ArrowRight size={18} />}
              </button>

            </form>
          </div>

          {/* Footer toggle link */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '2px solid var(--primary-color)', paddingTop: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {isLoginView ? (
                <>
                  New to The Civic Voice?{' '}
                  <Link to="/register" style={{ color: 'var(--coral)', textDecoration: 'underline' }}>
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <Link to="/login" style={{ color: 'var(--coral)', textDecoration: 'underline' }}>
                    Sign in here
                  </Link>
                </>
              )}
            </span>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .login-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .login-sidebar-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
