import React from 'react';

export function StatsMarquee() {
  const stats = [
    "SYS_STATUS: ONLINE",
    "OPEN_ISSUES: 142",
    "RESOLVED_7D: 89",
    "PENDING_VERIFICATION: 24",
    "CRITICAL_ALERTS: 3",
    "COMMUNITY_MEMBERS: 1,024"
  ];

  const marqueeText = [...stats, ...stats, ...stats].join(" // ");

  return (
    <div className="stats-marquee">
      <div className="marquee-content">
        <span className="stat-item">{marqueeText}</span>
        <span className="stat-item">{marqueeText}</span>
      </div>
    </div>
  );
}
