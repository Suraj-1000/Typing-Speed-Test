require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Set this to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Setup Socket.IO
require('./src/sockets/index')(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
