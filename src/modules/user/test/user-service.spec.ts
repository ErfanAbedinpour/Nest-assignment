import { Test } from "@nestjs/testing"
import { UserController } from "../user.controller"
import { UserService } from "../user.service"
import { UserRepository } from "../repository/abstract/user.repository";
import { mockUserRepo } from "./mock/user-repository.mock";
import { MongoServerError } from "mongodb";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessages } from "../../../errorResponses/errorResponse.enum ";
import { UserRole } from "../../../schemas";

describe("UserService", () => {


    let service: UserService;
    let userRepo: UserRepository
    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepo
                }
            ],
        }).compile()

        service = moduleRef.get(UserService);
        userRepo = moduleRef.get(UserRepository)

    })


    it("Should be defined", () => {
        expect(service).toBeDefined()
        expect(userRepo).toBeDefined()
    })


    describe("CreateUser", () => {
        it("Should be Throw BadRequest Because Email Is Already Taken", async () => {
            jest.spyOn(userRepo, 'create').mockRejectedValueOnce(new MongoServerError({ code: 11000 }))

            try {

                await service.createUser("name", 'email', "password")
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException)
                expect(err.message).toEqual(ErrorMessages.UNIQUE_EMAIl)
                expect(userRepo.create).toHaveBeenCalled()
            }
        })


        it("Should be Registered successfully", async () => {
            jest.spyOn(userRepo, 'create').mockResolvedValueOnce()


            const result = await service.createUser("name", 'email', "password")
            expect(result.msg).toEqual("User Created successfully")

            expect(userRepo.create).toHaveBeenCalledWith({ email: "email", name: "name", password: "password", role: undefined })
        })
    })
})