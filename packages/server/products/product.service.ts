import type { Product } from '../generated/prisma';
import { ProductNotFoundError } from './errors/product-not-found.error';
import { productRepository } from './product.repository';

export const productService = {
    async findById(productId: number): Promise<Product> {
        const product = await productRepository.findById(productId);
        if (!product) {
            throw ProductNotFoundError.create(productId);
        }
        return product;
    },
};
