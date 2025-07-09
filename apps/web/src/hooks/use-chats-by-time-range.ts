import { Thread } from '@/zero/types';

export function useThreadsByTimeRange<T extends Thread>(threads: T[]) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const DAYS_30 = 30;

    const now = Date.now();

    const timeBoundaries = {
        oneDayAgo: now - MS_PER_DAY,
        twoDaysAgo: now - 2 * MS_PER_DAY,
        thirtyDaysAgo: now - DAYS_30 * MS_PER_DAY,
    };

    const filterThreadsByTimeRange = (startTime: number, endTime?: number) =>
        threads.filter(chat => {
            const chatTime = chat.updatedAt ?? 0;
            return endTime ? chatTime >= startTime && chatTime < endTime : chatTime >= startTime;
        });

    const groups = {
        today: filterThreadsByTimeRange(timeBoundaries.oneDayAgo),
        yesterday: filterThreadsByTimeRange(timeBoundaries.twoDaysAgo, timeBoundaries.oneDayAgo),
        lastThirtyDays: filterThreadsByTimeRange(
            timeBoundaries.thirtyDaysAgo,
            timeBoundaries.twoDaysAgo
        ),
        history: filterThreadsByTimeRange(0, timeBoundaries.thirtyDaysAgo),
    };

    return groups;
}
