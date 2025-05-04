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

@Controller("users")
@IsAuth()
@RoleAccess(UserRole.ADMIN)
@ApiBearerAuth("JWT-AUTH")
@ApiForbiddenResponse({ description: "You Cannot Access To This Route" })
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get("me")
    getMe(@GetUser() user) {
        return user;
    }

    @Get()
    @ApiOkResponse({ description: "GetAllUsers", type: [ProductDTO] })
    getUsers() {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    @ApiOkResponse({ description: "GetUserById", type: ProductDTO })
    getUserById(@Param("id", ParseUUIDPipe) userId: string) {
        return this.userService.findUserById(userId);
    }


    @Patch(":id")
    updateUser(@Param("id", ParseUUIDPipe) userId: string, @Body() updatedUserDto: UpdateUserDTO) {
        return this.userService.updateUser(userId, updatedUserDto);
    }


    @Delete(":id")
    deleteUser(@Param("id", ParseUUIDPipe) userId: string) {
        return this.userService.deleteUser(userId);
    }

}