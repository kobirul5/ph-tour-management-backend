// import httpStatus from "http-status-codes";
// import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
// import AppError from "../errorHelpers/AppError";
// import { User } from "../modules/user/user.model";
import { JwtUtils } from "./jwt";
import { IUser } from "../modules/user/user.intrface";


export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = JwtUtils.generateToken(jwtPayload, envVars.JWT_SECRET as string, envVars.JWT_EXPIRATION as string)

    const refreshToken = JwtUtils.generateToken(jwtPayload, envVars.JWT_REFRESH_EXPIRATION as string, envVars.JWT_REFRESH_EXPIRATION as string)


    return {
        accessToken,
        refreshToken
    }
}

// export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

//     const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload


//     const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
//     }
//     if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
//         throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
//     }
//     if (isUserExist.isDeleted) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
//     }

//     const jwtPayload = {
//         userId: isUserExist._id,
//         email: isUserExist.email,
//         role: isUserExist.role
//     }
//     const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

//     return accessToken
// }