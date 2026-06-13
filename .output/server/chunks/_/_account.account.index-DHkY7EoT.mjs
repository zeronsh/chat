import { jsxs, jsx } from 'react/jsx-runtime';
import { a as useDatabase, p as useSession, i as authClient, q as RevokeSessionDialog, B as Button, N as NotAnonymous, L as LogoutDialog } from './ssr.mjs';
import { S as Section } from './section-DSNePGi9.mjs';
import { I as Input } from './input-DSH9a5ry.mjs';
import { S as Separator } from './separator-B1dEAfBT.mjs';
import { g as getUsername } from './usernames-DPjv0W1f.mjs';
import { Globe, MapPin, Clock, Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';
import { UAParser } from 'ua-parser-js';
import { useQuery } from '@rocicorp/zero/react';
import { toast } from 'sonner';
import { S as SingleFieldForm } from './single-field-form-DzgPsw4J.mjs';
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
import '@radix-ui/react-label';
import '@tanstack/react-form';

const SplitComponent = function RouteComponent() {
  const db = useDatabase();
  const {
    data: session
  } = useSession();
  const [activeSessions] = useQuery(db.query.session.where("userId", "=", db.userID).where("expiresAt", ">", (/* @__PURE__ */ new Date()).getTime()));
  const getDeviceIcon = (userAgent) => {
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    if (device.type === "mobile") return /* @__PURE__ */ jsx(Smartphone, { className: "size-4" });
    if (device.type === "tablet") return /* @__PURE__ */ jsx(Tablet, { className: "size-4" });
    if (os.name === "Mac OS") return /* @__PURE__ */ jsx(Laptop, { className: "size-4" });
    if (os.name === "Windows") return /* @__PURE__ */ jsx(Monitor, { className: "size-4" });
    if (os.name === "Linux") return /* @__PURE__ */ jsx(Monitor, { className: "size-4" });
    return /* @__PURE__ */ jsx(Globe, { className: "size-4" });
  };
  const getDeviceInfo = (userAgent) => {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    const parts = [];
    if (browser.name) parts.push(browser.name);
    if (os.name) parts.push(os.name);
    if (device.model) parts.push(device.model);
    return parts.join(" \u2022 ") || "Unknown device";
  };
  const formatDate = (date) => {
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1e3 * 60 * 60));
    const minutes = Math.floor(diff / (1e3 * 60));
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 w-full", children: [
    /* @__PURE__ */ jsx("title", { children: "Account | Zeron" }),
    /* @__PURE__ */ jsx(Section, { title: "Profile", description: "Update your account details", children: /* @__PURE__ */ jsx(SingleFieldForm, { label: "Username", description: "What do you want to be called?", footerMessage: "Please use 32 characters or less.", defaultValue: getUsername(session == null ? void 0 : session.user), renderInput: ({
      onChange,
      value
    }) => /* @__PURE__ */ jsx(Input, { value, onChange: (e) => onChange(e.target.value) }), onSubmit: async (value) => {
      if (!(session == null ? void 0 : session.user)) return;
      await authClient.updateUser({
        name: value
      });
      toast.success("Username updated");
    } }) }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsx(Section, { title: "Sessions", description: "Manage your sessions", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: activeSessions == null ? void 0 : activeSessions.map((sessionItem) => {
      const isCurrentSession = sessionItem.id === (session == null ? void 0 : session.session.id);
      const deviceInfo = sessionItem.userAgent ? getDeviceInfo(sessionItem.userAgent) : "Unknown device";
      const deviceIcon = sessionItem.userAgent ? getDeviceIcon(sessionItem.userAgent) : /* @__PURE__ */ jsx(Globe, { className: "size-4" });
      return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-4 rounded-lg border transition-colors ${isCurrentSession ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-foreground/10 hover:bg-muted/80"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center w-8 h-8 rounded-md ${isCurrentSession ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`, children: deviceIcon }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate", children: deviceInfo }),
              isCurrentSession && /* @__PURE__ */ jsx("span", { className: "text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full", children: "Current" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
              sessionItem.ipAddress && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "size-3" }),
                /* @__PURE__ */ jsx("span", { children: sessionItem.ipAddress })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "size-3" }),
                /* @__PURE__ */ jsx("span", { children: formatDate(new Date(sessionItem.createdAt)) })
              ] })
            ] })
          ] })
        ] }),
        !isCurrentSession && /* @__PURE__ */ jsx(RevokeSessionDialog, { token: sessionItem.token, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsx("span", { children: "Revoke" }) }) }),
        /* @__PURE__ */ jsx(NotAnonymous, { children: isCurrentSession && /* @__PURE__ */ jsx(LogoutDialog, { children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsx("span", { children: "Logout" }) }) }) })
      ] }, sessionItem.id);
    }) }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.account.index-DHkY7EoT.mjs.map
