import { HashingService } from "../../hashing/hashing.abstract";

export const hashServiceMock: HashingService = {
    hash: jest.fn(),
    verify: jest.fn()
}