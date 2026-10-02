import React, { useState, useEffect, useContext } from 'react';
import { Send, Sparkles, CheckCircle, AlertTriangle, Loader2, Info, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { TicketContext } from '../context/TicketContext';
import './ClientView.css';

const ClientView = () => {
  const { addTicket, showToast } = useContext(TicketContext);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [lastTicketRef, setLastTicketRef] = useState('');

  // Simular análisis de la IA
  useEffect(() => {
    if (description.trim().length > 10) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        const lowerDesc = description.toLowerCase();
        
        if (lowerDesc.includes('contraseña') || lowerDesc.includes('login') || lowerDesc.includes('acceso')) {
          setAiSuggestion({
            type: 'solution',
            title: "Protocolo de Restablecimiento de Contraseña",
            content: "Parece que tienes problemas para iniciar sesión. ¿Has intentado usar nuestro portal automático de restablecimiento?",
            action: "Ir al Portal de Restablecimiento",
            confidence: 94
          });
        } else if (lowerDesc.includes('red') || lowerDesc.includes('vpn') || lowerDesc.includes('internet') || lowerDesc.includes('conexion')) {
          setAiSuggestion({
            type: 'solution',
            title: "Problema de Conectividad VPN Detectado",
            content: "Actualmente hay una degradación del 15% en los nodos VPN de la zona Este. Intenta conectarte al servidor Oeste.",
            action: "Ver Estado de la Red",
            confidence: 88
          });
        } else if (lowerDesc.includes('bug') || lowerDesc.includes('error') || lowerDesc.includes('fallo') || lowerDesc.includes('lento')) {
          setAiSuggestion({
            type: 'solution',
            title: "Coincidencia de Error de Aplicación",
            content: "Esto se asemeja a un problema conocido (ERR-092) con la última actualización. Limpiar el caché de tu navegador suele resolverlo.",
            action: "Cómo limpiar el caché",
            confidence: 76
          });
        } else {
          setAiSuggestion({
            type: 'generic',
            title: "Requiere Revisión Manual",
            content: "No se ha encontrado una solución automática o paso a paso para este problema. Envía el ticket y lo analizaremos de inmediato.",
            action: "Enviar Ticket Ahora",
            confidence: 42
          });
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setAiSuggestion(null);
      setIsTyping(false);
    }
  }, [description]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (subject && description) {
      let priority = 'Media';
      let aiScore = 45;
      
      const lowerDesc = description.toLowerCase();
      if (lowerDesc.includes('caída') || lowerDesc.includes('urgente') || lowerDesc.includes('red') || lowerDesc.includes('vpn')) {
         priority = 'Alta';
         aiScore = 95;
      } else if (lowerDesc.includes('contraseña') || lowerDesc.includes('licencia')) {
         priority = 'Baja';
         aiScore = 99;
      }
      
      const ticketId = addTicket({
        subject,
        user: 'cliente.actual@empresa.com',
        priority,
        aiScore
      });
      setLastTicketRef(ticketId);
      setTicketSubmitted(true);
    } else {
      showToast('Por favor, completa el asunto y la descripción.', 'info');
    }
  };

  const handleAiAction = () => {
    if (aiSuggestion.type === 'generic') {
      handleSubmit(); // Enviar ticket automáticamente
    } else {
      showToast('Abriendo enlace de auto-servicio recomendado...', 'success');
    }
  };

  const handleNotHelpful = () => {
    setAiSuggestion({
      type: 'generic',
      title: "Asistencia Automática Descartada",
      content: "Entendido. La solución automática no fue útil. Por favor envía tu ticket para asignarlo a un agente de Nivel 2.",
      action: "Enviar Ticket Manualmente",
      confidence: 10
    });
  };

  const downloadQR = () => {
    const canvas = document.getElementById('success-qr');
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${lastTicketRef}-QR.png`;
      downloadLink.click();
    }
  };

  if (ticketSubmitted) {
    return (
      <div className="client-view animate-slide-up">
        <div className="glass-panel success-panel">
          <CheckCircle size={64} color="var(--accent-cyan)" />
          <h2>Ticket Creado Exitosamente</h2>
          <p>Tu incidencia ha sido registrada. Nuestro agente de IA ya la ha pre-procesado para el próximo agente humano disponible.</p>
          <div className="ticket-ref">{lastTicketRef}</div>
          
          <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', display: 'inline-flex' }}>
              <QRCodeCanvas 
                id="success-qr" 
                value={`https://helpdesk-theta-one.vercel.app/?ticket=${lastTicketRef}`} 
                size={150} 
                level={"H"} 
              />
            </div>
          </div>

          <div className="success-actions">
            <button className="btn btn-primary" onClick={downloadQR}>
              <Download size={18} style={{marginRight: 8}}/> Descargar QR
            </button>
            <button className="btn btn-outline" onClick={() => {
              setTicketSubmitted(false);
              setSubject('');
              setDescription('');
              setAiSuggestion(null);
            }}>Crear Otro Ticket</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-view animate-slide-up">
      <header className="view-header">
        <h1>Crear Ticket de Soporte</h1>
        <p>Describe tu problema y nuestra IA intentará resolverlo al instante o lo derivará al especialista adecuado.</p>
      </header>

      <div className="form-container">
        <div className="form-column">
          <form className="glass-panel client-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="subject">Asunto del Problema</label>
              <input 
                type="text" 
                id="subject" 
                className="form-input" 
                placeholder="Ej., No puedo acceder al panel principal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="description">Descripción Detallada</label>
              <textarea 
                id="description" 
                className="form-textarea" 
                placeholder="Explica el problema en detalle. Nuestra IA lo analizará en tiempo real..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary submit-btn">
              <span>Enviar Ticket</span>
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="ai-column">
          {description.length <= 10 && !isTyping && !aiSuggestion && (
            <div className="ai-placeholder glass-card">
              <Sparkles size={32} color="var(--text-muted)" />
              <p>Empieza a escribir la descripción de tu problema para obtener sugerencias instantáneas y soluciones automáticas impulsadas por IA.</p>
            </div>
          )}

          {isTyping && (
            <div className="ai-analyzing glass-card">
              <Loader2 className="spinner" size={24} color="var(--accent-violet)" />
              <span>AegisAI está analizando tu problema...</span>
            </div>
          )}

          {!isTyping && aiSuggestion && (
            <div className="ai-suggestion-card glass-card animate-pulse-glow" style={aiSuggestion.type === 'generic' ? {borderLeftColor: 'var(--text-muted)'} : {}}>
              <div className="ai-card-header">
                <div className="ai-badge" style={aiSuggestion.type === 'generic' ? {borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)'} : {}}>
                  {aiSuggestion.type === 'solution' ? <Sparkles size={14} /> : <Info size={14} />}
                  <span>{aiSuggestion.type === 'solution' ? 'Solución IA Encontrada' : 'Análisis IA Completado'}</span>
                </div>
                <span className="confidence-score">{aiSuggestion.confidence}% Precisión</span>
              </div>
              
              <h3 className="ai-title">{aiSuggestion.title}</h3>
              <p className="ai-content">{aiSuggestion.content}</p>
              
              <div className="ai-actions">
                <button type="button" className={`btn ${aiSuggestion.type === 'generic' ? 'btn-primary' : 'btn-secondary'}`} onClick={handleAiAction}>
                  {aiSuggestion.action}
                </button>
                {aiSuggestion.type === 'solution' && (
                  <button type="button" className="btn btn-outline" onClick={handleNotHelpful}>
                    No es útil
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientView;
