import React, { createContext, useState, useEffect } from 'react';
import { Clock, Users, Cpu, Activity } from 'lucide-react';

export const TicketContext = createContext();

const initialTickets = [
  { id: 'TKT-8902', subject: 'Tiempo de espera agotado en base de datos', user: 'j.doe@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 98, time: new Date(Date.now() - 10*60000) },
  { id: 'TKT-8901', subject: 'No puedo acceder a la wiki interna', user: 'm.smith@empresa.com', status: 'Abierto', priority: 'Media', aiScore: 45, time: new Date(Date.now() - 25*60000) },
  { id: 'TKT-8900', subject: 'Solicitud de nueva licencia de software', user: 'a.johnson@empresa.com', status: 'Pendiente', priority: 'Baja', aiScore: 12, time: new Date(Date.now() - 60*60000) },
  { id: 'TKT-8899', subject: 'Puerta de enlace VPN inalcanzable', user: 's.lee@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 95, time: new Date(Date.now() - 120*60000) },
];

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(initialTickets);
  const [toasts, setToasts] = useState([]);
  
  // Theme Management
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Settings Management
  const [settings, setSettings] = useState({
    notifications: true,
    autoAssign: false,
    language: 'es'
  });
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Ajustes guardados correctamente', 'success');
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Abierto',
      time: new Date()
    };
    setTickets(prev => [newTicket, ...prev]);
    if (settings.notifications) {
      showToast(`Ticket ${newTicket.id} creado exitosamente.`, 'success');
    }
    return newTicket.id;
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (settings.notifications) {
      showToast(`Ticket ${id} marcado como ${newStatus}.`, 'info');
    }
  };

  const deleteTicket = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    showToast(`Ticket ${id} eliminado permanentemente.`, 'info');
  };

  // SLA and Escalation Logic
  const slaAlertsCount = tickets.filter(t => t.status === 'Abierto' && (new Date() - new Date(t.time)) > 60*60000).length;

  const escalateCriticalTickets = () => {
    let escalatedCount = 0;
    setTickets(prev => {
      return prev.map(t => {
        if (t.priority === 'Alta' && t.status === 'Abierto') {
          escalatedCount++;
          return { ...t, status: 'Escalado', priority: 'Crítica' };
        }
        return t;
      });
    });
    
    // We use a timeout to ensure state is updated before showing toast, 
    // or just rely on the counter.
    setTimeout(() => {
      if (escalatedCount > 0) {
        showToast(`${escalatedCount} tickets críticos han sido escalados.`, 'success');
      } else {
        showToast('No hay tickets críticos abiertos para escalar.', 'info');
      }
    }, 100);
  };

  const pendingCount = tickets.filter(t => t.status === 'Abierto' || t.status === 'Pendiente' || t.status === 'Escalado').length;
  
  const metrics = [
    { id: 1, title: 'Tickets Pendientes', value: pendingCount.toString(), change: pendingCount > 3 ? '+12%' : '-2%', color: 'var(--accent-cyan)', icon: <Activity size={20} /> },
    { id: 2, title: 'SLA Promedio', value: '1.2 hrs', change: '-5%', color: 'var(--accent-violet)', icon: <Clock size={20} /> },
    { id: 3, title: 'Agentes Activos', value: '24/30', change: '80%', color: '#10B981', icon: <Users size={20} /> },
    { id: 4, title: 'Automatización IA', value: '68%', change: '+3%', color: '#F59E0B', icon: <Cpu size={20} /> },
  ];

  return (
    <TicketContext.Provider value={{ 
      tickets, addTicket, updateTicketStatus, deleteTicket, metrics, showToast,
      theme, toggleTheme, settings, updateSettings, slaAlertsCount, escalateCriticalTickets
    }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, left: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ 
            background: 'var(--bg-tertiary)', 
            color: 'var(--text-primary)', 
            padding: '12px 20px', 
            borderRadius: '8px', 
            borderLeft: `4px solid ${t.type === 'success' ? '#10B981' : 'var(--accent-cyan)'}`, 
            boxShadow: 'var(--glass-shadow)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            animation: 'slideInUp 0.3s ease'
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </TicketContext.Provider>
  );
};
