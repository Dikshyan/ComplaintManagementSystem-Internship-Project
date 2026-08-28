import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Calendar, Mail, FileText, ArrowUp, Info, PlusCircle, LogOut } from 'lucide-react';
import { getCurrentUser, getIssues, logout, fetchCurrentUser, fetchComplaintsApi } from '../services/client';
import { ProblemCard } from '../components/ProblemCard';

export function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [myIssues, setMyIssues] = useState([]);
  const [supportedIssues, setSupportedIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('reported'); // 'reported' | 'supported'

  const loadUserData = async () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const allIssues = await fetchComplaintsApi();
    // Filter issues reported by current user
    const reported = allIssues.filter(issue => issue.reporterName === user.fullName || issue.userId === user.id);
    setMyIssues(reported);

    // Filter issues upvoted/supported by current user
    const supported = allIssues.filter(issue => (user.upvotedIssues || []).includes(issue.id) || (user.upvotedIssues || []).includes(issue._id));
    setSupportedIssues(supported);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      {/* Profile Header Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '3rem', marginBottom: '4rem' }} className="profile-grid">
        {/* User Card */}
        <div className="brutal-card lime" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--white)',
              border: '3px solid var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              marginBottom: '1.5rem'
            }}>
              {currentUser.avatar || 'U'}
            </div>
            
            <h2 style={{ fontSize: '2.2rem', textTransform: 'none', marginBottom: '0.5rem' }}>{currentUser.fullName}</h2>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              @{currentUser.username}
            </div>
            
            <p style={{ color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1.5rem' }}>
              {currentUser.bio}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '2px solid var(--primary-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
              <Mail size={16} />
              <span style={{ fontWeight: '600' }}>{currentUser.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
              <Calendar size={16} />
              <span style={{ fontWeight: '600' }}>Joined {currentUser.joinedDate}</span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="brutal-btn small coral" 
              style={{ marginTop: '1.5rem', width: 'fit-content' }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="brutal-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>
              CITIZEN SCORECARD
            </h3>
            <p style={{ marginBottom: '2rem', fontSize: '1rem' }}>
              Thank you for participating! By reporting and upvoting community issues, you are directly helping local authorities prioritize infrastructure fixes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="stats-row">
            {/* Stat Box 1 */}
            <div className="brutal-card yellow" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <FileText size={24} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{myIssues.length}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Grievances Reported</div>
            </div>

            {/* Stat Box 2 */}
            <div className="brutal-card lavender" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <ArrowUp size={24} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{currentUser.upvotedIssues.length}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Issues Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter Header */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        borderBottom: 'var(--border-width) solid var(--primary-color)',
        marginBottom: '2.5rem',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setActiveTab('reported')}
          className={`brutal-btn ${activeTab === 'reported' ? 'primary' : ''}`}
        >
          My Reported Issues ({myIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('supported')}
          className={`brutal-btn ${activeTab === 'supported' ? 'primary' : ''}`}
        >
          My Supported Issues ({supportedIssues.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reported' ? (
        myIssues.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {myIssues.map((issue) => (
              <ProblemCard key={issue.id} problem={issue} onVote={loadUserData} />
            ))}
          </div>
        ) : (
          <div className="brutal-card yellow" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Info size={48} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>NO REGISTERED ISSUES</h3>
            <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem', fontWeight: '500' }}>
              You have not filed any public grievances yet. Help improve your ward by reporting issues today!
            </p>
            <Link to="/submit" className="brutal-btn primary">
              <PlusCircle size={18} />
              <span>Report an Issue</span>
            </Link>
          </div>
        )
      ) : (
        supportedIssues.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {supportedIssues.map((issue) => (
              <ProblemCard key={issue.id} problem={issue} onVote={loadUserData} />
            ))}
          </div>
        ) : (
          <div className="brutal-card lavender" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Info size={48} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>NO SUPPORTED ISSUES</h3>
            <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem', fontWeight: '500' }}>
              You haven't upvoted any complaints yet. Browse the community feed and support urgent issues!
            </p>
            <Link to="/problems" className="brutal-btn">
              <span>Browse Issues</span>
            </Link>
          </div>
        )
      )}

      {/* Responsive details */}
      <style>{`
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .stats-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
