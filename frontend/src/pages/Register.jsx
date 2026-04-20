import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (!err.response) {
        setError('Network Error: The backend server is not running or unreachable.');
      } else {
        const errorData = err.response.data;
        const errorMessage = typeof errorData === 'string' ? errorData : (errorData?.message || errorData?.error || 'Error registering account');
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Join Smart Campus</h2>
        
        {error && <p style={{ color: 'var(--secondary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>{success}</p>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
              minLength={2}
            />
          </div>
          <div className="form-group">
            <label>Student Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register Account
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ width: '100%' }}>
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
