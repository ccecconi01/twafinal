import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--isla-blue)', 
      padding: '15px 30px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ width:'10px', height:'10px', background:'var(--isla-yellow)', borderRadius:'50%' }}></div>
        ISLA Mobility
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
        <Link to="/mobilities" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Mobilidades</Link>
        <Link to="/partnerships" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Parcerias</Link>
        
        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
        
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Olá, {user.user}</span>
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--isla-yellow)', 
              color: 'var(--isla-yellow)', 
              padding: '5px 10px', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            SAIR
          </button>
        </div>
      </div>
    </nav>
  );
}