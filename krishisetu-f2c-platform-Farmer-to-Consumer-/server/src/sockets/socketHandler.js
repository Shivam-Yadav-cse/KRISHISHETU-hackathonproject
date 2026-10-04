// MOCK LIVE TRACKING FOR HACKATHON DEMO
const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('order_status_update', ({ orderId, status, userId }) => {
      io.to(`order_${orderId}`).emit('order_update', { orderId, status, timestamp: new Date() });
      if (userId) {
        io.to(`user_${userId}`).emit('notification', {
          title: `Order Update`,
          message: `Your order is now: ${status}`,
          type: 'delivery'
        });
      }
    });

    // MOCK LIVE TRACKING FOR HACKATHON DEMO - Simulate delivery partner movement
    socket.on('start_tracking', ({ orderId }) => {
      let step = 0;
      const mockRoute = [
        { lat: 19.076, lng: 72.877, status: 'Picked Up' },
        { lat: 19.080, lng: 72.880, status: 'Out for Delivery' },
        { lat: 19.085, lng: 72.883, status: 'Out for Delivery' },
        { lat: 19.090, lng: 72.886, status: 'Out for Delivery' },
        { lat: 19.095, lng: 72.890, status: 'Delivered' },
      ];
      const interval = setInterval(() => {
        if (step >= mockRoute.length) {
          clearInterval(interval);
          return;
        }
        const point = mockRoute[step];
        io.to(`order_${orderId}`).emit('location_update', {
          orderId,
          coordinates: { lat: point.lat, lng: point.lng },
          status: point.status,
          timestamp: new Date()
        });
        step++;
      }, 5000);

      socket.on('disconnect', () => clearInterval(interval));
    });

    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
