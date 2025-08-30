import type { Product } from '../generated/prisma';
import { ProductNotFoundError } from './errors/product-not-found.error';
import {
    productRepository,
    type ProductRepository,
} from './product.repository';

export interface ProductService {
    findById(productId: number): Promise<Product>;
    findAll(): Promise<Product[]>;
}

export function createProductService(
    repository: ProductRepository
): ProductService {
    return {
        async findById(productId: number): Promise<Product> {
            const product = await repository.findById(productId);
            if (!product) {
                throw ProductNotFoundError.create(productId);
            }
            return product;
        },

        async findAll(): Promise<Product[]> {
            return await repository.findAll();
        },
    };
}

export const productService = createProductService(productRepository);
