import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from './components/Login';
import Registration from './components/Registration';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Home from './components/Home';
import TechSupportDashboard from './components/TechSupportDashboard'; 
import AdminDashboard from './components/AdminDashboard';
import AssignSupport from './components/AssignSupport';
import AdminTickets from './components/AdminTickets';
import Navbar from './components/Navbar';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [role, setRole] = useState(null); 
  const handleTicketSubmit = (ticketData) => {
    setTickets([...tickets, ticketData]);
  };

  const handleTicketResolve = (index) => {
    const updatedTickets = [...tickets];
    updatedTickets.splice(index, 1);
    setTickets(updatedTickets);
  };

  useEffect(() => {
    
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []); 

  if (role === null) {
    
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
          {role === '0' && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/create-ticket" element={<TicketForm onSubmit={handleTicketSubmit} />} />
              <Route path="/tickets" element={<TicketList tickets={tickets} onResolve={handleTicketResolve} />} />
            </>
          )}
          {role === '1' && (
            <Route path="/tech-support-dashboard" element={<TechSupportDashboard />} />
          )}
          {role === '2' && (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/assign-support/:ticketId" element={<AssignSupport />} />
              <Route path="/admin-tickets" element={<AdminTickets />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
