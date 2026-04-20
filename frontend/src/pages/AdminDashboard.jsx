import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, Plus, Trash2, Edit, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0 });
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // events, registrations
  
  // Event Form State
  const [formData, setFormData] = useState({ id: null, title: '', date: '', department: '', type: '', description: '', capacity: 50 });

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth) {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [navigate]);



  const fetchDashboardData = async () => {
    const evRes = await api.get('/admin/events');
    const stRes = await api.get('/admin/statistics');
    const regRes = await api.get('/admin/registrations');
    setEvents(evRes.data);
    setStats(stRes.data);
    setRegistrations(regRes.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/admin/events/${formData.id}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      setShowForm(false);
      setFormData({ id: null, title: '', date: '', department: '', type: '', description: '', capacity: 50 });
      fetchDashboardData();
    } catch (err) {
      alert('Error saving event: ' + (err.response?.data?.title || 'Invalid data'));
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this event?')) {
      await api.delete(`/admin/events/${id}`);
      fetchDashboardData();
    }
  };

  if (!isAuthenticated) {
    return null; // The useEffect will redirect to /login
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <ShieldCheck color="var(--secondary)" /> Admin Portal
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
          Logout
        </button>
      </nav>

      <div className="app-container">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 mb-8 gap-4">
          <div className="glass-panel flex items-center justify-between">
            <div>
              <p className="text-sm">Total Events</p>
              <h2>{stats.totalEvents}</h2>
            </div>
            <BarChart3 size={40} color="var(--primary)" style={{ opacity: 0.5 }} />
          </div>
          <div className="glass-panel flex items-center justify-between">
            <div>
              <p className="text-sm">Total Registrations</p>
              <h2>{stats.totalRegistrations}</h2>
            </div>
            <BarChart3 size={40} color="var(--secondary)" style={{ opacity: 0.5 }} />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('events')}
          >
            Manage Events
          </button>
          <button 
            className={`btn ${activeTab === 'registrations' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('registrations')}
          >
            View Registrations
          </button>
        </div>
        {activeTab === 'events' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2>Manage Events</h2>
              <button onClick={() => { setShowForm(!showForm); setFormData({ id: null, title: '', date: '', department: '', type: '', description: '', capacity: 50 }); }} className="btn btn-primary">
                {showForm ? 'Cancel' : <><Plus size={18} /> Add Event</>}
              </button>
            </div>

            {showForm && (
              <div className="glass-panel mb-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-2">
                  <div className="form-group">
                    <label>Event Title</label>
                    <input type="text" minLength={3} maxLength={100} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Event Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Type (e.g., Workshop)</label>
                    <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input type="number" min={1} value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Description</label>
                    <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit" className="btn btn-primary">{formData.id ? 'Update Event' : 'Create Event'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
              {events.map((event) => (
                <div key={event.id} className="glass-panel flex justify-between items-center" style={{ padding: '1.5rem' }}>
                  <div>
                    <h3 className="mb-2">{event.title} <span className="badge badge-info" style={{ marginLeft: '10px' }}>{event.type}</span></h3>
                    <p className="text-sm">{event.date} | {event.department} | Cap: {event.capacity}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(event)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(event.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {events.length === 0 && <p>No events found. Create one!</p>}
            </div>
          </>
        )}

        {activeTab === 'registrations' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2>Student Registrations</h2>
            </div>
            <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
              {registrations.map(reg => (
                <div key={reg.id} className="glass-panel flex justify-between items-center" style={{ padding: '1.5rem' }}>
                  <div>
                    <h3 className="mb-2">{reg.studentName}</h3>
                    <p className="text-sm" style={{ color: 'var(--primary)' }}>{reg.studentEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-info mb-2">{reg.event.title}</span>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Registered on: {new Date(reg.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {registrations.length === 0 && <p>No student registrations yet.</p>}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
