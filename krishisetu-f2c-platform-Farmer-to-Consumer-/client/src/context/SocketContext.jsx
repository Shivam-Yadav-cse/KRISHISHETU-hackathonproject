import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket', 'polling'], reconnection: true });
    setSocket(s);
    if (user) s.emit('join_user_room', user._id);
    return () => s.disconnect();
  }, [user]);

  const joinOrderRoom = (orderId) => socket?.emit('join_room', `order_${orderId}`);
  const leaveOrderRoom = (orderId) => socket?.emit('leave_room', `order_${orderId}`);

  return (
    <SocketContext.Provider value={{ socket, joinOrderRoom, leaveOrderRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
