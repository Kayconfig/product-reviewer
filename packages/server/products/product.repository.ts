import type { Product } from '../generated/prisma';
import { getPrismaClient } from '../helpers/prisma-client';

export const productRepository = {
    async findById(id: number): Promise<Product | null> {
        const client = getPrismaClient();
        return await client.product.findFirst({ where: { id } });
    },
};
