import { useCustomer, useUsage, useSettings, useUser } from '@/hooks/use-database';
import { AnonymousLimits, FreeLimits, ProLimits } from '@/lib/constants';
import { useCallback, useMemo } from 'react';
import { Model } from '@/zero/types';
import { match, P } from 'ts-pattern';

export function useAccess() {
    const customer = useCustomer();
    const user = useUser();
    const settings = useSettings();
    const usage = useUsage();

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

        return limits.CREDITS - (usage.credits ?? 0);
    }, [usage, limits]);

    const remainingSearches = useMemo(() => {
        if (!usage) return 0;
        return limits.SEARCH - (usage.search ?? 0);
    }, [usage, limits]);

    const remainingResearches = useMemo(() => {
        if (!usage) return 0;
        return limits.RESEARCH - (usage.research ?? 0);
    }, [usage, limits]);

    const canSearch = useMemo(() => {
        return remainingSearches > 0;
    }, [remainingSearches, limits]);

    const canResearch = useMemo(() => {
        return remainingResearches > 0;
    }, [remainingResearches, limits]);

    const canUseModel = useMemo(() => {
        if (!settings?.model) return false;
        if (settings.model.access === 'premium_required' && !isPro) return false;
        if (settings.model.access === 'account_required' && user?.isAnonymous) return false;
        const cost = Number(settings.model.credits ?? 0);
        if (cost > remainingCredits) return false;
        return true;
    }, [settings?.model, remainingCredits, user?.isAnonymous, isPro]);

    const cannotUseModelReason = useMemo(() => {
        if (!settings?.model) return 'No model selected';
        if (settings.model.access === 'premium_required' && !isPro)
            return 'Premium required for this model';
        if (settings.model.access === 'account_required' && user?.isAnonymous)
            return 'Account required for this model';
        const cost = Number(settings.model.credits ?? 0);
        if (cost > remainingCredits) return 'Insufficient credits';
    }, [settings?.model, remainingCredits, user?.isAnonymous, isPro]);

    const checkCanUseModel = useCallback(
        (model: Model) => {
            if (model.access === 'premium_required' && !isPro) return false;
            if (model.access === 'account_required' && user?.isAnonymous) return false;
            const cost = Number(model.credits ?? 0);
            if (cost > remainingCredits) return false;
            return true;
        },
        [remainingCredits, user?.isAnonymous, isPro]
    );

    const getCannotUseModelMatcher = useCallback(
        <T>(
            model: Model,
            callbacks: {
                onPremiumRequired?: () => T;
                onAccountRequired?: () => T;
                onInsufficientCreditsAnonymous?: () => T;
                onInsufficientCreditsPro?: () => T;
                onInsufficientCreditsNotPro?: () => T;
            }
        ) => {
            return match({
                remainingCredits,
                canAffordModel: Number(model.credits ?? 0) <= remainingCredits,
                isAnonymous: user?.isAnonymous,
                isPro,
                modelAccess: model.access,
            })
                .with(
                    {
                        remainingCredits: P.number.gt(0),
                        modelAccess: 'premium_required',
                        isPro: false,
                    },
                    () => callbacks.onPremiumRequired?.()
                )
                .with(
                    {
                        remainingCredits: P.number.gt(0),
                        modelAccess: 'account_required',
                        isAnonymous: true,
                    },
                    () => callbacks.onAccountRequired?.()
                )
                .with(
                    {
                        canAffordModel: false,
                        isAnonymous: false,
                        isPro: false,
                    },
                    () => callbacks.onInsufficientCreditsNotPro?.()
                )
                .with(
                    {
                        canAffordModel: false,
                        isAnonymous: false,
                        isPro: true,
                    },
                    () => callbacks.onInsufficientCreditsPro?.()
                )
                .with(
                    {
                        canAffordModel: false,
                        isAnonymous: true,
                        isPro: false,
                    },
                    () => callbacks.onInsufficientCreditsAnonymous?.()
                )
                .otherwise(() => null);
        },
        [remainingCredits, user?.isAnonymous, isPro]
    );

    return {
        isPro,
        limits,
        isExpiring,
        remainingCredits,
        remainingSearches,
        remainingResearches,
        canSearch,
        canResearch,
        canUseModel,
        cannotUseModelReason,
        checkCanUseModel,
        getCannotUseModelMatcher,
    };
}
