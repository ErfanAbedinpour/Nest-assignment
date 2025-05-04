import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenPayload } from "../jwt-strategies/token.types";



export const GetUser = createParamDecorator(
    (data: keyof Partial<AccessTokenPayload>, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>();
        return data ? request.user[data] : request.user;
    })