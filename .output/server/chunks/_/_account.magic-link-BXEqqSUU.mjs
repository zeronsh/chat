import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Button } from './ssr.mjs';
import { Link } from '@tanstack/react-router';
import { MailIcon, ArrowLeftIcon } from 'lucide-react';
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

const SplitComponent = function RouteComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center relative w-full h-full p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col p-8 gap-6 items-center max-w-md col-span-1 justify-center row-span-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-2", children: /* @__PURE__ */ jsx(MailIcon, { className: "size-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold text-foreground", children: "Magic Link Sent" }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm text-center", children: "We've sent a magic link to your email address. Check your inbox and click the link to sign in to your account." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsxs(Link, { to: "/", children: [
        /* @__PURE__ */ jsx(ArrowLeftIcon, { className: "size-4" }),
        /* @__PURE__ */ jsx("span", { className: "text-primary-foreground", children: "Back to Home" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsx(Link, { to: "/login", children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Try Another Email" }) }) }) })
    ] })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.magic-link-BXEqqSUU.mjs.map
