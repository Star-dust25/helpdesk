import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, LayoutDashboard, UserPlus, Settings, Headphones, Sun, Moon } from 'lucide-react';
import { TicketContext } from '../context/TicketContext';
import './Sidebar.css';

const Sidebar = () => {
  const { theme, toggleTheme } = useContext(TicketContext);
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Bot size={32} color="var(--accent-cyan)" />
        <h2 className="brand-title">Aegis<span>AI</span></h2>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-heading">Mesa de Ayuda</h3>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
            <UserPlus size={20} />
            <span>Crear Ticket (Cliente)</span>
          </NavLink>
          <NavLink to="/agente" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Panel de Agente</span>
          </NavLink>
        </div>
        
        <div className="nav-section desktop-only" style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={toggleTheme} style={{cursor: 'pointer'}}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>Tema {theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
          </div>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} />
            <span>Configuración</span>
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Headphones size={20} />
            <span>Soporte Técnico</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
