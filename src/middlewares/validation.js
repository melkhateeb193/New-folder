import { AppError, asyncHandler } from "../utils/index.js";

export const validation1 = (Schema) => {
  return (req, res, next) => {
    const inputData = {
      ...req.body,
      ...req.query,
      ...req.params,
      ...req.file,
    };
    const result = Schema.validate(inputData, {
      abortEarly: false,
    });

    if (result?.error) {
      // return res
      //   .status(400)
      //   .json({ message: "Validation error", errors: result?.error.details });
      return next(new Error("Validation error", { cause: 400 }));
    }
    return next();
  };
};

// another Way

export const validation = (Schema) => {
  return (req, res, next) => {
    //validate
    const validationResult = [];
    for (const key of Object.keys(Schema)) {
      const { error } = Schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        validationResult.push({ [key]: error.details });
      }
    }
    if (validationResult.length > 0)
      return next(new AppError(validationResult, 400));

    return next();
  };
};

export const validationGraphQl = async ({ schema, data } = {}) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) throw new AppError(error.message, 400);
};
