import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop()
  originalDescription: string;

  @Prop()
  standardizedDescription: string;

  @Prop({ type: [Number], default: [] })
  vector?: number[];
}
export const ProductSchema = SchemaFactory.createForClass(Product);
