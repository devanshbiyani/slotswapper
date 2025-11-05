import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Marketplace(){
  const [slots, setSlots] = useState([]);

  useEffect(()=>{ fetchSlots(); }, []);
  async function fetchSlots(){
    try {
      const res = await API.get('/swappable-slots');
      setSlots(res.data);
    } catch (err) { console.error(err); }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl">Marketplace</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {slots.map(s => (
          <div key={s.id} className="p-3 border rounded">
            <h3>{s.title}</h3>
            <div>owner: {s.owner?.name}</div>
            <div>{new Date(s.startTime).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
