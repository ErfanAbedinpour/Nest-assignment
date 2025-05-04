import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../DTO/create-product.dto';
import { UpdateProductDto } from '../DTO/update-product.dto';
import { GetAllProductDTO } from '../DTO/get-all-product.dto';
import { ProductController } from '../product.controller';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import Decimal from 'decimal.js';

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService;

    const mockProductService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        findSimilarProduct: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{ provide: ProductService, useValue: mockProductService }],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        service = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a product', async () => {
        const dto: CreateProductDto = { description: "this is test Description", category: "Computer-utils", name: 'New Product', price: Decimal(100) };
        mockProductService.create.mockResolvedValue({ id: '1', ...dto });
        const result = await controller.create(dto);
        expect(result).toEqual({ id: '1', ...dto });
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw InternalServerErrorException when create fails', async () => {
        const dto: CreateProductDto = {
            description: "error test",
            category: "test-cat",
            name: 'Bad Product',
            price: Decimal(0),
        };
        mockProductService.create.mockRejectedValueOnce(new InternalServerErrorException('Create failed'));
        await expect(controller.create(dto)).rejects.toThrow(InternalServerErrorException);
        expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should return all products', async () => {
        const query: GetAllProductDTO = { page: 1, limit: 10 };
        mockProductService.findAll.mockResolvedValue([{ id: '1', name: "test-name" }])
        const result = await controller.findAll(query);
        expect(result).toEqual([{ id: '1', name: 'test-name' }]);
        expect(service.findAll).toHaveBeenCalledWith(10, 1);
    });

    it('should return one product', async () => {
        mockProductService.findOne.mockResolvedValue({ id: '1', name: "test-product" })
        const result = await controller.findOne('1');
        expect(result).toEqual({ id: '1', name: 'test-product' });
        expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product not found', async () => {
        mockProductService.findOne.mockRejectedValueOnce(new NotFoundException('Product not found'));
        await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
        expect(service.findOne).toHaveBeenCalledWith('999');
    });

    it('should update a product', async () => {
        mockProductService.update.mockResolvedValue({ id: "1", name: "Updated Title" })
        const dto: UpdateProductDto = { name: 'Updated Title' };
        const result = await controller.update('1', dto);
        expect(result).toEqual({ id: '1', ...dto });
        expect(service.update).toHaveBeenCalledWith('1', dto);
    });

    it('should throw NotFoundException when updating a non-existing product', async () => {
        const dto: UpdateProductDto = { name: 'Update Fail' };
        mockProductService.update.mockRejectedValueOnce(new NotFoundException('Product not found'));
        await expect(controller.update('999', dto)).rejects.toThrow(NotFoundException);
        expect(service.update).toHaveBeenCalledWith('999', dto);
    });

    it('should remove a product', async () => {
        mockProductService.remove.mockResolvedValueOnce({ id: "1", name: "product-test" })
        const result = await controller.remove('1');
        expect(result).toEqual({ id: '1', name: 'product-test' });
        expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when removing a non-existing product', async () => {
        mockProductService.remove.mockRejectedValueOnce(new NotFoundException('Product not found'));
        await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
        expect(service.remove).toHaveBeenCalledWith('999');
    });
    it('should return similar products', async () => {
        mockProductService.findSimilarProduct.mockResolvedValueOnce([{ id: "1", name: 'test-1' }, { id: '2', name: "test-2" }])
        const result = await controller.findSimilar({ id: '1', limit: 10, threshold: 0.8 });
        expect(result).toEqual([{ id: '1', name: 'test-1' }, { id: "2", name: 'test-2' }]);
        expect(service.findSimilarProduct).toHaveBeenCalledWith({ id: '1', limit: 10, threshold: 0.8 });
    });
});
