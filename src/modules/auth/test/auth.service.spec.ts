import { Test } from "@nestjs/testing"
import { AuthService } from "../auth.service"
import { HashingService } from "../hashing/hashing.abstract"
import { hashServiceMock } from "./mock/hashingService.mock"
import { UserService } from "../../user/user.service"
import { RegisterUserDTO } from "../DTO/register-user.dto"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { ErrorMessages } from "../../../errorResponses/errorResponse.enum "
import { UserTokenService } from "../jwt-strategies/user-token.service"
import { UserDocument, UserRole } from "../../../schemas"
import { JsonWebTokenError } from "@nestjs/jwt"
import { Types } from "mongoose"

describe("AuthService", function () {

    let service: AuthService
    let hashService: HashingService

    let mockTokenService = {
        generateToken: jest.fn(),
        verifyRefreshToken: jest.fn(),
        isValidate: jest.fn(),
        invalidate: jest.fn()
    } as unknown as UserTokenService;

    let userServiceMock = {
        createUser: jest.fn(),
        findUserByEmail: jest.fn(),
        findUserById: jest.fn(),
        getUsersLength: jest.fn()
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: HashingService,
                    useValue: hashServiceMock
                },
                {
                    provide: UserService,
                    useValue: userServiceMock
                },
                {
                    provide: UserTokenService,
                    useValue: mockTokenService
                }
            ]

        }).compile()


        service = moduleRef.get(AuthService)
        hashService = moduleRef.get(HashingService)
        userServiceMock = moduleRef.get(UserService)
    })



    it("Should be defined", () => {
        expect(service).toBeDefined()
        expect(hashService).toBeDefined()
        expect(userServiceMock).toBeDefined()
    })


    describe("CreateUser", () => {

        const payload = {
            email: "test-mail",
            name: "test-name",
            password: "test-password"
        } as RegisterUserDTO

        it("Should be registered successful With Admin Role", async () => {
            jest.spyOn(hashService, 'hash').mockResolvedValue("fake-hash");
            jest.spyOn(userServiceMock, 'createUser').mockResolvedValue(null);
            jest.spyOn(userServiceMock, 'getUsersLength').mockResolvedValue(0)

            const res = await service.registerUser(payload)
            expect(res).toEqual({ msg: "User Registered successfully" })
            expect(hashService.hash).toHaveBeenCalledWith(payload.password);
            expect(userServiceMock.createUser).toHaveBeenCalledWith(payload.name, payload.email, 'fake-hash', UserRole.ADMIN)
        })


        it("Should be Throw BadRequestException Because Email Is exist before", async () => {
            jest.spyOn(hashService, 'hash').mockResolvedValue("fake-hash");
            jest.spyOn(userServiceMock, 'createUser').mockResolvedValue(new NotFoundException());
            try {
                await service.registerUser(payload)
            } catch (err) {
                expect(err).toThrow(NotFoundException)
                expect(err).toThrow(ErrorMessages.UNIQUE_EMAIl)
                expect(hashService.hash).toHaveBeenCalledWith(payload.password);
                expect(userServiceMock.createUser).toHaveBeenCalledWith(payload.name, payload.email, 'fake-hash')
            }
        })
    })


    describe("LoginUser", () => {

        it("Should be Throw BadRequest Because User is Not Found", async () => {
            jest.spyOn(userServiceMock, 'findUserByEmail').mockRejectedValueOnce(new NotFoundException("not found"))

            try {
                await service.loginUser({ email: "", password: "" });
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual('not found');
            }
        })

        it("Should be Throw NotFoundException Because Password is Invalid", async () => {
            jest.spyOn(userServiceMock, 'findUserByEmail')
                .mockResolvedValueOnce({ password: "argon-hash-pass" } as UserDocument)

            jest.spyOn(hashService, 'verify').mockResolvedValue(false);

            try {
                await service.loginUser({ email: "email", password: "pass" });
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundException);
                expect(err.message).toEqual(ErrorMessages.USER_NOT_FOUND);
                expect(hashService.verify).toHaveBeenCalledWith('argon-hash-pass', 'pass')
            }
        })


        it("Should be Login Successful", async () => {
            jest.spyOn(userServiceMock, 'findUserByEmail')
                .mockResolvedValueOnce({ password: "argon-hash-pass", name: "test-name", id: "object-id", role: UserRole.USER, email: 'test-mail' } as UserDocument)

            jest.spyOn(hashService, 'verify').mockResolvedValue(true);

            jest.spyOn(mockTokenService, 'generateToken').mockResolvedValueOnce({ accessToken: "test-access", refreshToken: "test-refreshToken" })


            const result = await service.loginUser({ email: "email", password: "pass" });


            expect(result.accessToken).toEqual('test-access')
            expect(result.refreshToken).toEqual('test-refreshToken')
            expect(hashService.verify).toHaveBeenCalledWith('argon-hash-pass', 'pass')
            expect(userServiceMock.findUserByEmail).toHaveBeenCalledWith("email")
            expect(mockTokenService.generateToken).toHaveBeenCalledWith({
                email: "test-mail",
                id: "object-id",
                name: "test-name",
                role: UserRole.USER
            })
        })
    })


    describe("Generate Token", () => {
        it("Should Be Throw BadRequest Because JWT is expired.", async () => {
            jest.spyOn(mockTokenService, 'verifyRefreshToken').mockRejectedValueOnce(new JsonWebTokenError("error"))


            try {

                await service.generateToken({ refreshToken: "invalid-token" });
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException)
                expect(err.message).toEqual(ErrorMessages.INVALID_REFRESH_TOKEN)
                expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith('invalid-token')
            }
        })


        it("Should be Throw BadRequest Because Token Is Invalid", async () => {
            jest.spyOn(mockTokenService, 'verifyRefreshToken').mockResolvedValueOnce({ tokenId: "test-tokenId", userId: "test-user-id" });
            jest.spyOn(mockTokenService, 'isValidate').mockResolvedValueOnce(false);

            try {
                await service.generateToken({ refreshToken: "invalid-token" });
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException)
                expect(err.message).toEqual(ErrorMessages.INVALID_REFRESH_TOKEN)
                expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith('invalid-token')
                expect(mockTokenService.isValidate).toHaveBeenCalledWith('test-tokenId', 'invalid-token');
            }
        })


        it("Should be Throw BadRequest Because User Not found", async () => {
            const objId = new Types.ObjectId()
            jest.spyOn(mockTokenService, 'verifyRefreshToken').mockResolvedValueOnce({ tokenId: "test-tokenId", userId: objId.toString() });
            jest.spyOn(mockTokenService, 'isValidate').mockResolvedValueOnce(true);
            jest.spyOn(mockTokenService, 'invalidate').mockResolvedValueOnce();
            jest.spyOn(userServiceMock, 'findUserById').mockResolvedValueOnce(null)

            try {
                await service.generateToken({ refreshToken: "valid-token" });
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException)
                expect(err.message).toEqual(ErrorMessages.USER_NOT_FOUND)
                expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith('valid-token')
                expect(mockTokenService.isValidate).toHaveBeenCalledWith('test-tokenId', 'valid-token');
                expect(mockTokenService.invalidate).toHaveBeenCalledWith('test-tokenId');
                expect(userServiceMock.findUserById).toHaveBeenCalledWith(objId)
            }
        })


        it("Should be Generate new Token Successfully", async () => {
            const objId = new Types.ObjectId()
            const fakeUserInput = {
                email: "test-mail",
                name: 'test-name',
                id: objId,
                role: UserRole.USER
            }
            jest.spyOn(mockTokenService, 'verifyRefreshToken').mockResolvedValueOnce({ tokenId: "test-tokenId", userId: objId.toString() });
            jest.spyOn(mockTokenService, 'isValidate').mockResolvedValueOnce(true);
            jest.spyOn(mockTokenService, 'invalidate').mockResolvedValueOnce();
            jest.spyOn(userServiceMock, 'findUserById').mockResolvedValueOnce(fakeUserInput)
            jest.spyOn(mockTokenService, 'generateToken').mockResolvedValueOnce({ accessToken: 'test-access', refreshToken: 'test-refresh' })

            const result = await service.generateToken({ refreshToken: "valid-token" });
            expect(result.accessToken).toEqual('test-access')
            expect(result.refreshToken).toEqual('test-refresh')
            expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith('valid-token')
            expect(mockTokenService.isValidate).toHaveBeenCalledWith('test-tokenId', 'valid-token');
            expect(mockTokenService.invalidate).toHaveBeenCalledWith('test-tokenId');
            expect(userServiceMock.findUserById).toHaveBeenCalledWith(objId)
            expect(mockTokenService.generateToken).toHaveBeenCalledWith(
                {
                    email: fakeUserInput.email,
                    id: objId,
                    name: fakeUserInput.name,
                    role: fakeUserInput.role
                }
            )

        })
    })
})
