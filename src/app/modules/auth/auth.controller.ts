import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service";
import { Request, Response } from "express";


const credentialLogin = catchAsync(async (req: Request, res: Response,) => {
    const result = await AuthServices.credentialLogin(req.body);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Logged In Successfully",
        data: result,
    })
})

export const AuthController = {
    credentialLogin
}

