import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDTO } from "../DTO/user.dto";
import { UserSessionRepository } from "../../user-session/repository/abstract/user-session.abstract";
import { ObjectId } from 'mongodb'

@Injectable()
export class UserTokenService {
    constructor(private readonly jwtService: JwtService, private userSessionRepo: UserSessionRepository) { }

    async generateToken(user: UserDTO): Promise<{ accessToken: string, refreshToken: string }> {
        return {
            accessToken: await this.signAccessToken(user),
            refreshToken: await this.signRefreshToken(user.id.toString())
        }
    }


    signAccessToken(user: UserDTO): Promise<string> {
        return this.jwtService.signAsync({ name: user.name, role: user.role, userId: user.id }, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXPIRE + "min" })
    }


    async signRefreshToken(userId: string): Promise<string> {
        const tokenId = ObjectId.generate().toString()
        const refreshToken = await this.jwtService.signAsync({ userId, tokenId: tokenId }, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXPIRE + "min" })

        await this.userSessionRepo.create(refreshToken, userId, tokenId);
        return refreshToken

    }
}