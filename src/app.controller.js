import { createHandler } from "graphql-http";
import connectionDB from "./DB/connectionDB.js";
import * as Routers from "./modules/index.js";
import { schema } from "./modules/dashboard/graph.schema.js";
import { AppError, globalErrorHandling, limiter } from "./utils/index.js";
// import * as MiddleWares from "./utils/index.js";
import cors from "cors";

const bootstrap = async (app, express) => {
  // Connect to MongoDB
  await connectionDB();

  // middleware for passing request body
  app.use(express.json());
  app.use(cors());
  app.use(limiter);
  app.use("/graphql", createHandler({ schema }));

  // Initialize routes
  app.use("/auth", Routers.authRouter);
  app.use("/user", Routers.userRouter);
  app.use("/company", Routers.companyRouter);

  // routes for unHandled requests
  app.use("*", (req, res, next) => {
    return next(new AppError(`invalid URL ${req.originalUrl}`, 404));
  });
  // Error handling middleware
  app.use(globalErrorHandling);
};

export default bootstrap;
