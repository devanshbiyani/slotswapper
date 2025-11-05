import React, { useState } from 'react';
import { login, setToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await login({ email, password });
      setToken(res.data.token);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl">Login</h2>
      <form onSubmit={submit} className="max-w-md">
        <input className="block w-full p-2 my-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="block w-full p-2 my-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
}
