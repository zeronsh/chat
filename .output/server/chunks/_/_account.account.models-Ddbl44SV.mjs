import { jsxs, jsx } from 'react/jsx-runtime';
import { S as Section } from './section-DSNePGi9.mjs';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { j as useSettings, a as useDatabase, M as ModelIcon, m as formatTokenPrice, c as cn } from './ssr.mjs';
import { useQuery } from '@rocicorp/zero/react';
import { B as Badge } from './badge-Rbql8X69.mjs';
import { C as CapabilityBadges } from './capability-badges-B_Ev6rdj.mjs';
import '@tanstack/react-router';
import '@t3-oss/env-core';
import 'zod';
import 'better-auth/client/plugins';
import 'better-auth/react';
import 'react';
import 'clsx';
import 'tailwind-merge';
import 'nanoid';
import 'next-themes';
import 'sonner';
import 'drizzle-orm';
import 'drizzle-orm/pg-core';
import 'drizzle-orm/node-postgres';
import 'effect';
import '@react-email/components';
import 'resend';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';
import 'better-auth/react-start';
import 'node:async_hooks';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import '@radix-ui/react-dialog';
import 'lucide-react';
import 'zustand/traditional';
import 'zustand/middleware';
import '@tanstack/zod-adapter';
import 'uploadthing/server';
import 'ai';
import 'exa-js';
import 'resumable-stream';
import 'ts-pattern';
import '@vercel/functions';
import 'effect-redis';
import '@ai-sdk/gateway';
import 'stripe';
import '@tanstack/react-router/ssr/server';
import './tooltip-D6Wn3Zfb.mjs';
import '@base-ui-components/react/tooltip';

function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const SplitComponent = function RouteComponent() {
  const settings = useSettings();
  const db = useDatabase();
  const [allModels] = useQuery(db.query.model.where("enabled", true));
  if (!settings) return null;
  const currentPinned = settings.pinnedModels || [];
  const activeModelCount = currentPinned.length;
  const handleModelToggle = (modelId, isEnabled) => {
    let updatedPinned;
    if (isEnabled) {
      updatedPinned = [...currentPinned, modelId];
    } else {
      if (activeModelCount <= 1) {
        return;
      }
      updatedPinned = currentPinned.filter((id) => id !== modelId);
    }
    db.mutate.setting.update({
      id: settings.id,
      pinnedModels: updatedPinned
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 w-full", children: [
    /* @__PURE__ */ jsx("title", { children: "Models | Zeron" }),
    /* @__PURE__ */ jsx(Section, { title: "Available Models", description: "Toggle which models appear in your model selector", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: allModels == null ? void 0 : allModels.map((model) => {
      var _a;
      const isPinned = ((_a = settings.pinnedModels) == null ? void 0 : _a.includes(model.id)) || false;
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col rounded-lg border bg-card backdrop-blur-md overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-1 p-4 border-b", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ModelIcon, { className: "size-6 fill-primary", model: model.icon }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: model.name }),
                model.access === "premium_required" && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "PRO" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: model.description })
            ] }),
            /* @__PURE__ */ jsx(Switch, { checked: isPinned, disabled: isPinned && activeModelCount <= 1, onCheckedChange: (checked) => handleModelToggle(model.id, checked) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-sidebar justify-between", children: [
          /* @__PURE__ */ jsx("div", { children: model.capabilities && model.capabilities.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsx(CapabilityBadges, { capabilities: model.capabilities }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            formatTokenPrice(model.inputCost),
            " in \xB7",
            " ",
            formatTokenPrice(model.outputCost),
            " out /M tokens"
          ] })
        ] })
      ] }, model.id);
    }) }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.account.models-Ddbl44SV.mjs.map
