import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowUp, Calendar, User, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { upvoteIssue, hasUpvoted } from '../services/complaintApi';
import { getCurrentUser } from '../services/authapi';

export function ProblemCard({ problem, onVote, showImage = false }) {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(problem.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(hasUpvoted(problem.id));

  const department = problem.assignedDepartment || (typeof problem.assignedTo === 'object' ? problem.assignedTo?.department : '') || '';
  const assignedStaffName = typeof problem.assignedTo === 'object' ? problem.assignedTo?.name : '';

  const displayImage = showImage ? (problem.image || (problem.attachments && problem.attachments.length > 0 ? problem.attachments[0] : null)) : null;

  const handleVote = async (e) => {
    e.preventDefault(); // Stop navigation if clicked inside card Link
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('Please sign in to upvote complaints', { toastId: 'vote-login-required' });
      navigate('/login');
      return;
    }
    if (currentUser.role === 'admin' || currentUser.role === 'staff') {
      toast.info('Voting is restricted to public citizens', { toastId: 'vote-role-restricted' });
      return;
    }
    const result = await upvoteIssue(problem.id);
    if (result) {
      setVotes(result.issue.upvotes);
      setIsUpvoted(result.isUpvoted);
      if (onVote) onVote();
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Electricity': return 'var(--coral)';
      case 'Roads & Traffic': return 'var(--yellow)';
      case 'Sanitation': return 'var(--lime)';
      case 'Water Supply': return 'var(--lavender)';
      default: return 'var(--white)';
    }
  };

  const getPriorityClass = (pri) => {
    return `priority-${(pri || 'medium').toLowerCase()}`;
  };

  const getStatusClass = (stat) => {
    if (!stat) return 'status-open';
    const s = stat.toLowerCase().replace(/\s+/g, '_');
    if (s === 'in_progress' || s === 'in progress') return 'status-progress';
    if (s === 'resolved') return 'status-resolved';
    return `status-${s}`;
  };

  const formatId = (id) => {
    if (!id) return '';
    if (id.length > 8) return `#${id.slice(-8)}`;
    return `#${id}`;
  };

  return (
    <div className="brutal-card problem-card hover-rotate" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Card Visual Header */}
      {displayImage && (
        <div style={{ 
          height: '200px', 
          margin: '-2rem -2rem 1.5rem -2rem', 
          borderBottom: 'var(--border-width) solid var(--primary-color)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img 
            src={displayImage} 
            alt={problem.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className={`badge ${getStatusClass(problem.status)}`}>
              {problem.status ? problem.status.replace('_', ' ') : 'Pending'}
            </span>
            <span className={`badge ${getPriorityClass(problem.priority)}`}>
              {problem.priority} Priority
            </span>
          </div>
        </div>
      )}

      {/* Category Tag, ID & Department Row */}
      <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span 
            className="badge" 
            style={{ 
              backgroundColor: getCategoryColor(problem.category),
              color: 'var(--primary-color)',
              fontWeight: '800'
            }}
          >
            {problem.category}
          </span>

          {!displayImage && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className={`badge ${getStatusClass(problem.status)}`}>
                {problem.status ? problem.status.replace('_', ' ') : 'Pending'}
              </span>
              <span className={`badge ${getPriorityClass(problem.priority)}`}>
                {problem.priority}
              </span>
            </div>
          )}

          <span 
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: '800',
              backgroundColor: 'var(--bg-color)',
              border: '1.5px solid var(--primary-color)',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
              letterSpacing: '0.05em'
            }}
            title={problem.id}
          >
            {formatId(problem.id)}
          </span>
        </div>

        {department && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: 'var(--lavender)', color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.75rem', padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Building size={12} />
              <span>{department}</span>
            </span>
            {assignedStaffName && (
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                ({assignedStaffName})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', textTransform: 'none', lineHeight: '1.2' }}>
        <Link to={`/problems/${problem.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {problem.title}
        </Link>
      </h3>

      {/* Description Excerpt */}
      <p style={{ 
        fontSize: '0.95rem', 
        marginBottom: '1.5rem', 
        flexGrow: 1, 
        display: '-webkit-box', 
        WebkitLineClamp: 3, 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden' 
      }}>
        {problem.description}
      </p>

      {/* Location */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontSize: '0.85rem', 
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: 'var(--text-secondary)'
      }}>
        <MapPin size={16} color="var(--coral)" />
        <span>{problem.location}</span>
      </div>

      {/* Divider */}
      <div style={{ height: '2px', backgroundColor: 'var(--primary-color)', marginBottom: '1.25rem' }}></div>

      {/* Card Actions Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Author / Date info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <User size={12} />
            <span>{problem.reporterName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} />
            <span>{problem.dateReported}</span>
          </div>
        </div>

        {/* Upvote & Comment counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={`/problems/${problem.id}`} className="brutal-btn small white" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
            <span>View Details →</span>
          </Link>
          
          <button 
            onClick={handleVote}
            className={`brutal-btn small ${isUpvoted ? 'primary' : 'yellow'}`}
            style={{ padding: '0.4rem 0.8rem' }}
            title={isUpvoted ? "Remove Support" : "Support this Issue"}
          >
            <ArrowUp size={16} style={{ transform: isUpvoted ? 'scale(1.2)' : 'none', transition: 'transform 0.2s' }} />
            <span>{votes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
