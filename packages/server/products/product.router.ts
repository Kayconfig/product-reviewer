import { Router } from 'express';
import { reviewController } from '../reviews/reviews.controller';
import { productController } from './product.controller';

export const productRouter = Router();

productRouter.get('/:id/reviews', reviewController.findAll);
productRouter.get('/:id', productController.findById);
productRouter.post('/:id/reviews/summary', reviewController.summarizeReviews);
