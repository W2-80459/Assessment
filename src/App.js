import React, { useState } from 'react';
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
  const role = localStorage.getItem('role');
  const handleTicketSubmit = (ticketData) => {
    
    setTickets([...tickets, ticketData]);
  };

  const handleTicketResolve = (index) => {
    
    const updatedTickets = [...tickets];
    updatedTickets.splice(index, 1);
    setTickets(updatedTickets);
  };

  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          {role === '0' && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/create-ticket" element={<TicketForm onSubmit={handleTicketSubmit} />} />
              <Route path="/tickets" element={<TicketList tickets={tickets} onResolve={handleTicketResolve} />} />

            </>
          )}

          
          {role === '1' && (
            <Route path="/home" element={<TechSupportDashboard />} />
          )}
          {role === '2' && (
            <>
              <Route path="/home" element={<AdminDashboard />} />
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
