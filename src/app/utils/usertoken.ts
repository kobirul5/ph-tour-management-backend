
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import { jwtUtils } from "./jwt";
import { IsActive, IUser } from "../modules/user/user.intrface";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";


export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = jwtUtils.generateToken(jwtPayload, envVars.JWT_SECRET as string, envVars.JWT_EXPIRATION as string)

    const refreshToken = jwtUtils.generateToken(jwtPayload, envVars.JWT_REFRESH_EXPIRATION as string, envVars.JWT_REFRESH_EXPIRATION as string)


    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
   if (!envVars.JWT_REFRESH_SECRET) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT_REFRESH_SECRET is not defined.");
  }
  if (!envVars.JWT_SECRET) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT_SECRET is not defined.");
  }
  if (!envVars.JWT_EXPIRATION) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT_EXPIRATION is not defined.");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwtUtils.generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRATION
  );

  return accessToken;
};
