import React, { useContext } from 'react';
import { Save, Bell, Globe, Cpu } from 'lucide-react';
import { TicketContext } from '../context/TicketContext';
import './SettingsView.css';

const SettingsView = () => {
  const { settings, updateSettings, theme, toggleTheme } = useContext(TicketContext);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    updateSettings({ [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="settings-view animate-slide-up">
      <header className="view-header">
        <h1>Configuración de la Cuenta</h1>
        <p>Personaliza tus preferencias y el comportamiento de la plataforma.</p>
      </header>

      <div className="settings-container">
        <div className="glass-panel settings-card">
          <div className="settings-section">
            <div className="settings-icon"><Bell size={20} color="var(--accent-cyan)" /></div>
            <div className="settings-content">
              <h3>Notificaciones del Sistema</h3>
              <p>Recibir notificaciones flotantes de nuevos tickets y cambios de estado.</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-section">
            <div className="settings-icon"><Cpu size={20} color="var(--accent-violet)" /></div>
            <div className="settings-content">
              <h3>Asignación Automática de IA</h3>
              <p>Permitir que la Inteligencia Artificial asigne tickets a tu bandeja automáticamente.</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" name="autoAssign" checked={settings.autoAssign} onChange={handleChange} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-section">
            <div className="settings-icon"><Globe size={20} color="#10B981" /></div>
            <div className="settings-content">
              <h3>Idioma de la Interfaz</h3>
              <p>Elige tu idioma preferido para el panel de AegisAI.</p>
            </div>
            <select name="language" className="form-input settings-select" value={settings.language} onChange={handleChange}>
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
          
          <div className="settings-section" style={{ borderBottom: 'none' }}>
            <div className="settings-icon">
              {theme === 'dark' ? <span style={{fontSize: 20}}>🌙</span> : <span style={{fontSize: 20}}>☀️</span>}
            </div>
            <div className="settings-content">
              <h3>Apariencia</h3>
              <p>Alternar entre modo claro y modo oscuro.</p>
            </div>
            <button className="btn btn-outline" onClick={toggleTheme}>
              Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
