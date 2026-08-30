import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, PlusCircle, LayoutGrid } from 'lucide-react';
import { getCurrentUser, logout, fetchCurrentUser } from '../services/authapi';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Poll or refresh user state on navigation/actions
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">#</div>
          <span>THE CIVIC VOICE</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links" style={{ display: 'flex' }}>
          <Link to="/problems" className={`nav-link ${isActive('/problems')}`}>
            Browse Issues
          </Link>
          {(!currentUser || currentUser.role === 'user') && (
            <Link to="/submit" className={`nav-link ${isActive('/submit')}`}>
              Report a Problem
            </Link>
          )}
          <Link
            to={currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'staff' ? '/staff' : '/profile'}
            className={`nav-link ${isActive(currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'staff' ? '/staff' : '/profile')}`}
          >
            {currentUser?.role === 'admin' ? 'Admin Panel' : currentUser?.role === 'staff' ? 'Staff Portal' : 'Profile'}
          </Link>
        </nav>

        {/* Auth / CTA Button Group (Desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to={currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'staff' ? '/staff' : '/profile'}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0',
                  backgroundColor: currentUser?.role === 'admin' ? 'var(--coral)' : currentUser?.role === 'staff' ? 'var(--lime)' : 'var(--lavender)',
                  border: '2px solid var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  color: currentUser?.role === 'admin' ? 'var(--white)' : 'var(--primary-color)'
                }}>
                  {currentUser.avatar || 'U'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {currentUser.username} {currentUser?.role === 'admin' ? '(Admin)' : currentUser?.role === 'staff' ? '(Staff)' : ''}
                </span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="brutal-btn small coral"
                style={{ padding: '0.4rem 0.8rem' }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="brutal-btn small yellow" style={{ textDecoration: 'none' }}>
              Login
            </Link>
          )}

          {/* Quick Submit button for Citizens */}
          {(!currentUser || currentUser.role === 'user') && (
            <Link to="/submit" className="brutal-btn small primary" style={{ textDecoration: 'none' }}>
              <PlusCircle size={16} />
              <span>Report Issue</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button 
          className="brutal-btn small" 
          style={{ display: 'none', padding: '0.5rem' }} 
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          width: '100%',
          height: 'calc(100vh - var(--nav-height))',
          backgroundColor: 'var(--bg-color)',
          borderTop: 'var(--border-width) solid var(--primary-color)',
          zIndex: 99,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <Link to="/problems" className="brutal-btn" onClick={() => setMobileMenuOpen(false)}>
            Browse Issues
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/submit" className="brutal-btn primary" onClick={() => setMobileMenuOpen(false)}>
              <PlusCircle size={18} />
              <span>Report a Problem</span>
            </Link>
          </div>
          <Link to={currentUser?.role === 'admin' ? '/admin' : '/profile'} className="brutal-btn yellow" onClick={() => setMobileMenuOpen(false)}>
            {currentUser?.role === 'admin' ? 'Admin Control Center' : 'My Profile'}
          </Link>
          
          <div style={{ height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem 0' }}></div>
          
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--lavender)',
                  border: '2px solid var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800'
                }}>
                  {currentUser.avatar || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{currentUser.fullName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{currentUser.username}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="brutal-btn coral" style={{ width: '100%' }}>
                <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="brutal-btn yellow" style={{ textDecoration: 'none', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>
              Login / Sign Up
            </Link>
          )}
        </div>
      )}

      {/* Dynamic CSS styles helper for mobile view toggle display */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links, .desktop-actions {
            display: none !important;
          }
          #mobile-menu-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
