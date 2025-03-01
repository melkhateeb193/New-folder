import { tokenTypes, userModel } from "../DB/models/index.js";
import { AppError, asyncHandler, verifyToken } from "../utils/index.js";
import * as dbService from "../utils/dbService/dbService.js";

export const decodedToken = async ({ authorization, tokenType, next }) => {
  const [prefix, token] = authorization.split(" ") || [];
  if (!prefix || !token) {
    return next(new Error("Invalid token", { cause: 401 }));
  }
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;

  if (prefix === process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else if (prefix === process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else {
    return next(new Error("Invalid token prefix", { cause: 401 }));
  }

  const decoded = await verifyToken({
    token: token,
    signature:
      tokenType === tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE,
  });

  if (!decoded?.id)
    return next(new Error("invalid token payload", { cause: 401 }));

  const user = await userModel.findById(decoded.id);
  if (!user) return next(new Error("User not found", { cause: 401 }));

  if (user?.isDeleted) {
    return next(new Error("User account has been deleted", { cause: 401 }));
  }

  if (parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
    return next(new Error("Token expire. Please re-login", { cause: 401 }));
  }
  return user;
};

////////////////////////////////////////////////////////////////////////////////////////////////

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AppError("No token provided", 401));
  }
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.access,
    next,
  });
  req.user = user;

  return next();
});

////////////////////////////////////////////////////////////////////////////////////////////////

export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Your don't have permission to access Only ${accessRoles} roles have it`,
          403
        )
      );
    }
    return next();
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////

export const authGraph = async ({
  authorization,
  tokenType = tokenTypes.access,
  accessRoles = [],
} = {}) => {
  const [prefix, token] = authorization.split(" ") || [];
  if (!prefix || !token) {
    throw new AppError("Invalid token", 401);
  }
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;

  if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else if (prefix == process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else {
    throw new AppError("Invalid token prefix", 401);
  }

  const decoded = await verifyToken({
    token: token,
    signature:
      tokenType === tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE,
  });

  if (!decoded?.id) throw new AppError("invalid token payload", 401);

  // const user = await userModel.findById(decoded.id);
  const user = await dbService.findById({
    model: userModel,
    id: decoded.id,
  });

  if (!user) throw new AppError("User not found", 401);

  if (user?.isDeleted) {
    throw new AppError("User account has been deleted", 401);
  }

  if (parseInt(user?.changeCredentialTime?.getTime() / 1000) > decoded.iat) {
    throw new AppError("Token expire. Please re-login", 401);
  }

  if (!accessRoles.includes(user.role)) {
    throw new AppError(
      `Your don't have permission to access Only ${accessRoles} roles have it`,
      403
    );
  }
  return user;
};

////////////////////////////////////////////////////////////////////////////////////////////////

export const authSocket = async (socket) => {
  try {
    const [prefix, token] =
      socket?.handshake?.auth?.authorization?.split(" ") || [];
    if (!prefix || !token) {
      return { message: "Invalid token", statusCode: 401 };
    }
    let ACCESS_SIGNATURE = undefined;
    let REFRESH_SIGNATURE = undefined;

    if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
      ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
      REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
    } else if (prefix == process.env.PREFIX_TOKEN_USER) {
      ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
      REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
    } else {
      return { message: "Invalid token prefix", statusCode: 401 };
    }

    const decoded = await verifyToken({
      token: token,
      signature: ACCESS_SIGNATURE,
    });

    if (!decoded?.id)
      return { message: "invalid token payload", statusCode: 401 };

    // const user = await userModel.findById(decoded.id);
    const user = await dbService.findById({
      model: userModel,
      id: decoded.id,
    });

    if (!user) return next(new AppError("User not found", 401));

    if (user?.isDeleted) {
      return { message: "User account has been deleted", statusCode: 401 };
    }

    if (parseInt(user?.changeCredentialTime?.getTime() / 1000) > decoded.iat) {
      return { message: "Token expire. Please re-login", statusCode: 401 };
    }
    return { user, statusCode: 200 };
  } catch (error) {
    return { message: error.message, statusCode: error.statusCode || 500 };
  }
};
