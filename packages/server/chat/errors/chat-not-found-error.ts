export class ChatNotFoundError extends Error {
    constructor(chatId: string, userId: string) {
        super(`Chat# :${chatId} for user#: ${userId} not found `);
    }

    static create(chatId: string, userId: string): ChatNotFoundError {
        return new ChatNotFoundError(chatId, userId);
    }
}
