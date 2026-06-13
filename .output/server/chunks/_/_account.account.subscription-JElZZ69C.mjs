import { jsxs, jsx } from 'react/jsx-runtime';
import { S as Section } from './section-DSNePGi9.mjs';
import { p as useSession, N as NotAnonymous, B as Button, A as Anonymous } from './ssr.mjs';
import { u as useAccess } from './use-access-XV92pWg5.mjs';
import { Link } from '@tanstack/react-router';
import { B as Badge } from './badge-Rbql8X69.mjs';
import { S as Separator } from './separator-B1dEAfBT.mjs';
import '@t3-oss/env-core';
import 'zod';
import 'better-auth/client/plugins';
import 'better-auth/react';
import '@rocicorp/zero/react';
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
import '@radix-ui/react-separator';

const SplitComponent = function RouteComponent() {
  const {
    data: session
  } = useSession();
  const {
    isPro,
    isExpiring,
    usagePercent
  } = useAccess();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 w-full", children: [
    /* @__PURE__ */ jsx("title", { children: "Subscription | Zeron" }),
    /* @__PURE__ */ jsxs(Section, { title: "Subscription", description: "Manage your subscription.", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 bg-card p-4 rounded-lg border", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Free" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "$0" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "/month" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "The essential features of Zeron." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 bg-card p-4 rounded-lg border-primary/50 border", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Pro" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Recommended" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Gain access to premium models and advanced features." }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "$25" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "/month" })
          ] }),
          !isPro && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(NotAnonymous, { children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
              const url = new URL("/api/checkout", window.location.origin);
              url.searchParams.set("redirectUrl", window.location.origin + "/account/subscription");
              window.location.href = url.toString();
            }, children: "Upgrade to Pro" }) }),
            /* @__PURE__ */ jsx(Anonymous, { children: /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/login", search: {
              callbackUrl: "/api/checkout"
            }, children: "Upgrade to Pro" }) }) })
          ] }),
          isPro && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
            const url = new URL("/api/customer-portal", window.location.origin);
            url.searchParams.set("redirectUrl", window.location.origin + "/account/subscription");
            window.location.href = url.toString();
          }, children: "Manage Subscription" }) })
        ] })
      ] }),
      isPro && isExpiring && /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 bg-card", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-yellow-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Subscription Ending" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("p", { children: "Your Pro subscription has been canceled and will end at the end of your current billing period. You'll continue to have access to Pro features until then." }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsx(Section, { title: "Usage", description: "Track your current usage and limits.", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 bg-card p-4 rounded-lg border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Daily Usage" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          usagePercent,
          "% used"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-secondary rounded-full h-2", children: /* @__PURE__ */ jsx("div", { className: "bg-primary rounded-full h-2 transition-all duration-300", style: {
        width: `${usagePercent}%`
      } }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Resets daily" })
    ] }) }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.account.subscription-JElZZ69C.mjs.map
