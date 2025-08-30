import type { Product } from '../generated/prisma';
import { getPrismaClient } from '../helpers/prisma-client';

const client = getPrismaClient();

export interface ProductRepository {
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
}
export const productRepository = {
    async findById(id: number): Promise<Product | null> {
        return await client.product.findFirst({ where: { id } });
    },
    async findAll(): Promise<Product[]> {
        return await client.product.findMany();
    },
};
