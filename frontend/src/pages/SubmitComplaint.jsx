import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, AlertOctagon, UploadCloud, ChevronRight, HelpCircle } from 'lucide-react';
import { submitIssue, getCurrentUser } from '../services/client';

export function SubmitComplaint() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [imageName, setImageName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Mock upload interaction
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in all required fields (Title, Description, and Location).');
      return;
    }

    setIsSubmitting(true);

    // Simulate database write lag for premium feel
    setTimeout(() => {
      try {
        submitIssue(title, description, category, location, priority);
        setIsSubmitting(false);
        navigate('/problems'); // Redirect to feed page
      } catch (err) {
        setError('An error occurred during submission. Please try again.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      {/* Page header banner */}
      <div className="section-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h2 className="section-title">REPORT A GRIEVANCE</h2>
          <p className="section-subtitle">File a public complaint. Provide accurate details and location coordinates so that community members can support it.</p>
        </div>
      </div>

      {error && (
        <div className="brutal-card coral" style={{ color: 'var(--white)', padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertOctagon size={24} />
          <span style={{ fontWeight: '700' }}>{error}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="brutal-card" style={{ padding: '3rem', backgroundColor: 'var(--white)' }}>
        {/* Author sign-in notice */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--lavender)',
          border: '2px solid var(--primary-color)',
          padding: '1rem',
          marginBottom: '2rem',
          fontWeight: '600',
          fontSize: '0.95rem'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: 'var(--white)',
            border: '2px solid var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.8rem'
          }}>
            {currentUser?.avatar || 'U'}
          </div>
          <span>Filing grievance public record as: <strong>{currentUser?.fullName || 'Resident Guest'} (@{currentUser?.username || 'user'})</strong></span>
        </div>

        {/* 1. Title Input */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Issue Title <span style={{ color: 'var(--coral)' }}>*</span>
          </label>
          <input 
            type="text"
            className="brutal-input"
            placeholder="e.g. Broken streetlight on 14th main road, Indiranagar"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            required
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'block', fontWeight: '500' }}>
            Keep titles clear and concise. Describe what is broken and where. Max 80 characters.
          </span>
        </div>

        {/* Row fields: Category & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }} className="form-row">
          {/* 2. Category Dropdown */}
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Category
            </label>
            <select
              className="brutal-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Roads & Traffic">Roads & Traffic</option>
            </select>
          </div>

          {/* 3. Priority Dropdown */}
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Priority Level
            </label>
            <select
              className="brutal-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">🟢 Low (No immediate hazard)</option>
              <option value="Medium">🟡 Medium (Disruption caused)</option>
              <option value="High">🔴 High (Safety concern/gridlock)</option>
            </select>
          </div>
        </div>

        {/* 4. Location Input */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Exact Location <span style={{ color: 'var(--coral)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--coral)' }}>
              <MapPin size={18} />
            </span>
            <input 
              type="text"
              className="brutal-input"
              placeholder="e.g. Near St. Mary's School, Sector 7, HSR Layout, Bangalore"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
              required
            />
          </div>
        </div>

        {/* 5. Description Textarea */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Detailed Description <span style={{ color: 'var(--coral)' }}>*</span>
          </label>
          <textarea
            className="brutal-input"
            placeholder="Provide context, how long the issue has persisted, and the direct impact on citizens..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ minHeight: '150px', resize: 'vertical' }}
            required
          />
        </div>

        {/* 6. Mock Image Upload */}
        <div style={{ marginBottom: '3rem' }}>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Attach Photograph (Optional)
          </label>
          <div style={{
            border: '3px dashed var(--primary-color)',
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-color)',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
            <UploadCloud size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
            {imageName ? (
              <div>
                <p style={{ fontWeight: '700', color: 'var(--coral)', marginBottom: '0.5rem' }}>{imageName}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click or drag a new image to replace</p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Drag photo here, or click to upload</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Supports JPG, PNG, up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="brutal-btn"
            onClick={() => navigate('/problems')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="brutal-btn primary"
            disabled={isSubmitting}
            style={{ minWidth: '180px' }}
          >
            {isSubmitting ? 'Submitting...' : 'Register Grievance'}
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
      
      <style>{`
        @media (max-width: 576px) {
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
