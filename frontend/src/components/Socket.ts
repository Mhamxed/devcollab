import { io } from 'socket.io-client';

export const newSocket = io('ws://localhost:8000', {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,        // enable automatic reconnection
  reconnectionAttempts: 5,   // try to reconnect 5 times (default: Infinity)
  reconnectionDelay: 1000,   // wait 1 second before trying again
  reconnectionDelayMax: 5000,// maximum delay between attempts
  timeout: 20000             // timeout after 20 seconds if no response
});