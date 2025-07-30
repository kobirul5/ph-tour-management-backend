import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.intrface"
import httpStatus from 'http-status-codes'
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { JwtUtils } from "../../utils/jwt";

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

    const payloadJ = {
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = JwtUtils.generateToken(payloadJ, envVars.JWT_SECRET as string, envVars.JWT_EXPIRATION as string);

    return {
        accessToken
    }


}


export const AuthServices = {
    credentialLogin
}