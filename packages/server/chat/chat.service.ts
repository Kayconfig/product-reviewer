import type { AIMessageChunk } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { Readable, Transform } from 'node:stream';
import { ChatNotFoundError } from './errors/chat-not-found-error';
import { inMemChatRepo } from './in-mem-chat-repository';
import type { Message } from './interfaces/message';
import { getOllamaLLM } from './llm-model';
import { createHumanMsg } from './utils/message.util';

export const chatService = {
    async createChat(userId: string) {
        const chat = await inMemChatRepo.createChat(userId);
        return chat;
    },
    async queryLLM({
        userId,
        chatId,
        prompt,
    }: {
        userId: string;
        chatId: string;
        prompt: string;
    }): Promise<Message> {
        const llm = getOllamaLLM();
        const chat = await inMemChatRepo.getChat(userId, chatId);
        if (!chat) throw ChatNotFoundError.create(chatId, userId);
        const chatHistory = chat.messages;
        const userMsg = createHumanMsg(prompt);
        const aiMsg = await llm.invoke(chatHistory.concat(userMsg));
        inMemChatRepo.appendChatMessages(userId, chatId, userMsg, aiMsg);
        const msgId = randomUUID();
        return { id: msgId, content: aiMsg.content.toString() };
    },
    async queryLLMAndStreamResponse({
        userId,
        chatId,
        prompt,
    }: {
        userId: string;
        chatId: string;
        prompt: string;
    }) {
        const llm = getOllamaLLM();
        const chat = await inMemChatRepo.getChat(userId, chatId);
        if (!chat) throw ChatNotFoundError.create(chatId, userId);
        const chatHistory = chat.messages;
        const userMsg = createHumanMsg(prompt);
        console.log('iterableReadable loading...');
        const iterableReadableStream = await llm.stream(
            chatHistory.concat(userMsg)
        );
        console.log('iterableReadable done');
        const msgId = randomUUID();
        const aiMsgChunkTransformer = new Transform({
            highWaterMark: 1,
            objectMode: true,
            transform: function (chunk: AIMessageChunk, encoding, cb) {
                const { content } = chunk;
                const msgToSend = {
                    id: msgId,
                    content,
                    done: chunk?.response_metadata?.done ?? false,
                };
                this.push(`data: ${JSON.stringify(msgToSend)}\n\n`);
                cb();
            },
        });

        return Readable.from(iterableReadableStream, { objectMode: true }).pipe(
            aiMsgChunkTransformer
        );
    },
};
