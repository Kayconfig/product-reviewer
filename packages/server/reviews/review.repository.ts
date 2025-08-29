import { type Product, type Review, type Summary } from '../generated/prisma';
import { getPrismaClient } from '../helpers/prisma-client';
import { summaryRepository } from '../summary/summary.repository';

const client = getPrismaClient();
export const reviewRepository = {
    async findById(id: number): Promise<Review | null> {
        return await client.review.findFirst({ where: { id } });
    },

    async findByProductId(
        productId: number,
        limit: number = 100
    ): Promise<Review[]> {
        return await client.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },
    async storeReviewSummary(
        productId: number,
        summaryContent: string
    ): Promise<Summary> {
        return await summaryRepository.create({
            content: summaryContent,
            productId,
        });
    },

    async getReviewSummary(productId: number): Promise<Summary | null> {
        return await summaryRepository.findByProductId(productId);
    },

    async findProductById(productId: number): Promise<Product | null> {
        return await client.product.findFirst({ where: { id: productId } });
    },
};
