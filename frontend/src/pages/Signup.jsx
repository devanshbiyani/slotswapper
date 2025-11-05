import React, { useState } from 'react';
import { signup, setToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await signup({ name, email, password });
      setToken(res.data.token);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl">Signup</h2>
      <form onSubmit={submit} className="max-w-md">
        <input className="block w-full p-2 my-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="block w-full p-2 my-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="block w-full p-2 my-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Signup</button>
      </form>
    </div>
  );
}
