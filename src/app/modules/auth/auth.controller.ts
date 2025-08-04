/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/usertoken";
import { set } from "mongoose";
import { envVars } from "../../config/env";
import passport from "passport";


const credentialLogin = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    // const result = await AuthServices.credentialLogin(req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err:any, user:any, info:any) => {
    
    if (err) {
        console.log(err,"-------")
        return next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Authentication failed ${err}`, err));
    }

    if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials", info.message));
    }

    const tokenInfo = createUserTokens(user);
    
    const {pass, ...rest} = user.toObject();

    setAuthCookie(res, tokenInfo);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Logged In Successfully",
        data: {
            user: rest,
            accessToken: tokenInfo.accessToken,
            refreshToken: tokenInfo.refreshToken
        },
    })
    })(req,res,next);
   
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response,) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

  
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo,
    })
})


const logoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    
    const user = req.user;
    console.log("User from Google Callback:", user);
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Google authentication failed");
    }

    const tokenInfo = createUserTokens(user);
    console.log("Token Info:", tokenInfo);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})



export const AuthController = {
    credentialLogin,
    getNewAccessToken,
    logoutUser,
    changePassword,
    resetPassword,
    googleCallback
}

