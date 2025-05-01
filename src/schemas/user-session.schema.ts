import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type SessionDocument = HydratedDocument<Session>;


@Schema()
export class Session extends Document {
    @Prop({ type: Types.ObjectId, unique: true })
    tokenId: Types.ObjectId

    @Prop({ required: true, type: String, unique: true })
    token: string

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User
}

export const SessionSchema = SchemaFactory.createForClass(Session);