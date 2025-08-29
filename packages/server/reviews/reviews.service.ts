import { getOllamaLLM } from '../chat/llm-model';
import type { Review, Summary } from '../generated/prisma';
import { ProductNotFoundError } from '../products/errors/product-not-found.error';
import { summaryService } from '../summary/summary.service';
import { NoReviewsForProductError } from './errors/no-reviews-error';
import { getPromptForReviewSummary } from './prompt.helper';
import { reviewRepository } from './review.repository';

export const reviewsService = {
    async findAll(productId: number): Promise<Review[]> {
        return await reviewRepository.findByProductId(productId);
    },
    async summarizeReviews(productId: number): Promise<Summary> {
        const product = await reviewRepository.findProductById(productId);
        if (!product) {
            throw ProductNotFoundError.create(productId);
        }
        const existingSummary = await summaryService.getValidSummary(productId);

        if (existingSummary) return existingSummary;

        const limit = 10;
        const last10Reviews = await reviewRepository.findByProductId(
            productId,
            limit
        );
        if (last10Reviews.length < 1) {
            throw NoReviewsForProductError.create(productId);
        }
        const joinedReviews = last10Reviews
            .map((review) => review.content)
            .join('\n\n');

        const prompt = getPromptForReviewSummary(joinedReviews);
        const llm = getOllamaLLM();

        const aiMsg = await llm.invoke(prompt);
        const summaryContent = aiMsg.content.toString();

        return await reviewRepository.storeReviewSummary(
            productId,
            summaryContent
        );
    },

    async getReviewSummary(productId: number): Promise<Summary | null> {
        return await summaryService.getValidSummary(productId);
    },
};
