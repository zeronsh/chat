import { jsxs, jsx } from 'react/jsx-runtime';
import { R as Route$6, i as authClient, A as Anonymous, B as Button, N as NotAnonymous } from './ssr.mjs';
import { I as Input } from './input-DSH9a5ry.mjs';
import { S as Separator } from './separator-B1dEAfBT.mjs';
import { useForm } from '@tanstack/react-form';
import { useNavigate, Navigate } from '@tanstack/react-router';
import { ArrowRightIcon, Loader2, GithubIcon } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import z$2 from 'zod';
import '@t3-oss/env-core';
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

const schema = z$2.object({
  email: z$2.string().email()
});
const SplitComponent = function RouteComponent() {
  const navigate = useNavigate();
  const search = Route$6.useSearch();
  const form = useForm({
    defaultValues: {
      email: ""
    },
    onSubmit: async ({
      value
    }) => {
      await authClient.signIn.magicLink({
        email: value.email,
        callbackURL: search.callbackUrl
      });
      navigate({
        to: "/magic-link"
      });
    },
    validators: {
      onMount: schema,
      onChange: schema,
      onSubmit: schema
    }
  });
  return /* @__PURE__ */ jsxs("form", { className: "flex flex-1 items-center justify-center relative w-full h-full p-4", onSubmit: (e) => {
    e.preventDefault();
    form.handleSubmit();
  }, children: [
    /* @__PURE__ */ jsx(Anonymous, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 items-center max-w-md col-span-1 justify-center row-span-3 rounded-2x", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 min-w-[280px] md:min-w-[350px]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold text-foreground", children: "Login to Zeron" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "Enter your email to login to your account" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(form.Field, { name: "email", children: (field) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-full", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Email" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "m@example.com", value: field.state.value, onChange: (e) => field.handleChange(e.target.value) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(form.Subscribe, { selector: (state) => ({
        isSubmitting: state.isSubmitting,
        canSubmit: state.canSubmit
      }), children: ({
        isSubmitting,
        canSubmit
      }) => /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: !canSubmit || isSubmitting, children: [
        /* @__PURE__ */ jsx("span", { className: "text-primary-foreground", children: "Continue" }),
        !isSubmitting ? /* @__PURE__ */ jsx(ArrowRightIcon, { className: "text-primary-foreground", size: 10 }) : /* @__PURE__ */ jsx(Loader2, { className: "text-primary-foreground animate-spin", size: 10 })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-4 w-full", children: [
        /* @__PURE__ */ jsx(Separator, { className: "flex-1" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "Or" }),
        /* @__PURE__ */ jsx(Separator, { className: "flex-1" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-full", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: async () => {
          await authClient.signIn.social({
            provider: "google",
            callbackURL: search.callbackUrl
          });
        }, children: [
          /* @__PURE__ */ jsx(FcGoogle, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Continue with Google" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: async () => {
          await authClient.signIn.social({
            provider: "github",
            callbackURL: search.callbackUrl
          });
        }, children: [
          /* @__PURE__ */ jsx(GithubIcon, { className: "text-foreground", size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Continue with GitHub" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(NotAnonymous, { children: /* @__PURE__ */ jsx(Navigate, { to: "/" }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.login.index-CA2fzYyv.mjs.map
