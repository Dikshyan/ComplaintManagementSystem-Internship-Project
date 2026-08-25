import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, ArrowUp, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { getIssueById, upvoteIssue, hasUpvoted, addComment } from '../services/client';

export function ProblemDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [problem, setProblem] = useState(null);
  const [votes, setVotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  
  // Comments input state
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Load problem details
  const loadProblemDetails = () => {
    const data = getIssueById(id);
    if (data) {
      setProblem(data);
      setVotes(data.upvotes);
      setComments(data.comments || []);
      setIsUpvoted(hasUpvoted(data.id));
    }
  };

  useEffect(() => {
    loadProblemDetails();
  }, [id]);

  // Handle scrolling to comments section if URL hash is present
  useEffect(() => {
    if (location.hash === '#comments') {
      const el = document.getElementById('comments-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location, problem]);

  const handleVote = () => {
    const result = upvoteIssue(id);
    if (result) {
      setVotes(result.issue.upvotes);
      setIsUpvoted(result.isUpvoted);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = addComment(id, commentText);
    if (newComment) {
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  if (!problem) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="brutal-card coral" style={{ color: 'var(--white)', display: 'inline-block', maxWidth: '500px', padding: '3rem' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--white)' }}>GRIEVANCE NOT FOUND</h3>
          <p style={{ color: 'var(--white)', marginBottom: '2rem', opacity: '0.9' }}>
            The problem report with ID "{id}" could not be retrieved from the database. It might have been deleted or archived.
          </p>
          <Link to="/problems" className="brutal-btn yellow" style={{ display: 'inline-flex' }}>
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  // Visual highlights
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Electricity': return 'var(--coral)';
      case 'Roads & Traffic': return 'var(--yellow)';
      case 'Sanitation': return 'var(--lime)';
      case 'Water Supply': return 'var(--lavender)';
      default: return 'var(--white)';
    }
  };

  const getPriorityBadge = (pri) => {
    if (pri === 'High') return <span className="badge priority-high">High Priority</span>;
    if (pri === 'Medium') return <span className="badge priority-medium">Medium Priority</span>;
    return <span className="badge priority-low">Low Priority</span>;
  };

  const getStatusBadge = (stat) => {
    if (stat === 'RESOLVED') return <span className="badge status-resolved">RESOLVED</span>;
    if (stat === 'IN_PROGRESS') return <span className="badge status-progress">IN PROGRESS</span>;
    return <span className="badge status-open">OPEN</span>;
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/problems" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to All Problems</span>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '3rem' }} className="details-layout">
        {/* Left Column: Main Issue Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Title Header */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ backgroundColor: getCategoryColor(problem.category) }}>
                {problem.category}
              </span>
              {getPriorityBadge(problem.priority)}
              {getStatusBadge(problem.status)}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', textTransform: 'none', lineHeight: '1.15' }}>
              {problem.title}
            </h1>
          </div>

          {/* Issue Image (if available) */}
          {problem.image && (
            <div className="brutal-card" style={{ padding: '0', overflow: 'hidden', height: 'auto', maxHeight: '450px' }}>
              <img 
                src={problem.image} 
                alt={problem.title} 
                style={{ width: '100%', height: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Description Block */}
          <div className="brutal-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>
              ISSUE DESCRIPTION
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--primary-color)', 
              lineHeight: '1.6', 
              whiteSpace: 'pre-line' 
            }}>
              {problem.description}
            </p>
          </div>

          {/* Live Action Upvote Callout */}
          <div className="brutal-card yellow" style={{ 
            padding: '2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', textTransform: 'none' }}>
                {isUpvoted ? "You support this grievance!" : "Do you face this issue too?"}
              </h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '500', margin: '0' }}>
                Upvote to notify local supervisors of widespread community concern.
              </p>
            </div>
            <button 
              onClick={handleVote} 
              className={`brutal-btn ${isUpvoted ? 'primary' : 'white'}`}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              <ArrowUp size={20} style={{ transform: isUpvoted ? 'scale(1.2)' : 'none', transition: 'transform 0.2s' }} />
              <span>{votes} SUPPORTERS</span>
            </button>
          </div>

          {/* Comments Section */}
          <div id="comments-section" className="brutal-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>
              CITIZEN DISCUSSION ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }} className="comment-form">
              <input 
                type="text" 
                className="brutal-input" 
                placeholder="Write a comment, report progress, or suggest solutions..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flexGrow: 1 }}
              />
              <button type="submit" className="brutal-btn primary" style={{ padding: '0.85rem 1.5rem' }}>
                <Send size={18} />
                <span className="comment-btn-text">Comment</span>
              </button>
            </form>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div style={{ display: 'flex', flexType: 'column', flexDirection: 'column', gap: '1.5rem' }}>
                {comments.map((comment) => (
                  <div key={comment.id} style={{ 
                    borderLeft: '4px solid var(--coral)', 
                    paddingLeft: '1.25rem',
                    margin: '0.5rem 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{comment.user}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• {comment.date}</span>
                    </div>
                    <p style={{ color: 'var(--primary-color)', fontSize: '0.95rem', margin: 0 }}>
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '1rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                No comments posted yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Status Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Metadata Card */}
          <div className="brutal-card" style={{ padding: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              Report Details
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.2rem' }}>ID Reference</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{problem.id}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Location</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                  <MapPin size={16} color="var(--coral)" />
                  <span>{problem.location}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Reported By</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                  <User size={16} />
                  <span>{problem.reporterName}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Date Reported</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                  <Calendar size={16} />
                  <span>{problem.dateReported}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution History Timeline */}
          <div className="brutal-card lavender" style={{ padding: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
              Resolution Timeline
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
              {/* Vertical timeline connector line */}
              <div style={{
                position: 'absolute',
                top: '10px',
                bottom: '10px',
                left: '10px',
                width: '3px',
                backgroundColor: 'var(--primary-color)',
                zIndex: 0
              }}></div>

              {problem.resolutionHistory?.map((history, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                  {/* Status Node icon */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 && problem.resolutionHistory.length === 1 
                      ? 'var(--coral)' 
                      : history.status === 'RESOLVED' 
                        ? 'var(--lime)' 
                        : 'var(--yellow)',
                    border: '2px solid var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {history.status === 'RESOLVED' ? (
                      <CheckCircle2 size={12} strokeWidth={3} />
                    ) : history.status === 'IN_PROGRESS' ? (
                      <Clock size={12} strokeWidth={3} />
                    ) : (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                    )}
                  </div>

                  {/* Status text */}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.2rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        {history.status.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                        {history.date}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginTop: '0.25rem', marginBottom: '0' }}>
                      {history.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive adjustments styling */}
      <style>{`
        @media (max-width: 992px) {
          .details-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 576px) {
          .comment-form {
            flex-direction: column !important;
          }
          .comment-btn-text {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
}
