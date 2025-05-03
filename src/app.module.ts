import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UserSessionModule } from './modules/user-session/user-session.module';
import { ProductModule } from './modules/product/product.module';
import * as dotenv from 'dotenv';
import { EventEmitterModule } from '@nestjs/event-emitter';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      isGlobal: true,
      cache: true,
    }),
    EventEmitterModule.forRoot({ global: true }),
    AuthModule,
    UserModule,
    UserSessionModule,
    ProductModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
