import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div>Carregando...</div>;

  return (
    <div>
      <h1 style={{ color: 'var(--isla-blue)' }}>Dashboard Global</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        <div className="stat-card">
          <div>Total IN</div>
          <div className="stat-number">{stats.in}</div>
        </div>
        <div className="stat-card">
          <div>Total OUT</div>
          <div className="stat-number">{stats.out}</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--isla-yellow)', color: 'var(--isla-blue)' }}>
          <div>Total Geral</div>
          <div className="stat-number" style={{ color: 'white' }}>{stats.in + stats.out}</div>
        </div>
        
        <div className="stat-card">
          <div>Gestão</div>
          <div className="stat-number">{stats.schoolGestao}</div>
        </div>
        <div className="stat-card">
          <div>Tecnologia</div>
          <div className="stat-number">{stats.schoolTec}</div>
        </div>

        <div className="stat-card">
          <div>Concluídas</div>
          <div className="stat-number">{stats.completed}</div>
        </div>
        <div className="stat-card">
          <div>Em Curso</div>
          <div className="stat-number">{stats.ongoing}</div>
        </div>

        <div className="stat-card">
          <div>Estudantes</div>
          <div className="stat-number">{stats.students}</div>
        </div>
        <div className="stat-card">
          <div>Staff</div>
          <div className="stat-number">{stats.staff}</div>
        </div>

      </div>
    </div>
  );
}