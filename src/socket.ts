import { createServer } from 'http';
import { Server } from 'socket.io';
import config from 'config';

const wsServer = createServer();

const ALLOWED_DOMAIN = [
  config.get('domain.ADMIN_DOMAIN') as string,
  config.get('domain.CLIENT_DOMAIN') as string,
];

const io = new Server(wsServer, {
  cors: { origin: ALLOWED_DOMAIN },
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
