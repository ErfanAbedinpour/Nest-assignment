import { Injectable, Logger } from "@nestjs/common";
import { EmbeddingService } from "./abstract/embedding.service";
import { pipeline } from "@xenova/transformers";

@Injectable()
export class OpenApiEmbeddingService implements EmbeddingService {
    private logger = new Logger(OpenApiEmbeddingService.name);

    private embedder: any;

    async onModuleInit() {
        this.logger.log('Loading embedding model...');

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
}