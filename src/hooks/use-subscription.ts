import { useDatabase } from '@/context/database';
import { UserId } from '@/database/types';
import { FreeLimits, ProLimits } from '@/lib/constants';
import { useQuery } from '@rocicorp/zero/react';
import { useMemo } from 'react';

export function useSubscription() {
    const db = useDatabase();
    const [customer] = useQuery(
        db.query.userCustomer.where('userId', '=', UserId(db.userID)).one()
    );
    const [usage] = useQuery(db.query.usage.where('userId', '=', UserId(db.userID)).one());

    const isActive = useMemo(() => {
        if (!customer) return false;
        if (!customer.subscription) return false;
        return customer.subscription.currentPeriodEnd > Date.now() / 1000;
    }, [customer]);

    const isExpiring = useMemo(() => {
        if (!customer) return false;
        if (!customer.subscription) return false;
        return customer.subscription.cancelAtPeriodEnd;
    }, [customer]);

    const credits = useMemo(() => {
        if (!usage) return 0;
        if (!isActive) return FreeLimits.CREDITS - (usage.credits || 0);

        return ProLimits.CREDITS - (usage.credits || 0);
    }, [usage, isActive]);

    const search = useMemo(() => {
        if (!usage) return 0;
        if (!isActive) return FreeLimits.SEARCH - (usage.search || 0);
        return ProLimits.SEARCH - (usage.search || 0);
    }, [usage, isActive]);

    const research = useMemo(() => {
        if (!usage) return 0;
        if (!isActive) return FreeLimits.RESEARCH - (usage.research || 0);
        return ProLimits.RESEARCH - (usage.research || 0);
    }, [usage, isActive]);

    const canSearch = useMemo(() => {
        return search > 0;
    }, [search, isActive]);

    const canResearch = useMemo(() => {
        return research > 0;
    }, [research, isActive]);

    return {
        isActive,
        isExpiring,
        credits,
        search,
        research,
        canSearch,
        canResearch,
    };
}
