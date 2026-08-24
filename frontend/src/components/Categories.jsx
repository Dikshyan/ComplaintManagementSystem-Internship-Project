import React from 'react';
import { ShieldAlert, Zap, Truck, Users, Droplet, Wifi } from 'lucide-react';

export function Categories() {
  const categories = [
    { name: "INFRASTRUCTURE", icon: Zap, count: 124 },
    { name: "SANITATION", icon: Truck, count: 89 },
    { name: "PUBLIC_SAFETY", icon: ShieldAlert, count: 56 },
    { name: "WATER_SUPPLY", icon: Droplet, count: 42 },
    { name: "COMMUNICATIONS", icon: Wifi, count: 18 },
    { name: "COMMUNITY_NOISE", icon: Users, count: 31 }
  ];

  return (
    <section className="container">
      <div className="categories-layout">
        <div>
          <h2 className="section-title">QUERY BY<br/>CATEGORY</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            Filter the central database by specific issue types to view local metrics and active resolutions.
          </p>
        </div>
        
        <div className="categories-list">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button key={idx} className="brutal-btn category-btn">
                <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Icon size={24} color="var(--accent-magenta)" />
                  {cat.name}
                </span>
                <span style={{ color: 'var(--accent-cyan)' }}>[{cat.count}]</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
