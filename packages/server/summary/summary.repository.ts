import dayjs from 'dayjs';
import type { Summary } from '../generated/prisma';
import { getPrismaClient } from '../helpers/prisma-client';
import type { CreateSummaryDto } from './dto/create-summary.dto';

const client = getPrismaClient();
export const summaryRepository = {
    async create(data: CreateSummaryDto): Promise<Summary> {
        const now = new Date();
        const expiresAt = dayjs().add(2, 'days').toDate();
        const entry = {
            content: data.content,
            expiresAt,
            generatedAt: now,
            productId: data.productId,
        };
        return await client.summary.upsert({
            where: { productId: data.productId },
            create: entry,
            update: entry,
        });
    },
    async findById(id: number): Promise<Summary | null> {
        return await client.summary.findFirst({ where: { id } });
    },
    async findByProductId(productId: number): Promise<Summary | null> {
        return await client.summary.findFirst({ where: { productId } });
    },
};
