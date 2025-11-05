import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import { getToken } from './services/auth';
import { initSocket } from './services/socket';
import jwtDecode from 'jwt-decode';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

export default function App(){
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = jwtDecode(token);
        initSocket(token, payload.id);
      } catch(e) {}
    }
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
    </Routes>
  );
}
