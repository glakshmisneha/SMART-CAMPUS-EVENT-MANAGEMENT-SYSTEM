import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Users, Tag, CheckCircle2, ChevronLeft } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('explore'); // explore, my-events
  
  // Registration Form State
  const [registeringFor, setRegisteringFor] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('studentEmail');
    if (!storedEmail) {
      navigate('/');
      return;
    }
    setEmail(storedEmail);
    fetchEvents();
    fetchMyRegistrations(storedEmail);
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/student/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRegistrations = async (userEmail) => {
    try {
      const res = await api.get(`/student/my-registrations?email=${userEmail}`);
      setMyRegistrations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post(`/student/events/${registeringFor.id}/register`, {
        studentName,
        studentEmail: email
      });
      setSuccessMsg('Successfully registered!');
      setRegisteringFor(null);
      setStudentName('');
      await fetchMyRegistrations(email);
      setActiveTab('my-events');
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'string') {
        setErrorMsg(msg);
      } else if (msg && typeof msg === 'object') {
        // Handle validation format or json errors gracefully
        setErrorMsg(Object.values(msg)[0] || 'Validation error occurred');
      } else {
        setErrorMsg('Failed to register');
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <Calendar color="var(--primary)" /> Smart Campus
        </div>
        <div className="flex items-center gap-4">
          <span className="badge badge-info">{email}</span>
          <button onClick={() => { localStorage.removeItem('studentEmail'); navigate('/'); }} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="app-container">
        <div className="flex gap-4 mb-8">
          <button 
            className={`btn ${activeTab === 'explore' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore Events
          </button>
          <button 
            className={`btn ${activeTab === 'my-events' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('my-events')}
          >
            My Registrations
          </button>
        </div>

        {errorMsg && <div className="glass-panel mb-4" style={{ borderColor: 'red', color: 'red' }}>{errorMsg}</div>}
        {successMsg && <div className="glass-panel mb-4" style={{ borderColor: 'green', color: 'green' }}>{successMsg}</div>}

        {activeTab === 'explore' && !registeringFor && (
          <div className="grid grid-cols-3">
            {events.map(event => (
              <div key={event.id} className="glass-panel event-card">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3>{event.title}</h3>
                    <span className="badge badge-info">{event.type}</span>
                  </div>
                  <p className="text-sm">{event.description}</p>
                  
                  <div className="event-meta">
                    <span className="flex items-center gap-2"><Calendar size={14}/> {event.date}</span>
                    <span className="flex items-center gap-2"><MapPin size={14}/> {event.department}</span>
                  </div>
                  <div className="event-meta">
                    <span className="flex items-center gap-2"><Users size={14}/> Cap: {event.capacity}</span>
                  </div>
                </div>
                
                <div className="event-actions">
                  <button onClick={() => setRegisteringFor(event)} className="btn btn-primary" style={{ width: '100%' }}>
                    Register Now
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && <p>No events available right now.</p>}
          </div>
        )}

        {activeTab === 'explore' && registeringFor && (
          <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <button onClick={() => setRegisteringFor(null)} className="btn btn-outline mb-4" style={{ padding: '0.4rem 0.8rem' }}>
              <ChevronLeft size={16} /> Back
            </button>
            <h2>Register for {registeringFor.title}</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={studentName} 
                  onChange={e => setStudentName(e.target.value)} 
                  placeholder="John Doe"
                  minLength={3}
                />
              </div>
              <div className="form-group">
                <label>Email (Auto-filled)</label>
                <input type="email" disabled value={email} />
              </div>
              <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }}>
                Confirm Registration
              </button>
            </form>
          </div>
        )}

        {activeTab === 'my-events' && (
          <div className="grid grid-cols-2">
            {myRegistrations.map(reg => (
              <div key={reg.id} className="glass-panel flex justify-between items-center">
                <div>
                  <h3 className="flex items-center gap-2"><CheckCircle2 color="var(--primary)" size={20}/> {reg.event.title}</h3>
                  <p className="mt-2 text-sm max-w-md">Date: {reg.event.date} | Dept: {reg.event.department}</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-success">Registered</span>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Registered on: <br/>{new Date(reg.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {myRegistrations.length === 0 && <p>You haven't registered for any events yet.</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
