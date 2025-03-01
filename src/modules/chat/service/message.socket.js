import { chatModel } from "../../../DB/models/chat.model.js";
import { companyModel } from "../../../DB/models/company.model.js";
import { authSocket } from "../../../middlewares/index.js";
import * as dbService from "../../../utils/dbService/dbService.js";

export const sendMessage = async (socket) => {
  socket.on("sendMessage", async ({ receiverId, message, companyId }) => {
    try {
      const data = await authSocket(socket);
      if (data.statusCode != 200 || message.trim() == "")
        return socket.emit("authError", data);

      const userId = data.user._id;

      if (
        !(await dbService.findOne({
          model: companyModel,
          filter: {
            _id: companyId,
            $or: [
              { createdBy: userId },
              {
                Hrs: {
                  $in: [userId],
                },
              },
            ],
          },
        }))
      )
        return socket.emit(
          "error",
          "Only HR or company owner can start a conversation."
        );

      let chat = await dbService.findOneAndUpdate({
        model: chatModel,
        filter: {
          $or: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        update: {
          $push: { messages: { senderId, message, createdAt: new Date() } },
        },
        new: true,
      });
      if (!chat) {
        chat = await dbService.create({
          model: chatModel,
          query: {
            senderId: userId,
            receiverId,
            messages: [{ senderId, message, createdAt: new Date() }],
          },
        });
      }
      socket.emit("successMessage", { message });
      socket.to(receiverId).emit("newMessage", {
        senderId,
        message,
        createdAt: new Date(),
      });
    } catch (err) {
      console.log(err);
    }
  });
};
