import React, { useEffect, useState } from 'react';
import api from '../api/axios';
// AQUI ESTAVA O ERRO: Adicionei FaTrash, FaPlus e FaTimes
import { FaExternalLinkAlt, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'; 

export default function Partnerships({ user }) {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ country: '', area: '', blended: false });
  const [showForm, setShowForm] = useState(false);
  
  // Estado para o formulário de nova parceria
  const initialFormState = { 
    institution: '', 
    country: '', 
    website: '', 
    areas: '',
    erasmusCode: ''
  };
  const [newForm, setNewForm] = useState(initialFormState);

  // Busca dados com filtros
  const fetchPartnerships = () => {
    const params = new URLSearchParams(filters);
    if(filters.blended) params.append('blended', 'true');
    
    api.get(`/partnerships?${params.toString()}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Erro ao buscar:", err));
  };

  useEffect(fetchPartnerships, [filters]);

  // Função de Criar
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/partnerships', newForm);
      alert("Parceria criada com sucesso!");
      setShowForm(false);
      setNewForm(initialFormState);
      fetchPartnerships();
    } catch (error) {
      alert("Erro ao criar: " + (error.response?.data?.error || "Verifique os dados"));
    }
  };

  // Função de Apagar (Delete)
  const handleDelete = async (id) => {
      if (!confirm("Atenção: Apagar uma parceria pode afetar dados históricos. Confirmar?")) return;

      try {
          await api.delete(`/partnerships/${id}`);
          // Remove da lista visualmente
          setData(data.filter(item => item.id !== id));
      } catch (error) {
          alert("Erro ao apagar. Verifique se é admin.");
      }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--isla-blue)', margin: 0 }}>Parcerias Internacionais</h1>
        
        {/* Botão Criar (Só Admin) */}
        {user.user === 'grim' && !showForm && (
           <button className="btn-primary" onClick={() => setShowForm(true)}>
             <FaPlus /> Nova Parceria
           </button>
        )}
      </div>

      {/* Área de Filtros */}
      <div className="card" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
            placeholder="Filtrar por País" 
            value={filters.country}
            onChange={e => setFilters({...filters, country: e.target.value})} 
            style={{ padding: '5px' }}
        />
        <input 
            placeholder="Filtrar por Área" 
            value={filters.area}
            onChange={e => setFilters({...filters, area: e.target.value})} 
            style={{ padding: '5px' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={filters.blended}
            onChange={e => setFilters({...filters, blended: e.target.checked})} 
          />
          Blended Intensive?
        </label>
      </div>

      {/* Formulário de Criação */}
      {showForm && (
        <div className="card" style={{ background: '#eef', borderLeft: '5px solid var(--isla-blue)' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <h3>Nova Parceria</h3>
            <button onClick={() => setShowForm(false)} style={{ background:'transparent', border:'none', cursor:'pointer'}}><FaTimes /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display:'grid', gap:'10px', gridTemplateColumns: '1fr 1fr' }}>
             <input placeholder="Nome da Instituição" value={newForm.institution} onChange={e => setNewForm({...newForm, institution: e.target.value})} required style={{ gridColumn: '1 / 3', padding: '8px' }} />
             <input placeholder="País (Ex: Portugal)" value={newForm.country} onChange={e => setNewForm({...newForm, country: e.target.value})} required style={{ padding: '8px' }} />
             <input placeholder="Código Erasmus" value={newForm.erasmusCode} onChange={e => setNewForm({...newForm, erasmusCode: e.target.value})} style={{ padding: '8px' }} />
             <input placeholder="Área (Ex: Tecnologia)" value={newForm.areas} onChange={e => setNewForm({...newForm, areas: e.target.value})} style={{ padding: '8px' }} />
             <input placeholder="Website URL" value={newForm.website} onChange={e => setNewForm({...newForm, website: e.target.value})} style={{ padding: '8px' }} />
             <button type="submit" className="btn-primary" style={{ gridColumn: '1 / 3', marginTop:'10px' }}>Salvar</button>
          </form>
        </div>
      )}

      {/* Tabela de Dados */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {data.length === 0 && <p style={{textAlign:'center', color:'#888'}}>Nenhuma parceria encontrada.</p>}

        {data.map(p => (
          <div key={p.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', display:'flex', alignItems:'center', gap:'10px' }}>
                {p.institution}
                {p.website && (
                  <a href={p.website} target="_blank" className="btn-icon" title="Visitar site">
                    <FaExternalLinkAlt />
                  </a>
                )}
              </h3>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {p.country} | Código: {p.erasmusCode} | Área: {p.areas}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.85em' }}>
                <strong>Vagas Estudos:</strong> {p.studentsStudyCount || '0'} ({p.studentsStudyMonths || '0'} meses) <br/>
                <strong>Vagas Estágios:</strong> {p.studentsInternshipCount || '0'}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'5px', alignItems:'flex-end' }}>
                {p.blendedIntensive && (
                <span style={{ background: 'var(--isla-blue)', color:'white', padding:'2px 8px', borderRadius:'4px', fontSize:'10px' }}>BIP</span>
                )}
                
                {/* Botão DELETE (Só Admin) */}
                {user.user === 'grim' && (
                    <button 
                        onClick={() => handleDelete(p.id)} 
                        style={{ border:'none', background:'transparent', color:'red', cursor:'pointer', marginTop:'10px' }}
                        title="Apagar Parceria"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}