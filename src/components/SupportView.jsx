import React, { useState, useContext } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { TicketContext } from '../context/TicketContext';
import './SupportView.css';

const faqs = [
  { id: 1, q: '¿Cómo funciona el triaje automático de IA?', a: 'La IA analiza el contenido del ticket (palabras clave, urgencia, departamento) y lo categoriza en tiempo real, asignándole una puntuación de prioridad. Si la IA detecta que puede resolver el problema por sí misma (ej. restablecimiento de contraseñas), proporcionará sugerencias directas al cliente.' },
  { id: 2, q: '¿Qué significa que un ticket esté "Escalado"?', a: 'Un ticket escalado es aquel que ha superado el SLA permitido o requiere conocimientos de Soporte Nivel 3. Puedes escalar tickets críticos de forma manual desde el Panel de Agente o esperar a que el sistema automatizado lo haga en función del tiempo de inactividad.' },
  { id: 3, q: '¿Cómo puedo cambiar la paleta de colores?', a: 'Ve a la pestaña de "Configuración" (Settings) en el panel lateral. Allí podrás alternar manualmente entre el modo Claro y Oscuro. Todos los colores se adaptarán instantáneamente manteniendo la accesibilidad.' },
];

const SupportView = () => {
  const { addTicket, showToast } = useContext(TicketContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketRequested, setTicketRequested] = useState(false);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleContactL2 = () => {
    addTicket({
      subject: 'Solicitud de Asistencia Nivel 2 (Agente)',
      user: 'agente.interno@empresa.com',
      priority: 'Alta',
      aiScore: 99
    });
    setTicketRequested(true);
    showToast('Un ticket de asistencia Nivel 2 ha sido creado.', 'success');
  };

  return (
    <div className="support-view animate-slide-up">
      <header className="view-header">
        <h1>Centro de Ayuda de AegisAI</h1>
        <p>Encuentra respuestas a preguntas comunes o contacta al soporte de segundo nivel.</p>
      </header>

      <div className="support-container">
        <div className="faq-section">
          <h2><HelpCircle size={24} color="var(--accent-cyan)" /> Preguntas Frecuentes</h2>
          <div className="faq-list">
            {faqs.map(faq => (
              <div key={faq.id} className={`faq-item glass-card ${openFaq === faq.id ? 'open' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <h3>{faq.q}</h3>
                  {openFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openFaq === faq.id && (
                  <div className="faq-answer animate-slide-up">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="contact-section glass-panel">
          <MessageCircle size={48} color="var(--accent-violet)" />
          <h2>¿Necesitas más ayuda?</h2>
          <p>Si la inteligencia artificial y este FAQ no resuelven tus dudas, nuestro equipo de soporte interno (Nivel 2) está listo para ayudarte en la administración del sistema.</p>
          <button 
            className="btn btn-secondary contact-btn" 
            onClick={handleContactL2}
            disabled={ticketRequested}
          >
            {ticketRequested ? 'Ticket L2 Creado' : 'Contactar Nivel 2'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
