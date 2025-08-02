/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";


const credentialLogin = catchAsync(async (req: Request, res: Response,) => {
    const result = await AuthServices.credentialLogin(req.body);

    setAuthCookie(res, result)



    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Logged In Successfully",
        data: result,
    })
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



export const AuthController = {
    credentialLogin,
    getNewAccessToken,
    logoutUser,
}

