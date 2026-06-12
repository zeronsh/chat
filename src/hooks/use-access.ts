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

    const remainingBudget = useMemo(() => {
        if (!usage) return 0;

        return limits.BUDGET - (usage.cost ?? 0);
    }, [usage, limits]);

    const usagePercent = useMemo(() => {
        if (!usage) return 0;
        return Math.min(100, Math.round(((usage.cost ?? 0) / limits.BUDGET) * 100));
    }, [usage, limits]);

    const remainingResearches = useMemo(() => {
        if (!usage) return 0;
        return limits.RESEARCH - (usage.research ?? 0);
    }, [usage, limits]);

    const canSearch = useMemo(() => {
        return remainingBudget > 0;
    }, [remainingBudget]);

    const canResearch = useMemo(() => {
        return remainingResearches > 0 && remainingBudget > 0;
    }, [remainingResearches, remainingBudget]);

    const canUseModel = useMemo(() => {
        if (!settings?.model) return false;
        if (settings.model.access === 'premium_required' && !isPro) return false;
        if (settings.model.access === 'account_required' && user?.isAnonymous) return false;
        if (remainingBudget <= 0) return false;
        return true;
    }, [settings?.model, remainingBudget, user?.isAnonymous, isPro]);

    const cannotUseModelReason = useMemo(() => {
        if (!settings?.model) return 'No model selected';
        if (settings.model.access === 'premium_required' && !isPro)
            return 'Premium required for this model';
        if (settings.model.access === 'account_required' && user?.isAnonymous)
            return 'Account required for this model';
        if (remainingBudget <= 0) return 'Daily usage limit reached';
    }, [settings?.model, remainingBudget, user?.isAnonymous, isPro]);

    const checkCanUseModel = useCallback(
        (model: Model) => {
            if (model.access === 'premium_required' && !isPro) return false;
            if (model.access === 'account_required' && user?.isAnonymous) return false;
            if (remainingBudget <= 0) return false;
            return true;
        },
        [remainingBudget, user?.isAnonymous, isPro]
    );

    const canModelUseTools = useMemo(() => {
        if (!settings?.model) return false;
        if (settings.model?.capabilities?.includes('tools')) return true;
        return false;
    }, [settings?.model]);

    const canModelViewFiles = useMemo(() => {
        if (!settings?.model) return false;
        if (
            settings.model?.capabilities?.includes('vision') ||
            settings.model?.capabilities?.includes('documents')
        )
            return true;
        return false;
    }, [settings?.model]);

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
                hasBudget: remainingBudget > 0,
                isAnonymous: user?.isAnonymous,
                isPro,
                modelAccess: model.access,
            })
                .with(
                    {
                        hasBudget: true,
                        modelAccess: 'premium_required',
                        isPro: false,
                    },
                    () => callbacks.onPremiumRequired?.()
                )
                .with(
                    {
                        hasBudget: true,
                        modelAccess: 'account_required',
                        isAnonymous: true,
                    },
                    () => callbacks.onAccountRequired?.()
                )
                .with(
                    {
                        hasBudget: false,
                        isAnonymous: false,
                        isPro: false,
                    },
                    () => callbacks.onInsufficientCreditsNotPro?.()
                )
                .with(
                    {
                        hasBudget: false,
                        isAnonymous: false,
                        isPro: true,
                    },
                    () => callbacks.onInsufficientCreditsPro?.()
                )
                .with(
                    {
                        hasBudget: false,
                        isAnonymous: true,
                        isPro: false,
                    },
                    () => callbacks.onInsufficientCreditsAnonymous?.()
                )
                .otherwise(() => null);
        },
        [remainingBudget, user?.isAnonymous, isPro]
    );

    return {
        isPro,
        limits,
        isExpiring,
        remainingBudget,
        usagePercent,
        remainingResearches,
        canSearch,
        canResearch,
        canUseModel,
        cannotUseModelReason,
        checkCanUseModel,
        getCannotUseModelMatcher,
        canModelUseTools,
        canModelViewFiles,
    };
}
