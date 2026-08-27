import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Mail, Phone, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <div className="logo-icon">#</div>
              <span>FIXMYSTREET</span>
            </Link>
            <p style={{ maxWidth: '350px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              An independent, community-driven platform for reporting local issues, gathering community support, and tracking resolution updates. Powered by citizens, for citizens.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 'bold' }}>
              <Shield size={16} />
              <span>BBMP COMPLIANT & SECURE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/problems">Browse Issues</Link></li>
              <li><Link to="/submit">Report a Problem</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-links">
            <h4>Support & Connect</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} />
                <span>support@fixmystreet.in</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Phone size={16} />
                <span>1800-425-BBMP (2267)</span>
              </li>
              <li style={{ marginTop: '1rem' }}>
                <Link to="/submit" className="brutal-btn small yellow" style={{ textDecoration: 'none' }}>
                  FILE DIRECT GRIEVANCE
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright info */}
        <div className="footer-bottom">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} FixMyStreet India. All rights reserved. Built for community welfare.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Made with <Heart size={14} fill="var(--coral)" color="var(--coral)" /> by active citizens.
          </div>
        </div>
      </div>
    </footer>
  );
}
