import { Injectable, Logger } from "@nestjs/common";
import { EmbeddingService } from "./abstract/embedding.service";
import OpenAI from "openai";

@Injectable()
export class OpenApiEmbeddingService implements EmbeddingService {

    private openai: OpenAI;
    private logger = new Logger(OpenApiEmbeddingService.name);

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
    }

    async generateEmbedding(text: string): Promise<number[]> {
        return []
    }
}