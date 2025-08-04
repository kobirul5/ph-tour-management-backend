import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.intrface";


passport.use(
    new GoogleStrategy(
        { 
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL,
        }, async(accessToken: string, refreshToken: string, profile : Profile, done: VerifyCallback)=>{
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "Email not found in Google profile" });
                }

                let user = await User.findOne({ email });

                if (user) {
                    user = await User.create({
                        email,
                        name: profile.displayName || email,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: {
                            provider: "google",
                            providerId: profile.id,
                        }
                    
                    })
                }

                return done(null, user ?? undefined);

        }catch (error) {
                console.error("Google authentication error:", error);
                return done(error);
            }
        }
    )
)