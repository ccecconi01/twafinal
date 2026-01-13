import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { FaExternalLinkAlt, FaTrash, FaPlus, FaTimes, FaEdit } from 'react-icons/fa'; 

export default function Partnerships({ user }) {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado dos filtros (inicial)
  const [filters, setFilters] = useState({ 
    country: '', 
    area: '', 
    blended: false,
    study: false,
    internship: false,
    teaching: false,
    training: false 
  });

  // Estado para o formulário de nova parceria
  const initialFormState = { 
    institution: '', 
    country: '', 
    website: '', 
    areas: [],
    erasmusCode: '',
    studentsStudyCount: '',
    studentsInternshipCount: '',
    staffTeachingCount: '',
    staffTrainingCount: '',
    blendedIntensive: false
  };
  const [newForm, setNewForm] = useState(initialFormState);
  const [showNewCountryModal, setShowNewCountryModal] = useState(false);
  const [newCountryInput, setNewCountryInput] = useState('');
  const [showNewAreaModal, setShowNewAreaModal] = useState(false);
  const [newAreaCode, setNewAreaCode] = useState('');
  const [newAreaLabel, setNewAreaLabel] = useState('');

  // Áreas predefinidas com suas descrições
  const areasOptions = [
    { code: 'GE', label: 'GE=Gestão' },
    { code: 'RH', label: 'RH=Gestão de Recursos Humanos' },
    { code: 'GT', label: 'GT=Gestão do Turismo' },
    { code: 'EI', label: 'EI=Engenharia Informática' },
    { code: 'EST', label: 'EST=Engenharia da Segurança do Trabalho' },
    { code: 'MM', label: 'MM=Multimédia' }
  ];

  // LÓGICA DE BUSCA COM TODOS OS PARÂMETROS
  const fetchPartnerships = () => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.area) params.append('area', filters.area);
    if (filters.blended) params.append('blended', 'true');
    if (filters.study) params.append('study', 'true');
    if (filters.internship) params.append('internship', 'true');
    if (filters.teaching) params.append('teaching', 'true');
    if (filters.training) params.append('training', 'true');
    
    api.get(`/partnerships?${params.toString()}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Erro ao buscar:", err));
  };

  useEffect(fetchPartnerships, [filters]);

  // Extrair países e áreas únicos dos dados
  const uniqueCountries = [...new Set(data.map(p => p.country))].sort();
  const uniqueAreas = [...new Set(data.flatMap(p => p.areas?.split(' - ').map(a => a.trim())).filter(Boolean))].sort();

  // Adicionar novo país
  const handleAddNewCountry = () => {
    if (!newCountryInput.trim()) {
      alert("Por favor, digite o nome do país");
      return;
    }
    setNewForm({...newForm, country: newCountryInput});
    setNewCountryInput('');
    setShowNewCountryModal(false);
  };

  // Adicionar nova área
  const handleAddNewArea = () => {
    if (!newAreaCode.trim() || !newAreaLabel.trim()) {
      alert("Por favor, preencha o código e descrição da área");
      return;
    }
    // Adicionar à lista de opções e ao formulário
    const newAreaOption = { code: newAreaCode.toUpperCase(), label: `${newAreaCode.toUpperCase()}=${newAreaLabel}` };
    if (!areasOptions.some(a => a.code === newAreaOption.code)) {
      areasOptions.push(newAreaOption);
    }
    if (!newForm.areas.includes(newAreaOption.code)) {
      setNewForm({...newForm, areas: [...newForm.areas, newAreaOption.code]});
    }
    setNewAreaCode('');
    setNewAreaLabel('');
    setShowNewAreaModal(false);
  };

  // FUNÇAO CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...newForm,
        areas: newForm.areas.join(' - ')
      };
      await api.post('/partnerships', dataToSend);
      alert("Parceria criada com sucesso!");
      setShowForm(false);
      setNewForm(initialFormState);
      fetchPartnerships();
    } catch (error) {
      alert("Erro ao criar: " + (error.response?.data?.error || "Verifique os dados"));
    }
  };

  // FUNÇÃO EDIT
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...newForm,
        areas: newForm.areas.join(' - ')
      };
      await api.put(`/partnerships/${editingId}`, dataToSend);
      alert("Parceria atualizada com sucesso!");
      setEditingId(null);
      setNewForm(initialFormState);
      fetchPartnerships();
    } catch (error) {
      alert("Erro ao atualizar: " + (error.response?.data?.error || "Verifique os dados"));
    }
  };

  // FUNÇÃO DELETE
  const handleDelete = async (id) => {
      if (!confirm("Atenção: Apagar uma parceria pode afetar dados históricos. Confirmar?")) return;
      try {
          await api.delete(`/partnerships/${id}`);
          setData(data.filter(item => item.id !== id));
      } catch (error) {
          alert("Erro ao apagar. Verifique se é admin.");
      }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--isla-blue)', margin: 0 }}>Parcerias Internacionais</h1>
        
        {user.user === 'grim' && !showForm && editingId === null && (
           <button className="btn-primary" onClick={() => setShowForm(true)} style={{ padding: '12px 20px', fontSize: '1rem' }}>
             <FaPlus /> Nova Parceria
           </button>
        )}
      </div>

      {/* ÁREA DE FILTROS (GRID DE ALTO CONTRASTE) */}
      <div className="card" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '15px', 
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

        {/* Coluna Dropdown Área */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>Área</label>
          <select 
            value={filters.area}
            onChange={e => setFilters({...filters, area: e.target.value})} 
            style={{ padding: '12px 40px 12px 16px', borderRadius: '4px', border: '2px solid var(--isla-blue)', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.95rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23004876%27 stroke-width=%272%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '24px' }}
          >
            <option value="">Todas as Áreas</option>
            {uniqueAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Coluna Checkboxes 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#333', marginBottom: '0px', textDecoration: 'underline', textDecorationColor: 'var(--isla-yellow)', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>Tipo de Mobilidade</label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.blended} onChange={e => setFilters({...filters, blended: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            Blended Mobility (BIP)
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.study} onChange={e => setFilters({...filters, study: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            Vagas de Estudos
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filters.internship} onChange={e => setFilters({...filters, internship: e.target.checked})} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} /> 
            Vagas de Estágio
          </label>
        </div>

        {/* Coluna Checkboxes 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
          <div style={{ height: '1.5rem' }}></div>
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

      {/* Formulário de Criação */}
      {showForm && (
        <div className="card" style={{ background: '#f9f9f9', borderLeft: '5px solid var(--isla-blue)', marginBottom: '20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: 'var(--isla-blue)' }}>Registar Nova Parceria</h3>
            <button onClick={() => { setShowForm(false); setNewForm(initialFormState); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} onMouseEnter={(e) => e.target.style.background = '#e0e0e0'} onMouseLeave={(e) => e.target.style.background = 'transparent'}><FaTimes /></button>
          </div>
          <form onSubmit={handleCreate} style={{ display:'grid', gap:'15px', gridTemplateColumns: '1fr 1fr' }}>
             <input placeholder="Nome da Instituição" value={newForm.institution} onChange={e => setNewForm({...newForm, institution: e.target.value})} required style={{ gridColumn: '1 / 3', padding: '10px' }} />
             
             {/* País com dropdown e Adicionar País */}
             <div style={{ display: 'flex', gap: '8px' }}>
               <select 
                 value={newForm.country} 
                 onChange={e => setNewForm({...newForm, country: e.target.value})}
                 style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
               >
                 <option value="">Selecione o País</option>
                 {uniqueCountries.map(country => (
                   <option key={country} value={country}>{country}</option>
                 ))}
               </select>
               <button 
                 type="button" 
                 onClick={() => setShowNewCountryModal(true)}
                 style={{ padding: '10px 15px', background: 'var(--isla-yellow)', color: 'var(--isla-blue)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
               >
                 Adicionar País
               </button>
             </div>
             
             <input placeholder="Código Erasmus (Ex: PL WARSZAW01)" value={newForm.erasmusCode} onChange={e => setNewForm({...newForm, erasmusCode: e.target.value})} style={{ padding: '10px' }} />
             
             {/* Áreas com checkboxes e Nova Área */}
             <div style={{ gridColumn: '1 / 3', display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <label style={{ fontWeight: 'bold', color: '#333' }}>Áreas</label>
                 <button 
                   type="button" 
                   onClick={() => setShowNewAreaModal(true)}
                   style={{ padding: '6px 12px', background: 'var(--isla-yellow)', color: 'var(--isla-blue)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                 >
                   Nova Área
                 </button>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                 {areasOptions.map(area => (
                   <label key={area.code} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                     <input 
                       type="checkbox" 
                       checked={newForm.areas.includes(area.code)}
                       onChange={e => {
                         if (e.target.checked) {
                           setNewForm({...newForm, areas: [...newForm.areas, area.code]});
                         } else {
                           setNewForm({...newForm, areas: newForm.areas.filter(a => a !== area.code)});
                         }
                       }}
                       style={{ transform: 'scale(1.1)', cursor: 'pointer' }}
                     />
                     {area.label}
                   </label>
                 ))}
               </div>
             </div>

             <input placeholder="Link Website" value={newForm.website} onChange={e => setNewForm({...newForm, website: e.target.value})} style={{ gridColumn: '1 / 3', padding: '10px' }} />
             
             {/* Campos de Vagas */}
             <input placeholder="Número de vagas para Estudos" type="number" value={newForm.studentsStudyCount} onChange={e => setNewForm({...newForm, studentsStudyCount: e.target.value})} style={{ padding: '10px' }} />
             <input placeholder="Número de vagas para Estágios" type="number" value={newForm.studentsInternshipCount} onChange={e => setNewForm({...newForm, studentsInternshipCount: e.target.value})} style={{ padding: '10px' }} />
             <input placeholder="Número de vagas para Ensino" type="number" value={newForm.staffTeachingCount} onChange={e => setNewForm({...newForm, staffTeachingCount: e.target.value})} style={{ padding: '10px' }} />
             <input placeholder="Número de vagas para Formação" type="number" value={newForm.staffTrainingCount} onChange={e => setNewForm({...newForm, staffTrainingCount: e.target.value})} style={{ padding: '10px' }} />
             
             <div style={{ gridColumn: '1 / 3', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
               * Campos em branco = N/A
             </div>

            {/* Blended Intensive - manter no fim para não confundir com áreas */}
            <label style={{ gridColumn: '1 / 3', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#333' }}>
              <input
                type="checkbox"
                checked={newForm.blendedIntensive}
                onChange={e => setNewForm({ ...newForm, blendedIntensive: e.target.checked })}
                style={{ transform: 'scale(1.1)', cursor: 'pointer' }}
              />
              Possui Blended Intensive (BIP)
            </label>
             
             <button type="submit" className="btn-primary" style={{ gridColumn: '1 / 3', padding: '12px' }}>Guardar Parceria</button>
          </form>
        </div>
      )}

      {/* Modal para Novo País */}
      {showNewCountryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', width: '400px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--isla-blue)' }}>Adicionar Novo País</h3>
            <input 
              type="text" 
              placeholder="Nome do país" 
              value={newCountryInput}
              onChange={e => setNewCountryInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px', boxSizing: 'border-box' }}
              onKeyPress={e => e.key === 'Enter' && handleAddNewCountry()}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleAddNewCountry}
                style={{ flex: 1, padding: '10px', background: 'var(--isla-blue)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Adicionar
              </button>
              <button 
                onClick={() => { setShowNewCountryModal(false); setNewCountryInput(''); }}
                style={{ flex: 1, padding: '10px', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Edição */}
      {editingId !== null && (
        <div className="card" style={{ background: '#f9f9f9', borderLeft: '5px solid var(--isla-blue)', marginBottom: '20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: 'var(--isla-blue)' }}>Editar Parceria</h3>
            <button onClick={() => { setEditingId(null); setNewForm(initialFormState); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} onMouseEnter={(e) => e.target.style.background = '#e0e0e0'} onMouseLeave={(e) => e.target.style.background = 'transparent'}><FaTimes /></button>
          </div>
          <form onSubmit={handleEdit} style={{ display:'grid', gap:'15px', gridTemplateColumns: '1fr 1fr' }}>
             <input placeholder="Nome da Instituição" value={newForm.institution} onChange={e => setNewForm({...newForm, institution: e.target.value})} required style={{ gridColumn: '1 / 3', padding: '10px' }} />
             
             {/* País com dropdown e Novo + */}
             <div style={{ display: 'flex', gap: '8px' }}>
               <select 
                 value={newForm.country} 
                 onChange={e => setNewForm({...newForm, country: e.target.value})}
                 style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
               >
                 <option value="">Selecione o País</option>
                 {uniqueCountries.map(country => (
                   <option key={country} value={country}>{country}</option>
                 ))}
                 {newForm.country && !uniqueCountries.includes(newForm.country) && (
                   <option value={newForm.country} selected>{newForm.country}</option>
                 )}
               </select>
               <button 
                 type="button" 
                 onClick={() => setShowNewCountryModal(true)}
                 style={{ padding: '10px 15px', background: 'var(--isla-yellow)', color: 'var(--isla-blue)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
               >
                 Adicionar País
               </button>
             </div>
             
             <input placeholder="Código Erasmus (Ex: PL WARSZAW01)" value={newForm.erasmusCode} onChange={e => setNewForm({...newForm, erasmusCode: e.target.value})} style={{ padding: '10px' }} />
             
             {/* Áreas com checkboxes */}
             <div style={{ gridColumn: '1 / 3', display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <label style={{ fontWeight: 'bold', color: '#333' }}>Áreas</label>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                 {areasOptions.map(area => (
                   <label key={area.code} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                     <input 
                       type="checkbox" 
                       checked={newForm.areas.includes(area.code)}
                       onChange={e => {
                         if (e.target.checked) {
                           setNewForm({...newForm, areas: [...newForm.areas, area.code]});
                         } else {
                           setNewForm({...newForm, areas: newForm.areas.filter(a => a !== area.code)});
                         }
                       }}
                       style={{ transform: 'scale(1.1)', cursor: 'pointer' }}
                     />
                     {area.label}
                   </label>
                 ))}
               </div>
             </div>

             <input placeholder="Link Website" value={newForm.website} onChange={e => setNewForm({...newForm, website: e.target.value})} style={{ gridColumn: '1 / 3', padding: '10px' }} />
             
             {/* Campos de Vagas */}
             <input placeholder="Número de vagas para Estudos" type="number" value={newForm.studentsStudyCount} onChange={e => setNewForm({...newForm, studentsStudyCount: e.target.value})} style={{ padding: '10px' }} />
             <input placeholder="Número de vagas para Estágios" type="number" value={newForm.studentsInternshipCount} onChange={e => setNewForm({...newForm, studentsInternshipCount: e.target.value})} style={{ padding: '10px' }} />
             <input placeholder="Número de vagas para Ensino" type="number" value={newForm.staffTeachingCount} onChange={e => setNewForm({...newForm, staffTeachingCount: e.target.value})} style={{ padding: '10px' }} />
             <input placeholder="Número de vagas para Formação" type="number" value={newForm.staffTrainingCount} onChange={e => setNewForm({...newForm, staffTrainingCount: e.target.value})} style={{ padding: '10px' }} />
             
             <div style={{ gridColumn: '1 / 3', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
               * Campos em branco = N/A
             </div>

            {/* Blended Intensive - manter no fim para não confundir com áreas */}
            <label style={{ gridColumn: '1 / 3', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#333' }}>
              <input
                type="checkbox"
                checked={newForm.blendedIntensive}
                onChange={e => setNewForm({ ...newForm, blendedIntensive: e.target.checked })}
                style={{ transform: 'scale(1.1)', cursor: 'pointer' }}
              />
              Possui Blended Intensive (BIP)
            </label>
             
             <button type="submit" className="btn-primary" style={{ gridColumn: '1 / 3', padding: '12px' }}>Atualizar Parceria</button>
          </form>
        </div>
      )}

      {/* Modal para Nova Área */}
      {showNewAreaModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', width: '400px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--isla-blue)' }}>Adicionar Nova Área</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Código (Ex: CE)</label>
              <input 
                type="text" 
                placeholder="Código da área" 
                value={newAreaCode}
                onChange={e => setNewAreaCode(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Descrição (Ex: Comercialização e Empreendedorismo)</label>
              <input 
                type="text" 
                placeholder="Descrição completa" 
                value={newAreaLabel}
                onChange={e => setNewAreaLabel(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleAddNewArea}
                style={{ flex: 1, padding: '10px', background: 'var(--isla-blue)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Adicionar
              </button>
              <button 
                onClick={() => { setShowNewAreaModal(false); setNewAreaCode(''); setNewAreaLabel(''); }}
                style={{ flex: 1, padding: '10px', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Dados */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {data.length === 0 && <p style={{textAlign:'center', color:'#888', padding: '20px'}}>Nenhuma parceria corresponde aos filtros selecionados.</p>}
        {data.map(p => (
          <div key={p.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', display:'flex', alignItems:'center', gap:'10px', color: 'var(--isla-blue)' }}>
                {p.institution}
                {p.website && (
                  <a href={p.website} target="_blank" rel="noreferrer" className="btn-icon">
                    <FaExternalLinkAlt size={14} />
                  </a>
                )}
              </h3>
              <div style={{ fontSize: '0.9em', color: '#555', fontWeight: 'bold' }}>
                {p.country} | <span style={{ color: '#888' }}>{p.erasmusCode}</span>
              </div>
              <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                Área: {p.areas}
              </div>
              
              <div style={{ marginTop: '12px', display: 'flex', gap: '20px', fontSize: '0.85em', borderTop: '1px solid #eee', paddingTop: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div><strong>Estudos:</strong> {p.studentsStudyCount || 'N/A'}</div>
                  <div><strong>Estágios:</strong> {p.studentsInternshipCount || 'N/A'}</div>
                  <div><strong>Ensino:</strong> {p.staffTeachingCount || 'N/A'}</div>
                  <div><strong>Formação:</strong> {p.staffTrainingCount || 'N/A'}</div>
                </div>
                {p.blendedIntensive && (
                  <span style={{ background: 'var(--isla-blue)', color:'white', padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>BIP / BLENDED</span>
                )}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-end' }}>
                {/* Botões de Ação (Só Admin) */}
                {user.user === 'grim' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => { 
                              setEditingId(p.id); 
                              setNewForm({ 
                                institution: p.institution, 
                                country: p.country, 
                                website: p.website, 
                                areas: p.areas ? p.areas.split(' - ') : [],
                                erasmusCode: p.erasmusCode,
                                studentsStudyCount: p.studentsStudyCount || '',
                                studentsInternshipCount: p.studentsInternshipCount || '',
                                staffTeachingCount: p.staffTeachingCount || '',
                                staffTrainingCount: p.staffTrainingCount || '',
                                blendedIntensive: !!p.blendedIntensive
                              }); 
                            }} 
                            style={{ border:'none', background:'transparent', color:'#4CAF50', cursor:'pointer', padding: '6px 8px', borderRadius: '4px', fontSize: '1.1rem' }}
                            title="Editar parceria"
                        >
                            <FaEdit />
                        </button>
                        <button 
                            onClick={() => handleDelete(p.id)} 
                            style={{ border:'none', background:'transparent', color:'#ff4444', cursor:'pointer', padding: '6px 8px', borderRadius: '4px', fontSize: '1.1rem' }}
                            title="Apagar parceria"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}