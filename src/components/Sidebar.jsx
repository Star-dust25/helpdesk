import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, LayoutDashboard, UserPlus, Settings, Headphones, Sun, Moon, Menu, X } from 'lucide-react';
import { TicketContext } from '../context/TicketContext';
import './Sidebar.css';

const Sidebar = () => {
  const { theme, toggleTheme } = useContext(TicketContext);
  const [isOpen, setIsOpen] = useState(false);
  
  const closeMenu = () => setIsOpen(false);
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-group">
          <Bot size={32} color="var(--accent-cyan)" />
          <h2 className="brand-title">Aegis<span>AI</span></h2>
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      <nav className={`sidebar-nav ${isOpen ? 'open' : ''}`}>
        <div className="nav-section">
          <h3 className="nav-heading">Mesa de Ayuda</h3>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu} end>
            <UserPlus size={20} />
            <span>Crear Ticket (Cliente)</span>
          </NavLink>
          <NavLink to="/agente" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
            <LayoutDashboard size={20} />
            <span>Panel de Agente</span>
          </NavLink>
        </div>
        
        <div className="nav-section" style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={() => { toggleTheme(); closeMenu(); }} style={{cursor: 'pointer'}}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>Tema {theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
          </div>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
            <Settings size={20} />
            <span>Configuración</span>
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMenu}>
            <Headphones size={20} />
            <span>Soporte Técnico</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
