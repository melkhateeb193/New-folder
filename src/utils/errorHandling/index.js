export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

export const globalErrorHandling = (err, req, res, next) => {
  if (process.env.MODE == "DEV") {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message, stack: err.stack });
  }
  return res.status(err.statusCode || 500).json({ message: err.message });
};
