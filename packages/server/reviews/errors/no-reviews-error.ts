export class NoReviewsForProductError extends Error {
    constructor(productId: number) {
        super(`no reviews for product #: ${productId}`);
    }
    static create(productId: number): NoReviewsForProductError {
        return new NoReviewsForProductError(productId);
    }
}
