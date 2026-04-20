import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 3rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          <span style={{ color: 'var(--primary)' }}>Smart </span><span style={{ color: 'var(--secondary)' }}>Campus</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="btn btn-primary"
            style={{ borderRadius: '20px', padding: '0.6rem 1.5rem' }}
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', maxWidth: '800px' }}>
          Elevate Your Campus Experience
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Discover, register, and manage upcoming workshops, seminars, and events tailored just for you.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '5rem' }}>
          <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ borderRadius: '30px', padding: '0.8rem 2rem' }}>
            Get Started
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ borderRadius: '30px', padding: '0.8rem 2rem', borderColor: 'var(--primary)', color: 'var(--text-main)' }}>
            Join Now
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3" style={{ gap: '2rem', maxWidth: '1000px', width: '100%' }}>
          <div className="glass-panel" style={{ textAlign: 'left', padding: '2rem', border: 'none', background: 'var(--surface)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Workshops</h3>
            <p style={{ fontSize: '0.95rem' }}>Hands-on sessions to build your technical skills.</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'left', padding: '2rem', border: 'none', background: 'var(--surface)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Seminars</h3>
            <p style={{ fontSize: '0.95rem' }}>Insights from industry leaders and professors.</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'left', padding: '2rem', border: 'none', background: 'var(--surface)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Networking</h3>
            <p style={{ fontSize: '0.95rem' }}>Connect with your peers and potential mentors.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
