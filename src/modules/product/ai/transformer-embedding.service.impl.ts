import { Injectable, Logger } from "@nestjs/common";
import { EmbeddingService } from "./abstract/embedding.service";
import { pipeline } from "@xenova/transformers";

@Injectable()
export class TransformerEmbeddingService implements EmbeddingService {
    private logger = new Logger(TransformerEmbeddingService.name);

    private embedder: any;

    async onModuleInit() {
        this.logger.log('Loading embedding model. please wait...');

        this.embedder = await pipeline(
            'feature-extraction',
            'Xenova/nomic-embed-text-v1'
        );
        this.logger.log('Embedding model loaded.');
    }

    async generateEmbedding(text: string): Promise<number[]> {

        if (!this.embedder) {
            throw new Error('Embedder not loaded yet');
        }

        const results = await this.embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(results.data);
    }


    cosineSimilarity(firstVector: number[], secondVector: number[]): number {
        const dot = firstVector.reduce((sum, ai, i) => sum + ai * secondVector[i], 0);
        const magA = Math.sqrt(firstVector.reduce((sum, ai) => sum + ai * ai, 0));
        const magB = Math.sqrt(secondVector.reduce((sum, bi) => sum + bi * bi, 0));
        return dot / (magA * magB);
    }
}