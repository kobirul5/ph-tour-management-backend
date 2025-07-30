import {  NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { JwtUtils } from "../../utils/jwt";


const router = Router()

router.post("/register", validateRequest(createUserZodSchema),  UserControllers.createUser)
router.get("/all-users", async (req: Request, res: Response, next: NextFunction)=>{
    const accessToken = req.headers.authorization;

    if(!accessToken){
        throw new AppError(403, "No Token Recived")
    }
    const varifyToken = JwtUtils.verifyToken(accessToken, envVars.JWT_SECRET as string);
    if(!varifyToken ){
        throw new AppError(403, "Invalid Token")    
    }

    next()

} ,UserControllers.getAllUsers)

export const UserRoutes = router