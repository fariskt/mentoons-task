import express from 'express';
import http from 'http'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import userConnectionRouter from './routes/userConnectionRoute';
import chatRoutes from './routes/chatRoutes';
import { Server } from "socket.io";
import { chatSocket } from './socket/chatSocket';

const app = express()
const server = http.createServer(app);


app.use(cors({
    origin: ["https://mentoons-task.vercel.app", "http://localhost:5173"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

app.use("/api/user", userRouter)
app.use("/api/user", userConnectionRouter)
app.use("/api/chat", chatRoutes)

chatSocket(io);


export default server;
