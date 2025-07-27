import { useDatabase } from '@/context/database';
import { UserId } from '@/database/types';
import { FreeLimits, ProLimits } from '@/lib/constants';
import { useQuery } from '@rocicorp/zero/react';
import { useMemo } from 'react';

export function useAccess() {
    const db = useDatabase();
    const [customer] = useQuery(
        db.query.userCustomer.where('userId', '=', UserId(db.userID)).one()
    );
    const [usage] = useQuery(db.query.usage.where('userId', '=', UserId(db.userID)).one());

    const isPro = useMemo(() => {
        if (!customer) return false;
        if (!customer.subscription) return false;
        return customer.subscription.currentPeriodEnd > Date.now() / 1000;
    }, [customer]);

    const isExpiring = useMemo(() => {
        if (!customer) return false;
        if (!customer.subscription) return false;
        return customer.subscription.cancelAtPeriodEnd;
    }, [customer]);

    const remainingCredits = useMemo(() => {
        if (!usage) return 0;
        if (!isPro) return FreeLimits.CREDITS - (usage.credits || 0);

        return ProLimits.CREDITS - (usage.credits || 0);
    }, [usage, isPro]);

    const remainingSearches = useMemo(() => {
        if (!usage) return 0;
        if (!isPro) return FreeLimits.SEARCH - (usage.search || 0);
        return ProLimits.SEARCH - (usage.search || 0);
    }, [usage, isPro]);

    const remainingResearches = useMemo(() => {
        if (!usage) return 0;
        if (!isPro) return FreeLimits.RESEARCH - (usage.research || 0);
        return ProLimits.RESEARCH - (usage.research || 0);
    }, [usage, isPro]);

    const canSearch = useMemo(() => {
        return remainingSearches > 0;
    }, [remainingSearches, isPro]);

    const canResearch = useMemo(() => {
        return remainingResearches > 0;
    }, [remainingResearches, isPro]);

    return {
        isPro,
        isExpiring,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canSearch,
        canResearch,
    };
}
