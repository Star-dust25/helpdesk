import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ClientView from './components/ClientView';
import AgentView from './components/AgentView';
import SettingsView from './components/SettingsView';
import SupportView from './components/SupportView';
import Chatbot from './components/Chatbot';
import { TicketProvider } from './context/TicketContext';

function App() {
  return (
    <TicketProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ClientView />} />
              <Route path="/agente" element={<AgentView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/support" element={<SupportView />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </TicketProvider>
  );
}

export default App;
