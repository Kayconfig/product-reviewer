import { HttpStatusCode } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import type { Review } from '../generated/prisma';
import { ProductNotFoundError } from '../products/errors/product-not-found.error';
import { NoReviewsForProductError } from './errors/no-reviews-error';
import { reviewsService } from './reviews.service';

export const reviewController = {
    async findAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const productId = Number(req.params.id);
            if (isNaN(productId)) {
                res.status(HttpStatusCode.BadRequest).json({
                    statusCode: HttpStatusCode.BadRequest,
                    message: `bad request: invalid productId in path params`,
                    data: null,
                    errors: [`'productId' should be a valid integer`],
                });
                return;
            }
            const reviews: Review[] = await reviewsService.findAll(productId);
            const summary = await reviewsService.getReviewSummary(productId);

            const statusCode = HttpStatusCode.Ok;
            res.status(statusCode).json({
                statusCode,
                message: 'reviews fetched successfully.',
                data: { reviews, summary: summary?.content ?? null },
                errors: [],
            });
            return;
        } catch (e) {
            next(e);
        }
    },

    async summarizeReviews(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const productId = Number(req.params.id);
            if (isNaN(productId)) {
                res.status(HttpStatusCode.BadRequest).json({
                    statusCode: HttpStatusCode.BadRequest,
                    message: `bad request: invalid productId in path params`,
                    data: null,
                    errors: [`'productId' should be a valid integer`],
                });
                return;
            }
            const summary = await reviewsService.summarizeReviews(productId);
            const statusCode = HttpStatusCode.Ok;
            res.status(statusCode).json({
                statusCode,
                message: 'summary generated successfully',
                data: { summary },
                errors: [],
            });
        } catch (e) {
            if (e instanceof ProductNotFoundError) {
                const statusCode = HttpStatusCode.NotFound;
                res.status(statusCode).json({
                    statusCode,
                    message: 'error: cannot create summary',
                    data: null,
                    errors: ['product not found'],
                });
                return;
            }

            if (e instanceof NoReviewsForProductError) {
                const statusCode = HttpStatusCode.NotFound;
                res.status(statusCode).json({
                    statusCode,
                    message: 'error: cannot create summary',
                    data: null,
                    errors: ['no reviews exist for product'],
                });
                return;
            }
            next(e);
        }
    },
};
