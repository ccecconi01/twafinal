import React, { useState } from 'react';
import api from '../api/axios';
import logoImg from '../assets/islalogowhite.png';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ user: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data));
        onLogin(res.data);
      }
    } catch (err) {
      setError("Credenciais Inválidas");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: 'var(--isla-blue)' 
    }}>
      
      {/* LOGO CENTRALIZADA */}
      <div style={{ marginBottom: '50px' }}>
        <img src={logoImg} alt="Logo ISLA" style={{ width: '320px', height: 'auto', filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))' }} 
        />
      </div>

      {/* PAINEL DE LOGIN */}
      <div style={{ 
        background: 'white', 
        padding: '50px', 
        borderRadius: '15px', 
        width: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        borderTop: '8px solid var(--isla-yellow)' // Detalhe amarelo no topo
      }}>
        <h2 style={{ 
          color: 'var(--isla-blue)', 
          textAlign: 'center', 
          marginTop: 0,
          fontSize: '1.8rem',
          fontWeight: '800'
        }}>
          ISLA Mobility Manager
        </h2>
        
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px' }}>
          Gestão de Mobilidades Internacionais
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" placeholder="Utilizador" 
            value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})}
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          <input 
            type="password" placeholder="Palavra-passe" 
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          {error && <span style={{ color: '#d32f2f', textAlign: 'center', fontSize: '0.9rem' }}>{error}</span>}
          
          <button type="submit" className="btn-primary" style={{ 
            padding: '15px', 
            borderRadius: '8px', 
            fontSize: '1.1rem',
            backgroundColor: 'var(--isla-blue)',
            cursor: 'pointer'
          }}>
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
}