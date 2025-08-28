import { HttpStatusCode } from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { treeifyError } from 'zod';
import { chatService } from './chat.service';
import { createChatSchema } from './dto-schemas/create-chat.schema';
import { queryLLMSchema } from './dto-schemas/query-llm.schema';

export const chatController = {
    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const parsedBody = await createChatSchema.safeParseAsync(req.body);
            if (!parsedBody.success || parsedBody.data === undefined) {
                const statusCode = HttpStatusCode.BadRequest;
                res.status(statusCode).json({
                    statusCode,
                    message: 'invalid payload',
                    data: null,
                    errors: treeifyError(parsedBody.error),
                });
                return;
            }

            const chat = await chatService.createChat(parsedBody.data.userId);
            const createdStatus = HttpStatusCode.Created;
            res.status(createdStatus).json({
                status: createdStatus,
                message: 'chat created successfully',
                data: { id: chat.id },
                errors: null,
            });
            return;
        } catch (e) {
            next(e);
        }
    },
    async queryLLM(req: Request, res: Response, next: NextFunction) {
        try {
            const chatId = req.params.chatId;

            const parsedBody = await queryLLMSchema.safeParseAsync({
                ...req.body,
                chatId,
            });
            if (!parsedBody.success) {
                const statusCode = HttpStatusCode.BadRequest;
                res.status(statusCode).json({
                    statusCode,
                    message: 'invalid payload',
                    data: null,
                    errors: treeifyError(parsedBody.error),
                });
                return;
            }

            const aiMsg = await chatService.queryLLM(parsedBody.data);

            const statusCode = HttpStatusCode.Ok;
            res.status(statusCode).json({
                statusCode,
                message: '',
                data: aiMsg,
                errors: [],
            });
            return;
        } catch (e) {
            next(e);
        }
    },
};
