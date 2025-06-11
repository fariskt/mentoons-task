import { DefaultEventsMap, Server, Socket } from "socket.io";
import { saveMessage } from "../controllers/chatControllet";

export const chatSocket = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => { 
    const onlineUsers = new Map();

    io.on("connection", (socket:Socket) => {
        socket.on("user_connected", (userId) => {
            if (!userId) {
                console.error("⚠️ Missing userId on connection");
                return;
            }
            onlineUsers.set(userId, socket.id);
        });

        socket.on("send_message", async (data) => {            
            if (!data.receiverId || typeof data.receiverId !== "string") {
                console.error("⚠️ Invalid or missing receiver ID:", data);
                return;
            }

            const messageData = {
                ...data,
                timestamp: new Date(),
            };

            try {
                await saveMessage(messageData);
            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit("error_message", "Failed to save message.");
                return;
            }

            const receiverSocket = onlineUsers.get(messageData.receiverId);
            if (receiverSocket) {
                io.to(receiverSocket).emit("receive_message", messageData);
            }
        });
    });
};
