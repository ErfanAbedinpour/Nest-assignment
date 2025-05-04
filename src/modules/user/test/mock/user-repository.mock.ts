import { UserRepository } from "../../repository/abstract/user.repository";

export const mockUserRepo = {
    create: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    getAll: jest.fn(),
    getDocumentLength: jest.fn(),
    update: jest.fn(),
} as UserRepository;

