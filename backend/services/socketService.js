let ioInstance = null;

export const initializeSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinAdminRoom', () => {
      socket.join('admin');
      console.log('Admin joined room');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export const getIO = () => {
  return ioInstance;
};

