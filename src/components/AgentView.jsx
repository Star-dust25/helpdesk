import React, { useState, useRef, useEffect, useContext } from 'react';
import { Activity, Clock, Users, ShieldAlert, Cpu, AlertCircle, MoreVertical, Check, Trash2, X } from 'lucide-react';
import { TicketContext } from '../context/TicketContext';
import './AgentView.css';

const AgentView = () => {
  const { tickets, metrics, updateTicketStatus, deleteTicket, showToast, slaAlertsCount, escalateCriticalTickets } = useContext(TicketContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [slaFilterActive, setSlaFilterActive] = useState(false);
  const menuRef = useRef(null);

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'Crítica': return <span className="badge badge-high" style={{background: '#EF4444', color: '#FFF'}}>Crítica</span>;
      case 'Alta': return <span className="badge badge-high">Alta</span>;
      case 'Media': return <span className="badge badge-medium">Media</span>;
      case 'Baja': return <span className="badge badge-low">Baja</span>;
      default: return <span className="badge">Normal</span>;
    }
  };

  const getAiRecommendation = (score) => {
    if (score > 90) return <span className="badge badge-ai"><Cpu size={12} style={{marginRight: 4}}/> Auto-Triaje</span>;
    if (score > 40) return <span className="badge" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>Sugerido</span>;
    return <span className="badge" style={{background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>Manual</span>;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Abierto': return '#EF4444';
      case 'Pendiente': return '#F59E0B';
      case 'Escalado': return '#8A2BE2';
      case 'Cerrado': return '#10B981';
      default: return 'var(--text-primary)';
    }
  };

  let filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (slaFilterActive) {
    filteredTickets = filteredTickets.filter(t => t.status === 'Abierto' && (new Date() - new Date(t.time)) > 60*60000);
  }

  const formatTime = (dateObj) => {
    const diff = Math.floor((new Date() - new Date(dateObj)) / 60000);
    if (diff < 60) return `Hace ${diff}m`;
    const hours = Math.floor(diff / 60);
    return `Hace ${hours}h`;
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  return (
    <div className="agent-view animate-slide-up">
      <header className="view-header">
        <div className="header-content">
          <h1>Centro de Comando</h1>
          <p>Visión general en tiempo real de operaciones de soporte e incidentes priorizados por IA.</p>
        </div>
        <div className="header-actions desktop-only">
          <button 
            className={`btn ${slaFilterActive ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => {
              setSlaFilterActive(!slaFilterActive);
              if(!slaFilterActive && slaAlertsCount === 0) showToast('No hay alertas SLA activas.', 'info');
            }}
          >
            <AlertCircle size={16} /> Alertas SLA ({slaAlertsCount})
          </button>
          <button className="btn btn-primary" onClick={escalateCriticalTickets}>
            <ShieldAlert size={16} /> Escalar Críticos
          </button>
        </div>
      </header>

      <div className="metrics-grid">
        {metrics.map(metric => (
          <div key={metric.id} className="glass-card metric-card">
            <div className="metric-header">
              <div className="metric-icon" style={{ backgroundColor: `${metric.color}20`, color: metric.color }}>
                {metric.icon}
              </div>
              <span className={`metric-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {metric.change}
              </span>
            </div>
            <div className="metric-info">
              <h3 className="metric-title">{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel table-container">
        <div className="table-header">
          <h2>Cola de Incidentes Activos</h2>
          <div className="table-filters">
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Buscar tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline" onClick={() => { setSearchTerm(''); setSlaFilterActive(false); showToast('Filtros reiniciados'); }}>Limpiar Filtros</button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>ID Ticket</th>
                <th>Estado</th>
                <th>Asunto</th>
                <th>Solicitante</th>
                <th>Prioridad</th>
                <th>Triaje IA</th>
                <th>Tiempo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                <tr key={ticket.id} className="ticket-row" style={{ opacity: ticket.status === 'Cerrado' ? 0.6 : 1 }}>
                  <td className="ticket-id">{ticket.id}</td>
                  <td>
                    <span style={{ color: getStatusColor(ticket.status), fontWeight: 500, fontSize: '0.85rem' }}>
                      ● {ticket.status}
                    </span>
                  </td>
                  <td className="ticket-subject">{ticket.subject}</td>
                  <td className="ticket-user">{ticket.user}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>{getAiRecommendation(ticket.aiScore)}</td>
                  <td className="ticket-time">{formatTime(ticket.time)}</td>
                  <td className="ticket-action" style={{ position: 'relative' }}>
                    <button className="icon-btn" onClick={() => setOpenMenuId(openMenuId === ticket.id ? null : ticket.id)}>
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === ticket.id && (
                      <div className="action-menu" ref={menuRef}>
                        {ticket.status !== 'Cerrado' && (
                          <button onClick={() => { updateTicketStatus(ticket.id, 'Cerrado'); setOpenMenuId(null); }}>
                            <Check size={14} color="#10B981" /> Marcar Resuelto
                          </button>
                        )}
                        {ticket.status === 'Cerrado' && (
                          <button onClick={() => { updateTicketStatus(ticket.id, 'Abierto'); setOpenMenuId(null); }}>
                            <X size={14} color="#F59E0B" /> Reabrir Ticket
                          </button>
                        )}
                        <button onClick={() => { deleteTicket(ticket.id); setOpenMenuId(null); }} className="danger">
                          <Trash2 size={14} color="#EF4444" /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No se encontraron tickets con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentView;
