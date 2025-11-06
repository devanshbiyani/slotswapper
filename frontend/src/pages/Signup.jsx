// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://slotswapper-backend.onrender.com/api';
      const res = await axios.post(`${API_BASE}/auth/signup`, {
        name, email, password
      }, { headers: { 'Content-Type': 'application/json' }});
      const token = res.data.token || res.data?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        nav('/'); // go to home/dashboard
      } else {
        setErr('Signup succeeded but no token returned.');
      }
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Signup failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign up</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
          className="block w-full p-2 mb-2 border" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
          className="block w-full p-2 mb-2 border" required type="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
          className="block w-full p-2 mb-2 border" required type="password" />
        <button type="submit" className="px-3 py-1 border bg-blue-600 text-white">Sign up</button>
      </form>
      <div className="mt-4 text-sm">
        Already have an account? <a href="/login" className="text-blue-600">Login</a>
      </div>
    </div>
  );
}
