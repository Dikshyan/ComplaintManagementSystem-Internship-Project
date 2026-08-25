import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  ThumbsUp
} from 'lucide-react';
import { getStats, getIssues, updateIssueStatus } from '../db';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    progress: 0,
    active: 0,
    totalVotes: 0
  });

  const [issues, setIssues] = useState([]);

  useEffect(() => {
    setStats(getStats());
    setIssues(getIssues());
  }, []);

  const handleStatusChange = (issueId, newStatus) => {
    updateIssueStatus(issueId, newStatus);

    setIssues(getIssues());
    setStats(getStats());
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        display: 'flex'
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          minHeight: '100vh',
          backgroundColor: 'var(--primary-color)',
          color: 'var(--white)',
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: '800',
            borderBottom: '2px solid var(--white)',
            paddingBottom: '1.5rem'
          }}
        >
          FIXMYSTREET

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              marginTop: '0.4rem',
              opacity: 0.7
            }}
          >
            ADMIN CONTROL CENTER
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <button className="admin-nav-item">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="admin-nav-item">
            <FileText size={18} />
            Complaints
          </button>

          <button className="admin-nav-item">
            <Users size={18} />
            Users
          </button>

          <button className="admin-nav-item">
            <Settings size={18} />
            Settings
          </button>
        </nav>

        {/* Logout */}
        <div style={{ marginTop: 'auto' }}>
          <button className="admin-nav-item">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main
        style={{
          flex: 1,
          padding: '3rem',
          maxWidth: '1400px'
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--yellow)',
              border: '2px solid var(--primary-color)',
              padding: '0.5rem 1rem',
              fontWeight: '800',
              marginBottom: '1rem'
            }}
          >
            CIVIC CONTROL CENTER
          </div>

          <h1
            style={{
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              lineHeight: '0.9',
              margin: 0
            }}
          >
            DASHBOARD
          </h1>

          <p
            style={{
              marginTop: '1rem',
              maxWidth: '650px',
              color: 'var(--text-secondary)',
              fontSize: '1.05rem'
            }}
          >
            Monitor community complaints, track issue resolution,
            and help prioritize problems reported by citizens.
          </p>
        </div>

        {/* Statistics */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem'
          }}
        >
          {/* Total Complaints */}
          <div className="brutal-card yellow" style={{ padding: '1.5rem' }}>
            <FileText size={28} />

            <div
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                fontFamily: 'var(--font-display)',
                marginTop: '1rem'
              }}
            >
              {stats.total}
            </div>

            <div style={{ fontWeight: '800' }}>
              TOTAL COMPLAINTS
            </div>
          </div>

          {/* Active */}
          <div className="brutal-card lime" style={{ padding: '1.5rem' }}>
            <AlertCircle size={28} />

            <div
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                fontFamily: 'var(--font-display)',
                marginTop: '1rem'
              }}
            >
              {stats.active}
            </div>

            <div style={{ fontWeight: '800' }}>
              ACTIVE ISSUES
            </div>
          </div>

          {/* In Progress */}
          <div className="brutal-card lavender" style={{ padding: '1.5rem' }}>
            <Clock size={28} />

            <div
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                fontFamily: 'var(--font-display)',
                marginTop: '1rem'
              }}
            >
              {stats.progress}
            </div>

            <div style={{ fontWeight: '800' }}>
              IN PROGRESS
            </div>
          </div>

          {/* Resolved */}
          <div className="brutal-card coral" style={{ padding: '1.5rem' }}>
            <CheckCircle size={28} />

            <div
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                fontFamily: 'var(--font-display)',
                marginTop: '1rem'
              }}
            >
              {stats.resolved}
            </div>

            <div style={{ fontWeight: '800' }}>
              RESOLVED
            </div>
          </div>

          {/* Votes */}
          <div className="brutal-card" style={{ padding: '1.5rem' }}>
            <ThumbsUp size={28} />

            <div
              style={{
                fontSize: '3rem',
                fontWeight: '800',
                fontFamily: 'var(--font-display)',
                marginTop: '1rem'
              }}
            >
              {stats.totalVotes}
            </div>

            <div style={{ fontWeight: '800' }}>
              COMMUNITY VOTES
            </div>
          </div>
        </section>

        {/* Recent Complaints */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}
          >
            <h2 style={{ margin: 0 }}>
              RECENT COMPLAINTS
            </h2>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            >
              {issues.length} REPORTS
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="brutal-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3
                    style={{
                      marginBottom: '0.5rem',
                      fontSize: '1.25rem'
                    }}
                  >
                    {issue.title}
                  </h3>

                  <p
                    style={{
                      marginBottom: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {issue.location} • {issue.category}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                      fontSize: '0.8rem',
                      fontWeight: '800'
                    }}
                  >
                    <span>
                      PRIORITY: {issue.priority}
                    </span>

                    <span>
                      STATUS: {issue.status}
                    </span>

                    <span>
                      ▲ {issue.upvotes}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.6rem'
                  }}
                >
                  <div>{issue.reporterName}</div>

                  <div style={{ color: 'var(--text-secondary)' }}>
                    {issue.dateReported}
                  </div>

                  <select
                    value={issue.status}
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                    style={{
                      border: '2px solid var(--primary-color)',
                      padding: '0.5rem',
                      fontWeight: '800',
                      backgroundColor: 'var(--white)',
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Dashboard styles */}
      <style>{`
        .admin-nav-item {
          width: 100%;
          min-height: 48px;
          border: 2px solid var(--white);
          background: transparent;
          color: var(--white);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .admin-nav-item:hover {
          background: var(--white);
          color: var(--primary-color);
          transform: translate(3px, -3px);
          box-shadow: 4px 4px 0 var(--coral);
        }

        @media (max-width: 768px) {
          aside {
            width: 200px !important;
          }

          main {
            padding: 2rem 1.25rem !important;
          }
        }

        @media (max-width: 600px) {
          aside {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}