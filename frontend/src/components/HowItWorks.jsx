import React from 'react';

export function HowItWorks() {
  const steps = [
    { title: "IDENTIFY", desc: "Locate an issue in your community that needs municipal attention." },
    { title: "REPORT", desc: "Log the issue into the decentralized system with location and photo evidence." },
    { title: "VALIDATE", desc: "Community members verify and upvote the issue to prioritize it." },
    { title: "RESOLVE", desc: "Assigned agencies update status until resolution is confirmed by peers." }
  ];

  return (
    <section className="container">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="section-title" style={{ justifyContent: 'center' }}>PROTOCOL_MANUAL</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Standard operating procedures for engaging with the community complaint management protocol.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step, i) => (
          <div key={i} className="step-card">
            <h3 style={{ color: 'var(--accent-magenta)', marginBottom: '1rem', marginTop: '1rem' }}>{step.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
