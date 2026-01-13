import React, { useState } from 'react';
import api from '../api/axios';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ user: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      if (res.data.success) {
        onLogin({ user: formData.user, role: res.data.role });
      }
    } catch (err) {
      setError("Credenciais Inválidas");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#004876' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '300px' }}>
        <h2 style={{ color: '#004876', textAlign: 'center' }}>Acesso SigQ</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Utilizador" 
            value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})}
            style={{ padding: '10px' }}
          />
          <input 
            type="password" placeholder="Palavra-passe" 
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: '10px' }}
          />
          {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
          <button type="submit" className="btn-primary">ENTRAR</button>
        </form>
      </div>
    </div>
  );
}