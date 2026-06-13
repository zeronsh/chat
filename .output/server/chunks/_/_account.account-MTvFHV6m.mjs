import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Button, A as Anonymous } from './ssr.mjs';
import { S as Section } from './section-DSNePGi9.mjs';
import { S as Separator } from './separator-B1dEAfBT.mjs';
import { Link, Outlet } from '@tanstack/react-router';
import { UserIcon, CreditCardIcon, SettingsIcon, BotIcon, PaintbrushIcon } from 'lucide-react';
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

const pages = [{
  title: "Account",
  url: "/account",
  icon: /* @__PURE__ */ jsx(UserIcon, {})
}, {
  title: "Subscription",
  url: "/account/subscription",
  icon: /* @__PURE__ */ jsx(CreditCardIcon, {})
}, {
  title: "Preferences",
  url: "/account/preferences",
  icon: /* @__PURE__ */ jsx(SettingsIcon, {})
}, {
  title: "Models",
  url: "/account/models",
  icon: /* @__PURE__ */ jsx(BotIcon, {})
}, {
  title: "Appearance",
  url: "/account/appearance",
  icon: /* @__PURE__ */ jsx(PaintbrushIcon, {})
}];
const SplitComponent = function RouteComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-1 py-24", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 w-full max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your account preferences and configuration." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto min-w-full w-0", children: /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-2", children: pages.map((page) => /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", children: /* @__PURE__ */ jsxs(Link, { to: page.url, className: "flex items-center justify-start gap-2", activeOptions: {
      exact: true
    }, activeProps: {
      className: "bg-muted/50 border border-foreground/10"
    }, children: [
      page.icon,
      page.title
    ] }) }, page.url)) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs(Anonymous, { children: [
        /* @__PURE__ */ jsx(Section, { title: "Anonymous", description: "As an anonymous user, your data may be deleted or lost at any time. Login to keep your data safe.", children: /* @__PURE__ */ jsxs("div", { className: "border backdrop-blur-md mb-8 p-0 rounded-lg bg-card overflow-hidden text-sm text-muted-foreground flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("h3", { children: "Not logged in" }),
            /* @__PURE__ */ jsx("p", { children: "You are currently an anonymous user. Your chats, messages and preferences may be deleted in the future. To save your data, create an account or login." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex px-4 py-3 bg-sidebar w-full justify-end border-t", children: /* @__PURE__ */ jsx(Button, { variant: "default", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "Login" }) }) })
        ] }) }),
        /* @__PURE__ */ jsx(Separator, { className: "mb-8" })
      ] }),
      /* @__PURE__ */ jsx(Outlet, {})
    ] })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.account-MTvFHV6m.mjs.map
