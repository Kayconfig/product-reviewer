import { randomUUIDv7 } from 'bun';
import { getWonderLandSystemPrompt } from '../prompts/wonderland';
import { ChatNotFoundError } from './errors/chat-not-found-error';
import { ChatsNotFoundError } from './errors/chats-not-found-error';
import type { Chat, ChatRepository } from './interfaces/chat-repository';
import { createSystemMsg } from './utils/message.util';

type UserId = string;
type ChatId = string;
type Chats = Map<ChatId, Chat>;

const inMemDb = new Map<UserId, Chats>();

export const inMemChatRepo: ChatRepository = {
    async createChat(userId): Promise<Chat> {
        const sysMsgContent = await getWonderLandSystemPrompt();
        const sysMsg = createSystemMsg(sysMsgContent);
        const chat: Chat = { id: randomUUIDv7(), messages: [sysMsg] };
        let existingChats = inMemDb.get(userId);
        if (!existingChats) {
            existingChats = new Map<ChatId, Chat>();
        }
        existingChats.set(chat.id, chat);
        inMemDb.set(userId, existingChats);

        return chat;
    },
    async getChat(userId, chatId): Promise<Chat | null> {
        const chats = inMemDb.get(userId);
        const chat = chats?.get(chatId);
        return chat ?? null;
    },

    async appendChatMessages(userId, chatId, ...messages) {
        const chats = inMemDb.get(userId);
        if (!chats) {
            throw ChatsNotFoundError.create(userId);
        }

        const chat = chats.get(chatId);
        if (!chat) {
            throw ChatNotFoundError.create(chatId, userId);
        }

        chat.messages.push(...messages);
    },
};
