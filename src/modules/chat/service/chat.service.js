import { asyncHandler } from "../../../utils/index.js";
import * as dbService from "../../../utils/dbService/dbService.js";
import { chatModel } from "../../../DB/models/index.js";

export const getAllChat = asyncHandler(async (req, res, next) => {
  const { userId, companyId } = req.params;
  const currentUserId = req.user._id;

  const chat = dbService.findOne({
    model: chatModel,
    filter: {
      companyId,
      $or: [
        { senderId: currentUserId },
        { receiverId: userId },
        { senderId: userId },
        { receiverId: currentUserId },
      ],
    },
  });
  if (!chat) {
    return res.status(404).json({ message: "No chat found" });
  }

  res.status(200).json({ message: "Get all chat", chat });
});
