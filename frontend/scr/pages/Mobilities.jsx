import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

export default function Mobilities({ user }) {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Estado inicial do formulário
  const initialFormState = {
    candidateFirstName: '',
    candidateLastName: '',
    candidateEmail: '',
    direction: 'OUT', // IN ou OUT
    role: 'STUDENT',  // STUDENT ou STAFF
    type: 'Estudos (longa-duração)',
    school: 'GESTAO',
    country: '',
    receivingInstitution: '',
    status: 'PLANNED',
    startDate: '',
    endDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Carregar dados ao iniciar
  useEffect(() => {
    fetchMobilities();
  }, []);

  const fetchMobilities = () => {
    api.get('/mobilities').then(res => setData(res.data));
  };

  // Lógica para apagar
  const handleDelete = async (id) => {
    if (!confirm("Tem a certeza que deseja apagar esta mobilidade?")) return;
    try {
      // O header x-user-username já vai automático pelo axios.js, 
      // mas se der erro de permissão, certifica-te que o user.user está correto
      await api.delete(`/mobilities/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      alert("Erro ao apagar: " + (error.response?.data?.error || "Erro desconhecido"));
    }
  };

  // Lógica para Criar (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mobilities', formData);
      alert("Mobilidade criada com sucesso!");
      setShowForm(false);
      setFormData(initialFormState); // Limpa o formulário
      fetchMobilities(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao criar: Verifique se preencheu todos os campos.");
      console.error(error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--isla-blue)', margin: 0 }}>Gestão de Mobilidades</h1>
        
        {/* Botão de abrir formulário (Só Admin) */}
        {user.user === 'grim' && !showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
             <FaPlus /> Nova Mobilidade
          </button>
        )}
      </div>

      {/* FORMULÁRIO DE CRIAÇÃO */}
      {showForm && (
        <div className="card" style={{ backgroundColor: '#f0f8ff', borderLeft: '5px solid var(--isla-blue)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
            <h3>Nova Mobilidade</h3>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><FaTimes /></button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
            {/* Linha 1 */}
            <select 
                value={formData.direction} 
                onChange={e => setFormData({...formData, direction: e.target.value})}
                style={{ padding: '8px' }}
            >
                <option value="IN">INCOMING (A receber)</option>
                <option value="OUT">OUTGOING (A enviar)</option>
            </select>

            <select 
                value={formData.school} 
                onChange={e => setFormData({...formData, school: e.target.value})}
                style={{ padding: '8px' }}
            >
                <option value="GESTAO">Escola de Gestão</option>
                <option value="TECNOLOGIA">Escola de Tecnologia</option>
            </select>

            {/* Linha 2 - Candidato */}
            <input placeholder="Primeiro Nome" required 
                value={formData.candidateFirstName} onChange={e => setFormData({...formData, candidateFirstName: e.target.value})} 
            />
            <input placeholder="Último Nome" required 
                value={formData.candidateLastName} onChange={e => setFormData({...formData, candidateLastName: e.target.value})} 
            />
            
            {/* Linha 3 - Email e País */}
            <input placeholder="Email" type="email" required 
                value={formData.candidateEmail} onChange={e => setFormData({...formData, candidateEmail: e.target.value})} 
            />
            <input placeholder="País da Instituição Parceira" required 
                value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} 
            />

            {/* Linha 4 - Papel e Tipo Dinâmico */}
            <select 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
                style={{ padding: '8px' }}
            >
                <option value="STUDENT">Estudante</option>
                <option value="STAFF">Staff / Docente</option>
            </select>

            <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                style={{ padding: '8px' }}
            >
                {formData.role === 'STUDENT' ? (
                    <>
                        <option value="Estudos (longa-duração)">Estudos (Longa Duração)</option>
                        <option value="Estudos (curta-duração)">Estudos (Curta Duração)</option>
                        <option value="Estágios">Estágios</option>
                    </>
                ) : (
                    <>
                        <option value="Ensino">Ensino</option>
                        <option value="Formação">Formação</option>
                    </>
                )}
            </select>

            {/* Linha 5 - Datas e Instituição */}
            <input placeholder="Instituição Parceira" required style={{ gridColumn: '1 / 3' }}
                value={formData.receivingInstitution} onChange={e => setFormData({...formData, receivingInstitution: e.target.value})}
            />
            
            <div>
                <label style={{fontSize:'12px', color:'#666'}}>Início:</label>
                <input type="date" required style={{width:'100%'}}
                    value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
            </div>
            <div>
                <label style={{fontSize:'12px', color:'#666'}}>Fim:</label>
                <input type="date" required style={{width:'100%'}}
                    value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
            </div>

            <button type="submit" className="btn-primary" style={{ gridColumn: '1 / 3', marginTop:'10px' }}>
                Salvar Registo
            </button>
          </form>
        </div>
      )}

      {/* LISTAGEM */}
      <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
        {data.length === 0 && <p style={{textAlign:'center', color:'#888'}}>Nenhuma mobilidade encontrada.</p>}
        
        {data.map(m => (
          <div key={m.id} className="card" style={{ position: 'relative' }}>
            
            {/* Badge de Status no topo */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                <span style={{ 
                    fontSize: '10px', padding: '3px 8px', borderRadius: '10px', color: 'white',
                    backgroundColor: m.status === 'COMPLETED' ? 'green' : (m.status === 'ONGOING' ? 'orange' : '#888')
                }}>
                    {m.status}
                </span>

                {/* Botão DELETE (Só Admin) */}
                {user.user === 'grim' && (
                    <button onClick={() => handleDelete(m.id)} style={{ border:'none', background:'transparent', color:'red', cursor:'pointer' }}>
                        <FaTrash />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '100px' }}>
               <div style={{ display:'flex', flexDirection:'column' }}>
                   <strong style={{ fontSize: '1.1em' }}>{m.candidateFirstName} {m.candidateLastName}</strong>
                   <span style={{ fontSize: '0.8em', color:'#666' }}>{m.candidateEmail}</span>
               </div>
               
               <div style={{ textAlign: 'right' }}>
                   <span style={{ fontWeight: 'bold', color: m.direction === 'IN' ? 'green' : 'var(--isla-blue)' }}>
                       {m.direction}
                   </span>
               </div>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }}/>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', fontSize:'0.9em' }}>
                <div>
                    <strong>{m.school}</strong><br/>
                    {m.type} ({m.role})
                </div>
                <div style={{ textAlign:'right' }}>
                    {m.receivingInstitution}<br/>
                    {m.country}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
