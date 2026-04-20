import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email === 'admin@campus.edu' && password === 'admin123') {
        const token = btoa(`${email}:${password}`);
        localStorage.setItem('adminAuth', token);
        navigate('/admin');
        return;
      }

      await api.post('/student/auth/login', { email, password });
      localStorage.setItem('studentEmail', email);
      navigate('/student');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Login to Campus</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Please enter your credentials below.
        </p>
        
        {error && <p style={{ color: 'var(--secondary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="form-group">
            <label>Email / Username</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ width: '100%' }}>
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
