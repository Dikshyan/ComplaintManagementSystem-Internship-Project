import React, { useEffect, useState } from 'react';

export function ComplaintMapMock() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    // Generate random points on the map
    const newPoints = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // 5% to 95%
      y: Math.random() * 90 + 5,
      delay: Math.random() * 2
    }));
    setPoints(newPoints);
  }, []);

  return (
    <section id="map" className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>LIVE_THREAT_MAP</h2>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
          [ SCANNING REGION: LOCALHOST ]
        </div>
      </div>
      
      <div className="map-container">
        <div className="map-radar"></div>
        {points.map(point => (
          <div 
            key={point.id} 
            className="map-point"
            style={{ 
              left: `${point.x}%`, 
              top: `${point.y}%`,
              animationDelay: `${point.delay}s`
            }}
            title="ACTIVE COMPLAINT CLUSTER"
          />
        ))}
        
        <div style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          left: '1rem', 
          backgroundColor: '#000', 
          padding: '0.5rem',
          border: '1px solid var(--accent-green)',
          color: 'var(--accent-green)'
        }}>
          COORD: 34.0522° N, 118.2437° W
        </div>
      </div>
    </section>
  );
}
