export class ProductCreatedEvent {
  constructor(
    public id: string,
    public originalDescription: string,
  ) {}
}
