import { io } from 'socket.io-client';
let socket;

export function initSocket(token, userId) {
  socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:4000', {
    auth: { token }
  });
  socket.on('connect', () => {
    socket.emit('register', userId);
  });
  socket.on('notification', (payload) => {
    console.log('ws notification', payload);
    // integrate with UI notifications
  });
  return socket;
}

export function getSocket() { return socket; }
