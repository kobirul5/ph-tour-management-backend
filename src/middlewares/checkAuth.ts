import { NextFunction, Request, Response } from "express";
import { JwtUtils } from "../app/utils/jwt";
import AppError from "../app/errorHelpers/AppError";
import { envVars } from "../app/config/env";
import { JwtPayload } from "jsonwebtoken";


export const checkAuth= (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction)=>{
    const accessToken = req.headers.authorization;

    if(!accessToken){
        throw new AppError(403, "No Token Recived")
    }
    const verifyToken = JwtUtils.verifyToken(accessToken, envVars.JWT_SECRET as string) as JwtPayload;


    if(!verifyToken ){
        throw new AppError(403, "Invalid Token")    
    }

    if(authRoles.includes(verifyToken.role)){
        throw new AppError(403, "Your are not permitted for view this route")  
    }

    next()

}