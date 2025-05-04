import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch } from "@nestjs/common";
import { IsAuth } from "../auth/decorator/auth.decorator";
import { RoleAccess } from "../auth/decorator/role-access.decorator";
import { UserRole } from "../../schemas";
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ObjectId } from 'mongodb'
import { ProductDTO } from "../product/DTO/product.dto";
import { UpdateUserDTO } from "./DTO/update-user.dto";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { UserDTO } from "./DTO/user.dto";
import { IsObjectIdPipe } from "@nestjs/mongoose";
import { omit } from "lodash";

@Controller("users")
@IsAuth()
@RoleAccess(UserRole.ADMIN)
@ApiBearerAuth("JWT-AUTH")
@ApiForbiddenResponse({ description: "You Cannot Access To This Route" })
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get("me")
    @ApiOkResponse({ schema: { properties: { name: { type: 'string' }, role: { type: "string" }, id: { type: 'string' } } } })
    getMe(@GetUser() user) {
        return user;
    }

    @Get()
    @ApiOkResponse({ description: "GetAllUsers", type: [UserDTO] })
    getUsers() {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    @ApiOkResponse({ description: "GetUserById", type: UserDTO })
    async getUserById(@Param("id", IsObjectIdPipe) userId: string) {
        const user = await this.userService.findUserById(userId);

        return omit(user.toObject(), ['password'])
    }


    @Patch(":id")
    updateUser(@Param("id", IsObjectIdPipe) userId: string, @Body() updatedUserDto: UpdateUserDTO, @GetUser("userId") id: string) {

        return this.userService.updateUser(userId, updatedUserDto);
    }


    @Delete(":id")
    deleteUser(@Param("id", IsObjectIdPipe) userId: string) {
        return this.userService.deleteUser(userId);
    }

}