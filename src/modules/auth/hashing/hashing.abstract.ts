export abstract class HashingService {
  abstract hash(text: string): Promise<string>;
  abstract verify(hash: string, text: string): Promise<boolean>;
}
