import { Test } from "@nestjs/testing"
import { AuthService } from "../auth.service"
import { HashingService } from "../hashing/hashing.abstract"
import { hashServiceMock } from "./mock/hashingService.mock"
import { UserService } from "../../user/user.service"
import { RegisterUserDTO } from "../DTO/register-user.dto"
import { NotFoundException } from "@nestjs/common"
import { ErrorMessages } from "../../../errorResponses/errorResponse.enum "

describe("AuthService", function () {

    let service: AuthService
    let hashService: HashingService
    let userServiceMock = {
        createUser: jest.fn()
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
        it("Should be registered successful", async () => {
            jest.spyOn(hashService, 'hash').mockResolvedValue("fake-hash");
            jest.spyOn(userServiceMock, 'createUser').mockResolvedValue(null);


            const res = await service.registerUser(payload)
            expect(res).toEqual({ msg: "User Registered successfully" })
            expect(hashService.hash).toHaveBeenCalledWith(payload.password);
            expect(userServiceMock.createUser).toHaveBeenCalledWith(payload.name, payload.email, 'fake-hash')
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
})