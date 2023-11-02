import { Server } from "socket.io";

let activeUsers = [];
export default function initializeSocketServer() {
    const io = new Server(8800, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        // add new User
        socket.on("new-user-add", (newUserId) => {
            // if user is not added previously
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({ userId: newUserId, socketId: socket.id });
                console.log("New User Connected", activeUsers);
            }
            // send all active users to new user
            io.emit("get-users", activeUsers);
        });

        socket.on("disconnect", () => {
            // remove user from active users
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log("User Disconnected", activeUsers);
            // send all active users to all users
            io.emit("get-users", activeUsers);
        });

        // send message to a specific user
        socket.on("send-message", (data) => {
            const { receiverId } = data;
            const user = activeUsers.find((user) => user.userId === receiverId);
            console.log("Sending from socket to :", receiverId);
            console.log("Data: ", data);
            if (user) {
                io.to(user.socketId).emit("recieve-message", data);
            }
        });

        socket.on("outgoing-video-call", (data) => {
            console.log(data,"back data");
            const user = activeUsers.find((user) => user.userId === data.to);
            if (user) {
                console.log(user,"////");
                io.to(user.socketId).emit("incoming-video-call", {
                    from: data.from,
                    roomId: data.roomId,
                    callType: data.callType,
                });
            }
        });
        socket.on("outgoing-voice-call", (data) => {
            const user = activeUsers.find((user) => user.userId === data.to);
            if (user) {
                io.to(user.socketId).emit("incoming-voice-call", {
                    from: data.from,
                    roomId: data.roomId,
                    callType: data.callType,
                });
            }
        });

        socket.on("reject-voice-call", (data) => {
            const user = activeUsers.find((user) => user.userId === data.from);
            if (user) {
                io.to(user.socketId).emit("voice-call-rejected");
            }
        });

        socket.on("reject-video-call", (data) => {
            const user = activeUsers.find((user) => user.userId === data.from);
            if (user) {
                io.to(user.socketId).emit("video-call-rejected");
            }
        });

        socket.on("accept-incoming-call", (data) => {
            const user = activeUsers.find((user) => user.userId === data.id);
            if (user) {
                io.to(user.socketId).emit("accept-call");
            }
        });
    });
}

export { activeUsers };
