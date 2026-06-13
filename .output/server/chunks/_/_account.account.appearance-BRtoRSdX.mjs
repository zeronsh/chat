import { jsxs, jsx } from 'react/jsx-runtime';
import { S as Section } from './section-DSNePGi9.mjs';
import { S as Separator } from './separator-B1dEAfBT.mjs';
import { j as useSettings, a as useDatabase, c as cn } from './ssr.mjs';
import { SunIcon, MoonIcon } from 'lucide-react';
import '@radix-ui/react-separator';
import '@tanstack/react-router';
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

const themes = [{
  name: "Default",
  value: "default",
  description: "Clean and minimal design"
}, {
  name: "T3 Chat",
  value: "t3-chat",
  description: "Modern chat interface style"
}, {
  name: "Claymorphism",
  value: "claymorphism",
  description: "Soft, clay-like appearance"
}, {
  name: "Claude",
  value: "claude",
  description: "Anthropic's Claude-inspired theme"
}, {
  name: "Graphite",
  value: "graphite",
  description: "Dark and sophisticated"
}, {
  name: "Amethyst Haze",
  value: "amethyst-haze",
  description: "Purple-tinted aesthetic"
}, {
  name: "Vercel",
  value: "vercel",
  description: "Vercel-inspired design"
}];
const SplitComponent = function RouteComponent() {
  var _a;
  const settings = useSettings();
  const db = useDatabase();
  if (!settings) return null;
  const mode = (_a = settings.mode) != null ? _a : "dark";
  const handleThemeChange = (themeValue) => {
    db.mutate.setting.update({
      id: settings.id,
      theme: themeValue
    });
  };
  const handleModeChange = (newMode) => {
    db.mutate.setting.update({
      id: settings.id,
      mode: newMode
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 w-full", children: [
    /* @__PURE__ */ jsx("title", { children: "Appearance | Zeron" }),
    /* @__PURE__ */ jsx(Section, { title: "Mode", description: "Choose between light and dark mode", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: cn("relative p-4 rounded-lg border cursor-pointer transition-all hover:border-foreground/20 text-left w-full bg-muted/50 backdrop-blur-md border-foreground/15", settings.mode === "light" ? "border-primary/50 bg-primary/5" : "border-foreground/10 hover:bg-muted/50"), onClick: () => handleModeChange("light"), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-md bg-muted", children: /* @__PURE__ */ jsx(SunIcon, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Light Mode" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Bright interface for daytime use" })
          ] })
        ] }),
        settings.mode === "light" && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsx("div", { className: "size-2 bg-primary rounded-full" }) })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: cn("relative p-4 rounded-lg border cursor-pointer transition-all hover:border-foreground/20 text-left w-full bg-muted/50 backdrop-blur-md border-foreground/15", settings.mode === "dark" ? "border-primary/50 bg-primary/5" : "border-foreground/10 hover:bg-muted/50"), onClick: () => handleModeChange("dark"), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-md bg-muted", children: /* @__PURE__ */ jsx(MoonIcon, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Dark Mode" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Dark interface for nighttime use" })
          ] })
        ] }),
        settings.mode === "dark" && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsx("div", { className: "size-2 bg-primary rounded-full" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsx(Section, { title: "Theme", description: "Choose your preferred visual theme", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: themes.map((themeOption) => /* @__PURE__ */ jsxs("button", { type: "button", className: cn("relative p-4 rounded-lg border cursor-pointer transition-all hover:border-foreground/20 text-left w-full bg-background/10 backdrop-blur-md overflow-hidden", themeOption.value === settings.theme ? "border-primary/50 bg-primary/5" : "border-foreground/10 hover:bg-muted/50"), onClick: () => handleThemeChange(themeOption.value), children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: themeOption.name }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: themeOption.description })
      ] }) }),
      themeOption.value === settings.theme && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsx("div", { className: "size-2 bg-primary rounded-full" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex absolute left-0 right-0 bottom-0", children: [
        /* @__PURE__ */ jsx("div", { className: cn(themeOption.value, mode, "size-4 bg-primary flex-1") }),
        /* @__PURE__ */ jsx("div", { className: cn(themeOption.value, mode, "size-4 bg-secondary flex-1") }),
        /* @__PURE__ */ jsx("div", { className: cn(themeOption.value, mode, "size-4 bg-accent flex-1") })
      ] })
    ] }, themeOption.value)) }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.account.appearance-BRtoRSdX.mjs.map
