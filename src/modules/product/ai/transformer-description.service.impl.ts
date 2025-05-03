import {
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { DescriptionService } from './abstract/description.service';
import {
  pipeline,
  Text2TextGenerationOutput,
  Text2TextGenerationPipeline,
  Text2TextGenerationSingle,
} from '@xenova/transformers';

export class TransformerDescriptionService
  implements DescriptionService, OnModuleInit
{
  private generator: Text2TextGenerationPipeline;
  private logger = new Logger(TransformerDescriptionService.name);

  async onModuleInit() {
    this.logger.log('Starting Descriptor Model, please wait');

    /**
     * This Model is Small Models not Good for rewriting
     */

    const model_id = 'Xenova/LaMini-Flan-T5-783M';
    this.generator = await pipeline('text2text-generation', model_id, {});

    this.logger.log('Embedding Model Loaded');
  }

  async standardize(rawDescription: string): Promise<string> {
    try {
      /**
       * Use TransferJs For Load Load Model In memory and Use them Because OPENAI Model Is Block Form IRAN
       * this Model is Not Prefect You can Replace with Better than
       */

      const prompt = `
       Improve the following product description by correcting grammar and spelling mistakes, unifying its structure, and optimizing it for search engines using relevant keywords:
        "${rawDescription}"`;

      const output = (await this.generator(
        prompt,
      )) as unknown as Text2TextGenerationSingle[];

      return output[0].generated_text;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
