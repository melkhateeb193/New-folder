import { Server } from "socket.io";
import { sendMessage } from "./service/message.socket.js";

export const runIo = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      // methods: ["GET", "POST"],
      // credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    await sendMessage(socket);
  });
};
