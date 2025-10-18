import { createServer } from 'http';
import { Server } from 'socket.io';

const wsServer = createServer();

const io = new Server(wsServer, {
  cors: { origin: ['http://localhost:3001', 'http://localhost:5103', 'http://localhost:5173'] },
});

io.on('connection', (socket) => {
  console.log('✅ client connected:', socket.id);

  socket.on('join', (data) => {
    const roomId = String(data.tenantId);
    socket.join(roomId);
    console.log(`🟢 ${socket.id} joined room: ${roomId}`);
    socket.emit('join', { roomId });
  });

  socket.on('disconnect', () => {
    console.log('❌ client disconnected', socket.id);
  });
});

export default { wsServer, io };
