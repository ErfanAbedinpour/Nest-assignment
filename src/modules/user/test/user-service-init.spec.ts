import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../repository/abstract/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BadRequestException, INestApplicationContext, NotFoundException } from '@nestjs/common';
import { MongoUserRepository } from '../repository/mongo-user-repository';
import { User, UserSchema } from '../../../schemas';
import { Types } from 'mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('UserService (Integration Test)', () => {
    let userService: UserService;
    let userRepository: UserRepository;
    let mongod: MongoMemoryServer;
    let app: NestExpressApplication;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(uri),
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
            ],
            providers: [UserService, { provide: UserRepository, useClass: MongoUserRepository }],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>(UserRepository);
        app = module.createNestApplication<NestExpressApplication>();
        await app.init();
    });

    afterAll(async () => {
        await mongod.stop();
        await app.close()
    });

    // beforeEach(async () => {
    //     await mongod.cleanup({ doCleanup: true })
    //     // await userRepository.deleteAll();
    // });

    it('should create a new user', async () => {
        const result = await userService.createUser('test-name', 'test-mail', 'test-pass');
        expect(result.name).toEqual("test-name");

        const users = await userRepository.getAll();

        expect(users.length).toBe(1);
        expect(users[0].email).toBe('test-mail');
    });

    it('should throw an error if email is already taken', async () => {
        await userService.createUser('test-2-name', 'test-2-mail', 'password123');

        try {
            await userService.createUser('name', 'test-2-mail', 'password456');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toContain('Email is already registered');
        }
    });

    it('should find a user by id', async () => {
        const createdUser = await userService.createUser('test-3-name', 'test-3-mail', 'password123');
        const foundUser = await userService.findUserById(createdUser.id);
        expect(foundUser.email).toBe('test-3-mail');
    });

    it('should throw an error if user not found', async () => {
        expect(userService.findUserById((new Types.ObjectId()).toString())).rejects.toThrow(NotFoundException);
    });

    it('should update user data', async () => {
        const createdUser = await userService.createUser('test-4-name', 'test-4-mail', 'password123');
        const updatedUser = await userService.updateUser(createdUser.id, {
            name: 'test-5-name',
            email: 'test-5-mail'
        });
        expect(updatedUser.name).toBe('test-5-name');
        expect(updatedUser.email).toBe('test-5-mail');
    });

    it('should delete a user', async () => {
        const createdUser = await userService.createUser('test-6-name', 'test-6-mail', 'password123');
        const result = await userService.deleteUser(createdUser.id);
        expect(result).toEqual({ msg: 'User Removed successfully' });

        try {
            await userService.findUserById(createdUser.id);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toContain('User not found');
        }
    });
});
