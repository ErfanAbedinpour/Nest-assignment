import { InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { DescriptionService } from './abstract/description.service';
import { pipeline, Text2TextGenerationOutput, Text2TextGenerationPipeline, Text2TextGenerationSingle } from '@xenova/transformers';

export class OpenRouterDescriptionService implements DescriptionService, OnModuleInit {

  private generator: Text2TextGenerationPipeline
  private logger = new Logger(OpenRouterDescriptionService.name);

  async onModuleInit() {
    console.log('Starting Generating Text2Text Model')

    this.generator = await pipeline(
      'text2text-generation',
      'Xenova/flan-t5-base'
    );

    console.log('Finish Generating Text2Text Model')
  }

  async standardize(rawDescription: string): Promise<string> {
    try {

      const prompt = `Rewrite the following product description to sound professional, SEO-friendly, and natural. Fix grammar and spelling, and improve structure for semantic search. Do not use lists.\n\nDescription: "${rawDescription}"`;

      const output = (await this.generator(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
      })) as unknown as Text2TextGenerationSingle[]

      return output[0].generated_text
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
