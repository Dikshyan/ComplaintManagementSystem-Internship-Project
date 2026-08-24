import React, { useState, useEffect } from 'react';
import { Search, Filter, HelpCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getIssues } from '../db';
import { ProblemCard } from '../components/ProblemCard';

const CATEGORIES = [
  "All",
  "Infrastructure",
  "Sanitation",
  "Water Supply",
  "Electricity",
  "Public Safety",
  "Roads & Traffic"
];

export function ProblemsFeed() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'votes'

  const loadIssues = () => {
    setIssues(getIssues());
  };

  useEffect(() => {
    loadIssues();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...issues];

    // Search term check
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term) ||
        issue.location.toLowerCase().includes(term) ||
        issue.id.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(issue => issue.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== 'All') {
      result = result.filter(issue => issue.priority === selectedPriority);
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter(issue => issue.status === selectedStatus);
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));
    } else if (sortBy === 'votes') {
      result.sort((a, b) => b.upvotes - a.upvotes);
    }

    setFilteredIssues(result);
  }, [issues, searchTerm, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">ALL REPORTED ISSUES</h2>
          <p className="section-subtitle">Browse through community grievances, check current maintenance status, and lend your upvote to urgent issues.</p>
        </div>
        <Link to="/submit" className="brutal-btn primary">
          <PlusCircle size={18} />
          <span>REPORT A NEW ISSUE</span>
        </Link>
      </div>

      {/* Main Search & Filters Toolbar */}
      <div className="brutal-card" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1.5rem', alignItems: 'center' }} className="filters-grid">
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={18} />
            </span>
            <input 
              type="text" 
              className="brutal-input" 
              placeholder="Search issues, location, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Priority Select */}
          <div>
            <select 
              className="brutal-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Status Select */}
          <div>
            <select 
              className="brutal-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="OPEN">🔴 Open</option>
              <option value="IN_PROGRESS">🟡 In Progress</option>
              <option value="RESOLVED">🟢 Resolved</option>
            </select>
          </div>

          {/* Sort Select */}
          <div>
            <select 
              className="brutal-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">🕒 Newest First</option>
              <option value="votes">🔥 Most Upvoted</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <button 
            className="brutal-btn lavender"
            onClick={clearFilters}
            style={{ width: '100%', height: '100%', padding: '0.8rem 1rem' }}
          >
            Clear Filters
          </button>
        </div>

        {/* Category horizontal scrolling bar */}
        <div style={{ 
          marginTop: '1.5rem', 
          display: 'flex', 
          gap: '0.75rem', 
          overflowX: 'auto', 
          paddingBottom: '0.5rem',
          scrollbarWidth: 'thin'
        }} className="categories-list">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`brutal-btn small ${selectedCategory === category ? 'primary' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '1rem',
        fontWeight: 'bold'
      }}>
        <div>
          FOUND: <span style={{ color: 'var(--coral)' }}>{filteredIssues.length}</span> ISSUES MATCHING FILTERS
        </div>
        {(searchTerm || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Filters active
          </div>
        )}
      </div>

      {/* Problems List Grid */}
      {filteredIssues.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {filteredIssues.map((issue) => (
            <ProblemCard 
              key={issue.id} 
              problem={issue} 
              onVote={loadIssues} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="brutal-card yellow" style={{ textAlign: 'center', padding: '5rem 2rem', marginTop: '2rem' }}>
          <HelpCircle size={64} style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>No matching reports found</h3>
          <p style={{ maxWidth: '500px', margin: '0 auto 2rem', fontWeight: '500', color: 'var(--primary-color)' }}>
            We couldn't find any community complaints matching your filters or search text. You can clear the filters or report a new issue yourself!
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button className="brutal-btn primary" onClick={clearFilters}>Reset Filters</button>
            <Link to="/submit" className="brutal-btn">Report an Issue</Link>
          </div>
        </div>
      )}

      {/* Media Query Styles for Mobile Filters */}
      <style>{`
        @media (max-width: 992px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
          }
          .filters-grid > div:first-child {
            grid-column: span 2;
          }
          .filters-grid > button {
            grid-column: span 2;
          }
        }
        @media (max-width: 576px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }
          .filters-grid > div:first-child,
          .filters-grid > button {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
