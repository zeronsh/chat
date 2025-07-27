import { useDatabase } from '@/context/database';
import { UserId } from '@/database/types';
import { useUser } from '@/hooks/use-user';
import { AnonymousLimits, FreeLimits, ProLimits } from '@/lib/constants';
import { useQuery } from '@rocicorp/zero/react';
import { useMemo } from 'react';

export function useAccess() {
    const db = useDatabase();
    const [customer] = useQuery(
        db.query.userCustomer.where('userId', '=', UserId(db.userID)).one()
    );
    const user = useUser();
    const [usage] = useQuery(db.query.usage.where('userId', '=', UserId(db.userID)).one());

    const isPro = useMemo(() => {
        if (!customer) return false;
        if (!customer.subscription) return false;
        return customer.subscription.currentPeriodEnd > Date.now() / 1000;
    }, [customer]);

    const limits = useMemo(() => {
        if (user?.isAnonymous) return AnonymousLimits;
        if (!customer) return FreeLimits;
        if (!isPro) return FreeLimits;
        return ProLimits;
    }, [customer, user?.isAnonymous, isPro]);

    const isExpiring = useMemo(() => {
        if (!customer) return false;
        if (!customer.subscription) return false;
        return customer.subscription.cancelAtPeriodEnd;
    }, [customer]);

    const remainingCredits = useMemo(() => {
        if (!usage) return 0;

        return limits.CREDITS - (usage.credits || 0);
    }, [usage, limits]);

    const remainingSearches = useMemo(() => {
        if (!usage) return 0;
        return limits.SEARCH - (usage.search || 0);
    }, [usage, limits]);

    const remainingResearches = useMemo(() => {
        if (!usage) return 0;
        return limits.RESEARCH - (usage.research || 0);
    }, [usage, limits]);

    const canSearch = useMemo(() => {
        return remainingSearches > 0;
    }, [remainingSearches, limits]);

    const canResearch = useMemo(() => {
        return remainingResearches > 0;
    }, [remainingResearches, limits]);

    return {
        isPro,
        limits,
        isExpiring,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canSearch,
        canResearch,
    };
}
