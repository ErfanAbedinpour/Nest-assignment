import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../schemas';
import { ObjectId } from 'mongoose';

export class UserDTO {
  @ApiProperty({ description: 'userId' })
  id: ObjectId;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'example' })
  name: string;

  @ApiProperty({ enum: () => UserRole, example: UserRole.USER })
  role: UserRole;
}
