import { UserRole } from "../../../schemas";

export interface AccessTokenPayload {
    userId: string;
    tokenId: string;
}

export interface RefreshTokenPayload {
    role: UserRole,
    userId: string;
    name: string;
}