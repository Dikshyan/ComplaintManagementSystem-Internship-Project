import React from 'react';
import { Terminal } from 'lucide-react';

export function FooterCTA() {
  return (
    <footer className="footer-cta">
      <div className="container">
        <h2>JOIN THE NETWORK</h2>
        <p>Your community needs you to initialize positive change.</p>
        <button className="brutal-btn">
          <Terminal size={24} />
          INITIATE_REPORT_SEQUENCE
        </button>
        
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #003300', paddingTop: '2rem', color: '#004400', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          <span>© 2024 SYS.COMPLAINT. ALL SYSTEMS NOMINAL.</span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: '#004400' }}>[ TERMS ]</a>
            <a href="#" style={{ color: '#004400' }}>[ PRIVACY ]</a>
            <a href="#" style={{ color: '#004400' }}>[ SOURCE ]</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
