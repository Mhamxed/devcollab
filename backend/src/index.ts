import express from 'express'
import * as dotenv from 'dotenv'
import authRoutes from './routes/auth'
import connectDB from "./config/db";
import cors from "cors"
import problem from './routes/problemroute';
import authenticateJWT from './middleware/authMiddleware';
import session from './routes/sessionroute';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import SaveMessage from './utils/SaveMessage';
import SessionModel, { ChatMessage } from './models/session';
import mongoose from 'mongoose';
import { IUser } from './models/user';
import getRoomUsers from './utils/getRoomUsers';
import AddParticipant from './utils/AddParticipant';
import RemovePartipant from './utils/RemoveParticipant';
dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT


app.use(cors({
    origin: "http://localhost:5173", // React frontend URL
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", authRoutes);
app.use("/", authenticateJWT, problem)
app.use("/", authenticateJWT, session)


interface JoinRoomData {
  sessionId: string;
  user: IUser;
  timeRemaining: number;
}

interface LeaveRoomData {
  sessionId: string;
  user: IUser;
}

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // In production, specify your client's domain
    credentials: true
  },
  transports: ['websocket'],
});

io.on('connection', (socket: Socket) => {
  
  console.log(`User connected: ${socket.id}`);

  // Handle joining a room
  socket.on('joinRoom', async ({ sessionId, user }: JoinRoomData) => {
    socket.join(sessionId)

    if (!sessionId || !user) {
      socket.disconnect()
      return
    }
    // attach user and session data
    socket.data.sessionId = sessionId;
    socket.data.user = user;

    console.log(`${user._id} Joined room ${sessionId}`)
    
    // Store user details with socket ID
    await AddParticipant(sessionId, user.username)
    
    // Notify all users in the room about the new user
    const users = await getRoomUsers(sessionId)
    io.to(sessionId).emit('roomUsers', users);
  });

  // Handle chat messages
  socket.on('chatMessage', ({ sender, username, message, sessionId, time }: ChatMessage) => {
    if (!message || !sessionId || !sender) return;
    
    const MESSAGE: ChatMessage = {
      message,
      sender,
      username,
      time,
      sessionId
    };

    // Send to all users in the room
    SaveMessage(sessionId, MESSAGE)
    io.to(sessionId).emit('message', MESSAGE);
  });

  // Handle user leaving a room explicitly
  socket.on('leaveRoom', ({ sessionId, user }: LeaveRoomData) => {
    handleUserLeaving(socket, sessionId, user);
  });

  socket.on('language-change', ({ sessionId, language }) => {
    io.to(sessionId).emit('language', language)
  });

  socket.on('code-change', ({ sessionId, code }) => {
    io.to(sessionId).emit("code", code)
  });

  socket.on('notes-change', ({ sessionId, notes }) => {
    io.to(sessionId).emit("notes", notes)
  });

  socket.on('start-timer', (sessionId) => {
    io.to(sessionId).emit('start-timer');
  });

  socket.on('stop-timer', (sessionId) => {
    io.to(sessionId).emit('stop-timer');
  })

  socket.on('reset-timer', (sessionId) => {
    socket.to(sessionId).emit('reset-timer');
  }) 

  // Handle disconnections
  socket.on('disconnect', async () => {
    const sessionId = await socket.data.sessionId;
    const user = await socket.data.user;

    if (!sessionId || !user) {
      return
    }

    handleUserLeaving(socket, sessionId, user);
    console.log(`User disconnected: ${socket.id}`);
  });
})

export async function handleUserLeaving(socket: Socket, sessionId: string, user: IUser) {
  await RemovePartipant(sessionId, user.username)
  socket.leave(sessionId);
  const users = await getRoomUsers(sessionId)
  if (users?.length === 0) {
    await SessionModel.updateOne(
      { _id: sessionId },
      { $set: { timerRunning: false } }
  )
  }
  io.to(sessionId).emit('roomUsers', users);
  console.log(`${user.username} left room ${sessionId}`)
}

server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`))