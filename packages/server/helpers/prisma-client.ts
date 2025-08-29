import { PrismaClient } from '../generated/prisma';

export const getPrismaClient = (() => {
    let client: PrismaClient;
    return (): PrismaClient => {
        if (!client) {
            client = new PrismaClient();
        }
        return client;
    };
})();
