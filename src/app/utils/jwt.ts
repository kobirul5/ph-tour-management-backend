import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
const generateToken = (payload:JwtPayload, secret:string, expiredIn:string)=>{
    
    const token = jwt.sign(payload, secret, { expiresIn: expiredIn } as SignOptions);

    return token;
}


const verifyToken = (token: string, secret: string): JwtPayload | null => {
    try {
        const verifiedToken = jwt.verify(token, secret) as JwtPayload;
        return verifiedToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
};

export const JwtUtils = {
    generateToken,
    verifyToken
}