import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ProductRepository } from '../repository/abstract/product.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from '../DTO/create-product.dto';
import { UpdateProductDto } from '../DTO/update-product.dto';
import { GetSimilarProductQueryDTO } from '../DTO/get-similar-product.dto';
import Decimal from 'decimal.js';
import { ProductDocument } from '../../../schemas';

describe('ProductService', () => {
    let service: ProductService;
    let repository: jest.Mocked<ProductRepository>;
    let emitter: jest.Mocked<EventEmitter2>;

    const mockRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        similaritySearch: jest.fn(),
    };

    const mockEventEmitter = {
        emit: jest.fn(),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: ProductRepository, useValue: mockRepository },
                { provide: EventEmitter2, useValue: mockEventEmitter },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        repository = module.get(ProductRepository);
        emitter = module.get(EventEmitter2);
    });

    afterEach(() => jest.clearAllMocks());

    it('should create product and emit event', async () => {
        const dto: CreateProductDto = {
            name: 'Test Product',
            description: 'Some Description',
            category: 'Category',
            price: Decimal(100),
        };

        const mockCreated = {
            _id: '123',
            name: dto.name,
            originalDescription: dto.description,
            category: dto.category,
            price: dto.price,
            vector: [1, 2, 3],
            __v: 0,
            toObject: function () {
                return this;
            },
        };

        repository.create.mockResolvedValueOnce(mockCreated as unknown as ProductDocument);

        const result = await service.create(dto);

        expect(repository.create).toHaveBeenCalled();
        expect(emitter.emit).toHaveBeenCalledWith(
            'product.created',
            expect.objectContaining({
                id: '123',
                originalDescription: dto.description,
            }),
        );
        expect(result).not.toHaveProperty('vector');
        expect(result).not.toHaveProperty('__v');
    });

    it('should find all products and omit vector', async () => {
        const mockData = [
            {
                _id: '1',
                name: 'Product 1',
                vector: [1, 2],
                toObject: function () {
                    return this;
                },
            },
        ];
        repository.findAll.mockResolvedValueOnce(mockData as unknown as ProductDocument[]);

        const result = await service.findAll(10, 1);

        expect(result[0]).not.toHaveProperty('vector');
        expect(repository.findAll).toHaveBeenCalledWith(10, 1);
    });

    it('should find one product', async () => {
        const mockProduct = {
            _id: '1',
            name: 'Single Product',
            vector: [1, 2],
            toObject: function () {
                return this;
            },
        };

        repository.findById.mockResolvedValueOnce(mockProduct as unknown as ProductDocument);

        const result = await service.findOne('1');

        expect(result).not.toHaveProperty('vector');
    });

    it('should throw NotFoundException when product not found in findOne', async () => {
        repository.findById.mockResolvedValueOnce(null);
        await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should update a product', async () => {
        const dto: UpdateProductDto = { name: 'Updated', price: Decimal(200) };
        const updated = {
            _id: '1',
            ...dto,
            toObject: function () {
                return this;
            },
        };
        repository.update.mockResolvedValueOnce(updated as unknown as ProductDocument);

        const result = await service.update('1', dto);
        expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException when update fails', async () => {
        repository.update.mockResolvedValueOnce(null);
        await expect(service.update('999', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should remove a product', async () => {
        const mockProduct = {
            _id: '1',
            name: 'Delete Me',
            toObject: function () {
                return this;
            },
        };
        repository.delete.mockResolvedValueOnce(mockProduct as any);
        const result = await service.remove('1');
        expect(result.name).toBe('Delete Me');
    });

    it('should throw NotFoundException when remove fails', async () => {
        repository.delete.mockResolvedValueOnce(null);
        await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });

    it('should find similar products', async () => {
        const mockProduct = {
            _id: '1',
            name: 'Main Product',
            vector: [0.1, 0.2],
        };
        const mockSimilar = [{ _id: '2', name: 'Similar Product' }];

        repository.findById.mockResolvedValueOnce(mockProduct as unknown as ProductDocument);
        repository.similaritySearch.mockResolvedValueOnce(mockSimilar as unknown as ProductDocument[]);

        const dto: GetSimilarProductQueryDTO = {
            id: '1',
            limit: 5,
            threshold: 0.7,
        };

        const result = await service.findSimilarProduct(dto);

        expect(result).toEqual(mockSimilar);
    });

    it('should throw NotFoundException if product not found in similarity search', async () => {
        repository.findById.mockResolvedValueOnce(null);
        const dto: GetSimilarProductQueryDTO = {
            id: 'x',
            limit: 5,
            threshold: 0.7,
        };
        await expect(service.findSimilarProduct(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if vector is missing in similarity search', async () => {
        const mockProduct = {
            _id: '1',
            name: 'No Vector',
        };
        repository.findById.mockResolvedValueOnce(mockProduct as unknown as ProductDocument);
        const dto: GetSimilarProductQueryDTO = {
            id: '1',
            limit: 5,
            threshold: 0.7,
        };
        await expect(service.findSimilarProduct(dto)).rejects.toThrow(BadRequestException);
    });
});
