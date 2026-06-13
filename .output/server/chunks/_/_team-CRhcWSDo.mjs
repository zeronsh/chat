import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Button } from './ssr.mjs';
import { Link, Outlet } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
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
  return /* @__PURE__ */ jsx("div", { className: "flex flex-1 relative", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-1 z-1 overflow-auto relative", children: [
    /* @__PURE__ */ jsx(motion.div, { className: "absolute top-0 left-0 z-10 p-4", initial: {
      opacity: 0,
      x: -20
    }, animate: {
      opacity: 1,
      x: 0
    }, transition: {
      duration: 0.5,
      delay: 0.1
    }, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", children: [
      /* @__PURE__ */ jsx(ArrowLeftIcon, { className: "size-4" }),
      /* @__PURE__ */ jsx("span", { children: "Back" })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 w-full", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=_team-CRhcWSDo.mjs.map
