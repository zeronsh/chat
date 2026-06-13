import { jsx, jsxs } from 'react/jsx-runtime';
import { w as createServerRpc, x as createServerFn, y as getWebRequest, S as Session, z as getSSRData, C as getThreadByIdAndUserId, E as SessionLive, G as DatabaseLive, c as cn, H as DatabaseProvider, j as useSettings, T as Toaster, I as ProDialog } from './ssr.mjs';
import { createRootRoute, HeadContent, Scripts, Outlet } from '@tanstack/react-router';
import { Effect, Clock } from 'effect';
import { useRef, useEffect } from 'react';
import { z } from 'zod';
import '@t3-oss/env-core';
import 'better-auth/client/plugins';
import 'better-auth/react';
import '@rocicorp/zero/react';
import 'clsx';
import 'tailwind-merge';
import 'nanoid';
import 'next-themes';
import 'sonner';
import 'drizzle-orm';
import 'drizzle-orm/pg-core';
import 'drizzle-orm/node-postgres';
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

const GetContextSchema = z.object({
  threadId: z.string().optional()
});
const getContext_createServerFn_handler = createServerRpc("src_routes_root_tsx--getContext_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getContext.__executeServer(opts, signal);
});
const getContext = createServerFn({
  method: "GET"
}).validator((obj) => {
  return GetContextSchema.parse(obj);
}).handler(getContext_createServerFn_handler, async ({
  data
}) => {
  const program = Effect.Do.pipe(Effect.let("request", () => getWebRequest()), Effect.flatMap(({
    request
  }) => {
    return Effect.Do.pipe(Effect.bind("now", () => Clock.currentTimeMillis), Effect.bind("session", () => Session), Effect.bind("context", ({
      session
    }) => getSSRData(session.user.id)), Effect.bind("thread", ({
      session
    }) => {
      if (data.threadId) {
        return getThreadByIdAndUserId(data.threadId, session.user.id);
      }
      return Effect.succeed(null);
    }), Effect.bind("end", () => Clock.currentTimeMillis), Effect.tap(({
      now,
      end
    }) => Effect.log(`SSR Duration: ${end - now}ms`)), Effect.provide(SessionLive(request)));
  }), Effect.map(({
    context,
    session,
    thread
  }) => ({
    session,
    thread,
    settings: context.results[0],
    customer: context.results[1],
    usage: context.results[2],
    user: context.results[3],
    threads: context.results[4]
  })), Effect.provide(DatabaseLive), Effect.catchAll((_) => Effect.succeed(void 0)));
  return Effect.runPromise(program);
});
function RootComponent({
  htmlRef
}) {
  const settings = useSettings();
  const mountedRef = useRef(false);
  useEffect(() => {
    var _a, _b;
    if (htmlRef.current) {
      htmlRef.current.className = cn((_a = settings == null ? void 0 : settings.mode) != null ? _a : "dark", (_b = settings == null ? void 0 : settings.theme) != null ? _b : "default");
    }
  }, [settings == null ? void 0 : settings.mode, settings == null ? void 0 : settings.theme]);
  useEffect(() => {
    if (!mountedRef.current) {
      import('./markdown-J2uDOPVo.mjs').then((module) => {
        console.log("Markdown loaded");
        window.__preload_markdown = {
          default: module.Markdown
        };
      });
    }
    mountedRef.current = true;
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 flex text-foreground", children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center" }),
    /* @__PURE__ */ jsx(ProDialog, {})
  ] });
}
const Route = createRootRoute({
  shouldReload: false,
  loader: async ({
    params
  }) => {
    const context = await getContext({
      data: params
    });
    return {
      settings: context == null ? void 0 : context.settings,
      session: context == null ? void 0 : context.session,
      threads: context == null ? void 0 : context.threads,
      customer: context == null ? void 0 : context.customer,
      usage: context == null ? void 0 : context.usage,
      user: context == null ? void 0 : context.user,
      thread: context == null ? void 0 : context.thread
    };
  },
  head: (ctx) => {
    var _a, _b, _c;
    return {
      meta: [{
        charSet: "utf-8"
      }, {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }, {
        title: (_c = (_b = (_a = ctx == null ? void 0 : ctx.loaderData) == null ? void 0 : _a.thread) == null ? void 0 : _b.title) != null ? _c : "Zeron"
      }, {
        name: "description",
        content: "Chat with models from OpenAI, Anthropic, and more."
      }],
      links: [{
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      }, {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      }, {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600;700&display=swap"
      }]
    };
  },
  notFoundComponent: () => /* @__PURE__ */ jsx("div", { children: "Not found" }),
  component: () => /* @__PURE__ */ jsx(RootDocument, {})
});
function RootDocument() {
  var _a, _b, _c, _d;
  const ref = useRef(null);
  const loaderData = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "en", ref, className: cn((_b = (_a = loaderData == null ? void 0 : loaderData.settings) == null ? void 0 : _a.mode) != null ? _b : "dark", (_d = (_c = loaderData == null ? void 0 : loaderData.settings) == null ? void 0 : _c.theme) != null ? _d : "default"), children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "fixed inset-0", children: [
      /* @__PURE__ */ jsx(DatabaseProvider, { children: /* @__PURE__ */ jsx(RootComponent, { htmlRef: ref }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}

export { getContext_createServerFn_handler };
//# sourceMappingURL=__root-Bt3piWC-.mjs.map
