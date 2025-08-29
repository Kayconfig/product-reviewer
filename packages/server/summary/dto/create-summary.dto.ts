import z from 'zod';
export interface CreateSummaryDto {
    productId: number;
    content: string;
}

export const createSummarySchema = z.object({
    productId: z.number(`'productId' must be a valid integer`),

    content: z
        .string(`'content' must be a valid string`)
        .nonempty(`'content' must not be empty`),
});
