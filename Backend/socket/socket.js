import { Server } from "socket.io";
import http from "http";
import express from "express";
import Chat from "../Models/chat.js";
import Subject from "../Models/Subject.js";
import User from "../Models/User.js"; 
import cors from "cors";
import dotenv from 'dotenv';

const app = express();
dotenv.config();
console.log(process.env.JWT_Secret)

app.use(cors(
    {
        origin: ["http://localhost:5000", "https://edu-sync-front.vercel.app","https://edu-sync-backend-seven.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5000", "https://edu-sync-front.vercel.app"],
        methods: ["GET", "POST"],  
        credentials: true,
    },
});

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    const subjectId = socket.handshake.query.subjectId;

    if (userId && subjectId) {
        socket.join(subjectId);  
        console.log(`User ${userId} joined room: ${subjectId}`);
    }

    socket.on("newMessage", async ({ subjectId, message, sender }) => {
        try {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                return console.error("Subject not found");
            }
    
            const newMessage = new Chat({
                sender: sender,
                subject: subjectId,
                message,
                participants: subject.students.map(student => student.stuId),
            });
    
            const savedMessage = await newMessage.save();
            const populatedMessage = await Chat.findById(savedMessage._id).populate('sender', 'username imageUrl');
            subject.groupChat.push(savedMessage._id);
            await subject.save();
            io.to(subjectId).emit("newMessage", populatedMessage);
            console.log('Message posted and broadcasted', populatedMessage);
        } catch (error) {
            console.error('Error posting new message:', error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

export { io, server, app };
