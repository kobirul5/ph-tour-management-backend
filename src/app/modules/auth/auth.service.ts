import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.intrface"
import httpStatus from 'http-status-codes'
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/usertoken";

const credentialLogin = async (payload: Partial<IUser>)=>{
const {email, password} = payload;

    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }

    const isPasswordCorrect = await bcrypt.compare(password as string, isUserExist.password as string)

    if(!isPasswordCorrect){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userToken = createUserTokens(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass , ...rest} = isUserExist.toObject()

    

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

export const AuthServices = {
    credentialLogin,
    getNewAccessToken,
}