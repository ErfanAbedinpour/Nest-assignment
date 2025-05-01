export abstract class UserSessionRepository {
    abstract create(token: string, userId: string, tokenId: string): Promise<void>

    abstract invalidate(tokenId: string): Promise<void>

    abstract isValid(tokenId: string, token: string): Promise<boolean>
}