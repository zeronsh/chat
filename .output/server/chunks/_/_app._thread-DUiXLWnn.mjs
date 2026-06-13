import { jsxs, jsx, Fragment as Fragment$1 } from 'react/jsx-runtime';
import { DefaultChatTransport, AbstractChat } from 'ai';
import { a as useDatabase, k as useParamsThreadId, o as useThreadFromParams, n as nanoid, c as cn, j as useSettings, B as Button, h as useUser, N as NotAnonymous, i as authClient, A as Anonymous, l as dialogStore, M as ModelIcon, m as formatTokenPrice, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter } from './ssr.mjs';
import { useMemo, Fragment, useEffect, createContext, useState, useRef, useContext } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { u as useAccess } from './use-access-XV92pWg5.mjs';
import { g as getUsername } from './usernames-DPjv0W1f.mjs';
import { useNavigate, Link } from '@tanstack/react-router';
import { PaintBucket, SunIcon, MoonIcon, UserIcon, CreditCardIcon, SettingsIcon, BotIcon, PaintbrushIcon, GithubIcon, LogOutIcon, LogInIcon, ArrowDownIcon, AlertTriangleIcon, EditIcon, XIcon, LoaderIcon, Paperclip, SquareIcon, ArrowUpIcon, SearchIcon, FileText, X, ChevronsUpDown, PinOff, Pin, CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { Command as Command$1 } from 'cmdk';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { T as Tooltip, a as TooltipTrigger, b as TooltipPositioner, c as TooltipContent, d as TooltipProvider } from './tooltip-D6Wn3Zfb.mjs';
import { j as SidebarTrigger } from './sidebar-BMkfUrts.mjs';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import throttle from 'throttleit';
import { useMugenVirtualizer, MugenVList, VStack, useMugenSelector, HStack, Escape, Text, useMugenState, definePrimitive } from '@wingleeio/mugen';
import { T as Textarea } from './textarea-BaB3TrqS.mjs';
import { motion } from 'framer-motion';
import { generateReactHelpers, generateUploadButton, generateUploadDropzone } from '@uploadthing/react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import { useQuery } from '@rocicorp/zero/react';
import { C as CapabilityBadges } from './capability-badges-B_Ev6rdj.mjs';
import { Markdown } from '@wingleeio/mugen-markdown';
import { useDropzone } from 'react-dropzone';
import '@t3-oss/env-core';
import 'zod';
import 'better-auth/client/plugins';
import 'better-auth/react';
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
import '@tanstack/zod-adapter';
import 'uploadthing/server';
import 'exa-js';
import 'resumable-stream';
import '@vercel/functions';
import 'effect-redis';
import '@ai-sdk/gateway';
import 'stripe';
import '@tanstack/react-router/ssr/server';
import '@base-ui-components/react/tooltip';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-foreground/10 focus:text-muted-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-foreground/10 -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function UserMenu() {
  var _a;
  const user = useUser();
  const { isPro } = useAccess();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { className: "outline-none cursor-pointer", asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxs(Avatar, { className: "rounded-md overflow-hidden", children: [
      /* @__PURE__ */ jsx(AvatarImage, { className: "rounded-none", src: (_a = user == null ? void 0 : user.image) != null ? _a : void 0 }),
      /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-none", children: getUsername(user).charAt(0) })
    ] }) }) }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        className: "bg-background/50 border-foreground/10 w-[200px] backdrop-blur-md",
        align: "end",
        children: [
          /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm truncate", children: getUsername(user) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: isPro ? "Pro" : "Free" })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/account", children: [
            /* @__PURE__ */ jsx(UserIcon, { className: "size-4" }),
            "Account"
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/account/subscription", children: [
            /* @__PURE__ */ jsx(CreditCardIcon, { className: "size-4" }),
            "Subscription"
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/account/preferences", children: [
            /* @__PURE__ */ jsx(SettingsIcon, { className: "size-4" }),
            "Preferences"
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/account/models", children: [
            /* @__PURE__ */ jsx(BotIcon, { className: "size-4" }),
            "Models"
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/account/appearance", children: [
            /* @__PURE__ */ jsx(PaintbrushIcon, { className: "size-4" }),
            "Appearance"
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "https://github.com/zeronsh/chat", target: "_blank", rel: "noreferrer", children: [
            /* @__PURE__ */ jsx(GithubIcon, { className: "size-4" }),
            "GitHub"
          ] }) }),
          /* @__PURE__ */ jsxs(NotAnonymous, { children: [
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: async () => {
                  await authClient.signOut();
                  navigate({ to: "/logged-out" });
                },
                children: [
                  /* @__PURE__ */ jsx(LogOutIcon, { className: "size-4" }),
                  "Log out"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Anonymous, { children: [
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/login", children: [
              /* @__PURE__ */ jsx(LogInIcon, { className: "size-4" }),
              "Log in"
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
function Command({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1,
    {
      "data-slot": "command",
      className: cn("flex h-full w-full flex-col overflow-hidden rounded-md", className),
      ...props
    }
  );
}
function CommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-12 items-center gap-2 border-b border-foreground/10 px-3",
      children: [
        /* @__PURE__ */ jsx(SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx(
          Command$1.Input,
          {
            "data-slot": "command-input",
            className: cn(
              "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 text-md placeholder:text-sm",
              className
            ),
            ...props
          }
        )
      ]
    }
  );
}
function CommandList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1.List,
    {
      "data-slot": "command-list",
      className: cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className),
      ...props
    }
  );
}
function CommandEmpty({ ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1.Empty,
    {
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm",
      ...props
    }
  );
}
function CommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props
    }
  );
}
function CommandSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Separator,
    {
      "data-slot": "command-separator",
      className: cn("bg-foreground/10 -mx-1 h-px", className),
      ...props
    }
  );
}
function CommandItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-foreground/5 data-[selected=true]:text-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Popover({ ...props }) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden before:bg-sidebar/50 before:backdrop-blur-md before:absolute before:inset-0 before:z-[-1] before:rounded-md border-foreground/10",
        className
      ),
      ...props
    }
  ) });
}
const themes = [
  {
    name: "Default",
    value: "default"
  },
  {
    name: "T3 Chat",
    value: "t3-chat"
  },
  {
    name: "Claymorphism",
    value: "claymorphism"
  },
  {
    name: "Claude",
    value: "claude"
  },
  {
    name: "Graphite",
    value: "graphite"
  },
  {
    name: "Amethyst Haze",
    value: "amethyst-haze"
  },
  {
    name: "Vercel",
    value: "vercel"
  }
];
function ThemeSelector() {
  var _a;
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const db = useDatabase();
  if (!settings) return null;
  const mode = (_a = settings.mode) != null ? _a : "dark";
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsx(
        TooltipTrigger,
        {
          render: /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", "aria-expanded": open, children: /* @__PURE__ */ jsx(PaintBucket, { className: "size-4" }) }) })
        }
      ),
      /* @__PURE__ */ jsx(
        PopoverContent,
        {
          className: "p-0 bg-background/50 border-foreground/10 backdrop-blur-md overflow-hidden w-[250px]",
          align: "end",
          children: /* @__PURE__ */ jsxs(Command, { children: [
            /* @__PURE__ */ jsx(CommandInput, { placeholder: "Search theme...", className: "h-9" }),
            /* @__PURE__ */ jsxs(CommandList, { children: [
              /* @__PURE__ */ jsx(CommandEmpty, { children: "No theme found." }),
              /* @__PURE__ */ jsxs(CommandGroup, { heading: "Mode", children: [
                /* @__PURE__ */ jsxs(
                  CommandItem,
                  {
                    value: "light",
                    className: "data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground",
                    onSelect: () => {
                      db.mutate.setting.update({
                        id: settings.id,
                        mode: "light"
                      });
                    },
                    children: [
                      /* @__PURE__ */ jsx(SunIcon, { className: "size-4" }),
                      /* @__PURE__ */ jsx("span", { children: "Light" }),
                      /* @__PURE__ */ jsx("div", { className: "flex-1" }),
                      settings.mode === "light" && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Selected" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  CommandItem,
                  {
                    value: "dark",
                    className: "data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground",
                    onSelect: () => {
                      db.mutate.setting.update({
                        id: settings.id,
                        mode: "dark"
                      });
                    },
                    children: [
                      /* @__PURE__ */ jsx(MoonIcon, { className: "size-4" }),
                      /* @__PURE__ */ jsx("span", { children: "Dark" }),
                      /* @__PURE__ */ jsx("div", { className: "flex-1" }),
                      settings.mode === "dark" && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Selected" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(CommandSeparator, {}),
              /* @__PURE__ */ jsx(CommandGroup, { heading: "Theme", children: themes.map((themeOption) => /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  value: themeOption.name,
                  className: "data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground",
                  onSelect: () => {
                    db.mutate.setting.update({
                      id: settings.id,
                      theme: themeOption.value
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: cn(
                              themeOption.value,
                              mode,
                              "size-3 rounded-[3px] bg-primary"
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: cn(
                              themeOption.value,
                              mode,
                              "size-3 rounded-[3px] bg-secondary"
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: cn(
                              themeOption.value,
                              mode,
                              "size-3 rounded-[3px] bg-accent"
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: themeOption.name })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex-1" }),
                    themeOption.value === settings.theme && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Selected" })
                  ]
                },
                themeOption.value
              )) })
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(TooltipPositioner, { children: /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { children: "Theme switcher" }) }) })
  ] });
}
function Header() {
  const threadId = useParamsThreadId();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        threadId && "border-b border-foreground/10 bg-background/60 backdrop-blur-md",
        "absolute top-0 left-0 right-0 z-10 flex justify-between"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground select-none", children: "Zeron" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3", children: [
          /* @__PURE__ */ jsx(ThemeSelector, {}),
          /* @__PURE__ */ jsx(UserMenu, {})
        ] })
      ]
    }
  );
}
function Title({ title }) {
  return /* @__PURE__ */ jsx("title", { children: title != null ? title : "Zeron" });
}
class ThreadState {
  constructor(store) {
    __publicField(this, "store");
    __publicField(this, "pushMessage", (message) => {
      this.store.getState().pushMessage(message);
    });
    __publicField(this, "popMessage", () => {
      this.store.getState().popMessage();
    });
    __publicField(this, "replaceMessage", (index, message) => {
      this.store.getState().replaceMessage(index, message);
    });
    __publicField(this, "snapshot", (snapshot) => {
      return structuredClone(snapshot);
    });
    this.store = store;
  }
  get messages() {
    return this.store.getState().messages;
  }
  set messages(newMessages) {
    this.store.getState().setMessages(newMessages);
  }
  get status() {
    return this.store.getState().status;
  }
  set status(newStatus) {
    this.store.getState().setStatus(newStatus);
  }
  get error() {
    return this.store.getState().error;
  }
  set error(newError) {
    this.store.getState().setError(newError);
  }
}
function createThreadStore(init) {
  return createWithEqualityFn()(
    devtools(
      subscribeWithSelector((set, get) => {
        const setMessages = (messagesOrUpdater) => {
          const messages = typeof messagesOrUpdater === "function" ? messagesOrUpdater(get().messages) : messagesOrUpdater;
          set({ messages }, false, "thread/setMessages");
        };
        const throttledSetMessages = throttle(setMessages, 100);
        return {
          id: init.id,
          messages: init.messages,
          status: "ready",
          error: void 0,
          input: "",
          pendingFileCount: 0,
          editingMessageId: void 0,
          setEditingMessageId: (editingMessageId) => set({ editingMessageId }, false, "thread/setEditingMessageId"),
          setInput: (input) => set({ input }, false, "thread/setInput"),
          setPendingFileCount: (pendingFileCount) => {
            set(
              {
                pendingFileCount: typeof pendingFileCount === "function" ? pendingFileCount(get().pendingFileCount) : pendingFileCount
              },
              false,
              "thread/setPendingFileCount"
            );
          },
          attachments: [],
          setAttachments: (attachments) => set({ attachments }, false, "thread/setAttachments"),
          setStatus: (status) => set({ status }, false, "thread/setStatus"),
          setError: (error) => set({ error }, false, "thread/setError"),
          pushMessage: (message) => {
            get().setMessages([...get().messages, message]);
          },
          popMessage: () => {
            get().setMessages(get().messages.slice(0, -1));
          },
          replaceMessage: (index, message) => {
            get().setMessages([
              ...get().messages.slice(0, index),
              structuredClone(message),
              ...get().messages.slice(index + 1)
            ]);
          },
          setMessages: (messagesOrUpdater) => {
            if (get().status === "streaming") {
              throttledSetMessages(messagesOrUpdater);
              return;
            }
            setMessages(messagesOrUpdater);
          }
        };
      })
    )
  );
}
class Thread extends AbstractChat {
  constructor(init) {
    var _a;
    const store = createThreadStore({
      id: init.id,
      messages: (_a = init.messages) != null ? _a : []
    });
    const state = new ThreadState(store);
    super({ ...init, state });
    __publicField(this, "state");
    __publicField(this, "store");
    this.state = state;
    this.store = store;
  }
}
const ThreadContext = createContext(null);
const threads = /* @__PURE__ */ new Map();
function ThreadProvider({
  children,
  ...init
}) {
  var _a;
  const generateId = (_a = init.generateId) != null ? _a : nanoid;
  const id = useMemo(() => {
    if (init.id) {
      return init.id;
    }
    return generateId();
  }, [init.id, generateId]);
  const thread = useMemo(() => {
    if (threads.has(id)) {
      return threads.get(id);
    }
    const thread2 = new Thread({ ...init, id });
    threads.set(id, thread2);
    return thread2;
  }, [id]);
  useEffect(() => {
    if (init.messages && init.messages.length > 0 && init.messages.length >= thread.store.getState().messages.length) {
      thread.store.getState().setMessages(init.messages);
    }
  }, [init.messages, id]);
  return /* @__PURE__ */ jsx(ThreadContext.Provider, { value: thread, children });
}
function useThreadContext() {
  const thread = useContext(ThreadContext);
  if (!thread) {
    throw new Error("useThreadContext must be used within a ThreadProvider");
  }
  return thread;
}
function useThreadSelector(selector, equalityFn) {
  return useThreadContext().store(selector, equalityFn);
}
const PromptInputContext = createContext({
  isLoading: false,
  value: "",
  setValue: () => {
  },
  maxHeight: 240,
  onSubmit: void 0,
  disabled: false
});
function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput");
  }
  return context;
}
function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children
}) {
  const [internalValue, setInternalValue] = useState(value || "");
  const handleChange = (newValue) => {
    setInternalValue(newValue);
    onValueChange == null ? void 0 : onValueChange(newValue);
  };
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(
    PromptInputContext.Provider,
    {
      value: {
        isLoading,
        value: value != null ? value : internalValue,
        setValue: onValueChange != null ? onValueChange : handleChange,
        maxHeight,
        onSubmit
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "border-input bg-background rounded-3xl border p-2 shadow-xs",
            className
          ),
          children
        }
      )
    }
  ) });
}
function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}) {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = useRef(null);
  const threadId = useParamsThreadId();
  useEffect(() => {
    if (disableAutosize) return;
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = typeof maxHeight === "number" ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px` : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit == null ? void 0 : onSubmit();
    }
    onKeyDown == null ? void 0 : onKeyDown(e);
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [threadId]);
  return /* @__PURE__ */ jsx(
    Textarea,
    {
      ref: textareaRef,
      value,
      onChange: (e) => setValue(e.target.value),
      onKeyDown: handleKeyDown,
      className: cn(
        "text-primary min-h-[64px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      ),
      rows: 1,
      disabled,
      ...props
    }
  );
}
function PromptInputActions({ children, className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex items-center gap-2", className), ...props, children });
}
function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) {
  const { disabled } = usePromptInput();
  return /* @__PURE__ */ jsxs(Tooltip, { ...props, children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { disabled, render: /* @__PURE__ */ jsx("div", { children }) }),
    /* @__PURE__ */ jsx(TooltipPositioner, { side, children: /* @__PURE__ */ jsx(TooltipContent, { className, children: tooltip }) })
  ] });
}
generateUploadButton();
generateUploadDropzone();
const { useUploadThing } = generateReactHelpers();
function FileAttachment({ url, name, mediaType, onRemove, className }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isImage = mediaType.startsWith("image/");
  const isPdf = mediaType === "application/pdf";
  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  if (hasError) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "relative h-24 w-24 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-center",
          className
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 text-center p-2 w-full", children: [
            /* @__PURE__ */ jsx(FileText, { className: "size-6 text-destructive" }),
            /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs truncate w-full max-w-full text-center", children: name })
          ] }),
          onRemove && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground",
              onClick: onRemove,
              children: /* @__PURE__ */ jsx(X, { className: "size-3" })
            }
          )
        ]
      }
    );
  }
  if (isImage) {
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "relative h-24 w-24 rounded-2xl bg-muted/50 cursor-pointer",
            className
          ),
          onClick: () => setIsFullScreen(true),
          children: [
            isLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-muted/50", children: /* @__PURE__ */ jsx(LoaderIcon, { className: "size-6 animate-spin" }) }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: url,
                alt: name,
                className: cn(
                  "h-full w-full object-cover transition-opacity duration-200 rounded-2xl",
                  imageLoaded ? "opacity-100" : "opacity-0"
                ),
                onLoad: handleImageLoad,
                onError: handleImageError
              }
            ),
            onRemove && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground z-0",
                onClick: (e) => {
                  e.stopPropagation();
                  onRemove();
                },
                children: /* @__PURE__ */ jsx(X, { className: "size-3" })
              }
            )
          ]
        }
      ),
      isFullScreen && createPortal(
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "fixed inset-0 z-[9999] bg-background/50 backdrop-blur-sm",
            onClick: () => setIsFullScreen(false),
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: url,
                  alt: name,
                  className: "max-h-full max-w-full object-contain rounded-lg"
                }
              ) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70",
                  onClick: () => setIsFullScreen(false),
                  children: /* @__PURE__ */ jsx(X, { className: "size-6" })
                }
              )
            ]
          }
        ),
        document.body
      )
    ] });
  }
  if (isPdf) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "relative h-24 w-24 bg-muted/50 border rounded-2xl flex items-center justify-center",
          className
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-center p-2 w-full", children: [
            /* @__PURE__ */ jsx(FileText, { className: "size-6 text-muted-foreground" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs truncate w-full max-w-full text-center", children: name })
          ] }),
          onRemove && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground",
              onClick: onRemove,
              children: /* @__PURE__ */ jsx(X, { className: "size-3" })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative h-24 w-24 bg-muted/50 border rounded-2xl flex items-center justify-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 text-center p-2 w-full", children: [
          /* @__PURE__ */ jsx(FileText, { className: "size-6 text-muted-foreground" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs truncate w-full max-w-full text-center", children: name })
        ] }),
        onRemove && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground",
            onClick: onRemove,
            children: /* @__PURE__ */ jsx(X, { className: "size-3" })
          }
        )
      ]
    }
  );
}
function AccountDialog(props) {
  return /* @__PURE__ */ jsx(Dialog, { open: props.open, onOpenChange: props.setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 overflow-hidden gap-0", showCloseButton: false, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 bg-background", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Create an account" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Create an account to gain access to additional models and reset your limits." })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { className: "px-6 py-4 border-t border-foreground/10 bg-sidebar", children: /* @__PURE__ */ jsx(Button, { type: "button", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "Create account" }) }) })
  ] }) });
}
function InsufficientCreditsProDialog(props) {
  return /* @__PURE__ */ jsx(Dialog, { open: props.open, onOpenChange: props.setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 overflow-hidden gap-0", showCloseButton: false, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 bg-background", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Insufficient credits" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "You do not have enough credits to use this model. Credits are reset daily." })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { className: "px-6 py-4 border-t border-foreground/10 bg-sidebar", children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => props.setOpen(false), children: "Close" }) })
  ] }) });
}
function InsufficientCreditsDialog(props) {
  return /* @__PURE__ */ jsx(Dialog, { open: props.open, onOpenChange: props.setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 overflow-hidden gap-0", showCloseButton: false, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 bg-background", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Insufficient credits" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "You do not have enough credits to use this model. Upgrade to PRO to get more credits." })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { className: "px-6 py-4 border-t border-foreground/10 bg-sidebar", children: /* @__PURE__ */ jsx(Button, { type: "button", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/account/subscription", children: "Upgrade to PRO" }) }) })
  ] }) });
}
function ModelSelector() {
  var _a, _b;
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hoveredModel, setHoveredModel] = useState(null);
  const db = useDatabase();
  const [allModels] = useQuery(db.query.model.where("enabled", true));
  const settings = useSettings();
  const pinnedModelIds = (settings == null ? void 0 : settings.pinnedModels) || [];
  const models = allModels.filter((model) => pinnedModelIds.includes(model.id));
  const otherModels = allModels.filter((model) => !pinnedModelIds.includes(model.id));
  const access = useAccess();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [insufficientCreditsProDialogOpen, setInsufficientCreditsProDialogOpen] = useState(false);
  const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState(false);
  const setProDialogOpen = dialogStore((store) => store.proDialog.setOpen);
  useEffect(() => {
    if (!open) {
      setHoveredModel(null);
      setShowAll(false);
    }
  }, [open]);
  const handleSelectModel = (model) => {
    setOpen(false);
    if (access.checkCanUseModel(model)) {
      if (settings) {
        db.mutate.setting.update({
          id: settings.id,
          modelId: model.id
        });
      }
    } else {
      access.getCannotUseModelMatcher(model, {
        onPremiumRequired: () => {
          setProDialogOpen(true);
        },
        onAccountRequired: () => {
          setProDialogOpen(true);
        },
        onInsufficientCreditsPro: () => {
          setInsufficientCreditsProDialogOpen(true);
        },
        onInsufficientCreditsNotPro: () => {
          setInsufficientCreditsDialogOpen(true);
        },
        onInsufficientCreditsAnonymous: () => {
          setInsufficientCreditsDialogOpen(true);
        }
      });
    }
  };
  const handleTogglePin = (modelId, shouldPin) => {
    if (!settings) return;
    const current = settings.pinnedModels || [];
    const activeModelCount = current.length;
    let updated;
    if (shouldPin) {
      if (current.includes(modelId)) return;
      updated = [...current, modelId];
    } else {
      if (activeModelCount <= 1) {
        return;
      }
      updated = current.filter((id) => id !== modelId);
    }
    db.mutate.setting.update({ id: settings.id, pinnedModels: updated });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          "aria-expanded": open,
          className: "h-9 rounded-xl px-3 border border-foreground/10 bg-sidebar/40 hover:bg-sidebar/70 font-normal",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 ", children: [
              (settings == null ? void 0 : settings.model) && /* @__PURE__ */ jsx(
                ModelIcon,
                {
                  className: "fill-primary",
                  model: settings.model.icon
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "truncate hidden md:block text-xs", children: (_a = settings == null ? void 0 : settings.model) == null ? void 0 : _a.name }),
              ((_b = settings == null ? void 0 : settings.model) == null ? void 0 : _b.access) === "premium_required" && /* @__PURE__ */ jsx("span", { className: "font-mono text-[9px] font-semibold tracking-wider text-primary px-1.5 py-0.5 rounded-full z-1 bg-primary/10", children: "PRO" })
            ] }),
            /* @__PURE__ */ jsx(ChevronsUpDown, { className: "opacity-50 size-3.5" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(PopoverContent, { className: cn("p-0 relative min-w-[350px]"), align: "start", children: [
        /* @__PURE__ */ jsxs(Command, { children: [
          /* @__PURE__ */ jsx(CommandInput, { placeholder: "Find Model...", className: "h-9" }),
          /* @__PURE__ */ jsxs(CommandList, { className: cn(showAll && "max-h-[500px]"), children: [
            /* @__PURE__ */ jsx(CommandEmpty, { children: "No model found." }),
            !showAll && /* @__PURE__ */ jsx(CommandGroup, { children: models == null ? void 0 : models.map((model) => {
              var _a2;
              return /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  value: `${model.name} ${model.description}`,
                  onMouseEnter: () => setHoveredModel(model),
                  onSelect: () => handleSelectModel(model),
                  className: cn(
                    !access.checkCanUseModel(model) && "opacity-50"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 flex-1", children: [
                      model.icon && /* @__PURE__ */ jsx(
                        ModelIcon,
                        {
                          className: "fill-primary",
                          model: model.icon
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: model.name }),
                      model.access === "premium_required" && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-primary px-2 py-0.5 rounded-full z-1 bg-primary/10", children: "PRO" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      CapabilityBadges,
                      {
                        capabilities: (_a2 = model.capabilities) != null ? _a2 : []
                      }
                    )
                  ]
                },
                model.id
              );
            }) }),
            showAll && /* @__PURE__ */ jsxs(Fragment$1, { children: [
              /* @__PURE__ */ jsx(CommandGroup, { heading: "Pinned Models", children: models == null ? void 0 : models.map((model) => /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  value: `${model.name}`,
                  onMouseEnter: () => setHoveredModel(model),
                  onSelect: () => handleSelectModel(model),
                  className: cn(
                    !access.checkCanUseModel(model) && "opacity-50"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 flex-1", children: [
                      model.icon && /* @__PURE__ */ jsx(
                        ModelIcon,
                        {
                          className: "fill-primary",
                          model: model.icon
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: model.name }),
                      model.access === "premium_required" && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-primary px-2 py-0.5 rounded-full z-1 bg-primary/10", children: "PRO" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      CapabilityBadges,
                      {
                        capabilities: model.capabilities
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "size-5",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleTogglePin(model.id, false);
                        },
                        "aria-label": "Unpin model",
                        children: /* @__PURE__ */ jsx(PinOff, { className: "opacity-70 size-3" })
                      }
                    ) })
                  ]
                },
                `pinned-${model.id}`
              )) }),
              /* @__PURE__ */ jsx(CommandSeparator, {}),
              /* @__PURE__ */ jsx(CommandGroup, { heading: "Other Models", children: otherModels == null ? void 0 : otherModels.map((model) => /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  value: `${model.name}`,
                  onMouseEnter: () => setHoveredModel(model),
                  onSelect: () => handleSelectModel(model),
                  className: cn(
                    !access.checkCanUseModel(model) && "opacity-50"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 flex-1", children: [
                      model.icon && /* @__PURE__ */ jsx(
                        ModelIcon,
                        {
                          className: "fill-primary",
                          model: model.icon
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: model.name }),
                      model.access === "premium_required" && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-primary px-2 py-0.5 rounded-full z-1 bg-primary/10", children: "PRO" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      CapabilityBadges,
                      {
                        capabilities: model.capabilities
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "size-5",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleTogglePin(model.id, true);
                        },
                        "aria-label": "Pin model",
                        children: /* @__PURE__ */ jsx(Pin, { className: "opacity-70 size-3" })
                      }
                    ) })
                  ]
                },
                `other-${model.id}`
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsx(CommandSeparator, {}),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between p-2", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "w-full",
              onClick: () => setShowAll((prev) => !prev),
              children: showAll ? "Show pinned only" : "Show all models"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 translate-x-full pl-2 hidden md:block", children: hoveredModel && /* @__PURE__ */ jsxs("div", { className: "rounded-md flex flex-col gap-4 w-64 border border-foreground/10 overflow-hidden relative before:bg-sidebar/50 before:backdrop-blur-md before:absolute before:inset-0 before:z-[-1]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-2 pt-2", children: [
            /* @__PURE__ */ jsx(
              ModelIcon,
              {
                className: "size-4 fill-primary",
                model: hoveredModel.icon
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: hoveredModel.name })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-2", children: /* @__PURE__ */ jsx(CapabilityBadges, { capabilities: hoveredModel.capabilities }) }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground px-2", children: hoveredModel.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 text-sm text-muted-foreground px-2 border-t border-foreground/10 pt-4 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("div", { children: "Input" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: formatTokenPrice(hoveredModel.inputCost) }),
                "/M tokens"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("div", { children: "Output" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: formatTokenPrice(hoveredModel.outputCost) }),
                "/M tokens"
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AccountDialog, { open: accountDialogOpen, setOpen: setAccountDialogOpen }),
    /* @__PURE__ */ jsx(
      InsufficientCreditsProDialog,
      {
        open: insufficientCreditsProDialogOpen,
        setOpen: setInsufficientCreditsProDialogOpen
      }
    ),
    /* @__PURE__ */ jsx(
      InsufficientCreditsDialog,
      {
        open: insufficientCreditsDialogOpen,
        setOpen: setInsufficientCreditsDialogOpen
      }
    )
  ] });
}
function greetingForHour(hour) {
  if (hour < 5) return "Up late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
function MultiModalInput() {
  const id = useThreadSelector((state) => state.id);
  const status = useThreadSelector((state) => state.status);
  const input = useThreadSelector((state) => state.input);
  const attachments = useThreadSelector((state) => state.attachments);
  const pendingFileCount = useThreadSelector((state) => state.pendingFileCount);
  const setPendingFileCount = useThreadSelector((state) => state.setPendingFileCount);
  const setAttachments = useThreadSelector((state) => state.setAttachments);
  const setInput = useThreadSelector((state) => state.setInput);
  const setEditingMessageId = useThreadSelector((state) => state.setEditingMessageId);
  const editingMessageId = useThreadSelector((state) => state.editingMessageId);
  const setMessages = useThreadSelector((state) => state.setMessages);
  const setProDialogOpen = dialogStore((store) => store.proDialog.setOpen);
  const user = useUser();
  const { sendMessage } = useThreadContext();
  const { startUpload } = useUploadThing("fileUploader", {
    onBeforeUploadBegin: (file) => {
      setPendingFileCount((prev) => prev + 1);
      return file;
    },
    onClientUploadComplete: (files) => {
      setPendingFileCount((prev) => prev - files.length);
      const newAttachments = files.map((file) => ({
        type: "file",
        url: file.ufsUrl,
        filename: file.name,
        mediaType: file.type
      }));
      setAttachments([...attachments, ...newAttachments]);
    },
    onUploadError: (error) => {
      toast.error(error.message);
      setPendingFileCount((prev) => prev - 1);
    }
  });
  const fileInputRef = useRef(null);
  const threadId = useParamsThreadId();
  const navigate = useNavigate();
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    await startUpload(Array.from(files));
  };
  const handlePaperclipClick = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  const handleSubmit = async () => {
    if (!(input == null ? void 0 : input.trim())) return;
    await navigate({
      to: "/$threadId",
      params: {
        threadId: id
      },
      replace: Boolean(threadId)
    });
    if (editingMessageId) {
      setMessages(
        (prev) => prev.slice(
          0,
          prev.findIndex((message) => message.id === editingMessageId)
        )
      );
    }
    sendMessage({
      id: editingMessageId,
      role: "user",
      parts: [
        ...attachments,
        {
          type: "text",
          text: input
        }
      ]
    });
    setInput("");
    setAttachments([]);
    setEditingMessageId(void 0);
  };
  const {
    isPro,
    remainingBudget,
    usagePercent,
    canUseModel,
    cannotUseModelReason,
    canModelViewFiles
  } = useAccess();
  const matcher = useMemo(() => {
    return match({
      isPro,
      remainingBudget,
      usagePercent,
      status,
      attachments,
      input,
      pendingFileCount,
      canUseModel,
      canModelViewFiles
    });
  }, [
    isPro,
    remainingBudget,
    usagePercent,
    status,
    attachments,
    input,
    pendingFileCount,
    canUseModel,
    canModelViewFiles
  ]);
  return /* @__PURE__ */ jsxs(
    motion.form,
    {
      layout: "position",
      transition: { type: "spring", stiffness: 500, damping: 40 },
      className: cn(
        "absolute px-4 pt-4 flex flex-col gap-8 left-0 right-0",
        threadId ? "bottom-0" : "top-[22vh]"
      ),
      onSubmit: async (e) => {
        e.preventDefault();
        if (status === "streaming" || status === "submitted") {
          await fetch(`/api/thread/${id}/stop`, {
            method: "POST",
            credentials: "include"
          });
        } else {
          await handleSubmit();
        }
      },
      children: [
        !threadId && /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "max-w-3xl mx-auto w-full",
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-3", children: "Zeron" }),
              /* @__PURE__ */ jsxs("h2", { className: "font-serif text-4xl italic text-foreground", children: [
                greetingForHour((/* @__PURE__ */ new Date()).getHours()),
                ", ",
                getUsername(user),
                "."
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Ask anything \u2014 the transcript starts when you do." })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          PromptInput,
          {
            className: "max-w-3xl mx-auto p-0 w-full overflow-hidden rounded-2xl border border-foreground/15 bg-background/95 shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--color-foreground)_35%,transparent)] backdrop-blur-md focus-within:border-primary/40",
            value: input,
            onValueChange: setInput,
            onSubmit: handleSubmit,
            children: [
              match({ editingMessageId, usagePercent, isPro }).with(
                {
                  usagePercent: P.number.gte(100),
                  isPro: false,
                  editingMessageId: P.nullish
                },
                () => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(AlertTriangleIcon, { className: "size-3.5" }),
                    /* @__PURE__ */ jsx("p", { className: "font-mono uppercase tracking-wider text-[11px]", children: "Daily usage limit reached" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "link",
                      className: "h-6 underline font-normal cursor-pointer px-0 text-xs",
                      onClick: () => setProDialogOpen(true),
                      children: "Upgrade for higher limits"
                    }
                  )
                ] })
              ).with(
                {
                  usagePercent: P.number.gte(80),
                  isPro: false,
                  editingMessageId: P.nullish
                },
                () => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(AlertTriangleIcon, { className: "size-3.5" }),
                    /* @__PURE__ */ jsxs("p", { className: "font-mono uppercase tracking-wider text-[11px]", children: [
                      usagePercent,
                      "% of daily usage"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "link",
                      className: "h-6 underline font-normal cursor-pointer px-0 text-xs",
                      onClick: () => setProDialogOpen(true),
                      children: "Upgrade for higher limits"
                    }
                  )
                ] })
              ).with(
                {
                  usagePercent: P.number.gte(80),
                  isPro: true,
                  editingMessageId: P.nullish
                },
                () => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(AlertTriangleIcon, { className: "size-3.5" }),
                    /* @__PURE__ */ jsx("p", { className: "font-mono uppercase tracking-wider text-[11px]", children: usagePercent >= 100 ? "Daily usage limit reached" : `${usagePercent}% of daily usage` })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] uppercase tracking-wider text-primary", children: "Resets daily" })
                ] })
              ).with({ editingMessageId: P.string }, () => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-4 py-2.5 bg-sidebar/40 text-xs text-muted-foreground border-b border-foreground/10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(EditIcon, { className: "size-3.5" }),
                  /* @__PURE__ */ jsx("p", { className: "font-mono uppercase tracking-wider text-[11px]", children: "Editing message" })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-6",
                    onClick: () => {
                      setEditingMessageId(void 0);
                      setInput("");
                      setAttachments([]);
                    },
                    children: /* @__PURE__ */ jsx(XIcon, { className: "size-3.5" })
                  }
                )
              ] })).otherwise(() => null),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn("flex gap-2 px-4", {
                    "pt-4": attachments.length > 0 || pendingFileCount > 0
                  }),
                  children: [
                    attachments.map((attachment) => /* @__PURE__ */ jsx(
                      FileAttachment,
                      {
                        url: attachment.url,
                        name: attachment.filename,
                        mediaType: attachment.mediaType,
                        onRemove: () => {
                          setAttachments(attachments.filter((a) => a.url !== attachment.url));
                        }
                      },
                      attachment.url
                    )),
                    Array.from({ length: pendingFileCount }).map((_, index) => /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "h-24 w-24 bg-muted/50 rounded-2xl animate-pulse border relative",
                        children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-muted/50", children: /* @__PURE__ */ jsx(LoaderIcon, { className: "size-6 animate-spin" }) })
                      },
                      index
                    ))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(PromptInputTextarea, { className: "px-5 pt-4", placeholder: "Write to the model\u2026" }),
              /* @__PURE__ */ jsxs(PromptInputActions, { className: "flex items-center px-3 pb-3 pt-1", children: [
                /* @__PURE__ */ jsx(ModelSelector, {}),
                /* @__PURE__ */ jsx("div", { className: "flex-1" }),
                /* @__PURE__ */ jsx(
                  PromptInputAction,
                  {
                    tooltip: matcher.with({ canModelViewFiles: true }, () => "Attach files").with(
                      { canModelViewFiles: false },
                      () => "This model does not support file uploads"
                    ).otherwise(() => "Attach files"),
                    children: /* @__PURE__ */ jsxs(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        type: "button",
                        className: "h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground",
                        onClick: handlePaperclipClick,
                        disabled: matcher.with({ canModelViewFiles: false }, () => true).otherwise(() => false),
                        children: [
                          /* @__PURE__ */ jsx(Paperclip, { className: "size-4" }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              ref: fileInputRef,
                              type: "file",
                              accept: "image/*,application/pdf",
                              multiple: true,
                              className: "hidden",
                              onChange: (e) => handleFileUpload(e.target.files)
                            }
                          )
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  PromptInputAction,
                  {
                    tooltip: matcher.with(
                      {
                        input: P.string.maxLength(0),
                        remainingBudget: P.number.gt(0),
                        status: "ready",
                        canUseModel: true
                      },
                      () => "Message cannot be empty"
                    ).with(
                      {
                        remainingBudget: P.number.lte(0),
                        status: "ready"
                      },
                      () => "You have reached your daily usage limit."
                    ).with(
                      {
                        pendingFileCount: P.number.gt(0),
                        status: "ready"
                      },
                      () => "Waiting for files to upload"
                    ).with(
                      {
                        attachments: P.when((a) => a.length > 0),
                        canModelViewFiles: false,
                        status: "ready"
                      },
                      () => "This model does not support file uploads"
                    ).with({ canUseModel: false, status: "ready" }, () => cannotUseModelReason).with(
                      { status: P.union("streaming", "submitted") },
                      () => "Stop generation"
                    ).otherwise(() => "Send message"),
                    children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        type: "submit",
                        variant: "default",
                        size: "icon",
                        className: "h-9 w-9 rounded-xl",
                        disabled: matcher.with(
                          {
                            input: P.string.maxLength(0),
                            remainingBudget: P.number.gt(0),
                            status: "ready"
                          },
                          () => true
                        ).with(
                          {
                            remainingBudget: P.number.lte(0)
                          },
                          () => true
                        ).with(
                          {
                            pendingFileCount: P.number.gt(0)
                          },
                          () => true
                        ).with(
                          {
                            attachments: P.when((a) => a.length > 0),
                            canModelViewFiles: false,
                            status: "ready"
                          },
                          () => true
                        ).with({ canUseModel: false, status: "ready" }, () => true).with({ status: P.union("streaming", "submitted") }, () => false).otherwise(() => false),
                        children: status === "streaming" || status === "submitted" ? /* @__PURE__ */ jsx(SquareIcon, { className: "size-4 fill-current" }) : /* @__PURE__ */ jsx(ArrowUpIcon, { className: "size-4" })
                      }
                    )
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
const SANS = "Geist, sans-serif";
const MONO = "'Geist Mono', monospace";
const INK = {
  fg: "var(--color-foreground)",
  muted: "var(--color-muted-foreground)",
  accent: "var(--color-primary)",
  hairline: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
  wash: "color-mix(in oklab, var(--color-foreground) 5%, transparent)"
};
const CHAT_MD_THEME = {
  fontFamily: "Geist",
  monoFamily: "'Geist Mono', monospace",
  fontSize: 15,
  lineHeight: 26,
  color: INK.fg,
  blockGap: 14,
  heading: { color: INK.fg, weight: 600 },
  link: { color: INK.accent, underline: true },
  inlineCode: { background: INK.wash, color: INK.fg, sizeScale: 0.9 },
  code: {
    background: INK.wash,
    color: INK.fg,
    padding: 14,
    radius: 8,
    fontSize: 13,
    lineHeight: 21
  },
  blockquote: { borderColor: INK.hairline, color: INK.muted, padding: 12, gap: 8, borderWidth: 2 },
  list: { gap: 8, indent: 22, markerColor: INK.muted }
};
const Disclosure = definePrimitive("button", { name: "Disclosure" });
const buttonReset = {
  cursor: "pointer",
  textAlign: "left",
  background: "transparent",
  border: "none",
  font: "inherit",
  color: "inherit"
};
function TurnRow(turn) {
  if (turn.role === "user") {
    return /* @__PURE__ */ jsx(UserTurn, { turn });
  }
  return /* @__PURE__ */ jsx(AssistantTurn, { turn });
}
function UserTurn({ turn }) {
  return /* @__PURE__ */ jsxs(VStack, { gap: 8, padding: 16, children: [
    turn.files.length > 0 ? /* @__PURE__ */ jsx(HStack, { justify: "flex-end", children: /* @__PURE__ */ jsx(Escape, { height: 100, children: /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-end gap-2", children: turn.files.map((file, i) => /* @__PURE__ */ jsx(
      FileAttachment,
      {
        url: file.url,
        name: file.filename,
        mediaType: file.mediaType
      },
      i
    )) }) }) }) : null,
    /* @__PURE__ */ jsx(HStack, { justify: "flex-end", children: /* @__PURE__ */ jsx(
      VStack,
      {
        padding: 14,
        style: {
          background: "var(--color-foreground)",
          borderRadius: "18px 18px 4px 18px"
        },
        children: /* @__PURE__ */ jsx(
          Text,
          {
            shrink: true,
            whiteSpace: "pre-wrap",
            font: `15px ${SANS}`,
            lineHeight: 24,
            color: "var(--color-background)",
            children: turn.text
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(HStack, { justify: "flex-end", children: /* @__PURE__ */ jsx(Escape, { height: 28, width: 64, children: /* @__PURE__ */ jsx(UserActions, { turn }) }) })
  ] });
}
function AssistantTurn({ turn }) {
  var _a;
  const [openOverride, setOpenOverride] = useMugenState(null);
  return /* @__PURE__ */ jsxs(VStack, { gap: 14, padding: 16, children: [
    /* @__PURE__ */ jsxs(HStack, { gap: 8, align: "center", children: [
      /* @__PURE__ */ jsx(
        VStack,
        {
          width: 6,
          height: 6,
          style: { background: INK.accent, borderRadius: 3 }
        }
      ),
      /* @__PURE__ */ jsx(Text, { font: `600 10px ${MONO}`, lineHeight: 14, letterSpacing: 1.4, color: INK.muted, children: ((_a = turn.modelName) != null ? _a : "Assistant").toUpperCase() })
    ] }),
    turn.pending ? /* @__PURE__ */ jsx(
      Text,
      {
        font: `600 15px ${SANS}`,
        lineHeight: 26,
        color: INK.accent,
        className: "animate-pulse",
        children: "\u258D"
      }
    ) : null,
    turn.blocks.map((block, i) => {
      if (block.kind === "reasoning") {
        const open = openOverride != null ? openOverride : !block.done;
        const label = block.done ? `THOUGHT${block.seconds ? ` FOR ${block.seconds}S` : ""}` : "THINKING\u2026";
        return /* @__PURE__ */ jsxs(VStack, { gap: open ? 10 : 0, children: [
          /* @__PURE__ */ jsx(
            Disclosure,
            {
              padding: 2,
              onClick: () => setOpenOverride(!open),
              style: { ...buttonReset, borderRadius: 6 },
              children: /* @__PURE__ */ jsxs(HStack, { gap: 7, align: "center", children: [
                /* @__PURE__ */ jsx(Text, { font: `600 10px ${MONO}`, lineHeight: 14, color: INK.muted, children: open ? "\u25BE" : "\u25B8" }),
                /* @__PURE__ */ jsx(
                  Text,
                  {
                    font: `600 10px ${MONO}`,
                    lineHeight: 14,
                    letterSpacing: 1.4,
                    color: INK.muted,
                    children: label
                  }
                )
              ] })
            }
          ),
          open ? /* @__PURE__ */ jsxs(HStack, { gap: 13, align: "stretch", children: [
            /* @__PURE__ */ jsx(
              VStack,
              {
                width: 2,
                style: { background: INK.hairline, borderRadius: 2 }
              }
            ),
            /* @__PURE__ */ jsx(
              Text,
              {
                font: `14px ${SANS}`,
                lineHeight: 24,
                color: INK.muted,
                whiteSpace: "pre-wrap",
                children: block.text
              }
            )
          ] }) : null
        ] }, i);
      }
      if (block.kind === "error") {
        return /* @__PURE__ */ jsxs(HStack, { gap: 13, align: "stretch", children: [
          /* @__PURE__ */ jsx(
            VStack,
            {
              width: 2,
              style: { background: "var(--color-destructive)", borderRadius: 2 }
            }
          ),
          /* @__PURE__ */ jsx(
            Text,
            {
              font: `13px ${MONO}`,
              lineHeight: 20,
              color: "var(--color-destructive)",
              children: block.text
            }
          )
        ] }, i);
      }
      return /* @__PURE__ */ jsx(Markdown, { source: block.text, theme: CHAT_MD_THEME }, i);
    }),
    turn.streaming && !turn.pending ? /* @__PURE__ */ jsx(
      Text,
      {
        font: `600 15px ${SANS}`,
        lineHeight: 26,
        color: INK.accent,
        className: "animate-pulse",
        children: "\u258D"
      }
    ) : null,
    !turn.streaming ? /* @__PURE__ */ jsx(Escape, { height: 28, children: /* @__PURE__ */ jsx(AssistantActions, { turn }) }) : null
  ] });
}
function UserActions({ turn }) {
  const setEditingMessageId = useThreadSelector((state) => state.setEditingMessageId);
  const setInput = useThreadSelector((state) => state.setInput);
  const setAttachments = useThreadSelector((state) => state.setAttachments);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full items-center justify-end gap-0.5 opacity-40 transition-opacity hover:opacity-100", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "size-7",
        "aria-label": "Copy message",
        onClick: async () => {
          await navigator.clipboard.writeText(turn.text);
          toast.success("Copied to clipboard");
        },
        children: /* @__PURE__ */ jsx(CopyIcon, { className: "size-3" })
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "size-7",
        "aria-label": "Edit message",
        onClick: () => {
          setEditingMessageId(turn.messageId);
          setInput(turn.text);
          setAttachments(
            turn.files.map((file) => ({
              type: "file",
              url: file.url,
              filename: file.filename || "untitled",
              mediaType: file.mediaType
            }))
          );
        },
        children: /* @__PURE__ */ jsx(EditIcon, { className: "size-3" })
      }
    )
  ] });
}
function AssistantActions({ turn }) {
  const thread = useThreadContext();
  const busy = useThreadSelector(
    (state) => state.status === "streaming" || state.status === "submitted"
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full items-center gap-0.5 opacity-40 transition-opacity hover:opacity-100", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "size-7",
        "aria-label": "Copy response",
        onClick: async () => {
          await navigator.clipboard.writeText(turn.text);
          toast.success("Copied to clipboard");
        },
        children: /* @__PURE__ */ jsx(CopyIcon, { className: "size-3" })
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "size-7",
        "aria-label": "Regenerate response",
        disabled: busy,
        onClick: () => {
          thread.regenerate({ messageId: turn.messageId });
        },
        children: /* @__PURE__ */ jsx(RefreshCcwIcon, { className: "size-3" })
      }
    ),
    turn.modelIcon ? /* @__PURE__ */ jsx("span", { className: "ml-1 flex items-center gap-1.5 text-muted-foreground", children: /* @__PURE__ */ jsx(ModelIcon, { className: "size-3 fill-current", model: turn.modelIcon }) }) : null
  ] });
}
function buildTurns(messages, status) {
  var _a, _b, _c, _d, _e;
  const busy = status === "streaming" || status === "submitted";
  const turns = [];
  for (let m = 0; m < messages.length; m++) {
    const message = messages[m];
    const isLast = m === messages.length - 1;
    const role = message.role === "assistant" ? "assistant" : "user";
    const parts = message.parts;
    const blocks = [];
    const files = [];
    const textPieces = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.type === "text") {
        if (part.text) {
          blocks.push({ kind: "markdown", text: part.text });
          textPieces.push(part.text);
        }
        continue;
      }
      if (part.type === "file") {
        files.push({
          url: part.url,
          filename: part.filename,
          mediaType: part.mediaType
        });
        continue;
      }
      if (part.type === "data-error") {
        blocks.push({ kind: "error", text: String(part.data) });
        continue;
      }
      if (part.type === "reasoning") {
        const done = part.state === "done";
        const seconds = reasoningSeconds(parts, i);
        const previous = blocks.at(-1);
        if ((previous == null ? void 0 : previous.kind) === "reasoning") {
          previous.text = `${previous.text}

${part.text}`;
          previous.done = done;
          if (seconds !== null) {
            previous.seconds = ((_a = previous.seconds) != null ? _a : 0) + seconds;
          }
        } else if (part.text) {
          blocks.push({ kind: "reasoning", text: part.text, done, seconds });
        }
        continue;
      }
    }
    const streaming = isLast && role === "assistant" && busy;
    turns.push({
      id: message.id,
      messageId: message.id,
      role,
      blocks,
      files,
      text: textPieces.join("\n"),
      modelName: (_c = (_b = message.metadata) == null ? void 0 : _b.model) == null ? void 0 : _c.name,
      modelIcon: (_e = (_d = message.metadata) == null ? void 0 : _d.model) == null ? void 0 : _e.icon,
      streaming,
      pending: role === "assistant" && blocks.length === 0 && streaming
    });
  }
  const last = messages.at(-1);
  if (busy && last && last.role === "user") {
    turns.push({
      id: `pending-${last.id}`,
      messageId: last.id,
      role: "assistant",
      blocks: [],
      files: [],
      text: "",
      streaming: true,
      pending: true
    });
  }
  return turns;
}
function reasoningSeconds(parts, i) {
  let start = null;
  for (let j = i - 1; j >= 0; j--) {
    const part = parts[j];
    if ((part == null ? void 0 : part.type) === "data-reasoning-time" && part.data.type === "start") {
      start = part.data.timestamp;
      break;
    }
  }
  if (start === null) return null;
  for (let j = i + 1; j < parts.length; j++) {
    const part = parts[j];
    if ((part == null ? void 0 : part.type) === "data-reasoning-time" && part.data.type === "end") {
      return Math.max(0, Math.ceil((part.data.timestamp - start) / 1e3));
    }
  }
  return null;
}
function useAutoResume() {
  const { resumeStream, store } = useThreadContext();
  const id = useThreadSelector((state) => state.id);
  const status = useThreadSelector((state) => state.status);
  const db = useDatabase();
  const [thread] = useQuery(
    db.query.thread.where("id", "=", id != null ? id : "").related("messages", (q) => q.orderBy("createdAt", "asc")).one()
  );
  useEffect(() => {
    var _a;
    if ((thread == null ? void 0 : thread.streamId) && // Remote status is streaming or submitted
    ((thread == null ? void 0 : thread.status) === "streaming" || (thread == null ? void 0 : thread.status) === "submitted") && // Local status is ready
    status === "ready") {
      store.getState().setMessages((_a = thread.messages.map((m) => m.message)) != null ? _a : []);
      resumeStream();
    }
  }, [thread == null ? void 0 : thread.streamId, thread == null ? void 0 : thread.status]);
}
function MessageList() {
  const messages = useThreadSelector((state) => state.messages);
  const status = useThreadSelector((state) => state.status);
  useAutoResume();
  const items = useMemo(() => buildTurns(messages, status), [messages, status]);
  const list = useMugenVirtualizer({ items });
  return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
    /* @__PURE__ */ jsx(
      MugenVList,
      {
        instance: list,
        getKey: (turn) => turn.id,
        render: TurnRow,
        font: "15px Geist, sans-serif",
        lineHeight: 26,
        maxW: 768,
        overscan: 320,
        initialScroll: "bottom",
        stickToBottom: true,
        renderTop: () => /* @__PURE__ */ jsx(VStack, { height: 72 }),
        renderBottom: () => /* @__PURE__ */ jsx(VStack, { height: 176 }),
        className: "h-full"
      }
    ),
    /* @__PURE__ */ jsx(ScrollToBottom, { list }),
    /* @__PURE__ */ jsx(MultiModalInput, {})
  ] });
}
function ScrollToBottom({ list }) {
  const awayFromBottom = useMugenSelector(list, (state) => state.distanceFromBottom > 200);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "data-hidden": !awayFromBottom,
      onClick: () => list.scrollToBottom({ behavior: "smooth" }),
      className: "absolute bottom-44 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-foreground/15 bg-background/90 py-1.5 pl-2.5 pr-3.5 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:text-foreground data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-2 data-[hidden=true]:opacity-0",
      children: [
        /* @__PURE__ */ jsx(ArrowDownIcon, { className: "size-3" }),
        "Latest"
      ]
    }
  );
}
function FileDropArea({
  onUpload,
  children,
  overlayText = "Drop files here",
  className
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { canModelViewFiles } = useAccess();
  const onDrop = async (accepted) => {
    setIsDragActive(false);
    const dataTransfer = new DataTransfer();
    accepted.forEach((file) => dataTransfer.items.add(file));
    await onUpload(dataTransfer.files);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/plain": []
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    noClick: true,
    noKeyboard: true,
    disabled: !canModelViewFiles
  });
  return /* @__PURE__ */ jsxs("div", { ...getRootProps(), className: cn("relative flex flex-col flex-1", className), children: [
    /* @__PURE__ */ jsx("input", { ...getInputProps() }),
    children,
    isDragActive && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex size-full items-center justify-center border-none bg-background/50 p-0 backdrop-blur transition-opacity duration-200 ease-out z-10 rounded-3xl", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: overlayText }) })
  ] });
}
function ThreadContainer({ children }) {
  const attachments = useThreadSelector((state) => state.attachments);
  const setPendingFileCount = useThreadSelector((state) => state.setPendingFileCount);
  const setAttachments = useThreadSelector((state) => state.setAttachments);
  const { startUpload } = useUploadThing("fileUploader", {
    onBeforeUploadBegin: (file) => {
      setPendingFileCount((prev) => prev + 1);
      return file;
    },
    onClientUploadComplete: (files) => {
      setPendingFileCount((prev) => prev - files.length);
      const newAttachments = files.map((file) => ({
        type: "file",
        url: file.ufsUrl,
        filename: file.name,
        mediaType: file.type
      }));
      setAttachments([...attachments, ...newAttachments]);
    },
    onUploadError: (error) => {
      toast.error(error.message);
      setPendingFileCount((prev) => prev - 1);
    }
  });
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    await startUpload(Array.from(files));
  };
  return /* @__PURE__ */ jsx(FileDropArea, { onUpload: handleFileUpload, children });
}
const SplitComponent = function RouteComponent() {
  const db = useDatabase();
  const threadId = useParamsThreadId();
  const thread = useThreadFromParams();
  const messages = useMemo(() => {
    return thread == null ? void 0 : thread.messages.map((message) => message.message);
  }, [thread]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Title, { title: thread == null ? void 0 : thread.title }),
    /* @__PURE__ */ jsx(ThreadProvider, { id: threadId, messages, transport: new DefaultChatTransport({
      api: "/api/thread",
      prepareSendMessagesRequest: async ({
        id,
        messages: messages2,
        body
      }) => {
        var _a;
        const settings = db.query.setting.where("userId", "=", db.userID).one().materialize();
        return {
          body: {
            id,
            message: messages2.at(-1),
            modelId: (_a = settings.data) == null ? void 0 : _a.modelId,
            ...body
          }
        };
      }
    }), children: /* @__PURE__ */ jsxs(ThreadContainer, { children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(MessageList, {})
    ] }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_app._thread-DUiXLWnn.mjs.map
