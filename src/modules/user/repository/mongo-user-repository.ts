import { Injectable } from '@nestjs/common';
import { UserRepository } from './abstract/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from '../../../schemas';
import { Model } from 'mongoose';
import { UserPersist } from './persistance/user-persist';
import { RepositoryException } from '../../../exception/respository.exception';
import { ErrorMessages } from '../../../errorResponses/errorResponse.enum ';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async create(user: UserPersist): Promise<void> {
    try {
      await this.userModel.create({
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role ?? UserRole.USER,
      });
      return;
    } catch (err) {
      throw err;
    }
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select("-__v").exec();
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.userModel.deleteOne({ _id: id });
      return result.deletedCount >= 1;
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, data: Partial<UserPersist>): Promise<UserDocument> {
    try {
      const result = await this.userModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      }).select('-__v').exec();

      if (!result) throw new RepositoryException(ErrorMessages.USER_NOT_FOUND);

      return result;
    } catch (err) {
      throw err;
    }
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select("-__v").exec();
  }

  getDocumentLength(): Promise<number> {
    return this.userModel.countDocuments();
  }


  getAll(): Promise<UserDocument[]> {
    return this.userModel.find({}).select("-__v -password").exec()

  }
}

