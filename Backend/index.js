import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import cookieParser from "cookie-parser";
import UserRoute from './Routes/UserRoute.js';
import SubjectRoute from './Routes/SubjectRoute.js';
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import helpRoute from './Routes/HelpRoute.js';
import ChatRoute from './Routes/ChatRoute.js';
import {app,server } from "./socket/socket.js"
import cors from 'cors';

app.use(cors({
    origin: ["http://localhost:5000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    timeout: 6000000
});
console.log(process.env.JWT_Secret)

connectDB();
const _dirname = path.resolve();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("hello");
});
app.use('/api/user',UserRoute)
app.use('/api/s',SubjectRoute)
app.use('/api/generate',helpRoute);
app.use('/api/c',ChatRoute)


const port = process.env.PORT || 5000;

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(_dirname, '/Frontend/dist')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(_dirname, 'Frontend', 'dist', 'index.html'));
//     })
// }
server.listen(port, () => console.log(`http://localhost:${port}`));
