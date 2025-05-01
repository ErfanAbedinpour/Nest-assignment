import { Test } from "@nestjs/testing"
import { MongoUserRepository } from "../mongo-user-repository"
import { getModelToken } from "@nestjs/mongoose"
import { User, UserDocument, UserRole } from "../../../../schemas"
import { Model } from "mongoose"
import { RepositoryException } from "../../../../exception/respository.exception"
import { ErrorMessages } from "../../../../errorResponses/errorResponse.enum "
import { resourceUsage } from "process"

describe("MongoUserRepository", () => {

    let repository: MongoUserRepository;
    const userModelMock = {
        create: jest.fn(),
        findById: jest.fn(),
        deleteOne: jest.fn(),
        findOneAndUpdate: jest.fn()
    } as unknown as Model<User>

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [MongoUserRepository,
                {
                    provide: getModelToken(User.name),
                    useValue: userModelMock
                }
            ]
        }).compile()

        repository = moduleRef.get(MongoUserRepository)
    })


    it("Should be defined", () => {
        expect(repository).toBeDefined()
        expect(userModelMock).toBeDefined()
    })

    it("Should be new UserDocument", async () => {
        jest.spyOn(userModelMock, 'create').mockResolvedValueOnce({} as any)


        const payload = { email: 'test-mail', name: "test-name", password: "test-password" }
        await repository.create(payload)
        expect(userModelMock.create).toHaveBeenCalledWith({
            email: payload.email,
            password: payload.password,
            name: payload.name,
            role: UserRole.USER
        })
    })



    it("Should be find UserDocument", async () => {
        jest.spyOn(userModelMock, 'findById').mockResolvedValue({ email: "test-mail", name: 'test-name' } as unknown as UserDocument)


        const result = await repository.findById("true-object-id");

        expect(result!.name).toEqual('test-name')
        expect(result!.email).toEqual('test-mail')
        expect(userModelMock.findById).toHaveBeenCalledWith("true-object-id")
    })



    it("Should be return false if userDoc not found", async () => {

        jest.spyOn(userModelMock, 'deleteOne').mockResolvedValueOnce({ deletedCount: 0, acknowledged: true });

        const result = await repository.delete("wrong-object-id")
        expect(result).toEqual(false)
        expect(userModelMock.deleteOne).toHaveBeenCalledWith({ _id: "wrong-object-id" })
    })


    it("Should be return true if userDoc successfully deleted", async () => {

        jest.spyOn(userModelMock, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1, acknowledged: true });
        const result = await repository.delete("true-object-id")
        expect(result).toEqual(true)
        expect(userModelMock.deleteOne).toHaveBeenCalledWith({ _id: "true-object-id" })
    })



    it("Should be Throw Exception Because Doc not found", async () => {
        jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(null)
        try {
            await repository.update("wrong-object-id", {})
        } catch (err) {
            expect(err).toBeInstanceOf(RepositoryException)
            expect(err.message).toEqual(ErrorMessages.USER_NOT_FOUND)
            expect(userModelMock.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'wrong-object-id' }, {}, { new: true })
        }
    })

    it("Should be Updated successfully", async () => {
        const payload = { email: "new-test-mail", name: 'new-name' };

        jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(payload as unknown as UserDocument)

        const result = await repository.update("true-object-id", payload)
        expect(result.name).toEqual('new-name')
        expect(result.email).toEqual('new-test-mail')
        expect(userModelMock.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'true-object-id' }, { name: payload.name, email: payload.email }, { new: true })
    })

})