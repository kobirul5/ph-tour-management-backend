import { Types } from "mongoose";

export enum Role {
    SURER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}


export interface IAuthProvider {
    provider: string;
    providerId: string;
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?:isActive;
    isVerified?: boolean;
    role: Role;
    auth: IAuthProvider[];
    booking?:Types.ObjectId[];
    guides?:Types.ObjectId[]
}