import React, { createContext, useState, useEffect } from 'react';
import { Clock, Users, Cpu, Activity } from 'lucide-react';

export const TicketContext = createContext();

const initialTickets = [
  { id: 'TKT-8902', category: 'Base de Datos', subject: 'Tiempo de espera agotado en base de datos', user: 'j.doe@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 98, time: new Date(Date.now() - 10*60000) },
  { id: 'TKT-8901', category: 'Accesos', subject: 'No puedo acceder a la wiki interna', user: 'm.smith@empresa.com', status: 'Abierto', priority: 'Media', aiScore: 45, time: new Date(Date.now() - 25*60000) },
  { id: 'TKT-8900', category: 'Software', subject: 'Solicitud de nueva licencia de software', user: 'a.johnson@empresa.com', status: 'Pendiente', priority: 'Baja', aiScore: 12, time: new Date(Date.now() - 60*60000) },
  { id: 'TKT-8899', category: 'Redes', subject: 'Puerta de enlace VPN inalcanzable', user: 's.lee@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 95, time: new Date(Date.now() - 120*60000) },
  { id: 'TKT-8898', category: 'Hardware', subject: 'Laptop no enciende tras actualización', user: 'p.gomez@empresa.com', status: 'Escalado', priority: 'Crítica', aiScore: 99, time: new Date(Date.now() - 180*60000) },
  { id: 'TKT-8897', category: 'Accesos', subject: 'Restablecimiento de contraseña de correo', user: 'l.torres@empresa.com', status: 'Cerrado', priority: 'Media', aiScore: 85, time: new Date(Date.now() - 240*60000) },
  { id: 'TKT-8896', category: 'Software', subject: 'Error 500 en el portal de facturación', user: 'c.ruiz@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 92, time: new Date(Date.now() - 30*60000) },
  { id: 'TKT-8895', category: 'Redes', subject: 'Wi-Fi intermitente en la oficina central', user: 'h.martinez@empresa.com', status: 'Pendiente', priority: 'Media', aiScore: 40, time: new Date(Date.now() - 400*60000) },
  { id: 'TKT-8894', category: 'Hardware', subject: 'Impresora atascada en el piso 3', user: 'd.garcia@empresa.com', status: 'Cerrado', priority: 'Baja', aiScore: 15, time: new Date(Date.now() - 1440*60000) },
  { id: 'TKT-8893', category: 'Accesos', subject: 'Permisos insuficientes para carpeta compartida', user: 'm.lopez@empresa.com', status: 'Abierto', priority: 'Media', aiScore: 65, time: new Date(Date.now() - 50*60000) },
  { id: 'TKT-8892', category: 'Software', subject: 'Aplicación de nómina se cierra inesperadamente', user: 'f.herrera@empresa.com', status: 'Escalado', priority: 'Crítica', aiScore: 97, time: new Date(Date.now() - 150*60000) },
  { id: 'TKT-8891', category: 'Base de Datos', subject: 'Lentitud extrema en consultas de reportes', user: 'e.diaz@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 88, time: new Date(Date.now() - 80*60000) },
  { id: 'TKT-8890', category: 'Redes', subject: 'No hay conexión a internet en sala de juntas', user: 'a.navarro@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 94, time: new Date(Date.now() - 20*60000) },
  { id: 'TKT-8889', category: 'Hardware', subject: 'Monitor parpadea constantemente', user: 'v.castro@empresa.com', status: 'Pendiente', priority: 'Baja', aiScore: 20, time: new Date(Date.now() - 300*60000) },
  { id: 'TKT-8888', category: 'Software', subject: 'Licencia de Office caducada', user: 'j.rodriguez@empresa.com', status: 'Abierto', priority: 'Media', aiScore: 50, time: new Date(Date.now() - 15*60000) },
  { id: 'TKT-8887', category: 'Redes', subject: 'Microcortes en la conexión ethernet', user: 'a.silva@empresa.com', status: 'Pendiente', priority: 'Alta', aiScore: 82, time: new Date(Date.now() - 250*60000) },
  { id: 'TKT-8886', category: 'Accesos', subject: 'Desbloqueo de cuenta de usuario', user: 'm.morales@empresa.com', status: 'Cerrado', priority: 'Alta', aiScore: 90, time: new Date(Date.now() - 2800*60000) },
  { id: 'TKT-8885', category: 'Hardware', subject: 'Teclado con teclas atascadas', user: 'l.fernandez@empresa.com', status: 'Cerrado', priority: 'Baja', aiScore: 10, time: new Date(Date.now() - 4000*60000) },
  { id: 'TKT-8884', category: 'Base de Datos', subject: 'Error de integridad referencial en tabla de clientes', user: 'k.ortiz@empresa.com', status: 'Escalado', priority: 'Crítica', aiScore: 99, time: new Date(Date.now() - 45*60000) },
  { id: 'TKT-8883', category: 'General', subject: 'Duda sobre política de vacaciones', user: 'p.castillo@empresa.com', status: 'Cerrado', priority: 'Baja', aiScore: 5, time: new Date(Date.now() - 5000*60000) },
  { id: 'TKT-8882', category: 'Software', subject: 'Adobe Illustrator no guarda archivos', user: 'r.vega@empresa.com', status: 'Abierto', priority: 'Media', aiScore: 55, time: new Date(Date.now() - 65*60000) },
  { id: 'TKT-8881', category: 'Accesos', subject: 'Creación de credenciales para nuevo ingreso', user: 't.rios@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 80, time: new Date(Date.now() - 12*60000) },
  { id: 'TKT-8880', category: 'Redes', subject: 'Latencia alta hacia el servidor de archivos', user: 'n.iglesias@empresa.com', status: 'Pendiente', priority: 'Media', aiScore: 48, time: new Date(Date.now() - 210*60000) },
  { id: 'TKT-8879', category: 'Hardware', subject: 'Reemplazo de batería de UPS', user: 'g.soto@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 89, time: new Date(Date.now() - 95*60000) },
  { id: 'TKT-8878', category: 'Software', subject: 'Zoom se queda congelado al compartir pantalla', user: 'y.mendoza@empresa.com', status: 'Abierto', priority: 'Media', aiScore: 35, time: new Date(Date.now() - 25*60000) },
  { id: 'TKT-8877', category: 'General', subject: 'Solicitud de silla ergonómica', user: 'w.cruz@empresa.com', status: 'Pendiente', priority: 'Baja', aiScore: 8, time: new Date(Date.now() - 1100*60000) },
  { id: 'TKT-8876', category: 'Base de Datos', subject: 'Backup nocturno fallido', user: 's.reyes@empresa.com', status: 'Escalado', priority: 'Crítica', aiScore: 98, time: new Date(Date.now() - 600*60000) },
  { id: 'TKT-8875', category: 'Accesos', subject: 'Revocar acceso a ex-empleado urgente', user: 'f.guzman@empresa.com', status: 'Abierto', priority: 'Crítica', aiScore: 100, time: new Date(Date.now() - 5*60000) },
  { id: 'TKT-8874', category: 'Hardware', subject: 'Proyector de la sala A no enciende', user: 'j.vargas@empresa.com', status: 'Abierto', priority: 'Alta', aiScore: 70, time: new Date(Date.now() - 30*60000) },
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
      category: ticket.category || 'General',
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
