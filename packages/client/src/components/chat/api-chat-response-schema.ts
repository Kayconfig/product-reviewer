import z from 'zod';

export const apiSuccessChatResponseSchema = z.object({
    statusCode: z.number(`invalid 'statusCode' should be number`),
    message: z.string(`invalid 'message' should be string`),
    data: z.object({
        message: z.string("invalid 'data.message', should be string"),
    }),
    errors: z.array(z.string().optional(), {
        error: 'should be array of string',
    }),
});
