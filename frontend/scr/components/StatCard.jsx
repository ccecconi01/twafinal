import React from 'react';

export default function StatCard({ title, value, color = 'var(--isla-blue)', labelColor = 'white' }) {
  return (
    <div style={{ 
      backgroundColor: color, 
      color: labelColor, 
      padding: '20px', 
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '120px'
    }}>
      <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
        {title}
      </div>
      <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--isla-yellow)' }}>
        {value}
      </div>
    </div>
  );
}