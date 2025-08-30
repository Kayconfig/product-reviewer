import { beforeEach, describe, expect, it, jest, spyOn } from 'bun:test';
import type { Product } from '../generated/prisma';
import { ProductNotFoundError } from './errors/product-not-found.error';
import type { ProductRepository } from './product.repository';
import { createProductService, type ProductService } from './product.service';

describe('productService', () => {
    let productService: ProductService;
    let mockedProductRepository: ProductRepository;
    beforeEach(() => {
        mockedProductRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
        };
        productService = createProductService(mockedProductRepository);
    });
    it('should be defined', () => {
        expect(productService).toBeDefined();
        expect(mockedProductRepository).toBeDefined();
    });

    const mockProductId = 1;
    const mockProduct: Product = {
        description: 'mock description',
        id: mockProductId,
        name: 'mock product name',
        price: 43.67,
    };
    describe('findById', () => {
        beforeEach(() => {
            expect(mockedProductRepository).toBeDefined();
        });
        it('should return correct product', async () => {
            spyOn(mockedProductRepository, 'findById').mockImplementation(
                async (id) => {
                    expect(id).toBe(mockProductId);
                    return id === mockProduct.id ? mockProduct : null;
                }
            );

            const product = await productService.findById(mockProductId);
            expect(product).toEqual(mockProduct);
        });

        it('should throw ProductNotFoundError if productId is not in db', () => {
            const nonExistentProductId = mockProductId + 300;
            spyOn(mockedProductRepository, 'findById').mockImplementation(
                async (id) => {
                    expect(id).toBe(nonExistentProductId);
                    return null;
                }
            );

            expect(
                productService.findById(nonExistentProductId)
            ).rejects.toThrowError(ProductNotFoundError);
        });
    });

    describe('findAll', () => {
        beforeEach(() => {
            expect(mockedProductRepository).toBeDefined();
        });
        it('should return products in db', async () => {
            spyOn(productService, 'findAll').mockImplementation(async () => [
                mockProduct,
            ]);
            expect(productService.findAll()).resolves.toEqual([mockProduct]);
        });

        it('should return empty array if there are no products in db', async () => {
            spyOn(productService, 'findAll').mockImplementation(async () => []);
            expect(productService.findAll()).resolves.toEqual([]);
        });
    });
});
