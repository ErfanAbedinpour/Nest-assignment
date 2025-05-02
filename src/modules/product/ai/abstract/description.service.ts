export abstract class DescriptionService {
  abstract standardize(raw: string): Promise<string>;
}
