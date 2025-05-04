import { OmitType, PartialType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class UpdateUserDTO extends PartialType(OmitType(UserDTO, ["createdAt", "updatedAt", "id"])) { }