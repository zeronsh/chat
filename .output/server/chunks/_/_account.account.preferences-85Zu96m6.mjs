import { jsxs, jsx } from 'react/jsx-runtime';
import { S as Section } from './section-DSNePGi9.mjs';
import { I as Input } from './input-DSH9a5ry.mjs';
import { S as Separator } from './separator-B1dEAfBT.mjs';
import { T as Textarea } from './textarea-BaB3TrqS.mjs';
import { j as useSettings, a as useDatabase } from './ssr.mjs';
import { toast } from 'sonner';
import z$2 from 'zod';
import { S as SingleFieldForm } from './single-field-form-DzgPsw4J.mjs';
import '@radix-ui/react-separator';
import '@tanstack/react-router';
import '@t3-oss/env-core';
import 'better-auth/client/plugins';
import 'better-auth/react';
import '@rocicorp/zero/react';
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
import '@radix-ui/react-label';
import '@tanstack/react-form';

const nicknameSchema = z$2.object({
  value: z$2.string().min(0).max(50)
});
const biographySchema = z$2.object({
  value: z$2.string().min(0).max(500)
});
const instructionsSchema = z$2.object({
  value: z$2.string().min(0).max(1e3)
});
const SplitComponent = function RouteComponent() {
  var _a, _b, _c;
  const settings = useSettings();
  const db = useDatabase();
  const updateSetting = async (field, value) => {
    if (!settings) return;
    await db.mutate.setting.update({
      id: settings.id,
      [field]: value
    });
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    toast.success(`${fieldName} saved`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
    /* @__PURE__ */ jsx("title", { children: "Preferences | Zeron" }),
    /* @__PURE__ */ jsxs(Section, { title: "Preferences", description: "Customize your preferences here.", children: [
      /* @__PURE__ */ jsx(SingleFieldForm, { label: "Nickname", description: "What do you want Zeron Chat to call you?", footerMessage: "Please use 50 characters or less.", defaultValue: (_a = settings == null ? void 0 : settings.nickname) != null ? _a : "", schema: nicknameSchema, renderInput: ({
        onChange,
        value
      }) => /* @__PURE__ */ jsx(Input, { placeholder: "Enter your nickname", value, className: "bg-muted/50 backdrop-blur-md border border-foreground/15", onChange: (e) => onChange(e.target.value) }), onSubmit: (value) => updateSetting("nickname", value) }),
      /* @__PURE__ */ jsx(SingleFieldForm, { label: "Biography", description: "What should Zeron Chat know about you?", footerMessage: "Please use 500 characters or less.", defaultValue: (_b = settings == null ? void 0 : settings.biography) != null ? _b : "", schema: biographySchema, renderInput: ({
        onChange,
        value
      }) => /* @__PURE__ */ jsx(Textarea, { className: "resize-none bg-muted/50 backdrop-blur-md border border-foreground/15", placeholder: "Enter your biography", rows: 5, value, onChange: (e) => onChange(e.target.value) }), onSubmit: (value) => updateSetting("biography", value) })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsx(Section, { title: "System", description: "Customize your system prompt here.", children: /* @__PURE__ */ jsx(SingleFieldForm, { label: "Instructions", description: "How do you want Zeron Chat to behave?", footerMessage: "Please use 1000 characters or less.", defaultValue: (_c = settings == null ? void 0 : settings.instructions) != null ? _c : "", schema: instructionsSchema, renderInput: ({
      onChange,
      value
    }) => /* @__PURE__ */ jsx(Textarea, { className: "resize-none bg-muted/50 backdrop-blur-md border border-foreground/15", placeholder: "Enter your instructions", rows: 5, value, onChange: (e) => onChange(e.target.value) }), onSubmit: (value) => updateSetting("instructions", value) }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_account.account.preferences-85Zu96m6.mjs.map
