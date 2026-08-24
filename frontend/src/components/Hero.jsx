import React from 'react';
import { Search, AlertTriangle } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-accent">REPORT.</span><br/>
            TRACK.<br/>
            <span className="text-magenta">RESOLVE.</span>
          </h1>
          
          <p className="hero-subtitle">
            A decentralized dashboard for community issues. Enter an ID, location, or keyword to search the database.
          </p>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <input 
                type="text" 
                className="terminal-input" 
                placeholder="search_query --type=all" 
              />
            </div>
            <button className="brutal-btn primary">
              <Search size={20} />
              EXECUTE
            </button>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button className="brutal-btn">
              <AlertTriangle size={20} color="var(--accent-magenta)" />
              <span className="text-magenta">RAISE A COMPLAINT</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
