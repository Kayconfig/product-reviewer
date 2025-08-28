import z from 'zod';

export const createChatSchema = z.object(
    {
        userId: z.string('userId should be a valid uuid v4'),
    },
    { error: 'body cannot be empty!' }
);
