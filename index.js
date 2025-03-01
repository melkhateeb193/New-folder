import express from "express";
import bootstrap from "./src/app.controller.js";
import { runIo } from "./src/modules/chat/chat.socketIO.js";

const app = express();
const port = process.env.PORT || 3000;

bootstrap(app, express);

const server = app.listen(port, () => console.log(`http://localhost:${port}`));

runIo(server);
