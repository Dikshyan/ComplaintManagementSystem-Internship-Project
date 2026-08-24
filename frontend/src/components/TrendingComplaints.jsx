import React from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

export function TrendingComplaints() {
  const complaints = [
    {
      id: "ISS-001",
      title: "Streetlight Malfunction on 5th Ave",
      status: "OPEN",
      location: "Sector 4",
      upvotes: 245,
      comments: 12
    },
    {
      id: "ISS-002",
      title: "Pothole causing traffic delay",
      status: "RESOLVED",
      location: "North Bridge",
      upvotes: 189,
      comments: 34
    },
    {
      id: "ISS-003",
      title: "Garbage collection delayed by 3 days",
      status: "OPEN",
      location: "West District",
      upvotes: 156,
      comments: 8
    }
  ];

  return (
    <section id="discover" className="container">
      <h2 className="section-title">TRENDING ISSUES</h2>
      
      <div className="complaints-grid">
        {complaints.map((issue) => (
          <div key={issue.id} className="brutal-card complaint-card">
            <div className="card-header">
              <span className={`status-badge ${issue.status === 'OPEN' ? 'status-open' : 'status-resolved'}`}>
                {issue.status}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {issue.id}
              </span>
            </div>
            
            <h3 className="complaint-title">{issue.title}</h3>
            
            <div className="complaint-meta">
              <span>LOC: {issue.location}</span>
              <span>
                <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> 
                {issue.upvotes}
              </span>
              <span>
                <MessageSquare size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />
                {issue.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="brutal-btn">VIEW_ALL_RECORDS</button>
      </div>
    </section>
  );
}
