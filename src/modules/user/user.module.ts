import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas';
import { UserRepository } from './repository/abstract/user.repository';
import { MongoUserRepository } from './repository/mongo-user-repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule { }
