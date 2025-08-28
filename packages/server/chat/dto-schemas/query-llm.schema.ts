import z from 'zod';

export const queryLLMSchema = z.object({
    prompt: z
        .string(`'prompt' should be a valid string`)
        .min(2, { error: `'prompt' should be minimum of 2 characters` })
        .max(1000, { error: `'prompt' cannot exceed 1000 characters` }),
    userId: z.string(`'userId' should be a valid uuid v4`),
    chatId: z.string(`'chatId' should be a valid uuid v4`),
});
