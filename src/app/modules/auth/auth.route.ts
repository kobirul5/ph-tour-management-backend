import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.intrface";


const router = Router()

router.post('/login', AuthController.credentialLogin)
router.post('/logout', AuthController.logoutUser)
router.post('/refresh-token', AuthController.credentialLogin)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)

export const AuthRoute = router;