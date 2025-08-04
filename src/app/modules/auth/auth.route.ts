import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.intrface";
import passport from "passport";
import { envVars } from "../../config/env";


const router = Router()

router.post('/login', AuthController.credentialLogin)
router.post('/logout', AuthController.logoutUser)
router.post('/refresh-token', AuthController.credentialLogin)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)





// Google OAuth Routes
// Initiate Google OAuth flow

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthController.googleCallback)


export const AuthRoute = router;