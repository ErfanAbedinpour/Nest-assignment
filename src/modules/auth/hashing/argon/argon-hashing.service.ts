import { hash, verify } from "argon2";
import { HashingService } from "../hashing.abstract";

export class ArgonHashingService implements HashingService {
    async hash(text: string): Promise<string> {
        return (await hash(text, { secret: Buffer.from(process.env.ARGON_SECRET) })).toString();
    }

    verify(hash: string, text: string): Promise<boolean> {
        return verify(hash, text, { secret: Buffer.from(process.env.ARGON_SECRET) })
    }
}