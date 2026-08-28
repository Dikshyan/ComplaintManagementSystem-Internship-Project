import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle, Award, CheckCircle, Flame, Users, Zap, ShieldAlert } from 'lucide-react';
import { getIssues, getStats, fetchComplaintsApi } from '../services/client';
import { ProblemCard } from '../components/ProblemCard';

export function Home() {
  const [trendingIssues, setTrendingIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, progress: 0, active: 0, totalVotes: 0 });

  const loadHomeData = async () => {
    const issues = await fetchComplaintsApi();
    setAllIssues(issues);
    const sorted = [...issues].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, 3);
    setTrendingIssues(sorted);
    const freshStats = await getStats(issues);
    setStats(freshStats);
  };

  useEffect(() => {
    loadHomeData();
    // Poll every 10 seconds for real-time synchronization
    const interval = setInterval(loadHomeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVoteToggle = async () => {
    await loadHomeData();
  };

  // Build real marquee strings from recent complaints
  const marqueeItems = allIssues.slice(0, 6).map(issue => {
    if (issue.status === 'Resolved' || issue.status === 'RESOLVED') {
      return `🎉 RESOLVED: ${issue.title} — ${issue.location}`;
    }
    if (issue.upvotes > 3) {
      return `⚡ TRENDING: ${issue.title} — ${issue.upvotes} votes — ${issue.location}`;
    }
    return `🚨 REPORTED: ${issue.title} — ${issue.location}`;
  });

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{ 
        backgroundColor: 'var(--white)',
        borderBottom: 'var(--border-width) solid var(--primary-color)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--yellow)',
              border: '2px solid var(--primary-color)',
              padding: '0.4rem 0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              marginBottom: '2rem'
            }}>
              <Zap size={16} fill="var(--primary-color)" />
              <span>CITIZEN ACTIVISM IN ACTION</span>
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
              lineHeight: '0.95', 
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              Fixing our <span style={{ color: 'var(--coral)', textDecoration: 'underline' }}>neighborhoods</span>, one vote at a time.
            </h1>

            <p style={{ 
              fontSize: '1.15rem', 
              color: 'var(--coral)', 
              fontWeight: '700',
              fontFamily: 'var(--font-sans)',
              marginBottom: '1rem'
            }}>
              Making Local Voices Count
            </p>
            
            <p style={{ 
              fontSize: '1.15rem', 
              color: 'var(--text-secondary)', 
              maxWidth: '600px', 
              marginBottom: '3rem',
              lineHeight: '1.4'
            }}>
              Have a broken streetlight, pothole, or garbage heap? Don't just complain to yourself. Report it here, gather community upvotes, and force civic authorities to take action.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/submit" className="brutal-btn primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                <PlusCircle size={20} />
                <span>Report a Problem</span>
              </Link>
              <Link to="/problems" className="brutal-btn" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                <span>Browse Issues</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Strip — horizontal bar */}
      <section className="stats-strip" style={{
        backgroundColor: 'var(--primary-color)',
        borderBottom: 'var(--border-width) solid var(--primary-color)',
        padding: '2.5rem 0',
        margin: 0
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--white)', lineHeight: 1.1 }}>{stats.total}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--yellow)', marginTop: '0.35rem' }}>Complaints Registered</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--lime)', lineHeight: 1.1 }}>{stats.resolved}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--yellow)', marginTop: '0.35rem' }}>Resolved</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--coral)', lineHeight: 1.1 }}>{stats.active}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--yellow)', marginTop: '0.35rem' }}>Active / In Progress</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--white)', lineHeight: 1.1 }}>{stats.totalVotes}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--yellow)', marginTop: '0.35rem' }}>Community Votes</div>
          </div>
        </div>
      </section>

      {/* 3. Live Activity Marquee — real data */}
      {marqueeItems.length > 0 && (
        <div className="marquee-container" style={{ margin: 0 }}>
          <div className="marquee-content">
            {marqueeItems.map((item, i) => (
              <span key={i} className="marquee-item">{item}</span>
            ))}
            {marqueeItems.map((item, i) => (
              <span key={`dup-${i}`} className="marquee-item">{item}</span>
            ))}
          </div>
        </div>
      )}

      {/* Sections Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', marginTop: '4rem' }}>
        {/* 4. Trending Issues Grid */}
        <section className="container">
          <div className="section-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--coral)', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                <Flame fill="var(--coral)" size={18} />
                <span>COMMUNITY HOTSPOTS</span>
              </div>
              <h2 className="section-title">TRENDING ISSUES</h2>
              <p className="section-subtitle">Complaints gaining the most support from your neighbors. Upvote to bring them closer to official resolution.</p>
            </div>
            <Link to="/problems" className="brutal-btn small">
              <span>View All {stats.total} Problems</span>
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {trendingIssues.map((issue) => (
              <ProblemCard key={issue.id} problem={issue} onVote={handleVoteToggle} />
            ))}
          </div>
        </section>

      {/* 5. How It Works Section */}
      <section className="container">
        <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <div>
            <h2 className="section-title">HOW IT WORKS</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Four simple steps to turn community frustration into verified civic resolution.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginTop: '3rem' }}>
          {/* Step 1 */}
          <div className="brutal-card" style={{ padding: '2rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: 'var(--coral)', 
              border: '2px solid var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.25rem',
              color: 'var(--white)',
              marginBottom: '1.5rem'
            }}>01</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Report Issue</h3>
            <p style={{ fontSize: '0.95rem' }}>Pinpoint the location, snap a photo, pick a category, and write a description of the civic issue.</p>
          </div>

          {/* Step 2 */}
          <div className="brutal-card" style={{ padding: '2rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: 'var(--yellow)', 
              border: '2px solid var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.25rem',
              marginBottom: '1.5rem'
            }}>02</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Upvote & Support</h3>
            <p style={{ fontSize: '0.95rem' }}>Neighbors upvote matching issues to validate reports and build community pressure. No duplicates!</p>
          </div>

          {/* Step 3 */}
          <div className="brutal-card" style={{ padding: '2rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: 'var(--lime)', 
              border: '2px solid var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.25rem',
              marginBottom: '1.5rem'
            }}>03</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Get Attention</h3>
            <p style={{ fontSize: '0.95rem' }}>Highly upvoted issues automatically generate civic notifications and local ward reports.</p>
          </div>

          {/* Step 4 */}
          <div className="brutal-card" style={{ padding: '2rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: 'var(--lavender)', 
              border: '2px solid var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.25rem',
              marginBottom: '1.5rem'
            }}>04</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Resolution</h3>
            <p style={{ fontSize: '0.95rem' }}>Municipal supervisors dispatch repair wings. We track timelines and mark verified resolutions.</p>
          </div>
        </div>
      </section>

      {/* 6. Final CTA Section */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="brutal-card yellow" style={{ 
          padding: '4rem 3rem', 
          display: 'grid', 
          gridTemplateColumns: '1.3fr 0.7fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Seen a problem in your street today?
            </h2>
            <p style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--primary-color)', opacity: '0.85', maxWidth: '600px' }}>
              Take 60 seconds to file a complaint. The faster you list it, the faster your community can upvote it, and the quicker it gets fixed.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Link to="/submit" className="brutal-btn primary" style={{ fontSize: '1.1rem', padding: '1.2rem 2.2rem', width: '100%', textAlign: 'center' }}>
              <PlusCircle size={20} />
              <span>REPORT IT NOW</span>
            </Link>
          </div>
        </div>
      </section>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .brutal-card.yellow {
            grid-template-columns: 1fr !important;
            padding: 2.5rem 1.5rem !important;
          }
          .stats-divider {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
