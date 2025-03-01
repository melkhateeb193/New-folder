import { rateLimit } from "express-rate-limit";
import { AppError } from "../errorHandling/index.js";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  // message: { error: "Too many requests, please try again later." }, // default message
  // statusCode: 429, // HTTP status code to respond with for rate limit exceeded (default: 429)
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  handler: (req, res, next) => {
    return next(
      new AppError("Too many requests, please try again later.", 429)
    );
  },
});
