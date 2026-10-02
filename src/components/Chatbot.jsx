import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { TicketContext } from '../context/TicketContext';
import { getGroqChatCompletion } from '../services/aiService';
import './Chatbot.css';

const initialMessages = [
  { id: 1, sender: 'bot', text: '¡Hola! Soy Aegis, tu agente de soporte IA de Nivel 1. ¿En qué te puedo ayudar hoy?' }
];

const systemPrompt = {
  role: 'system',
  content: `Eres Aegis, un experto asistente de soporte técnico de Nivel 1 para una empresa. 
Tu trabajo es responder a problemas de IT (red, contraseñas, hardware, software) de manera breve, concisa y profesional en español.
Si el problema es fácil (ej. restablecer contraseña), da instrucciones.
Si el problema requiere que lo vea un humano (ej. reemplazo de hardware, caída de servidor, errores de código), diles que enviarás su caso a Nivel 2 y al final de tu respuesta EXACTAMENTE pon esta etiqueta: [CREAR_TICKET].`
};

const Chatbot = () => {
  const { addTicket } = useContext(TicketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadQR = (ticketId) => {
    const canvas = document.getElementById(`qr-${ticketId}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${ticketId}-QR.png`;
      downloadLink.click();
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Preparar el historial para Groq
      const apiMessages = [
        systemPrompt,
        ...messages.map(m => ({
          role: m.sender === 'bot' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: 'user', content: inputValue }
      ];

      // Llamar a Llama3 a través de Groq
      let aiText = await getGroqChatCompletion(apiMessages);
      let shouldCreateTicket = false;

      // Procesar la intención de crear un ticket
      if (aiText.includes('[CREAR_TICKET]')) {
        shouldCreateTicket = true;
        aiText = aiText.replace('[CREAR_TICKET]', '').trim();
      }

      let newMessage = { id: Date.now(), sender: 'bot', text: aiText };

      if (shouldCreateTicket) {
        const ticketId = addTicket({
           subject: `Problema Técnico Reportado Vía Chat: ${inputValue.substring(0, 30)}...`,
           user: 'usuario.chat@empresa.com',
           priority: 'Alta', // Podemos asumir prioridad media/alta
           aiScore: 88
        });
        
        newMessage.text = `He generado el ticket interno ${ticketId} para que nuestro equipo lo revise de inmediato.\n\n${aiText}`;
        newMessage.ticketId = ticketId;
      }

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      // Manejar el error de falta de API Key
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'bot', 
        text: `Error de sistema: ${error.message}. Por favor revisa el archivo .env para usar mi inteligencia.` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Chat de Soporte IA"
      >
        <MessageSquare size={24} />
      </button>

      <div className={`chatbot-window glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-title">
            <Bot size={20} color="var(--accent-cyan)" />
            <div>
              <h3>Aegis Soporte IA</h3>
              <span className="status">Llama 3 • Groq</span>
            </div>
          </div>
          <button className="icon-btn close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar Chat">
            <X size={20} />
          </button>
        </div>

        <div className="chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="avatar">
                {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className="message-content">
                <div style={{whiteSpace: 'pre-line'}}>{msg.text}</div>
                {msg.ticketId && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', display: 'inline-flex' }}>
                       <QRCodeCanvas 
                         id={`qr-${msg.ticketId}`} 
                         value={`https://helpdesk-theta-one.vercel.app/?ticket=${msg.ticketId}`} 
                         size={120} 
                         level={"H"} 
                       />
                    </div>
                    <button type="button" className="btn btn-outline" style={{padding: '6px 12px', fontSize: '0.85rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => downloadQR(msg.ticketId)}>
                      <Download size={14} style={{marginRight: 6}} /> Descargar QR
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message bot typing">
              <div className="avatar"><Bot size={14} /></div>
              <div className="message-content typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Escribe tu pregunta..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="chat-send" disabled={!inputValue.trim() || isTyping}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
