import { InternalServerErrorException, Logger } from "@nestjs/common";
import { DescriptionService } from "./abstract-description.service";
import { OpenAI } from 'openai'

export class OpenApiDescriptionService implements DescriptionService {
    private openai: OpenAI;

    private logger = new Logger(OpenApiDescriptionService.name);

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPEN_ROUTER_API_KEY, baseURL: 'https://openrouter.ai/api/v1',
        });
    }


    async standardize(rawDescription: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: `You are a product description expert. Standardize the following product description:
                    - Fix grammar and spelling
                    - Unify the structure (e.g., intro, features, benefits)
                    - Optimize for search (SEO-friendly)
                    - Is optimized for semantic search 
                    - Avoids bullet points or lists
                    - Sounds professional and natural
                    `
                },
                {
                    role: 'user',
                    content: rawDescription,
                }],
            });

            const text = response.choices[0].message.content
            return text || rawDescription;
        } catch (err) {
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}