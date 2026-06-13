import { r as useCustomer, h as useUser, j as useSettings, t as useUsage, v as AnonymousLimits, F as FreeLimits, P as ProLimits } from './ssr.mjs';
import { useMemo, useCallback } from 'react';
import { match } from 'ts-pattern';

function useAccess() {
  const customer = useCustomer();
  const user = useUser();
  const settings = useSettings();
  const usage = useUsage();
  const isPro = useMemo(() => {
    if (!customer) return false;
    if (!customer.subscription) return false;
    return customer.subscription.currentPeriodEnd > Date.now() / 1e3;
  }, [customer]);
  const limits = useMemo(() => {
    if (user == null ? void 0 : user.isAnonymous) return AnonymousLimits;
    if (!customer) return FreeLimits;
    if (!isPro) return FreeLimits;
    return ProLimits;
  }, [customer, user == null ? void 0 : user.isAnonymous, isPro]);
  const isExpiring = useMemo(() => {
    if (!customer) return false;
    if (!customer.subscription) return false;
    return customer.subscription.cancelAtPeriodEnd;
  }, [customer]);
  const remainingBudget = useMemo(() => {
    var _a;
    if (!usage) return 0;
    return limits.BUDGET - ((_a = usage.cost) != null ? _a : 0);
  }, [usage, limits]);
  const usagePercent = useMemo(() => {
    var _a;
    if (!usage) return 0;
    return Math.min(100, Math.round(((_a = usage.cost) != null ? _a : 0) / limits.BUDGET * 100));
  }, [usage, limits]);
  const canSearch = useMemo(() => {
    return remainingBudget > 0;
  }, [remainingBudget]);
  const canResearch = useMemo(() => {
    return limits.RESEARCH_ENABLED && remainingBudget > 0;
  }, [limits, remainingBudget]);
  const canUseModel = useMemo(() => {
    if (!(settings == null ? void 0 : settings.model)) return false;
    if (settings.model.access === "premium_required" && !isPro) return false;
    if (settings.model.access === "account_required" && (user == null ? void 0 : user.isAnonymous)) return false;
    if (remainingBudget <= 0) return false;
    return true;
  }, [settings == null ? void 0 : settings.model, remainingBudget, user == null ? void 0 : user.isAnonymous, isPro]);
  const cannotUseModelReason = useMemo(() => {
    if (!(settings == null ? void 0 : settings.model)) return "No model selected";
    if (settings.model.access === "premium_required" && !isPro)
      return "Premium required for this model";
    if (settings.model.access === "account_required" && (user == null ? void 0 : user.isAnonymous))
      return "Account required for this model";
    if (remainingBudget <= 0) return "Daily usage limit reached";
  }, [settings == null ? void 0 : settings.model, remainingBudget, user == null ? void 0 : user.isAnonymous, isPro]);
  const checkCanUseModel = useCallback(
    (model) => {
      if (model.access === "premium_required" && !isPro) return false;
      if (model.access === "account_required" && (user == null ? void 0 : user.isAnonymous)) return false;
      if (remainingBudget <= 0) return false;
      return true;
    },
    [remainingBudget, user == null ? void 0 : user.isAnonymous, isPro]
  );
  const canModelUseTools = useMemo(() => {
    var _a, _b;
    if (!(settings == null ? void 0 : settings.model)) return false;
    if ((_b = (_a = settings.model) == null ? void 0 : _a.capabilities) == null ? void 0 : _b.includes("tools")) return true;
    return false;
  }, [settings == null ? void 0 : settings.model]);
  const canModelViewFiles = useMemo(() => {
    var _a, _b, _c, _d;
    if (!(settings == null ? void 0 : settings.model)) return false;
    if (((_b = (_a = settings.model) == null ? void 0 : _a.capabilities) == null ? void 0 : _b.includes("vision")) || ((_d = (_c = settings.model) == null ? void 0 : _c.capabilities) == null ? void 0 : _d.includes("documents")))
      return true;
    return false;
  }, [settings == null ? void 0 : settings.model]);
  const getCannotUseModelMatcher = useCallback(
    (model, callbacks) => {
      return match({
        hasBudget: remainingBudget > 0,
        isAnonymous: user == null ? void 0 : user.isAnonymous,
        isPro,
        modelAccess: model.access
      }).with(
        {
          hasBudget: true,
          modelAccess: "premium_required",
          isPro: false
        },
        () => {
          var _a;
          return (_a = callbacks.onPremiumRequired) == null ? void 0 : _a.call(callbacks);
        }
      ).with(
        {
          hasBudget: true,
          modelAccess: "account_required",
          isAnonymous: true
        },
        () => {
          var _a;
          return (_a = callbacks.onAccountRequired) == null ? void 0 : _a.call(callbacks);
        }
      ).with(
        {
          hasBudget: false,
          isAnonymous: false,
          isPro: false
        },
        () => {
          var _a;
          return (_a = callbacks.onInsufficientCreditsNotPro) == null ? void 0 : _a.call(callbacks);
        }
      ).with(
        {
          hasBudget: false,
          isAnonymous: false,
          isPro: true
        },
        () => {
          var _a;
          return (_a = callbacks.onInsufficientCreditsPro) == null ? void 0 : _a.call(callbacks);
        }
      ).with(
        {
          hasBudget: false,
          isAnonymous: true,
          isPro: false
        },
        () => {
          var _a;
          return (_a = callbacks.onInsufficientCreditsAnonymous) == null ? void 0 : _a.call(callbacks);
        }
      ).otherwise(() => null);
    },
    [remainingBudget, user == null ? void 0 : user.isAnonymous, isPro]
  );
  return {
    isPro,
    limits,
    isExpiring,
    remainingBudget,
    usagePercent,
    canSearch,
    canResearch,
    canUseModel,
    cannotUseModelReason,
    checkCanUseModel,
    getCannotUseModelMatcher,
    canModelUseTools,
    canModelViewFiles
  };
}

export { useAccess as u };
//# sourceMappingURL=use-access-XV92pWg5.mjs.map
