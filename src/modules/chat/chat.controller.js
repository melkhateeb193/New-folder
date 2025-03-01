import { Router } from "express";
import * as CS from "./service/chat.service.js";
import * as CV from "./chat.validation.js";
import * as middleWares from "../../middlewares/index.js";

export const chatRouter = Router({ mergeParams: true });

chatRouter.get(
  "/:userId",
  middleWares.authentication,
  middleWares.validation(CV.getAllChatSchema),
  CS.getAllChat
);
