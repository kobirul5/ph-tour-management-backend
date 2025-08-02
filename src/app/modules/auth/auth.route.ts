import { Router } from "express";
import { AuthController } from "./auth.controller";


const router = Router()

router.post('/login', AuthController.credentialLogin)
router.post('/logout', AuthController.logoutUser)
router.post('/refresh-token', AuthController.credentialLogin)


export const AuthRoute = router;