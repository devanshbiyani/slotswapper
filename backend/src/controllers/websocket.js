let io;
const onlineUsers = new Map();

function initWebsocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, { cors: { origin: '*' }});

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on('register', (userId) => {
      onlineUsers.set(userId, socket.id);
    });
    socket.on('disconnect', () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
    });
  });
}

function emitToUser(userId, payload) {
  if (!io) return;
  const sid = onlineUsers.get(userId);
  if (!sid) return;
  io.to(sid).emit('notification', payload);
}

module.exports = { initWebsocket, emitToUser };
