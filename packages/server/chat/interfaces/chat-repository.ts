import type { Messages } from './message';

export type Chat = {
    id: string;
    messages: Messages;
};

export interface ChatRepository {
    createChat(userId: string): Promise<Chat>;
    getChat(userId: string, chatId: string): Promise<Chat | null>;
    appendChatMessages(
        userId: string,
        chatId: string,
        ...messages: Messages
    ): Promise<void>;
}
