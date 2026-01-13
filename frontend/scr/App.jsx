import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mobilities from './pages/Mobilities';
import Partnerships from './pages/Partnerships';

function App() {
  const [user, setUser] = useState(null); // { user: 'grim', role: 'admin' }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Navbar */}
        <nav style={{ background: 'var(--isla-blue)', padding: '1rem', color: 'white', display:'flex', justifyContent:'space-between' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ISLA Mobility Manager</div>
          <div style={{ display:'flex', gap:'20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/mobilities" style={{ color: 'white', textDecoration: 'none' }}>Mobilidades</Link>
            <Link to="/partnerships" style={{ color: 'white', textDecoration: 'none' }}>Parcerias</Link>
            <button onClick={() => setUser(null)} style={{background:'transparent', border:'1px solid white', color:'white'}}>Sair ({user.user})</button>
          </div>
        </nav>

        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mobilities" element={<Mobilities user={user} />} />
            <Route path="/partnerships" element={<Partnerships user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;