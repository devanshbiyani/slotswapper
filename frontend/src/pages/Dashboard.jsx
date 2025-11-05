import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  return (
    <div className="p-6">
      <h2 className="text-2xl">Dashboard</h2>
      <p>Welcome — use the links below</p>
      <ul>
        <li><Link to="/marketplace">Marketplace</Link></li>
      </ul>
    </div>
  );
}
