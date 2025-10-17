import { createServer } from 'http';
import { Server } from 'socket.io';

const wsServer = createServer();

const io = new Server(wsServer, { cors: { origin: 'http://localhost:5103' } });

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  socket.on('join', (data) => {
    socket.join(String(data.tenantId));
    socket.emit('join', {
      roomId: String(data.tenantId),
    });
  });
});

export default { wsServer, io };
