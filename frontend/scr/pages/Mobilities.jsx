import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { FaTrash, FaPlus, FaTimes, FaEdit, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

export default function Mobilities({ user }) {
  const [data, setData] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado dos filtros (inicial)
  const [filters, setFilters] = useState({ 
    country: '',
    school: '',
    studyLong: false,
    studyShort: false,
    internship: false,
    teaching: false,
    training: false,
    direction: '',
    status: ''
  });

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

  // LÓGICA DE BUSCA COM TODOS OS PARÂMETROS
  const fetchMobilities = () => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.school) params.append('school', filters.school);
    if (filters.studyLong) params.append('studyLong', 'true');
    if (filters.studyShort) params.append('studyShort', 'true');
    if (filters.internship) params.append('internship', 'true');
    if (filters.teaching) params.append('teaching', 'true');
    if (filters.training) params.append('training', 'true');
    if (filters.direction) params.append('direction', filters.direction);
    if (filters.status) params.append('status', filters.status);
    
    api.get(`/mobilities?${params.toString()}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Erro ao buscar:", err));
  };

  useEffect(fetchMobilities, [filters]);

  // Buscar parcerias para os dropdowns
  useEffect(() => {
    api.get('/partnerships')
      .then(res => setPartnerships(res.data))
      .catch(err => console.error("Erro ao buscar parcerias:", err));
  }, []);

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

  // Lógica para Editar (PUT)
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/mobilities/${editingId}`, formData);
      alert("Mobilidade atualizada com sucesso!");
      setEditingId(null);
      setFormData(initialFormState); // Limpa o formulário
      fetchMobilities(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao atualizar: " + (error.response?.data?.error || "Erro desconhecido"));
      console.error(error);
    }
  };

  // Extrair países únicos dos dados
  const uniqueCountries = [...new Set(data.map(m => m.country))].sort();

  // Extrair países únicos das parcerias para o formulário
  const partnershipCountries = [...new Set(partnerships.map(p => p.country))].sort();

  // Filtrar instituições pelo país selecionado no formulário
  const getInstitutionsByCountry = (country) => {
    if (!country) return [];
    return partnerships
      .filter(p => p.country === country)
      .map(p => p.institution)
      .sort();
  };

  // Função para determinar qual universidade exibir baseado na direção
  const getDisplayedInstitution = (mobility) => {
    return mobility.direction === 'OUT' ? mobility.receivingInstitution : mobility.sendingInstitution;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--isla-blue)', margin: 0 }}>Gestão de Mobilidades</h1>
        
        {/* Botão de abrir formulário (Só Admin) */}
        {user.user === 'grim' && !showForm && editingId === null && (
          <button className="btn-primary" onClick={() => setShowForm(true)} style={{ padding: '12px 20px', fontSize: '1rem' }}>
             <FaPlus /> Nova Mobilidade
          </button>
        )}
      </div>

      {/* ÁREA DE FILTROS (GRID DE ALTO CONTRASTE) */}
      <div className="card" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.1fr 1.1fr 1.6fr 0.6fr 0.6fr',
          gap: '20px', 
          backgroundColor: '#fff',
          borderLeft: '5px solid var(--isla-yellow)',
          marginBottom: '20px' 
      }}>
        {/* Coluna Dropdown País */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>País</label>
          <select 
            value={filters.country}
            onChange={e => setFilters({...filters, country: e.target.value})} 
            style={{ padding: '12px 40px 12px 16px', borderRadius: '4px', border: '2px solid var(--isla-blue)', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.95rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23004876%27 stroke-width=%272%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '24px' }}
          >
            <option value="">Todos os Países</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Coluna Dropdown Escola Superior */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>Escola Superior</label>
          <select 
            value={filters.school}
            onChange={e => setFilters({...filters, school: e.target.value})} 
            style={{ padding: '12px 40px 12px 16px', borderRadius: '4px', border: '2px solid var(--isla-blue)', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.95rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23004876%27 stroke-width=%272%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '24px' }}
          >
            <option value="">Todas as Escolas</option>
            <option value="GESTAO">Gestão</option>
            <option value="TECNOLOGIA">Tecnologia</option>
          </select>
        </div>

        {/* Colunas Tipo de Mobilidade juntas */}
        <div style={{ display: 'flex', gap: '0px' }}>
          {/* Coluna Checkboxes Tipo de Mobilidade */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '500', flex: 1, paddingRight: '8px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', marginBottom: '0px', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>Tipo de Mobilidade</label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={filters.studyLong} onChange={e => setFilters({...filters, studyLong: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
              Estudos (Longa Duração)
            </label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={filters.studyShort} onChange={e => setFilters({...filters, studyShort: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
              Estudos (Curta Duração)
            </label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={filters.internship} onChange={e => setFilters({...filters, internship: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
              Estágios
            </label>
          </div>

          {/* Coluna Checkboxes Ensino/Formação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '500', flex: 1 }}>
            <div style={{ height: 'calc(0.95rem * 1.2 + 6px)' }}></div>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={filters.teaching} onChange={e => setFilters({...filters, teaching: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
              Ensino (Docentes)
            </label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={filters.training} onChange={e => setFilters({...filters, training: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
              Formação (Docentes e Colaboradores)
            </label>
          </div>
        </div>

        {/* Coluna Filtro Direção */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', fontWeight: '500' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>Direção</label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.direction === 'IN'} onChange={e => setFilters({...filters, direction: e.target.checked ? 'IN' : ''})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            IN
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.direction === 'OUT'} onChange={e => setFilters({...filters, direction: e.target.checked ? 'OUT' : ''})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            OUT
          </label>
        </div>

        {/* Coluna Filtro de Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', fontWeight: '500' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>Status</label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.status === 'PLANNED'} onChange={e => setFilters({...filters, status: e.target.checked ? 'PLANNED' : ''})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            Planeado
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.status === 'ONGOING'} onChange={e => setFilters({...filters, status: e.target.checked ? 'ONGOING' : ''})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            Em Andamento
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.status === 'COMPLETED'} onChange={e => setFilters({...filters, status: e.target.checked ? 'COMPLETED' : ''})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            Concluído
          </label>
        </div>
      </div>

      {/* FORMULÁRIO DE CRIAÇÃO */}
      {showForm && (
        <div className="card" style={{ backgroundColor: '#f0f8ff', borderLeft: '5px solid var(--isla-blue)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <h3 style={{ margin: 0 }}>Nova Mobilidade</h3>
            <button onClick={() => { setShowForm(false); setFormData(initialFormState); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} onMouseEnter={(e) => e.target.style.background = '#e0e0e0'} onMouseLeave={(e) => e.target.style.background = 'transparent'}><FaTimes /></button>
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
            <select 
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value, receivingInstitution: ''})}
                style={{ padding: '8px' }}
                required
            >
                <option value="">Selecione o País</option>
                {partnershipCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                ))}
            </select>

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

            {/* Linha 5 - Instituição e Datas */}
            <select 
                value={formData.receivingInstitution} 
                onChange={e => setFormData({...formData, receivingInstitution: e.target.value})}
                style={{ gridColumn: '1 / 3', padding: '8px' }}
                required
                disabled={!formData.country}
            >
                <option value="">Selecione a Instituição Parceira</option>
                {getInstitutionsByCountry(formData.country).map(institution => (
                    <option key={institution} value={institution}>{institution}</option>
                ))}
            </select>
            
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

      {/* FORMULÁRIO DE EDIÇÃO */}
      {editingId !== null && (
        <div className="card" style={{ backgroundColor: '#f0f8ff', borderLeft: '5px solid var(--isla-blue)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <h3 style={{ margin: 0 }}>Editar Mobilidade</h3>
            <button onClick={() => { setEditingId(null); setFormData(initialFormState); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} onMouseEnter={(e) => e.target.style.background = '#e0e0e0'} onMouseLeave={(e) => e.target.style.background = 'transparent'}><FaTimes /></button>
          </div>
          
          <form onSubmit={handleEdit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
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
            <select 
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value, receivingInstitution: ''})}
                style={{ padding: '8px' }}
                required
            >
                <option value="">Selecione o País</option>
                {partnershipCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                ))}
            </select>

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

            {/* Linha 5 - Instituição e Datas */}
            <select 
                value={formData.receivingInstitution} 
                onChange={e => setFormData({...formData, receivingInstitution: e.target.value})}
                style={{ gridColumn: '1 / 3', padding: '8px' }}
                required
                disabled={!formData.country}
            >
                <option value="">Selecione a Instituição Parceira</option>
                {getInstitutionsByCountry(formData.country).map(institution => (
                    <option key={institution} value={institution}>{institution}</option>
                ))}
            </select>
            
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
                Atualizar Registo
            </button>
          </form>
        </div>
      )}

      {/* LISTAGEM */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
        {data.length === 0 && <p style={{textAlign:'center', color:'#888'}}>Nenhuma mobilidade encontrada.</p>}
        
        {data.map(m => (
          <div key={m.id} className="card" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: '1050px', width: '100%' }}>
            
            {/* Informações principais - esquerda */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ fontSize: '1.1em' }}>{m.candidateFirstName} {m.candidateLastName}</strong>
                <span style={{ fontSize: '0.8em', color:'#666', display: 'block' }}>{m.candidateEmail}</span>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '5px' }}><strong>{m.school}</strong></div>
                <div style={{ color: '#555', fontSize: '0.9em' }}>{m.type} ({m.role})</div>
              </div>
              
              <div style={{ fontSize: '0.9em' }}>
                <div style={{ marginBottom: '3px' }}><strong>{getDisplayedInstitution(m)}</strong></div>
                <div style={{ color: '#555' }}>{m.country}</div>
              </div>
            </div>

            {/* Botões, Status/Direction, Datas - direita */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginLeft: '20px' }}>
                {/* Botões de Ação no topo (Só Admin) */}
                {user.user === 'grim' && (
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button 
                            onClick={() => { 
                              setEditingId(m.id); 
                              setFormData({
                                candidateFirstName: m.candidateFirstName,
                                candidateLastName: m.candidateLastName,
                                candidateEmail: m.candidateEmail,
                                direction: m.direction,
                                role: m.role,
                                type: m.type,
                                school: m.school,
                                country: m.country,
                                receivingInstitution: m.receivingInstitution,
                                status: m.status,
                                startDate: m.startDate ? m.startDate.split('T')[0] : '',
                                endDate: m.endDate ? m.endDate.split('T')[0] : ''
                              });
                            }} 
                            style={{ border:'none', background:'transparent', color:'#4CAF50', cursor:'pointer', padding: '6px 8px', borderRadius: '4px', fontSize: '1.1rem' }}
                            title="Editar mobilidade"
                        >
                            <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(m.id)} style={{ border:'none', background:'transparent', color:'#ff4444', cursor:'pointer', padding: '6px 8px', borderRadius: '4px', fontSize: '1.1rem' }} title="Apagar mobilidade">
                            <FaTrash />
                        </button>
                    </div>
                )}

                {/* IN/OUT em cima, Status embaixo - centralizados */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {/* IN/OUT com ícone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: m.direction === 'OUT' ? '3px' : '6px', fontSize: '1.5em', color: 'var(--isla-blue)' }}>
                    {m.direction === 'OUT' ? (
                      <>
                        <span style={{ fontSize: '0.67em', fontWeight: 'bold', lineHeight: '1' }}>OUT</span>
                        <FaSignOutAlt />
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '0.67em', fontWeight: 'bold', lineHeight: '1' }}>IN</span>
                        <FaSignInAlt />
                      </>
                    )}
                  </div>

                  {/* Badge de Status */}
                  <span style={{ 
                      fontSize: '11px', padding: '4px 10px', borderRadius: '10px', color: 'white',
                      backgroundColor: m.status === 'COMPLETED' ? 'green' : (m.status === 'ONGOING' ? 'orange' : '#888'),
                      fontWeight: 'bold'
                  }}>
                      {m.status}
                  </span>
                </div>

                {/* Datas */}
                <div style={{ fontSize: '0.85em', color: '#666', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <div><strong>Início:</strong> {m.startDate ? new Date(m.startDate).toLocaleDateString('pt-PT') : 'N/A'}</div>
                  <div><strong>Fim:</strong> {m.endDate ? new Date(m.endDate).toLocaleDateString('pt-PT') : 'N/A'}</div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
