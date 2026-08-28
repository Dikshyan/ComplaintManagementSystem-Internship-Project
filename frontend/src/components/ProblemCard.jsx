import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUp, MessageSquare, Calendar, User } from 'lucide-react';
import { upvoteIssue, hasUpvoted } from '../services/client';

export function ProblemCard({ problem, onVote }) {
  const [votes, setVotes] = useState(problem.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(hasUpvoted(problem.id));

  const handleVote = async (e) => {
    e.preventDefault(); // Stop navigation if clicked inside card Link
    const result = await upvoteIssue(problem.id);
    if (result) {
      setVotes(result.issue.upvotes);
      setIsUpvoted(result.isUpvoted);
      if (onVote) onVote();
    }
  };

  // Assign accent colors dynamically based on category for rich design
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
    return `priority-${pri.toLowerCase()}`;
  };

  const getStatusClass = (stat) => {
    if (stat === 'IN_PROGRESS') return 'status-progress';
    return `status-${stat.toLowerCase()}`;
  };

  return (
    <div className="brutal-card problem-card hover-rotate" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Card Visual Header */}
      {problem.image && (
        <div style={{ 
          height: '200px', 
          margin: '-2rem -2rem 1.5rem -2rem', 
          borderBottom: 'var(--border-width) solid var(--primary-color)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img 
            src={problem.image} 
            alt={problem.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.5rem' }}>
            <span className={`badge ${getStatusClass(problem.status)}`}>
              {problem.status.replace('_', ' ')}
            </span>
            <span className={`badge ${getPriorityClass(problem.priority)}`}>
              {problem.priority} Priority
            </span>
          </div>
        </div>
      )}

      {/* Category Tag */}
      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold' }}>
          {problem.id}
        </span>
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
          <Link to={`/problems/${problem.id}#comments`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
            <MessageSquare size={16} />
            <span>{problem.comments?.length || 0}</span>
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
