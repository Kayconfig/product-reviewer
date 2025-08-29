import { HttpStatusCode } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { ProductNotFoundError } from './errors/product-not-found.error';
import { productService } from './product.service';

export const productController = {
    async findById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const productId = Number(req.params.id);
        try {
            if (isNaN(productId)) {
                res.status(HttpStatusCode.BadRequest).json({
                    statusCode: HttpStatusCode.BadRequest,
                    message: `bad request: invalid productId in path params`,
                    data: null,
                    errors: [`'productId' should be a valid integer`],
                });
                return;
            }
            const product = await productService.findById(productId);

            const statusCode = HttpStatusCode.Ok;
            res.status(statusCode).json({
                statusCode,
                message: 'product found',
                data: product,
                errors: [],
            });
            return;
        } catch (e) {
            if (e instanceof ProductNotFoundError) {
                res.status(HttpStatusCode.NotFound).json({
                    statusCode: HttpStatusCode.NotFound,
                    message: `product not found`,
                    data: null,
                    errors: [`product #: ${productId} not found`],
                });
                return;
            }
            next(e);
        }
    },
};
