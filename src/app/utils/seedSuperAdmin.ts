import { envVars } from "../config/env";
import { Role } from "../modules/user/user.intrface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async()=>{
    try {
       const isAdminExits = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})
       if(isAdminExits){
        console.log("suerAdmin already exists")
       }

       const hashPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, envVars.BCRYPT_SALT_ROUNDS )

       const payload= {
        name: "Super Admin",
        email: envVars.SUPER_ADMIN_EMAIL,
        role: Role.SURER_ADMIN,
        password: hashPassword,
       }



    } catch (error) {
        console.log(error)
    }
}