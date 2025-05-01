import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    ADMIN = "Admin",
    USER = 'User'
}

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: String, unique: true })
    email: string

    @Prop({ enum: UserRole, required: true, default: UserRole.USER, })
    role: UserRole

    @Prop({ required: true, type: String })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User);