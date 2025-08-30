import { Router } from 'express';
import { reviewController } from '../reviews/reviews.controller';
import { productController } from './product.controller';

export const productRouter = Router();

productRouter.get('/', productController.findAll);
productRouter.get('/:id/review', reviewController.findAll);
productRouter.get('/:id', productController.findById);
productRouter.post('/:id/review/summary', reviewController.summarizeReviews);
