import { Router } from 'express';
import { chatController } from './chat.controller';

export const chatRouter = Router();

chatRouter.post('/', chatController.createChat);
chatRouter.post('/:chatId/message', chatController.queryLLM);
