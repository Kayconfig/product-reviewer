import type { NextFunction, Request, Response } from 'express';

export const chatController = {
    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    },
    async queryLLM(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {
            next(e);
        }
    },
};
