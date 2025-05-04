import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { pipeline, Text2TextGenerationPipeline } from '@xenova/transformers';
import { TransformerDescriptionService } from '../transformer-description.service.impl';

jest.mock('@xenova/transformers', () => ({
    pipeline: jest.fn(),
}));

describe('TransformerDescriptionService', () => {
    let service: TransformerDescriptionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransformerDescriptionService],
        }).compile();

        service = module.get<TransformerDescriptionService>(TransformerDescriptionService);
    });

    describe('standardize', () => {
        it('should return standardized description', async () => {
            const mockGenerator = jest.fn().mockResolvedValue([
                { generated_text: 'Improved description here.' },
            ]);

            service["generator"] = mockGenerator as unknown as Text2TextGenerationPipeline;

            const result = await service.standardize('bad grammar description');
            expect(result).toBe('Improved description here.');
            expect(mockGenerator).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on failure', async () => {
            const mockGenerator = jest.fn().mockRejectedValue(new Error('Model error'));

            service["generator"] = mockGenerator as unknown as Text2TextGenerationPipeline;

            await expect(service.standardize('fail case')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('onModuleInit', () => {
        it('should initialize generator using pipeline', async () => {
            const mockGeneratorFn = jest.fn();
            (pipeline as jest.Mock).mockResolvedValue(mockGeneratorFn);

            await service.onModuleInit();

            expect(pipeline).toHaveBeenCalledWith('text2text-generation', 'Xenova/LaMini-Flan-T5-783M', {});
            expect((service as any).generator).toBe(mockGeneratorFn);
        });
    });
});
