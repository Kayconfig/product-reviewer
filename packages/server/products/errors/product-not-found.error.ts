export class ProductNotFoundError extends Error {
    constructor(productId: number) {
        super(`product #${productId} not found`);
    }

    static create(productId: number) {
        return new ProductNotFoundError(productId);
    }
}
