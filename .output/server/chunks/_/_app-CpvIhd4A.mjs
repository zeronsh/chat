import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { B as Button, Z as ZeronIcon, u as useThreads, a as useDatabase, D as Dialog, b as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter, c as cn } from './ssr.mjs';
import { S as SidebarProvider, a as Sidebar, b as SidebarContent, c as SidebarHeader, d as SidebarGroup, e as SidebarGroupContent, f as SidebarMenu, g as SidebarMenuItem, h as SidebarMenuButton, i as SidebarGroupLabel } from './sidebar-BMkfUrts.mjs';
import { T as Tooltip, a as TooltipTrigger, b as TooltipPositioner, c as TooltipContent } from './tooltip-D6Wn3Zfb.mjs';
import { Outlet, Link, useNavigate, useParams } from '@tanstack/react-router';
import { PlusIcon, Loader2Icon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import z$2 from 'zod';
import * as LabelPrimitive from '@radix-ui/react-label';
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
import '@base-ui-components/react/tooltip';

function useThreadsByTimeRange(threads) {
  const MS_PER_DAY = 24 * 60 * 60 * 1e3;
  const DAYS_30 = 30;
  const now = Date.now();
  const timeBoundaries = {
    oneDayAgo: now - MS_PER_DAY,
    twoDaysAgo: now - 2 * MS_PER_DAY,
    thirtyDaysAgo: now - DAYS_30 * MS_PER_DAY
  };
  const filterThreadsByTimeRange = (startTime, endTime) => threads.filter((chat) => {
    var _a;
    const chatTime = (_a = chat.updatedAt) != null ? _a : 0;
    return endTime ? chatTime >= startTime && chatTime < endTime : chatTime >= startTime;
  });
  const groups = {
    today: filterThreadsByTimeRange(timeBoundaries.oneDayAgo),
    yesterday: filterThreadsByTimeRange(timeBoundaries.twoDaysAgo, timeBoundaries.oneDayAgo),
    lastThirtyDays: filterThreadsByTimeRange(
      timeBoundaries.thirtyDaysAgo,
      timeBoundaries.twoDaysAgo
    ),
    history: filterThreadsByTimeRange(0, timeBoundaries.thirtyDaysAgo)
  };
  return groups;
}
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm text-muted-foreground leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function AppSidebar() {
  const [threadToEdit, setThreadToEdit] = useState(null);
  const [threadToDelete, setThreadToDelete] = useState(null);
  return /* @__PURE__ */ jsxs(Sidebar, { children: [
    /* @__PURE__ */ jsx(AppSidebarHeader, {}),
    /* @__PURE__ */ jsxs(SidebarContent, { children: [
      /* @__PURE__ */ jsx(AppSidebarActions, {}),
      /* @__PURE__ */ jsx(
        AppSidebarThreads,
        {
          setThreadToEdit,
          setThreadToDelete
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AppSidebarKeyboardShortcuts, {}),
    /* @__PURE__ */ jsx(EditThreadTitleDialog, { thread: threadToEdit, setThreadToEdit }),
    /* @__PURE__ */ jsx(DeleteThreadDialog, { thread: threadToDelete, setThreadToDelete })
  ] });
}
function AppSidebarHeader() {
  return /* @__PURE__ */ jsx(SidebarHeader, { className: "p-3", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(ZeronIcon, { className: "size-6" }) }) }) });
}
function AppSidebarActions() {
  return /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/", children: [
    /* @__PURE__ */ jsx(PlusIcon, {}),
    /* @__PURE__ */ jsx("span", { className: "flex-1", children: "New Thread" })
  ] }) }) }) }) }) });
}
function AppSidebarKeyboardShortcuts() {
  const navigate = useNavigate();
  const params = useParams({ from: "/_app/_thread/$threadId", shouldThrow: false });
  const threads = useThreads();
  const onHandleKeyDown = useCallback(
    (e) => {
      const isMeta = navigator.platform.toLowerCase().includes("mac") ? e.metaKey : e.ctrlKey;
      if (e.shiftKey && isMeta && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        e.stopPropagation();
        navigate({ to: "/" });
        return;
      }
      if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();
        if (threads.length === 0) return;
        const currentThreadId = params == null ? void 0 : params.threadId;
        const currentIndex = threads.findIndex((thread) => thread.id === currentThreadId);
        let nextIndex;
        if (e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? threads.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex >= threads.length - 1 ? 0 : currentIndex + 1;
        }
        const nextThread = threads[nextIndex];
        if (nextThread) {
          navigate({
            to: "/$threadId",
            params: { threadId: nextThread.id }
          });
        }
      }
    },
    [threads, params == null ? void 0 : params.threadId, navigate]
  );
  useEffect(() => {
    const activeEl = document.querySelector(
      '[data-thread-active="true"]'
    );
    if (!activeEl) return;
    const getScrollParent = (el) => {
      var _a;
      let parent = el == null ? void 0 : el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
        const overflowY = style.overflowY;
        if (hasScrollableContent && (overflowY === "auto" || overflowY === "scroll")) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return (_a = document.scrollingElement) != null ? _a : null;
    };
    const container = getScrollParent(activeEl);
    if (!container) return;
    const isFullyVisible = () => {
      const elRect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom;
    };
    if (!isFullyVisible()) {
      activeEl.scrollIntoView({ block: "start", inline: "nearest", behavior: "instant" });
    }
  }, [params == null ? void 0 : params.threadId, threads]);
  useEffect(() => {
    document.addEventListener("keydown", onHandleKeyDown);
    return () => document.removeEventListener("keydown", onHandleKeyDown);
  }, [onHandleKeyDown]);
  return null;
}
function AppSidebarThreads({
  setThreadToEdit,
  setThreadToDelete
}) {
  const threads = useThreads();
  const groups = useThreadsByTimeRange(threads);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ThreadGroup,
      {
        threads: groups.today,
        label: "Today",
        setThreadToEdit,
        setThreadToDelete
      }
    ),
    /* @__PURE__ */ jsx(
      ThreadGroup,
      {
        threads: groups.yesterday,
        label: "Yesterday",
        setThreadToEdit,
        setThreadToDelete
      }
    ),
    /* @__PURE__ */ jsx(
      ThreadGroup,
      {
        threads: groups.lastThirtyDays,
        label: "Last 30 Days",
        setThreadToEdit,
        setThreadToDelete
      }
    ),
    /* @__PURE__ */ jsx(
      ThreadGroup,
      {
        threads: groups.history,
        label: "History",
        setThreadToEdit,
        setThreadToDelete
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/50 p-4", children: "You've reached the end of your threads." })
  ] });
}
function ThreadGroup({
  threads,
  label,
  setThreadToEdit,
  setThreadToDelete
}) {
  if (threads.length === 0) return null;
  return /* @__PURE__ */ jsxs(SidebarGroup, { children: [
    /* @__PURE__ */ jsx(SidebarGroupLabel, { children: label }),
    /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: threads.map((thread) => /* @__PURE__ */ jsx(
      ThreadItem,
      {
        thread,
        setThreadToEdit,
        setThreadToDelete
      },
      thread.id
    )) }) })
  ] });
}
function ThreadItem({
  thread,
  setThreadToEdit,
  setThreadToDelete
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: "group/thread-item relative", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/$threadId",
        className: "w-full flex absolute inset-0 items-center px-2 rounded-md gap-2",
        params: { threadId: thread.id },
        activeOptions: { exact: true },
        activeProps: { className: "bg-muted", "data-thread-active": "true" },
        onMouseDown: (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.button === 0) {
            navigate({
              to: "/$threadId",
              params: { threadId: thread.id }
            });
          }
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate flex-1", children: thread.title }),
          (thread.status === "streaming" || thread.status === "submitted") && /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin text-muted-foreground" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bottom-0 pointer-events-none flex justify-end gap-2 px-4 items-center group-hover/thread-item:opacity-100 opacity-0 transition-all duration-100 bg-gradient-to-l from-sidebar to-transparent w-full rounded-r-md" }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-0 right-0 bottom-0 flex justify-end gap-2 px-2 items-center group-hover/thread-item:opacity-100 group-hover/thread-item:translate-x-0 translate-x-full opacity-0 transition-all duration-100 rounded-r-lg pointer-events-none group-hover/thread-item:pointer-events-auto", children: [
      /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(
          TooltipTrigger,
          {
            render: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "size-6 hover:text-primary hover:bg-transparent",
                onClick: () => setThreadToEdit(thread),
                children: /* @__PURE__ */ jsx(PencilIcon, { className: "size-4" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(TooltipPositioner, { className: "pointer-events-none", children: /* @__PURE__ */ jsx(TooltipContent, { children: "Edit Thread Title" }) })
      ] }),
      /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(
          TooltipTrigger,
          {
            render: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "size-6 hover:text-primary",
                onClick: () => setThreadToDelete(thread),
                children: /* @__PURE__ */ jsx(TrashIcon, { className: "size-4" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(TooltipPositioner, { className: "pointer-events-none", children: /* @__PURE__ */ jsx(TooltipContent, { children: "Delete Thread" }) })
      ] })
    ] })
  ] }) }) });
}
const editThreadTitleSchema = z$2.object({
  title: z$2.string().min(1).max(200)
});
function EditThreadTitleDialog({
  thread,
  setThreadToEdit
}) {
  var _a;
  const db = useDatabase();
  const form = useForm({
    defaultValues: {
      title: (_a = thread == null ? void 0 : thread.title) != null ? _a : ""
    },
    validators: {
      onMount: editThreadTitleSchema,
      onChange: editThreadTitleSchema,
      onSubmit: editThreadTitleSchema
    },
    onSubmit: async ({ value }) => {
      if (!thread) return;
      await db.mutate.thread.update({
        id: thread.id,
        title: value.title
      });
      setThreadToEdit(null);
    }
  });
  return /* @__PURE__ */ jsx(Dialog, { open: !!thread, onOpenChange: () => setThreadToEdit(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 overflow-hidden gap-0", showCloseButton: false, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 bg-sidebar border-b border-foreground/10", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Thread Title" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Edit the title of the thread." })
    ] }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: async (e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 px-6 py-4 bg-background", children: /* @__PURE__ */ jsx("div", { className: "grid gap-2", children: /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "title",
              validators: {
                onChange: ({ value }) => {
                  if (value.length === 0) return "Title is required";
                  if (value.length > 100)
                    return "Title must be less than 100 characters";
                }
              },
              children: (field) => /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    value: field.state.value,
                    onChange: (e) => field.handleChange(e.target.value)
                  }
                ),
                field.state.meta.errors ? /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors.join(", ") }) : null
              ] })
            }
          ) }) }),
          /* @__PURE__ */ jsxs(DialogFooter, { className: "px-6 py-4 border-t border-foreground/10 bg-sidebar", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setThreadToEdit(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              form.Subscribe,
              {
                selector: (state) => [state.canSubmit, state.isSubmitting],
                children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "submit",
                    disabled: !canSubmit || isSubmitting,
                    onClick: () => form.handleSubmit(),
                    children: [
                      isSubmitting && /* @__PURE__ */ jsx(Loader2Icon, { className: "w-4 h-4 animate-spin" }),
                      /* @__PURE__ */ jsx("span", { children: "Save" })
                    ]
                  }
                )
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
function DeleteThreadDialog({
  thread,
  setThreadToDelete
}) {
  const db = useDatabase();
  const params = useParams({ from: "/_app/_thread/$threadId", shouldThrow: false });
  const navigate = useNavigate();
  async function handleDelete() {
    if (!thread) return;
    await db.mutate.thread.delete({ id: thread.id });
    if ((params == null ? void 0 : params.threadId) === thread.id) {
      navigate({ to: "/" });
    }
    setThreadToDelete(null);
  }
  return /* @__PURE__ */ jsx(Dialog, { open: !!thread, onOpenChange: () => setThreadToDelete(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 overflow-hidden gap-0", showCloseButton: false, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 bg-background", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Delete Thread" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Are you sure you want to delete this thread? This action cannot be undone." })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "px-6 py-4 border-t border-foreground/10 bg-sidebar", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setThreadToDelete(null), children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "destructive", onClick: handleDelete, children: "Delete" })
    ] })
  ] }) });
}
const SplitComponent = function RouteComponent() {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=_app-CpvIhd4A.mjs.map
