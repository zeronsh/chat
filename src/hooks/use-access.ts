import { useDatabase } from '@/context/database';
import { UserId } from '@/database/types';
import { useSettings } from '@/hooks/use-settings';
import { FreeLimits, ProLimits } from '@/lib/constants';
import { useQuery } from '@rocicorp/zero/react';
import { useMemo } from 'react';
import { match } from 'ts-pattern';

export function useAccess() {
    const db = useDatabase();
    const [user] = useQuery(db.query.user.where('id', '=', UserId(db.userID)).one());
    const [customer] = useQuery(
        db.query.userCustomer.where('userId', '=', UserId(db.userID)).one()
    );
    const settings = useSettings();
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

    const canUseModel = useMemo(() => {
        if (!settings?.model) return false;
        const cost = settings.model.credits || 0;
        const hasEnoughCredits = remainingCredits - cost >= 0;
        const isAnonymous = user?.isAnonymous;
        return match({
            hasEnoughCredits: hasEnoughCredits,
            isAnonymous: isAnonymous,
            isPro: isPro,
            access: settings.model.access,
        })
            .with(
                {
                    access: 'public',
                    hasEnoughCredits: true,
                },
                () => true
            )
            .with(
                {
                    access: 'account_required',
                    isAnonymous: false,
                    hasEnoughCredits: true,
                },
                () => true
            )
            .with(
                {
                    access: 'premium_required',
                    isAnonymous: false,
                    isPro: true,
                    hasEnoughCredits: true,
                },
                () => true
            )
            .otherwise(() => false);
    }, [settings?.model, isPro, remainingCredits, user?.isAnonymous]);

    return {
        isPro,
        isExpiring,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canSearch,
        canResearch,
        canUseModel,
    };
}
