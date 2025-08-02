/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.intrface"
import httpStatus from 'http-status-codes'
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/usertoken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }

    const isPasswordCorrect = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordCorrect) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userToken = createUserTokens(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()



    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        rest,

    }


}


const getNewAccessToken = async (refreshToken: string) => {
    console.log(refreshToken, "-----------")
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUNDS))

    user!.save();


}


const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUNDS)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}


export const AuthServices = {
    credentialLogin,
    getNewAccessToken,
    changePassword,
    resetPassword
}