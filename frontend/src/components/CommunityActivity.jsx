import React from 'react';

export function CommunityActivity() {
  const activities = [
    { time: "10:42:05", user: "0x7F...8A", action: "upvoted", target: "ISS-002" },
    { time: "10:38:12", user: "SYS_ADMIN", action: "status_change -> RESOLVED", target: "ISS-045" },
    { time: "10:15:00", user: "0x2B...9C", action: "filed_new_report", target: "ISS-051 (Sanitation)" },
    { time: "09:55:33", user: "0x1A...4D", action: "commented on", target: "ISS-001" },
    { time: "09:20:11", user: "CITY_SVC_04", action: "assigned_to", target: "ISS-003" },
  ];

  return (
    <section id="activity" className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        <div>
          <h2 className="section-title">SYSTEM<br/>LOGS</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Real-time feed of community actions and system updates. Transparency is built into the protocol.
          </p>
          <button className="brutal-btn" style={{ marginTop: '2rem' }}>EXPORT_LOGS.CSV</button>
        </div>
        
        <div className="activity-feed">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
            tail -f /var/log/community_activity.log
          </div>
          
          {activities.map((act, i) => (
            <div key={i} className="activity-item">
              <span className="activity-time">[{act.time}]</span>
              <span className="activity-text">
                <span style={{ color: 'var(--accent-magenta)' }}>{act.user}</span> 
                {' '}{act.action}{' '} 
                <span className="activity-highlight">{act.target}</span>
              </span>
            </div>
          ))}
          
          <div className="activity-item" style={{ borderBottom: 'none', animation: 'pulse 2s infinite' }}>
            <span className="activity-time">[{new Date().toLocaleTimeString()}]</span>
            <span className="activity-text" style={{ color: 'var(--text-secondary)' }}>
              listening for new events_ <span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}
