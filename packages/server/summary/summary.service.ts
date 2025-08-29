import dayjs from 'dayjs';
import type { Summary } from '../generated/prisma';
import { summaryRepository } from './summary.repository';

function isExistingSummaryValid(summary: Summary | null): boolean {
    if (summary) {
        const now = Date.now();
        const summaryExpireOneHourEarlier =
            summary.expiresAt.getTime() - 60 * 60 * 1000;
        const summaryHasNotExpired =
            dayjs(summaryExpireOneHourEarlier).isSame(now) ||
            dayjs(summaryExpireOneHourEarlier).isAfter(now);
        if (summaryHasNotExpired) return true;
    }
    return false;
}

export const summaryService = {
    async getValidSummary(productId: number): Promise<Summary | null> {
        const summary = await summaryRepository.findByProductId(productId);
        if (isExistingSummaryValid(summary)) {
            return summary;
        }
        return null;
    },
};
