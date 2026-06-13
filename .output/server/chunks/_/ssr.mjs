import { createFileRoute, createRootRoute, useLocation, Link, useNavigate, lazyRouteComponent, useParams, HeadContent, Scripts, Outlet, RouterProvider, createRouter as createRouter$1 } from '@tanstack/react-router';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createEnv } from '@t3-oss/env-core';
import z$2, { z as z$1 } from 'zod';
import { magicLinkClient, anonymousClient, organizationClient, emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ZeroProvider, useQuery } from '@rocicorp/zero/react';
import { useMemo, useEffect, createContext, useState, useContext, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet, nanoid as nanoid$1 } from 'nanoid';
import { useTheme } from 'next-themes';
import { Toaster as Toaster$1 } from 'sonner';
import { eq, relations, sql, and, gt, not } from 'drizzle-orm';
import { pgTable, pgEnum, jsonb, text as text$1, index, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Layer, Effect, Brand, Data, Clock, Runtime, Deferred, Schedule, Duration } from 'effect';
import { Html, Head, Body, Preview, Container, Heading, Link as Link$1, Text } from '@react-email/components';
import { Resend } from 'resend';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization as organization$1, jwt, magicLink, emailOTP, anonymous } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { MoveRightIcon, CheckIcon, DiamondIcon, XIcon as XIcon$1 } from 'lucide-react';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { zodValidator } from '@tanstack/zod-adapter';
import { createRouteHandler, createUploadthing } from 'uploadthing/server';
import { tool, generateText, stepCountIs, NoSuchToolError, generateObject, createUIMessageStream, streamText, JsonToSseTransformStream, wrapLanguageModel, extractReasoningMiddleware, smoothStream, convertToModelMessages } from 'ai';
import { Exa } from 'exa-js';
import { createResumableStreamContext } from 'resumable-stream';
import { match } from 'ts-pattern';
import { waitUntil } from '@vercel/functions';
import { RedisConnectionOptionsLive, RedisPubSubLive, RedisPubSub } from 'effect-redis';
import { gateway } from '@ai-sdk/gateway';
import Stripe from 'stripe';
import { defineHandlerCallback, renderRouterToStream } from '@tanstack/react-router/ssr/server';

function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
const defaultStreamHandler = defineHandlerCallback(
  ({ request, router: router2, responseHeaders }) => renderRouterToStream({
    request,
    router: router2,
    responseHeaders,
    children: /* @__PURE__ */ jsx(StartServer, { router: router2 })
  })
);
const stateIndexKey = "__TSR_index";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    var _a, _b;
    const ignoreBlocker = (navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          (_b = opts.onBlocked) == null ? void 0 : _b.call(opts);
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index2, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index2);
          handleIndexChange({ type: "GO", index: index2 });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      var _a;
      if (!opts.setBlockers) return () => {
      };
      const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        var _a2, _b;
        const blockers2 = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
        (_b = opts.setBlockers) == null ? void 0 : _b.call(opts, blockers2.filter((b) => b !== blocker));
      };
    },
    flush: () => {
      var _a;
      return (_a = opts.flush) == null ? void 0 : _a.call(opts);
    },
    destroy: () => {
      var _a;
      return (_a = opts.destroy) == null ? void 0 : _a.call(opts);
    },
    notify
  };
}
function assignKeyAndIndex(index2, state) {
  if (!state) {
    state = {};
  }
  const key = createRandomKey();
  return {
    ...state,
    key,
    // TODO: Remove in v2 - use __TSR_key instead
    __TSR_key: key,
    [stateIndexKey]: index2
  };
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index2 = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index22) => assignKeyAndIndex(index22, void 0)
  );
  const getLocation = () => parseHref(entries[index2], states[index2]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index2 < entries.length - 1) {
        entries.splice(index2 + 1);
        states.splice(index2 + 1);
      }
      states.push(state);
      entries.push(path);
      index2 = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index2] = state;
      entries[index2] = path;
    },
    back: () => {
      index2 = Math.max(index2 - 1, 0);
    },
    forward: () => {
      index2 = Math.min(index2 + 1, entries.length - 1);
    },
    go: (n) => {
      index2 = Math.min(Math.max(index2 + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const addedKey = createRandomKey();
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: addedKey, __TSR_key: addedKey }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function splitSetCookieString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitSetCookieString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
function json(payload, init) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: mergeHeaders(
      { "content-type": "application/json" },
      init == null ? void 0 : init.headers
    )
  });
}
var prefix = "Invariant failed";
function invariant(condition, message2) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
const SEGMENT_TYPE_PATHNAME = 0;
const SEGMENT_TYPE_PARAM = 1;
const SEGMENT_TYPE_WILDCARD = 2;
const SEGMENT_TYPE_OPTIONAL_PARAM = 3;
function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== void 0;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
const parsePathname = (pathname, cache) => {
  if (!pathname) return [];
  const cached = cache == null ? void 0 : cache.get(pathname);
  if (cached) return cached;
  const parsed = baseParsePathname(pathname);
  cache == null ? void 0 : cache.set(pathname, parsed);
  return parsed;
};
const PARAM_RE = /^\$.{1,}$/;
const PARAM_W_CURLY_BRACES_RE = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const OPTIONAL_PARAM_W_CURLY_BRACES_RE = /^(.*?)\{-(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const WILDCARD_RE = /^\$$/;
const WILDCARD_W_CURLY_BRACES_RE = /^(.*?)\{\$\}(.*)$/;
function baseParsePathname(pathname) {
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: SEGMENT_TYPE_PATHNAME,
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(
    ...split.map((part) => {
      const wildcardBracesMatch = part.match(WILDCARD_W_CURLY_BRACES_RE);
      if (wildcardBracesMatch) {
        const prefix2 = wildcardBracesMatch[1];
        const suffix = wildcardBracesMatch[2];
        return {
          type: SEGMENT_TYPE_WILDCARD,
          value: "$",
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      const optionalParamBracesMatch = part.match(
        OPTIONAL_PARAM_W_CURLY_BRACES_RE
      );
      if (optionalParamBracesMatch) {
        const prefix2 = optionalParamBracesMatch[1];
        const paramName = optionalParamBracesMatch[2];
        const suffix = optionalParamBracesMatch[3];
        return {
          type: SEGMENT_TYPE_OPTIONAL_PARAM,
          value: paramName,
          // Now just $paramName (no prefix)
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      const paramBracesMatch = part.match(PARAM_W_CURLY_BRACES_RE);
      if (paramBracesMatch) {
        const prefix2 = paramBracesMatch[1];
        const paramName = paramBracesMatch[2];
        const suffix = paramBracesMatch[3];
        return {
          type: SEGMENT_TYPE_PARAM,
          value: "" + paramName,
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      if (PARAM_RE.test(part)) {
        const paramName = part.substring(1);
        return {
          type: SEGMENT_TYPE_PARAM,
          value: "$" + paramName,
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      if (WILDCARD_RE.test(part)) {
        return {
          type: SEGMENT_TYPE_WILDCARD,
          value: "$",
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      return {
        type: SEGMENT_TYPE_PATHNAME,
        value: part.includes("%25") ? part.split("%25").map((segment) => decodeURI(segment)).join("%25") : decodeURI(part)
      };
    })
  );
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: SEGMENT_TYPE_PATHNAME,
      value: "/"
    });
  }
  return segments;
}
function matchPathname(basepath, currentPathname, matchLocation, parseCache) {
  const pathParams = matchByPath(
    basepath,
    currentPathname,
    matchLocation,
    parseCache
  );
  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function removeBasepath(basepath, pathname, caseSensitive = false) {
  const normalizedBasepath = caseSensitive ? basepath : basepath.toLowerCase();
  const normalizedPathname = caseSensitive ? pathname : pathname.toLowerCase();
  switch (true) {
    // default behaviour is to serve app from the root - pathname
    // left untouched
    case normalizedBasepath === "/":
      return pathname;
    // shortcut for removing the basepath if it matches the pathname
    case normalizedPathname === normalizedBasepath:
      return "";
    // in case pathname is shorter than basepath - there is
    // nothing to remove
    case pathname.length < basepath.length:
      return pathname;
    // avoid matching partial segments - strict equality handled
    // earlier, otherwise, basepath separated from pathname with
    // separator, therefore lack of separator means partial
    // segment match (`/app` should not match `/application`)
    case normalizedPathname[normalizedBasepath.length] !== "/":
      return pathname;
    // remove the basepath from the pathname if it starts with it
    case normalizedPathname.startsWith(normalizedBasepath):
      return pathname.slice(basepath.length);
    // otherwise, return the pathname as is
    default:
      return pathname;
  }
}
function matchByPath(basepath, from, {
  to,
  fuzzy,
  caseSensitive
}, parseCache) {
  if (basepath !== "/" && !from.startsWith(basepath)) {
    return void 0;
  }
  from = removeBasepath(basepath, from, caseSensitive);
  to = removeBasepath(basepath, `${to ?? "$"}`, caseSensitive);
  const baseSegments = parsePathname(
    from.startsWith("/") ? from : `/${from}`,
    parseCache
  );
  const routeSegments = parsePathname(
    to.startsWith("/") ? to : `/${to}`,
    parseCache
  );
  const params = {};
  const result = isMatch(
    baseSegments,
    routeSegments,
    params,
    fuzzy,
    caseSensitive
  );
  return result ? params : void 0;
}
function isMatch(baseSegments, routeSegments, params, fuzzy, caseSensitive) {
  var _a, _b, _c;
  let baseIndex = 0;
  let routeIndex = 0;
  while (baseIndex < baseSegments.length || routeIndex < routeSegments.length) {
    const baseSegment = baseSegments[baseIndex];
    const routeSegment = routeSegments[routeIndex];
    if (routeSegment) {
      if (routeSegment.type === SEGMENT_TYPE_WILDCARD) {
        const remainingBaseSegments = baseSegments.slice(baseIndex);
        let _splat;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          if (!baseSegment) return false;
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if ("prefixSegment" in routeSegment) {
            if (!baseValue.startsWith(prefix2)) {
              return false;
            }
          }
          if ("suffixSegment" in routeSegment) {
            if (!((_a = baseSegments[baseSegments.length - 1]) == null ? void 0 : _a.value.endsWith(suffix))) {
              return false;
            }
          }
          let rejoinedSplat = decodeURI(
            joinPaths(remainingBaseSegments.map((d2) => d2.value))
          );
          if (prefix2 && rejoinedSplat.startsWith(prefix2)) {
            rejoinedSplat = rejoinedSplat.slice(prefix2.length);
          }
          if (suffix && rejoinedSplat.endsWith(suffix)) {
            rejoinedSplat = rejoinedSplat.slice(
              0,
              rejoinedSplat.length - suffix.length
            );
          }
          _splat = rejoinedSplat;
        } else {
          _splat = decodeURI(
            joinPaths(remainingBaseSegments.map((d2) => d2.value))
          );
        }
        params["*"] = _splat;
        params["_splat"] = _splat;
        return true;
      }
      if (routeSegment.type === SEGMENT_TYPE_PATHNAME) {
        if (routeSegment.value === "/" && !(baseSegment == null ? void 0 : baseSegment.value)) {
          routeIndex++;
          continue;
        }
        if (baseSegment) {
          if (caseSensitive) {
            if (routeSegment.value !== baseSegment.value) {
              return false;
            }
          } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
            return false;
          }
          baseIndex++;
          routeIndex++;
          continue;
        } else {
          return false;
        }
      }
      if (routeSegment.type === SEGMENT_TYPE_PARAM) {
        if (!baseSegment) {
          return false;
        }
        if (baseSegment.value === "/") {
          return false;
        }
        let _paramValue = "";
        let matched = false;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if (prefix2 && !baseValue.startsWith(prefix2)) {
            return false;
          }
          if (suffix && !baseValue.endsWith(suffix)) {
            return false;
          }
          let paramValue = baseValue;
          if (prefix2 && paramValue.startsWith(prefix2)) {
            paramValue = paramValue.slice(prefix2.length);
          }
          if (suffix && paramValue.endsWith(suffix)) {
            paramValue = paramValue.slice(0, paramValue.length - suffix.length);
          }
          _paramValue = decodeURIComponent(paramValue);
          matched = true;
        } else {
          _paramValue = decodeURIComponent(baseSegment.value);
          matched = true;
        }
        if (matched) {
          params[routeSegment.value.substring(1)] = _paramValue;
          baseIndex++;
        }
        routeIndex++;
        continue;
      }
      if (routeSegment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        if (!baseSegment) {
          routeIndex++;
          continue;
        }
        if (baseSegment.value === "/") {
          routeIndex++;
          continue;
        }
        let _paramValue = "";
        let matched = false;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if ((!prefix2 || baseValue.startsWith(prefix2)) && (!suffix || baseValue.endsWith(suffix))) {
            let paramValue = baseValue;
            if (prefix2 && paramValue.startsWith(prefix2)) {
              paramValue = paramValue.slice(prefix2.length);
            }
            if (suffix && paramValue.endsWith(suffix)) {
              paramValue = paramValue.slice(
                0,
                paramValue.length - suffix.length
              );
            }
            _paramValue = decodeURIComponent(paramValue);
            matched = true;
          }
        } else {
          let shouldMatchOptional = true;
          for (let lookAhead = routeIndex + 1; lookAhead < routeSegments.length; lookAhead++) {
            const futureRouteSegment = routeSegments[lookAhead];
            if ((futureRouteSegment == null ? void 0 : futureRouteSegment.type) === SEGMENT_TYPE_PATHNAME && futureRouteSegment.value === baseSegment.value) {
              shouldMatchOptional = false;
              break;
            }
            if ((futureRouteSegment == null ? void 0 : futureRouteSegment.type) === SEGMENT_TYPE_PARAM || (futureRouteSegment == null ? void 0 : futureRouteSegment.type) === SEGMENT_TYPE_WILDCARD) {
              break;
            }
          }
          if (shouldMatchOptional) {
            _paramValue = decodeURIComponent(baseSegment.value);
            matched = true;
          }
        }
        if (matched) {
          params[routeSegment.value.substring(1)] = _paramValue;
          baseIndex++;
        }
        routeIndex++;
        continue;
      }
    }
    if (baseIndex < baseSegments.length && routeIndex >= routeSegments.length) {
      params["**"] = joinPaths(
        baseSegments.slice(baseIndex).map((d2) => d2.value)
      );
      return ((_b = routeSegments[routeSegments.length - 1]) == null ? void 0 : _b.value) !== "/";
    }
    if (routeIndex < routeSegments.length && baseIndex >= baseSegments.length) {
      for (let i = routeIndex; i < routeSegments.length; i++) {
        if (((_c = routeSegments[i]) == null ? void 0 : _c.type) !== SEGMENT_TYPE_OPTIONAL_PARAM) {
          return false;
        }
      }
      break;
    }
    break;
  }
  return true;
}
function isNotFound(obj) {
  return !!(obj == null ? void 0 : obj.isNotFound);
}
const rootRouteId = "__root__";
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
const REQUIRED_PARAM_BASE_SCORE = 0.5;
const OPTIONAL_PARAM_BASE_SCORE = 0.4;
const WILDCARD_PARAM_BASE_SCORE = 0.25;
function handleParam(segment, baseScore) {
  if (segment.prefixSegment && segment.suffixSegment) {
    return baseScore + 0.05;
  }
  if (segment.prefixSegment) {
    return baseScore + 0.02;
  }
  if (segment.suffixSegment) {
    return baseScore + 0.01;
  }
  return baseScore;
}
function processRouteTree({
  routeTree: routeTree2,
  initRoute
}) {
  const routesById = {};
  const routesByPath = {};
  const recurseRoutes = (childRoutes) => {
    childRoutes.forEach((childRoute, i) => {
      initRoute == null ? void 0 : initRoute(childRoute, i);
      const existingRoute = routesById[childRoute.id];
      invariant(
        !existingRoute,
        `Duplicate routes found with id: ${String(childRoute.id)}`
      );
      routesById[childRoute.id] = childRoute;
      if (!childRoute.isRoot && childRoute.path) {
        const trimmedFullPath = trimPathRight(childRoute.fullPath);
        if (!routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
          routesByPath[trimmedFullPath] = childRoute;
        }
      }
      const children = childRoute.children;
      if (children == null ? void 0 : children.length) {
        recurseRoutes(children);
      }
    });
  };
  recurseRoutes([routeTree2]);
  const scoredRoutes = [];
  const routes = Object.values(routesById);
  routes.forEach((d2, i) => {
    var _a;
    if (d2.isRoot || !d2.path) {
      return;
    }
    const trimmed = trimPathLeft(d2.fullPath);
    let parsed = parsePathname(trimmed);
    let skip = 0;
    while (parsed.length > skip + 1 && ((_a = parsed[skip]) == null ? void 0 : _a.value) === "/") {
      skip++;
    }
    if (skip > 0) parsed = parsed.slice(skip);
    let optionalParamCount = 0;
    let hasStaticAfter = false;
    const scores = parsed.map((segment, index2) => {
      if (segment.value === "/") {
        return 0.75;
      }
      let baseScore = void 0;
      if (segment.type === SEGMENT_TYPE_PARAM) {
        baseScore = REQUIRED_PARAM_BASE_SCORE;
      } else if (segment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        baseScore = OPTIONAL_PARAM_BASE_SCORE;
        optionalParamCount++;
      } else if (segment.type === SEGMENT_TYPE_WILDCARD) {
        baseScore = WILDCARD_PARAM_BASE_SCORE;
      }
      if (baseScore) {
        for (let i2 = index2 + 1; i2 < parsed.length; i2++) {
          const nextSegment = parsed[i2];
          if (nextSegment.type === SEGMENT_TYPE_PATHNAME && nextSegment.value !== "/") {
            hasStaticAfter = true;
            return handleParam(segment, baseScore + 0.2);
          }
        }
        return handleParam(segment, baseScore);
      }
      return 1;
    });
    scoredRoutes.push({
      child: d2,
      trimmed,
      parsed,
      index: i,
      scores,
      optionalParamCount,
      hasStaticAfter
    });
  });
  const flatRoutes = scoredRoutes.sort((a, b) => {
    const minLength = Math.min(a.scores.length, b.scores.length);
    for (let i = 0; i < minLength; i++) {
      if (a.scores[i] !== b.scores[i]) {
        return b.scores[i] - a.scores[i];
      }
    }
    if (a.scores.length !== b.scores.length) {
      if (a.optionalParamCount !== b.optionalParamCount) {
        if (a.hasStaticAfter === b.hasStaticAfter) {
          return a.optionalParamCount - b.optionalParamCount;
        } else if (a.hasStaticAfter && !b.hasStaticAfter) {
          return -1;
        } else if (!a.hasStaticAfter && b.hasStaticAfter) {
          return 1;
        }
      }
      return b.scores.length - a.scores.length;
    }
    for (let i = 0; i < minLength; i++) {
      if (a.parsed[i].value !== b.parsed[i].value) {
        return a.parsed[i].value > b.parsed[i].value ? 1 : -1;
      }
    }
    return a.index - b.index;
  }).map((d2, i) => {
    d2.child.rank = i;
    return d2.child;
  });
  return { routesById, routesByPath, flatRoutes };
}
function getMatchedRoutes({
  pathname,
  routePathname,
  basepath,
  caseSensitive,
  routesByPath,
  routesById,
  flatRoutes,
  parseCache
}) {
  let routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  const getMatchedParams = (route) => {
    var _a;
    const result = matchPathname(
      basepath,
      trimmedPath,
      {
        to: route.fullPath,
        caseSensitive: ((_a = route.options) == null ? void 0 : _a.caseSensitive) ?? caseSensitive,
        // we need fuzzy matching for `notFoundMode: 'fuzzy'`
        fuzzy: true
      },
      parseCache
    );
    return result;
  };
  let foundRoute = routePathname !== void 0 ? routesByPath[routePathname] : void 0;
  if (foundRoute) {
    routeParams = getMatchedParams(foundRoute);
  } else {
    let fuzzyMatch = void 0;
    for (const route of flatRoutes) {
      const matchedParams = getMatchedParams(route);
      if (matchedParams) {
        if (route.path !== "/" && matchedParams["**"]) {
          if (!fuzzyMatch) {
            fuzzyMatch = { foundRoute: route, routeParams: matchedParams };
          }
        } else {
          foundRoute = route;
          routeParams = matchedParams;
          break;
        }
      }
    }
    if (!foundRoute && fuzzyMatch) {
      foundRoute = fuzzyMatch.foundRoute;
      routeParams = fuzzyMatch.routeParams;
    }
  }
  let routeCursor = foundRoute || routesById[rootRouteId];
  const matchedRoutes = [routeCursor];
  while (routeCursor.parentRoute) {
    routeCursor = routeCursor.parentRoute;
    matchedRoutes.push(routeCursor);
  }
  matchedRoutes.reverse();
  return { matchedRoutes, routeParams, foundRoute };
}
const startSerializer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const serializer = serializers.find((t) => t.stringifyCondition(ogVal));
    if (serializer) {
      return serializer.stringify(ogVal);
    }
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject(ogVal)) {
      const serializer = serializers.find((t) => t.parseCondition(ogVal));
      if (serializer) {
        return serializer.parse(ogVal);
      }
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) {
      return value.map((v2) => startSerializer.encode(v2));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v2]) => [
          key,
          startSerializer.encode(v2)
        ])
      );
    }
    const serializer = serializers.find((t) => t.stringifyCondition(value));
    if (serializer) {
      return serializer.stringify(value);
    }
    return value;
  },
  decode: (value) => {
    if (isPlainObject(value)) {
      const serializer = serializers.find((t) => t.parseCondition(value));
      if (serializer) {
        return serializer.parse(value);
      }
    }
    if (Array.isArray(value)) {
      return value.map((v2) => startSerializer.decode(v2));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v2]) => [
          key,
          startSerializer.decode(v2)
        ])
      );
    }
    return value;
  }
};
const createSerializer = (key, check, toValue, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
const serializers = [
  createSerializer(
    // Key
    "undefined",
    // Check
    (v2) => v2 === void 0,
    // To
    () => 0,
    // From
    () => void 0
  ),
  createSerializer(
    // Key
    "date",
    // Check
    (v2) => v2 instanceof Date,
    // To
    (v2) => v2.toISOString(),
    // From
    (v2) => new Date(v2)
  ),
  createSerializer(
    // Key
    "error",
    // Check
    (v2) => v2 instanceof Error,
    // To
    (v2) => ({
      ...v2,
      message: v2.message,
      stack: void 0,
      cause: v2.cause
    }),
    // From
    (v2) => Object.assign(new Error(v2.message), v2)
  ),
  createSerializer(
    // Key
    "formData",
    // Check
    (v2) => v2 instanceof FormData,
    // To
    (v2) => {
      const entries = {};
      v2.forEach((value, key) => {
        const entry = entries[key];
        if (entry !== void 0) {
          if (Array.isArray(entry)) {
            entry.push(value);
          } else {
            entries[key] = [entry, value];
          }
        } else {
          entries[key] = value;
        }
      });
      return entries;
    },
    // From
    (v2) => {
      const formData = new FormData();
      Object.entries(v2).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    }
  ),
  createSerializer(
    // Key
    "bigint",
    // Check
    (v2) => typeof v2 === "bigint",
    // To
    (v2) => v2.toString(),
    // From
    (v2) => BigInt(v2)
  )
];
function warning(condition, message2) {
}
const startStorage = new AsyncLocalStorage();
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && (opts == null ? void 0 : opts.throwIfNotFound) !== false) {
    throw new Error(
      `No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return context;
}
const globalMiddleware = [];
const getRouterInstance = () => {
  var _a;
  return (_a = getStartContext({
    throwIfNotFound: false
  })) == null ? void 0 : _a.router;
};
function createServerFn(options, __opts) {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") {
    resolvedOptions.method = "GET";
  }
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        middleware
      }));
    },
    validator: (validator) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        validator
      }));
    },
    type: (type) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        type
      }));
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      Object.assign(resolvedOptions, {
        ...extractedFn,
        extractedFn,
        serverFn
      });
      const resolvedMiddleware = [...resolvedOptions.middleware || [], serverFnBaseToMiddleware(resolvedOptions)];
      return Object.assign(async (opts) => {
        return executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...resolvedOptions,
          data: opts == null ? void 0 : opts.data,
          headers: opts == null ? void 0 : opts.headers,
          signal: opts == null ? void 0 : opts.signal,
          context: {},
          router: getRouterInstance()
        }).then((d2) => {
          if (resolvedOptions.response === "full") {
            return d2;
          }
          if (d2.error) throw d2.error;
          return d2.result;
        });
      }, {
        // This copies over the URL, function ID
        ...extractedFn,
        // The extracted function on the server-side calls
        // this function
        __executeServer: async (opts_, signal) => {
          const opts = opts_ instanceof FormData ? extractFormDataContext(opts_) : opts_;
          opts.type = typeof resolvedOptions.type === "function" ? resolvedOptions.type(opts) : resolvedOptions.type;
          const ctx = {
            ...extractedFn,
            ...opts,
            signal
          };
          const run = () => executeMiddleware$1(resolvedMiddleware, "server", ctx).then((d2) => ({
            // Only send the result and sendContext back to the client
            result: d2.result,
            error: d2.error,
            context: d2.sendContext
          }));
          if (ctx.type === "static") {
            let response;
            if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.getItem) {
              response = await serverFnStaticCache.getItem(ctx);
            }
            if (!response) {
              response = await run().then((d2) => {
                return {
                  ctx: d2,
                  error: null
                };
              }).catch((e) => {
                return {
                  ctx: void 0,
                  error: e
                };
              });
              if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.setItem) {
                await serverFnStaticCache.setItem(ctx, response);
              }
            }
            invariant(response);
            if (response.error) {
              throw response.error;
            }
            return response.ctx;
          }
          return run();
        }
      });
    }
  };
}
async function executeMiddleware$1(middlewares, env2, opts) {
  const flattenedMiddlewares = flattenMiddlewares([...globalMiddleware, ...middlewares]);
  const next = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) {
      return ctx;
    }
    if (nextMiddleware.options.validator && (env2 === "client" ? nextMiddleware.options.validateClient : true)) {
      ctx.data = await execValidator(nextMiddleware.options.validator, ctx.data);
    }
    const middlewareFn = env2 === "client" ? nextMiddleware.options.client : nextMiddleware.options.server;
    if (middlewareFn) {
      return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
        return next(newCtx).catch((error) => {
          if (isRedirect(error) || isNotFound(error)) {
            return {
              ...newCtx,
              error
            };
          }
          throw error;
        });
      });
    }
    return next(ctx);
  };
  return next({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || {}
  });
}
let serverFnStaticCache;
function setServerFnStaticCache(cache) {
  const previousCache = serverFnStaticCache;
  serverFnStaticCache = typeof cache === "function" ? cache() : cache;
  return () => {
    serverFnStaticCache = previousCache;
  };
}
function createServerFnStaticCache(serverFnStaticCache2) {
  return serverFnStaticCache2;
}
async function sha1Hash(message2) {
  const msgBuffer = new TextEncoder().encode(message2);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
setServerFnStaticCache(() => {
  const getStaticCacheUrl = async (options, hash) => {
    const filename = await sha1Hash(`${options.functionId}__${hash}`);
    return `/__tsr/staticServerFnCache/${filename}.json`;
  };
  const jsonToFilenameSafeString = (json2) => {
    const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
      acc[curr] = value[curr];
      return acc;
    }, {}) : value;
    const jsonString = JSON.stringify(json2 ?? "", sortedKeysReplacer);
    return jsonString.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
  };
  const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
  return createServerFnStaticCache({
    getItem: async (ctx) => {
      if (typeof document === "undefined") {
        const hash = jsonToFilenameSafeString(ctx.data);
        const url = await getStaticCacheUrl(ctx, hash);
        const publicUrl = "/Users/wing/.t3/worktrees/chat/t3code-27afbea1/.output/public";
        const {
          promises: fs
        } = await import('node:fs');
        const path = await import('node:path');
        const filePath = path.join(publicUrl, url);
        const [cachedResult, readError] = await fs.readFile(filePath, "utf-8").then((c) => [startSerializer.parse(c), null]).catch((e) => [null, e]);
        if (readError && readError.code !== "ENOENT") {
          throw readError;
        }
        return cachedResult;
      }
      return void 0;
    },
    setItem: async (ctx, response) => {
      const {
        promises: fs
      } = await import('node:fs');
      const path = await import('node:path');
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      const publicUrl = "/Users/wing/.t3/worktrees/chat/t3code-27afbea1/.output/public";
      const filePath = path.join(publicUrl, url);
      await fs.mkdir(path.dirname(filePath), {
        recursive: true
      });
      await fs.writeFile(filePath, startSerializer.stringify(response));
    },
    fetchItem: async (ctx) => {
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      let result = staticClientCache == null ? void 0 : staticClientCache.get(url);
      if (!result) {
        result = await fetch(url, {
          method: "GET"
        }).then((r) => r.text()).then((d2) => startSerializer.parse(d2));
        staticClientCache == null ? void 0 : staticClientCache.set(url, result);
      }
      return result;
    }
  });
});
function extractFormDataContext(formData) {
  const serializedContext = formData.get("__TSR_CONTEXT");
  formData.delete("__TSR_CONTEXT");
  if (typeof serializedContext !== "string") {
    return {
      context: {},
      data: formData
    };
  }
  try {
    const context = startSerializer.parse(serializedContext);
    return {
      context,
      data: formData
    };
  } catch {
    return {
      data: formData
    };
  }
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m2) => {
      if (m2.options.middleware) {
        recurse(m2.options.middleware);
      }
      if (!seen.has(m2)) {
        seen.add(m2);
        flattened.push(m2);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
const applyMiddleware = async (middlewareFn, ctx, nextFn) => {
  return middlewareFn({
    ...ctx,
    next: async (userCtx = {}) => {
      return nextFn({
        ...ctx,
        ...userCtx,
        context: {
          ...ctx.context,
          ...userCtx.context
        },
        sendContext: {
          ...ctx.sendContext,
          ...userCtx.sendContext ?? {}
        },
        headers: mergeHeaders(ctx.headers, userCtx.headers),
        result: userCtx.result !== void 0 ? userCtx.result : ctx.response === "raw" ? userCtx : ctx.result,
        error: userCtx.error ?? ctx.error
      });
    }
  });
};
function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = validator["~standard"].validate(input);
    if (result instanceof Promise) throw new Error("Async validation not supported");
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) {
    return validator.parse(input);
  }
  if (typeof validator === "function") {
    return validator(input);
  }
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    _types: void 0,
    options: {
      validator: options.validator,
      validateClient: options.validateClient,
      client: async ({
        next,
        sendContext,
        ...ctx
      }) => {
        var _a;
        const payload = {
          ...ctx,
          // switch the sendContext over to context
          context: sendContext,
          type: typeof ctx.type === "function" ? ctx.type(ctx) : ctx.type
        };
        if (ctx.type === "static" && "production" === "production" && typeof document !== "undefined") {
          invariant(serverFnStaticCache);
          const result = await serverFnStaticCache.fetchItem(payload);
          if (result) {
            if (result.error) {
              throw result.error;
            }
            return next(result.ctx);
          }
          warning(result, `No static cache item found for ${payload.functionId}__${JSON.stringify(payload.data)}, falling back to server function...`);
        }
        const res = await ((_a = options.extractedFn) == null ? void 0 : _a.call(options, payload));
        return next(res);
      },
      server: async ({
        next,
        ...ctx
      }) => {
        var _a;
        const result = await ((_a = options.serverFn) == null ? void 0 : _a.call(options, ctx));
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
var R = ((a) => (a[a.AggregateError = 1] = "AggregateError", a[a.ArrowFunction = 2] = "ArrowFunction", a[a.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", a[a.ObjectAssign = 8] = "ObjectAssign", a[a.BigIntTypedArray = 16] = "BigIntTypedArray", a))(R || {});
function Nr(o) {
  switch (o) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function d(o) {
  let e = "", r = 0, t;
  for (let n = 0, a = o.length; n < a; n++) t = Nr(o[n]), t && (e += o.slice(r, n) + t, r = n + 1);
  return r === 0 ? e = o : e += o.slice(r), e;
}
var O = "__SEROVAL_REFS__", Q = "$R", ae = `self.${Q}`;
function xr(o) {
  return o == null ? `${ae}=${ae}||[]` : `(${ae}=${ae}||{})["${d(o)}"]=[]`;
}
function f$1(o, e) {
  if (!o) throw e;
}
var Be = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
function je(o) {
  return Be.has(o);
}
function Ke(o) {
  return f$1(je(o), new ie(o)), Be.get(o);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, O, { value: C, configurable: true, writable: false, enumerable: false });
function Hr(o) {
  return o;
}
function Ye(o, e) {
  for (let r = 0, t = e.length; r < t; r++) {
    let n = e[r];
    o.has(n) || (o.add(n), n.extends && Ye(o, n.extends));
  }
}
function m(o) {
  if (o) {
    let e = /* @__PURE__ */ new Set();
    return Ye(e, o), [...e];
  }
}
var $e = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, ce = { [Symbol.asyncIterator]: 0, [Symbol.hasInstance]: 1, [Symbol.isConcatSpreadable]: 2, [Symbol.iterator]: 3, [Symbol.match]: 4, [Symbol.matchAll]: 5, [Symbol.replace]: 6, [Symbol.search]: 7, [Symbol.species]: 8, [Symbol.split]: 9, [Symbol.toPrimitive]: 10, [Symbol.toStringTag]: 11, [Symbol.unscopables]: 12 }, qe = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" };
var ue = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, s = void 0;
function u$1(o, e, r, t, n, a, i, l, c, p2, h, X) {
  return { t: o, i: e, s: r, l: t, c: n, m: a, p: i, e: l, a: c, f: p2, b: h, o: X };
}
function x(o) {
  return u$1(2, s, o, s, s, s, s, s, s, s, s, s);
}
var I = x(2), A = x(3), pe = x(1), de = x(0), Xe = x(4), Qe = x(5), er = x(6), rr = x(7);
function me(o) {
  return o instanceof EvalError ? 1 : o instanceof RangeError ? 2 : o instanceof ReferenceError ? 3 : o instanceof SyntaxError ? 4 : o instanceof TypeError ? 5 : o instanceof URIError ? 6 : 0;
}
function wr(o) {
  let e = ue[me(o)];
  return o.name !== e ? { name: o.name } : o.constructor.name !== e ? { name: o.constructor.name } : {};
}
function j(o, e) {
  let r = wr(o), t = Object.getOwnPropertyNames(o);
  for (let n = 0, a = t.length, i; n < a; n++) i = t[n], i !== "name" && i !== "message" && (i === "stack" ? e & 4 && (r = r || {}, r[i] = o[i]) : (r = r || {}, r[i] = o[i]));
  return r;
}
function fe(o) {
  return Object.isFrozen(o) ? 3 : Object.isSealed(o) ? 2 : Object.isExtensible(o) ? 0 : 1;
}
function ge(o) {
  switch (o) {
    case Number.POSITIVE_INFINITY:
      return Qe;
    case Number.NEGATIVE_INFINITY:
      return er;
  }
  return o !== o ? rr : Object.is(o, -0) ? Xe : u$1(0, s, o, s, s, s, s, s, s, s, s, s);
}
function w$1(o) {
  return u$1(1, s, d(o), s, s, s, s, s, s, s, s, s);
}
function Se(o) {
  return u$1(3, s, "" + o, s, s, s, s, s, s, s, s, s);
}
function sr(o) {
  return u$1(4, o, s, s, s, s, s, s, s, s, s, s);
}
function he(o, e) {
  let r = e.valueOf();
  return u$1(5, o, r !== r ? "" : e.toISOString(), s, s, s, s, s, s, s, s, s);
}
function ye(o, e) {
  return u$1(6, o, s, s, d(e.source), e.flags, s, s, s, s, s, s);
}
function ve(o, e) {
  let r = new Uint8Array(e), t = r.length, n = new Array(t);
  for (let a = 0; a < t; a++) n[a] = r[a];
  return u$1(19, o, n, s, s, s, s, s, s, s, s, s);
}
function or(o, e) {
  return u$1(17, o, ce[e], s, s, s, s, s, s, s, s, s);
}
function nr(o, e) {
  return u$1(18, o, d(Ke(e)), s, s, s, s, s, s, s, s, s);
}
function _(o, e, r) {
  return u$1(25, o, r, s, d(e), s, s, s, s, s, s, s);
}
function Ne(o, e, r) {
  return u$1(9, o, s, e.length, s, s, s, s, r, s, s, fe(e));
}
function be(o, e) {
  return u$1(21, o, s, s, s, s, s, s, s, e, s, s);
}
function xe(o, e, r) {
  return u$1(15, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ie(o, e, r) {
  return u$1(16, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ae(o, e, r) {
  return u$1(20, o, s, e.byteLength, s, s, s, s, s, r, e.byteOffset, s);
}
function we(o, e, r) {
  return u$1(13, o, me(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Ee(o, e, r) {
  return u$1(14, o, me(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Pe(o, e, r) {
  return u$1(7, o, s, e, s, s, s, s, r, s, s, s);
}
function M(o, e) {
  return u$1(28, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function U(o, e) {
  return u$1(30, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function L(o, e, r) {
  return u$1(31, o, s, s, s, s, s, s, r, e, s, s);
}
function Re(o, e) {
  return u$1(32, o, s, s, s, s, s, s, s, e, s, s);
}
function Oe(o, e) {
  return u$1(33, o, s, s, s, s, s, s, s, e, s, s);
}
function Ce(o, e) {
  return u$1(34, o, s, s, s, s, s, s, s, e, s, s);
}
var { toString: _e } = Object.prototype;
function Er(o, e) {
  return e instanceof Error ? `Seroval caught an error during the ${o} process.
  
${e.name}
${e.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new` : `Seroval caught an error during the ${o} process.

"${_e.call(e)}"

For more information, please check the "cause" property of this error.`;
}
var ee$1 = class ee extends Error {
  constructor(r, t) {
    super(Er(r, t));
    this.cause = t;
  }
}, E = class extends ee$1 {
  constructor(e) {
    super("parsing", e);
  }
}, Te = class extends ee$1 {
  constructor(e) {
    super("serialization", e);
  }
}, g = class extends Error {
  constructor(r) {
    super(`The value ${_e.call(r)} of type "${typeof r}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`);
    this.value = r;
  }
}, y = class extends Error {
  constructor(e) {
    super('Unsupported node type "' + e.t + '".');
  }
}, W = class extends Error {
  constructor(e) {
    super('Missing plugin for tag "' + e + '".');
  }
}, ie = class extends Error {
  constructor(r) {
    super('Missing reference for the value "' + _e.call(r) + '" of type "' + typeof r + '"');
    this.value = r;
  }
};
var T = class {
  constructor(e, r) {
    this.value = e;
    this.replacement = r;
  }
};
function z(o, e, r) {
  return o & 2 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function S(o, e, r) {
  return o & 2 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var ar = {}, ir = {};
var lr = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} };
function Pr(o) {
  return z(o, ["r"], "(r.p=new Promise(" + S(o, ["s", "f"], "r.s=s,r.f=f") + "))");
}
function Rr(o) {
  return S(o, ["r", "d"], "r.s(d),r.p.s=1,r.p.v=d");
}
function Or(o) {
  return S(o, ["r", "d"], "r.f(d),r.p.s=2,r.p.v=d");
}
function Cr(o) {
  return z(o, ["b", "a", "s", "l", "p", "f", "e", "n"], "(b=[],a=!0,s=!1,l=[],p=0,f=" + S(o, ["v", "m", "x"], "for(x=0;x<p;x++)l[x]&&l[x][m](v)") + ",n=" + S(o, ["o", "x", "z", "c"], 'for(x=0,z=b.length;x<z;x++)(c=b[x],(!a&&x===z-1)?o[s?"return":"throw"](c):o.next(c))') + ",e=" + z(o, ["o", "t"], "(a&&(l[t=p++]=o),n(o)," + S(o, [], "a&&(l[t]=void 0)") + ")") + ",{__SEROVAL_STREAM__:!0,on:" + z(o, ["o"], "e(o)") + ",next:" + S(o, ["v"], 'a&&(b.push(v),f(v,"next"))') + ",throw:" + S(o, ["v"], 'a&&(b.push(v),f(v,"throw"),a=s=!1,l.length=0)') + ",return:" + S(o, ["v"], 'a&&(b.push(v),f(v,"return"),a=!1,s=!0,l.length=0)') + "})");
}
function cr(o, e) {
  switch (e) {
    case 0:
      return "[]";
    case 1:
      return Pr(o);
    case 2:
      return Rr(o);
    case 3:
      return Or(o);
    case 4:
      return Cr(o);
    default:
      return "";
  }
}
function Fe(o) {
  return "__SEROVAL_STREAM__" in o;
}
function K() {
  let o = /* @__PURE__ */ new Set(), e = [], r = true, t = true;
  function n(l) {
    for (let c of o.keys()) c.next(l);
  }
  function a(l) {
    for (let c of o.keys()) c.throw(l);
  }
  function i(l) {
    for (let c of o.keys()) c.return(l);
  }
  return { __SEROVAL_STREAM__: true, on(l) {
    r && o.add(l);
    for (let c = 0, p2 = e.length; c < p2; c++) {
      let h = e[c];
      c === p2 - 1 && !r ? t ? l.return(h) : l.throw(h) : l.next(h);
    }
    return () => {
      r && o.delete(l);
    };
  }, next(l) {
    r && (e.push(l), n(l));
  }, throw(l) {
    r && (e.push(l), a(l), r = false, t = false, o.clear());
  }, return(l) {
    r && (e.push(l), i(l), r = false, t = true, o.clear());
  } };
}
function Ve(o) {
  let e = K(), r = o[Symbol.asyncIterator]();
  async function t() {
    try {
      let n = await r.next();
      n.done ? e.return(n.value) : (e.next(n.value), await t());
    } catch (n) {
      e.throw(n);
    }
  }
  return t().catch(() => {
  }), e;
}
function J(o) {
  let e = [], r = -1, t = -1, n = o[Symbol.iterator]();
  for (; ; ) try {
    let a = n.next();
    if (e.push(a.value), a.done) {
      t = e.length - 1;
      break;
    }
  } catch (a) {
    r = e.length, e.push(a);
  }
  return { v: e, t: r, d: t };
}
var Y = class {
  constructor(e) {
    this.marked = /* @__PURE__ */ new Set();
    this.plugins = e.plugins, this.features = 31 ^ (e.disabledFeatures || 0), this.refs = e.refs || /* @__PURE__ */ new Map();
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  createIndex(e) {
    let r = this.refs.size;
    return this.refs.set(e, r), r;
  }
  getIndexedValue(e) {
    let r = this.refs.get(e);
    return r != null ? (this.markRef(r), { type: 1, value: sr(r) }) : { type: 0, value: this.createIndex(e) };
  }
  getReference(e) {
    let r = this.getIndexedValue(e);
    return r.type === 1 ? r : je(e) ? { type: 2, value: nr(r.value, e) } : r;
  }
  parseWellKnownSymbol(e) {
    let r = this.getReference(e);
    return r.type !== 0 ? r.value : (f$1(e in ce, new g(e)), or(r.value, e));
  }
  parseSpecialReference(e) {
    let r = this.getIndexedValue(lr[e]);
    return r.type === 1 ? r.value : u$1(26, r.value, e, s, s, s, s, s, s, s, s, s);
  }
  parseIteratorFactory() {
    let e = this.getIndexedValue(ar);
    return e.type === 1 ? e.value : u$1(27, e.value, s, s, s, s, s, s, s, this.parseWellKnownSymbol(Symbol.iterator), s, s);
  }
  parseAsyncIteratorFactory() {
    let e = this.getIndexedValue(ir);
    return e.type === 1 ? e.value : u$1(29, e.value, s, s, s, s, s, s, [this.parseSpecialReference(1), this.parseWellKnownSymbol(Symbol.asyncIterator)], s, s, s);
  }
  createObjectNode(e, r, t, n) {
    return u$1(t ? 11 : 10, e, s, s, s, s, n, s, s, s, s, fe(r));
  }
  createMapNode(e, r, t, n) {
    return u$1(8, e, s, s, s, s, s, { k: r, v: t, s: n }, s, this.parseSpecialReference(0), s, s);
  }
  createPromiseConstructorNode(e, r) {
    return u$1(22, e, r, s, s, s, s, s, s, this.parseSpecialReference(1), s, s);
  }
};
var kr = /^[$A-Z_][0-9A-Z_$]*$/i;
function Le(o) {
  let e = o[0];
  return (e === "$" || e === "_" || e >= "A" && e <= "Z" || e >= "a" && e <= "z") && kr.test(o);
}
function se(o) {
  switch (o.t) {
    case 0:
      return o.s + "=" + o.v;
    case 2:
      return o.s + ".set(" + o.k + "," + o.v + ")";
    case 1:
      return o.s + ".add(" + o.v + ")";
    case 3:
      return o.s + ".delete(" + o.k + ")";
  }
}
function Fr(o) {
  let e = [], r = o[0];
  for (let t = 1, n = o.length, a, i = r; t < n; t++) a = o[t], a.t === 0 && a.v === i.v ? r = { t: 0, s: a.s, k: s, v: se(r) } : a.t === 2 && a.s === i.s ? r = { t: 2, s: se(r), k: a.k, v: a.v } : a.t === 1 && a.s === i.s ? r = { t: 1, s: se(r), k: s, v: a.v } : a.t === 3 && a.s === i.s ? r = { t: 3, s: se(r), k: a.k, v: s } : (e.push(r), r = a), i = a;
  return e.push(r), e;
}
function fr(o) {
  if (o.length) {
    let e = "", r = Fr(o);
    for (let t = 0, n = r.length; t < n; t++) e += se(r[t]) + ",";
    return e;
  }
  return s;
}
var Vr = "Object.create(null)", Dr = "new Set", Br = "new Map", jr = "Promise.resolve", _r = "Promise.reject", Mr = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: s }, V = class {
  constructor(e) {
    this.stack = [];
    this.flags = [];
    this.assignments = [];
    this.plugins = e.plugins, this.features = e.features, this.marked = new Set(e.markedRefs);
  }
  createFunction(e, r) {
    return z(this.features, e, r);
  }
  createEffectfulFunction(e, r) {
    return S(this.features, e, r);
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  pushObjectFlag(e, r) {
    e !== 0 && (this.markRef(r), this.flags.push({ type: e, value: this.getRefParam(r) }));
  }
  resolveFlags() {
    let e = "";
    for (let r = 0, t = this.flags, n = t.length; r < n; r++) {
      let a = t[r];
      e += Mr[a.type] + "(" + a.value + "),";
    }
    return e;
  }
  resolvePatches() {
    let e = fr(this.assignments), r = this.resolveFlags();
    return e ? r ? e + r : e : r;
  }
  createAssignment(e, r) {
    this.assignments.push({ t: 0, s: e, k: s, v: r });
  }
  createAddAssignment(e, r) {
    this.assignments.push({ t: 1, s: this.getRefParam(e), k: s, v: r });
  }
  createSetAssignment(e, r, t) {
    this.assignments.push({ t: 2, s: this.getRefParam(e), k: r, v: t });
  }
  createDeleteAssignment(e, r) {
    this.assignments.push({ t: 3, s: this.getRefParam(e), k: r, v: s });
  }
  createArrayAssign(e, r, t) {
    this.createAssignment(this.getRefParam(e) + "[" + r + "]", t);
  }
  createObjectAssign(e, r, t) {
    this.createAssignment(this.getRefParam(e) + "." + r, t);
  }
  isIndexedValueInStack(e) {
    return e.t === 4 && this.stack.includes(e.i);
  }
  serializeReference(e) {
    return this.assignIndexedValue(e.i, O + '.get("' + e.s + '")');
  }
  serializeArrayItem(e, r, t) {
    return r ? this.isIndexedValueInStack(r) ? (this.markRef(e), this.createArrayAssign(e, t, this.getRefParam(r.i)), "") : this.serialize(r) : "";
  }
  serializeArray(e) {
    let r = e.i;
    if (e.l) {
      this.stack.push(r);
      let t = e.a, n = this.serializeArrayItem(r, t[0], 0), a = n === "";
      for (let i = 1, l = e.l, c; i < l; i++) c = this.serializeArrayItem(r, t[i], i), n += "," + c, a = c === "";
      return this.stack.pop(), this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(r, "[" + n + (a ? ",]" : "]"));
    }
    return this.assignIndexedValue(r, "[]");
  }
  serializeProperty(e, r, t) {
    if (typeof r == "string") {
      let n = Number(r), a = n >= 0 && n.toString() === r || Le(r);
      if (this.isIndexedValueInStack(t)) {
        let i = this.getRefParam(t.i);
        return this.markRef(e.i), a && n !== n ? this.createObjectAssign(e.i, r, i) : this.createArrayAssign(e.i, a ? r : '"' + r + '"', i), "";
      }
      return (a ? r : '"' + r + '"') + ":" + this.serialize(t);
    }
    return "[" + this.serialize(r) + "]:" + this.serialize(t);
  }
  serializeProperties(e, r) {
    let t = r.s;
    if (t) {
      let n = r.k, a = r.v;
      this.stack.push(e.i);
      let i = this.serializeProperty(e, n[0], a[0]);
      for (let l = 1, c = i; l < t; l++) c = this.serializeProperty(e, n[l], a[l]), i += (c && i && ",") + c;
      return this.stack.pop(), "{" + i + "}";
    }
    return "{}";
  }
  serializeObject(e) {
    return this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(e.i, this.serializeProperties(e, e.p));
  }
  serializeWithObjectAssign(e, r, t) {
    let n = this.serializeProperties(e, r);
    return n !== "{}" ? "Object.assign(" + t + "," + n + ")" : t;
  }
  serializeStringKeyAssignment(e, r, t, n) {
    let a = this.serialize(n), i = Number(t), l = i >= 0 && i.toString() === t || Le(t);
    if (this.isIndexedValueInStack(n)) l && i !== i ? this.createObjectAssign(e.i, t, a) : this.createArrayAssign(e.i, l ? t : '"' + t + '"', a);
    else {
      let c = this.assignments;
      this.assignments = r, l && i !== i ? this.createObjectAssign(e.i, t, a) : this.createArrayAssign(e.i, l ? t : '"' + t + '"', a), this.assignments = c;
    }
  }
  serializeAssignment(e, r, t, n) {
    if (typeof t == "string") this.serializeStringKeyAssignment(e, r, t, n);
    else {
      let a = this.stack;
      this.stack = [];
      let i = this.serialize(n);
      this.stack = a;
      let l = this.assignments;
      this.assignments = r, this.createArrayAssign(e.i, this.serialize(t), i), this.assignments = l;
    }
  }
  serializeAssignments(e, r) {
    let t = r.s;
    if (t) {
      let n = [], a = r.k, i = r.v;
      this.stack.push(e.i);
      for (let l = 0; l < t; l++) this.serializeAssignment(e, n, a[l], i[l]);
      return this.stack.pop(), fr(n);
    }
    return s;
  }
  serializeDictionary(e, r) {
    if (e.p) if (this.features & 8) r = this.serializeWithObjectAssign(e, e.p, r);
    else {
      this.markRef(e.i);
      let t = this.serializeAssignments(e, e.p);
      if (t) return "(" + this.assignIndexedValue(e.i, r) + "," + t + this.getRefParam(e.i) + ")";
    }
    return this.assignIndexedValue(e.i, r);
  }
  serializeNullConstructor(e) {
    return this.pushObjectFlag(e.o, e.i), this.serializeDictionary(e, Vr);
  }
  serializeDate(e) {
    return this.assignIndexedValue(e.i, 'new Date("' + e.s + '")');
  }
  serializeRegExp(e) {
    return this.assignIndexedValue(e.i, "/" + e.c + "/" + e.m);
  }
  serializeSetItem(e, r) {
    return this.isIndexedValueInStack(r) ? (this.markRef(e), this.createAddAssignment(e, this.getRefParam(r.i)), "") : this.serialize(r);
  }
  serializeSet(e) {
    let r = Dr, t = e.l, n = e.i;
    if (t) {
      let a = e.a;
      this.stack.push(n);
      let i = this.serializeSetItem(n, a[0]);
      for (let l = 1, c = i; l < t; l++) c = this.serializeSetItem(n, a[l]), i += (c && i && ",") + c;
      this.stack.pop(), i && (r += "([" + i + "])");
    }
    return this.assignIndexedValue(n, r);
  }
  serializeMapEntry(e, r, t, n) {
    if (this.isIndexedValueInStack(r)) {
      let a = this.getRefParam(r.i);
      if (this.markRef(e), this.isIndexedValueInStack(t)) {
        let l = this.getRefParam(t.i);
        return this.createSetAssignment(e, a, l), "";
      }
      if (t.t !== 4 && t.i != null && this.isMarked(t.i)) {
        let l = "(" + this.serialize(t) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, a, this.getRefParam(t.i)), this.createDeleteAssignment(e, n), l;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, a, this.serialize(t)), this.stack = i, "";
    }
    if (this.isIndexedValueInStack(t)) {
      let a = this.getRefParam(t.i);
      if (this.markRef(e), r.t !== 4 && r.i != null && this.isMarked(r.i)) {
        let l = "(" + this.serialize(r) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, this.getRefParam(r.i), a), this.createDeleteAssignment(e, n), l;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, this.serialize(r), a), this.stack = i, "";
    }
    return "[" + this.serialize(r) + "," + this.serialize(t) + "]";
  }
  serializeMap(e) {
    let r = Br, t = e.e.s, n = e.i, a = e.f, i = this.getRefParam(a.i);
    if (t) {
      let l = e.e.k, c = e.e.v;
      this.stack.push(n);
      let p2 = this.serializeMapEntry(n, l[0], c[0], i);
      for (let h = 1, X = p2; h < t; h++) X = this.serializeMapEntry(n, l[h], c[h], i), p2 += (X && p2 && ",") + X;
      this.stack.pop(), p2 && (r += "([" + p2 + "])");
    }
    return a.t === 26 && (this.markRef(a.i), r = "(" + this.serialize(a) + "," + r + ")"), this.assignIndexedValue(n, r);
  }
  serializeArrayBuffer(e) {
    let r = "new Uint8Array(", t = e.s, n = t.length;
    if (n) {
      r += "[" + t[0];
      for (let a = 1; a < n; a++) r += "," + t[a];
      r += "]";
    }
    return this.assignIndexedValue(e.i, r + ").buffer");
  }
  serializeTypedArray(e) {
    return this.assignIndexedValue(e.i, "new " + e.c + "(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeDataView(e) {
    return this.assignIndexedValue(e.i, "new DataView(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeAggregateError(e) {
    let r = e.i;
    this.stack.push(r);
    let t = this.serializeDictionary(e, 'new AggregateError([],"' + e.m + '")');
    return this.stack.pop(), t;
  }
  serializeError(e) {
    return this.serializeDictionary(e, "new " + ue[e.s] + '("' + e.m + '")');
  }
  serializePromise(e) {
    let r, t = e.f, n = e.i, a = e.s ? jr : _r;
    if (this.isIndexedValueInStack(t)) {
      let i = this.getRefParam(t.i);
      r = a + (e.s ? "().then(" + this.createFunction([], i) + ")" : "().catch(" + this.createEffectfulFunction([], "throw " + i) + ")");
    } else {
      this.stack.push(n);
      let i = this.serialize(t);
      this.stack.pop(), r = a + "(" + i + ")";
    }
    return this.assignIndexedValue(n, r);
  }
  serializeWellKnownSymbol(e) {
    return this.assignIndexedValue(e.i, $e[e.s]);
  }
  serializeBoxed(e) {
    return this.assignIndexedValue(e.i, "Object(" + this.serialize(e.f) + ")");
  }
  serializePlugin(e) {
    let r = this.plugins;
    if (r) for (let t = 0, n = r.length; t < n; t++) {
      let a = r[t];
      if (a.tag === e.c) return this.assignIndexedValue(e.i, a.serialize(e.s, this, { id: e.i }));
    }
    throw new W(e.c);
  }
  getConstructor(e) {
    let r = this.serialize(e);
    return r === this.getRefParam(e.i) ? r : "(" + r + ")";
  }
  serializePromiseConstructor(e) {
    let r = this.assignIndexedValue(e.s, "{p:0,s:0,f:0}");
    return this.assignIndexedValue(e.i, this.getConstructor(e.f) + "(" + r + ")");
  }
  serializePromiseResolve(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializePromiseReject(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializeSpecialReference(e) {
    return this.assignIndexedValue(e.i, cr(this.features, e.s));
  }
  serializeIteratorFactory(e) {
    let r = "", t = false;
    return e.f.t !== 4 && (this.markRef(e.f.i), r = "(" + this.serialize(e.f) + ",", t = true), r += this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["i", "c", "d", "t"], "(i=0,t={[" + this.getRefParam(e.f.i) + "]:" + this.createFunction([], "t") + ",next:" + this.createEffectfulFunction([], "if(i>s.d)return{done:!0,value:void 0};if(d=s.v[c=i++],c===s.t)throw d;return{done:c===s.d,value:d}") + "})"))), t && (r += ")"), r;
  }
  serializeIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeAsyncIteratorFactory(e) {
    let r = e.a[0], t = e.a[1], n = "";
    r.t !== 4 && (this.markRef(r.i), n += "(" + this.serialize(r)), t.t !== 4 && (this.markRef(t.i), n += (n ? "," : "(") + this.serialize(t)), n && (n += ",");
    let a = this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["b", "c", "p", "d", "e", "t", "f"], "(b=[],c=0,p=[],d=-1,e=!1,f=" + this.createEffectfulFunction(["i", "l"], "for(i=0,l=p.length;i<l;i++)p[i].s({done:!0,value:void 0})") + ",s.on({next:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!1,value:v});b.push(v)") + ",throw:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.f(v);f(),d=b.length,e=!0,b.push(v)") + ",return:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!0,value:v});f(),d=b.length,b.push(v)") + "}),t={[" + this.getRefParam(t.i) + "]:" + this.createFunction([], "t.p") + ",next:" + this.createEffectfulFunction(["i", "t", "v"], "if(d===-1){return((i=c++)>=b.length)?(" + this.getRefParam(r.i) + "(t={p:0,s:0,f:0}),p.push(t),t.p):{done:!1,value:b[i]}}if(c>d)return{done:!0,value:void 0};if(v=b[i=c++],i!==d)return{done:!1,value:v};if(e)throw v;return{done:!0,value:v}") + "})")));
    return n ? n + a + ")" : a;
  }
  serializeAsyncIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeStreamConstructor(e) {
    let r = this.assignIndexedValue(e.i, this.getConstructor(e.f) + "()"), t = e.a.length;
    if (t) {
      let n = this.serialize(e.a[0]);
      for (let a = 1; a < t; a++) n += "," + this.serialize(e.a[a]);
      return "(" + r + "," + n + "," + this.getRefParam(e.i) + ")";
    }
    return r;
  }
  serializeStreamNext(e) {
    return this.getRefParam(e.i) + ".next(" + this.serialize(e.f) + ")";
  }
  serializeStreamThrow(e) {
    return this.getRefParam(e.i) + ".throw(" + this.serialize(e.f) + ")";
  }
  serializeStreamReturn(e) {
    return this.getRefParam(e.i) + ".return(" + this.serialize(e.f) + ")";
  }
  serialize(e) {
    try {
      switch (e.t) {
        case 2:
          return qe[e.s];
        case 0:
          return "" + e.s;
        case 1:
          return '"' + e.s + '"';
        case 3:
          return e.s + "n";
        case 4:
          return this.getRefParam(e.i);
        case 18:
          return this.serializeReference(e);
        case 9:
          return this.serializeArray(e);
        case 10:
          return this.serializeObject(e);
        case 11:
          return this.serializeNullConstructor(e);
        case 5:
          return this.serializeDate(e);
        case 6:
          return this.serializeRegExp(e);
        case 7:
          return this.serializeSet(e);
        case 8:
          return this.serializeMap(e);
        case 19:
          return this.serializeArrayBuffer(e);
        case 16:
        case 15:
          return this.serializeTypedArray(e);
        case 20:
          return this.serializeDataView(e);
        case 14:
          return this.serializeAggregateError(e);
        case 13:
          return this.serializeError(e);
        case 12:
          return this.serializePromise(e);
        case 17:
          return this.serializeWellKnownSymbol(e);
        case 21:
          return this.serializeBoxed(e);
        case 22:
          return this.serializePromiseConstructor(e);
        case 23:
          return this.serializePromiseResolve(e);
        case 24:
          return this.serializePromiseReject(e);
        case 25:
          return this.serializePlugin(e);
        case 26:
          return this.serializeSpecialReference(e);
        case 27:
          return this.serializeIteratorFactory(e);
        case 28:
          return this.serializeIteratorFactoryInstance(e);
        case 29:
          return this.serializeAsyncIteratorFactory(e);
        case 30:
          return this.serializeAsyncIteratorFactoryInstance(e);
        case 31:
          return this.serializeStreamConstructor(e);
        case 32:
          return this.serializeStreamNext(e);
        case 33:
          return this.serializeStreamThrow(e);
        case 34:
          return this.serializeStreamReturn(e);
        default:
          throw new y(e);
      }
    } catch (r) {
      throw new Te(r);
    }
  }
};
var D = class extends V {
  constructor(r) {
    super(r);
    this.mode = "cross";
    this.scopeId = r.scopeId;
  }
  getRefParam(r) {
    return Q + "[" + r + "]";
  }
  assignIndexedValue(r, t) {
    return this.getRefParam(r) + "=" + t;
  }
  serializeTop(r) {
    let t = this.serialize(r), n = r.i;
    if (n == null) return t;
    let a = this.resolvePatches(), i = this.getRefParam(n), l = this.scopeId == null ? "" : Q, c = a ? "(" + t + "," + a + i + ")" : t;
    if (l === "") return r.t === 10 && !a ? "(" + c + ")" : c;
    let p2 = this.scopeId == null ? "()" : "(" + Q + '["' + d(this.scopeId) + '"])';
    return "(" + this.createFunction([l], c) + ")" + p2;
  }
};
var v = class extends Y {
  parseItems(e) {
    let r = [];
    for (let t = 0, n = e.length; t < n; t++) t in e && (r[t] = this.parse(e[t]));
    return r;
  }
  parseArray(e, r) {
    return Ne(e, r, this.parseItems(r));
  }
  parseProperties(e) {
    let r = Object.entries(e), t = [], n = [];
    for (let i = 0, l = r.length; i < l; i++) t.push(d(r[i][0])), n.push(this.parse(r[i][1]));
    let a = Symbol.iterator;
    return a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(M(this.parseIteratorFactory(), this.parse(J(e))))), a = Symbol.asyncIterator, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(U(this.parseAsyncIteratorFactory(), this.parse(K())))), a = Symbol.toStringTag, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(w$1(e[a]))), a = Symbol.isConcatSpreadable, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(e[a] ? I : A)), { k: t, v: n, s: t.length };
  }
  parsePlainObject(e, r, t) {
    return this.createObjectNode(e, r, t, this.parseProperties(r));
  }
  parseBoxed(e, r) {
    return be(e, this.parse(r.valueOf()));
  }
  parseTypedArray(e, r) {
    return xe(e, r, this.parse(r.buffer));
  }
  parseBigIntTypedArray(e, r) {
    return Ie(e, r, this.parse(r.buffer));
  }
  parseDataView(e, r) {
    return Ae(e, r, this.parse(r.buffer));
  }
  parseError(e, r) {
    let t = j(r, this.features);
    return we(e, r, t ? this.parseProperties(t) : s);
  }
  parseAggregateError(e, r) {
    let t = j(r, this.features);
    return Ee(e, r, t ? this.parseProperties(t) : s);
  }
  parseMap(e, r) {
    let t = [], n = [];
    for (let [a, i] of r.entries()) t.push(this.parse(a)), n.push(this.parse(i));
    return this.createMapNode(e, t, n, r.size);
  }
  parseSet(e, r) {
    let t = [];
    for (let n of r.keys()) t.push(this.parse(n));
    return Pe(e, r.size, t);
  }
  parsePlugin(e, r) {
    let t = this.plugins;
    if (t) for (let n = 0, a = t.length; n < a; n++) {
      let i = t[n];
      if (i.parse.sync && i.test(r)) return _(e, i.tag, i.parse.sync(r, this, { id: e }));
    }
  }
  parseStream(e, r) {
    return L(e, this.parseSpecialReference(4), []);
  }
  parsePromise(e, r) {
    return this.createPromiseConstructorNode(e, this.createIndex({}));
  }
  parseObject(e, r) {
    if (Array.isArray(r)) return this.parseArray(e, r);
    if (Fe(r)) return this.parseStream(e, r);
    let t = r.constructor;
    if (t === T) return this.parse(r.replacement);
    let n = this.parsePlugin(e, r);
    if (n) return n;
    switch (t) {
      case Object:
        return this.parsePlainObject(e, r, false);
      case void 0:
        return this.parsePlainObject(e, r, true);
      case Date:
        return he(e, r);
      case RegExp:
        return ye(e, r);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return this.parseError(e, r);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return this.parseBoxed(e, r);
      case ArrayBuffer:
        return ve(e, r);
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return this.parseTypedArray(e, r);
      case DataView:
        return this.parseDataView(e, r);
      case Map:
        return this.parseMap(e, r);
      case Set:
        return this.parseSet(e, r);
    }
    if (t === Promise || r instanceof Promise) return this.parsePromise(e, r);
    let a = this.features;
    if (a & 16) switch (t) {
      case BigInt64Array:
      case BigUint64Array:
        return this.parseBigIntTypedArray(e, r);
    }
    if (a & 1 && typeof AggregateError != "undefined" && (t === AggregateError || r instanceof AggregateError)) return this.parseAggregateError(e, r);
    if (r instanceof Error) return this.parseError(e, r);
    if (Symbol.iterator in r || Symbol.asyncIterator in r) return this.parsePlainObject(e, r, !!t);
    throw new g(r);
  }
  parseFunction(e) {
    let r = this.getReference(e);
    if (r.type !== 0) return r.value;
    let t = this.parsePlugin(r.value, e);
    if (t) return t;
    throw new g(e);
  }
  parse(e) {
    switch (typeof e) {
      case "boolean":
        return e ? I : A;
      case "undefined":
        return pe;
      case "string":
        return w$1(e);
      case "number":
        return ge(e);
      case "bigint":
        return Se(e);
      case "object": {
        if (e) {
          let r = this.getReference(e);
          return r.type === 0 ? this.parseObject(r.value, e) : r.value;
        }
        return de;
      }
      case "symbol":
        return this.parseWellKnownSymbol(e);
      case "function":
        return this.parseFunction(e);
      default:
        throw new g(e);
    }
  }
  parseTop(e) {
    try {
      return this.parse(e);
    } catch (r) {
      throw r instanceof E ? r : new E(r);
    }
  }
};
var oe = class extends v {
  constructor(r) {
    super(r);
    this.alive = true;
    this.pending = 0;
    this.initial = true;
    this.buffer = [];
    this.onParseCallback = r.onParse, this.onErrorCallback = r.onError, this.onDoneCallback = r.onDone;
  }
  onParseInternal(r, t) {
    try {
      this.onParseCallback(r, t);
    } catch (n) {
      this.onError(n);
    }
  }
  flush() {
    for (let r = 0, t = this.buffer.length; r < t; r++) this.onParseInternal(this.buffer[r], false);
  }
  onParse(r) {
    this.initial ? this.buffer.push(r) : this.onParseInternal(r, false);
  }
  onError(r) {
    if (this.onErrorCallback) this.onErrorCallback(r);
    else throw r;
  }
  onDone() {
    this.onDoneCallback && this.onDoneCallback();
  }
  pushPendingState() {
    this.pending++;
  }
  popPendingState() {
    --this.pending <= 0 && this.onDone();
  }
  parseProperties(r) {
    let t = Object.entries(r), n = [], a = [];
    for (let l = 0, c = t.length; l < c; l++) n.push(d(t[l][0])), a.push(this.parse(t[l][1]));
    let i = Symbol.iterator;
    return i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(M(this.parseIteratorFactory(), this.parse(J(r))))), i = Symbol.asyncIterator, i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(U(this.parseAsyncIteratorFactory(), this.parse(Ve(r))))), i = Symbol.toStringTag, i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(w$1(r[i]))), i = Symbol.isConcatSpreadable, i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(r[i] ? I : A)), { k: n, v: a, s: n.length };
  }
  handlePromiseSuccess(r, t) {
    let n = this.parseWithError(t);
    n && this.onParse(u$1(23, r, s, s, s, s, s, s, [this.parseSpecialReference(2), n], s, s, s)), this.popPendingState();
  }
  handlePromiseFailure(r, t) {
    if (this.alive) {
      let n = this.parseWithError(t);
      n && this.onParse(u$1(24, r, s, s, s, s, s, s, [this.parseSpecialReference(3), n], s, s, s));
    }
    this.popPendingState();
  }
  parsePromise(r, t) {
    let n = this.createIndex({});
    return t.then(this.handlePromiseSuccess.bind(this, n), this.handlePromiseFailure.bind(this, n)), this.pushPendingState(), this.createPromiseConstructorNode(r, n);
  }
  parsePlugin(r, t) {
    let n = this.plugins;
    if (n) for (let a = 0, i = n.length; a < i; a++) {
      let l = n[a];
      if (l.parse.stream && l.test(t)) return _(r, l.tag, l.parse.stream(t, this, { id: r }));
    }
    return s;
  }
  parseStream(r, t) {
    let n = L(r, this.parseSpecialReference(4), []);
    return this.pushPendingState(), t.on({ next: (a) => {
      if (this.alive) {
        let i = this.parseWithError(a);
        i && this.onParse(Re(r, i));
      }
    }, throw: (a) => {
      if (this.alive) {
        let i = this.parseWithError(a);
        i && this.onParse(Oe(r, i));
      }
      this.popPendingState();
    }, return: (a) => {
      if (this.alive) {
        let i = this.parseWithError(a);
        i && this.onParse(Ce(r, i));
      }
      this.popPendingState();
    } }), n;
  }
  parseWithError(r) {
    try {
      return this.parse(r);
    } catch (t) {
      return this.onError(t), s;
    }
  }
  start(r) {
    let t = this.parseWithError(r);
    t && (this.onParseInternal(t, true), this.initial = false, this.flush(), this.pending <= 0 && this.destroy());
  }
  destroy() {
    this.alive && (this.onDone(), this.alive = false);
  }
  isAlive() {
    return this.alive;
  }
};
var G = class extends oe {
  constructor() {
    super(...arguments);
    this.mode = "cross";
  }
};
function gr(o, e) {
  let r = m(e.plugins), t = new G({ plugins: r, refs: e.refs, disabledFeatures: e.disabledFeatures, onParse(n, a) {
    let i = new D({ plugins: r, features: t.features, scopeId: e.scopeId, markedRefs: t.marked }), l;
    try {
      l = i.serializeTop(n);
    } catch (c) {
      e.onError && e.onError(c);
      return;
    }
    e.onSerialize(l, a);
  }, onError: e.onError, onDone: e.onDone });
  return t.start(o), t.destroy.bind(t);
}
var p = {}, ee2 = Hr({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === p;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, r) {
  return r.createFunction(["d"], "new ReadableStream({start:" + r.createEffectfulFunction(["c"], "d.on({next:" + r.createEffectfulFunction(["v"], "c.enqueue(v)") + ",throw:" + r.createEffectfulFunction(["v"], "c.error(v)") + ",return:" + r.createEffectfulFunction([], "c.close()") + "})") + "})");
}, deserialize() {
  return p;
} });
function w(e) {
  let r = K(), a = e.getReader();
  async function t() {
    try {
      let n = await a.read();
      n.done ? r.return(n.value) : (r.next(n.value), await t());
    } catch (n) {
      r.throw(n);
    }
  }
  return t().catch(() => {
  }), r;
}
var re = Hr({ tag: "seroval/plugins/web/ReadableStream", extends: [ee2], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(p), stream: r.parse(K()) };
}, async async(e, r) {
  return { factory: await r.parse(p), stream: await r.parse(w(e)) };
}, stream(e, r) {
  return { factory: r.parse(p), stream: r.parse(w(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return new ReadableStream({ start(t) {
    a.on({ next(n) {
      t.enqueue(n);
    }, throw(n) {
      t.error(n);
    }, return() {
      t.close();
    } });
  } });
} }), u = re;
const minifiedTsrBootStrapScript = 'self.$_TSR={c:()=>{document.querySelectorAll(".\\\\$tsr").forEach(e=>{e.remove()})}};\n';
const ShallowErrorPlugin = /* @__PURE__ */ Hr({
  tag: "tanstack-start:seroval-plugins/Error",
  test(value) {
    return value instanceof Error;
  },
  parse: {
    sync(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    },
    async async(value, ctx) {
      return {
        message: await ctx.parse(value.message)
      };
    },
    stream(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    }
  },
  serialize(node, ctx) {
    return "new Error(" + ctx.serialize(node.message) + ")";
  },
  deserialize(node, ctx) {
    return new Error(ctx.deserialize(node.message));
  }
});
const GLOBAL_TSR = "$_TSR";
const SCOPE_ID = "tsr";
function dehydrateMatch(match2) {
  const dehydratedMatch = {
    i: match2.id,
    u: match2.updatedAt,
    s: match2.status
  };
  const properties = [
    ["__beforeLoadContext", "b"],
    ["loaderData", "l"],
    ["error", "e"],
    ["ssr", "ssr"]
  ];
  for (const [key, shorthand] of properties) {
    if (match2[key] !== void 0) {
      dehydratedMatch[shorthand] = match2[key];
    }
  }
  return dehydratedMatch;
}
function attachRouterServerSsrUtils(router2, manifest) {
  router2.ssr = {
    manifest
  };
  const serializationRefs = /* @__PURE__ */ new Map();
  let initialScriptSent = false;
  const getInitialScript = () => {
    if (initialScriptSent) {
      return "";
    }
    initialScriptSent = true;
    return `${xr(SCOPE_ID)};${minifiedTsrBootStrapScript};`;
  };
  let _dehydrated = false;
  const listeners = [];
  router2.serverSsr = {
    injectedHtml: [],
    injectHtml: (getHtml) => {
      const promise = Promise.resolve().then(getHtml);
      router2.serverSsr.injectedHtml.push(promise);
      router2.emit({
        type: "onInjectedHtml",
        promise
      });
      return promise.then(() => {
      });
    },
    injectScript: (getScript) => {
      return router2.serverSsr.injectHtml(async () => {
        const script = await getScript();
        return `<script class='$tsr'>${getInitialScript()}${script};if (typeof $_TSR !== 'undefined') $_TSR.c()<\/script>`;
      });
    },
    dehydrate: async () => {
      var _a, _b, _c;
      invariant(!_dehydrated);
      let matchesToDehydrate = router2.state.matches;
      if (router2.isShell()) {
        matchesToDehydrate = matchesToDehydrate.slice(0, 1);
      }
      const matches = matchesToDehydrate.map(dehydrateMatch);
      const dehydratedRouter = {
        manifest: router2.ssr.manifest,
        matches
      };
      const lastMatchId = (_a = matchesToDehydrate[matchesToDehydrate.length - 1]) == null ? void 0 : _a.id;
      if (lastMatchId) {
        dehydratedRouter.lastMatchId = lastMatchId;
      }
      dehydratedRouter.dehydratedData = await ((_c = (_b = router2.options).dehydrate) == null ? void 0 : _c.call(_b));
      _dehydrated = true;
      const p2 = createControlledPromise();
      gr(dehydratedRouter, {
        refs: serializationRefs,
        // TODO make plugins configurable
        plugins: [u, ShallowErrorPlugin],
        onSerialize: (data, initial) => {
          const serialized = initial ? `${GLOBAL_TSR}["router"]=` + data : data;
          router2.serverSsr.injectScript(() => serialized);
        },
        scopeId: SCOPE_ID,
        onDone: () => p2.resolve(""),
        onError: (err) => p2.reject(err)
      });
      router2.serverSsr.injectHtml(() => p2);
    },
    isDehydrated() {
      return _dehydrated;
    },
    onRenderFinished: (listener) => listeners.push(listener),
    setRenderFinished: () => {
      listeners.forEach((l) => l());
    }
  };
}
function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}
var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message2, opts = {}) {
    super(message2, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  return event.web?.request || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}
const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function getResponseStatus$1(event) {
  return event.node.res.statusCode;
}
function getResponseHeaders$1(event) {
  return event.node.res.getHeaders();
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders$1 = setResponseHeaders;
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    __publicField(this, "node");
    __publicField(this, "web");
    __publicField(this, "context", {});
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    __publicField(this, "_handled", false);
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}
function defineEventHandler$1(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventStorage = new AsyncLocalStorage();
function defineEventHandler(handler) {
  return defineEventHandler$1((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
async function runWithEvent(event, fn) {
  return eventStorage.run(event, fn);
}
function getEvent() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event;
}
const HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const getResponseStatus = createWrapperFunction(getResponseStatus$1);
const getResponseHeaders = createWrapperFunction(getResponseHeaders$1);
const setHeaders = createWrapperFunction(setHeaders$1);
const getWebRequest = createWrapperFunction(toWebRequest);
function requestHandler(handler) {
  return handler;
}
const VIRTUAL_MODULES = {
  routeTree: "tanstack-start-route-tree:v",
  startManifest: "tanstack-start-manifest:v",
  serverFnManifest: "tanstack-start-server-fn-manifest:v"
};
async function loadVirtualModule(id) {
  switch (id) {
    case VIRTUAL_MODULES.routeTree:
      return await Promise.resolve().then(() => routeTree_gen);
    case VIRTUAL_MODULES.startManifest:
      return await import('./_tanstack-start-manifest_v-B6a0fJO-.mjs');
    case VIRTUAL_MODULES.serverFnManifest:
      return await import('./_tanstack-start-server-fn-manifest_v-G5KteJe0.mjs');
    default:
      throw new Error(`Unknown virtual module: ${id}`);
  }
}
async function getStartManifest(opts) {
  const { tsrStartManifest } = await loadVirtualModule(
    VIRTUAL_MODULES.startManifest
  );
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      suppressHydrationWarning: true,
      async: true
    },
    children: script
  });
  const manifest = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k, v2]) => {
        const { preloads, assets } = v2;
        return [
          k,
          {
            preloads,
            assets
          }
        ];
      })
    )
  };
  return manifest;
}
function sanitizeBase$1(base) {
  return base.replace(/^\/|\/$/g, "");
}
const handleServerAction = async ({
  request
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const regex = new RegExp(`${sanitizeBase$1("/_serverFn")}/([^/?#]+)`);
  const match2 = url.pathname.match(regex);
  const serverFnId = match2 ? match2[1] : null;
  const search2 = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search2;
  const isRaw = "raw" in search2;
  if (typeof serverFnId !== "string") {
    throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  }
  const {
    default: serverFnManifest
  } = await loadVirtualModule(VIRTUAL_MODULES.serverFnManifest);
  const serverFnInfo = serverFnManifest[serverFnId];
  if (!serverFnInfo) {
    console.info("serverFnManifest", serverFnManifest);
    throw new Error("Server function info not found for " + serverFnId);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + serverFnId);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
  }
  const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (request.headers.get("Content-Type") && formDataContentTypes.some((type) => {
          var _a;
          return (_a = request.headers.get("Content-Type")) == null ? void 0 : _a.includes(type);
        })) {
          invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
          return await action(await request.formData(), signal);
        }
        if (method.toLowerCase() === "get") {
          let payload2 = search2;
          if (isCreateServerFn) {
            payload2 = search2.payload;
          }
          payload2 = payload2 ? startSerializer.parse(payload2) : payload2;
          return await action(payload2, signal);
        }
        const jsonPayloadAsString = await request.text();
        const payload = startSerializer.parse(jsonPayloadAsString);
        if (isCreateServerFn) {
          return await action(payload, signal);
        }
        return await action(...payload, signal);
      })();
      if (result.result instanceof Response) {
        return result.result;
      }
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) {
          return result;
        }
      }
      if (isNotFound(result)) {
        return isNotFoundResponse(result);
      }
      return new Response(result !== void 0 ? startSerializer.stringify(result) : void 0, {
        status: getResponseStatus(getEvent()),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      return new Response(startSerializer.stringify(error), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  if (isRaw) {
    return response;
  }
  return response;
};
function isNotFoundResponse(error) {
  const {
    headers,
    ...rest
  } = error;
  return new Response(JSON.stringify(rest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    getResponseHeaders(),
    {
      "Content-Type": "text/html; charset=UTF-8"
    },
    ...opts.router.state.matches.map((match2) => {
      return match2.headers;
    })
  );
  return headers;
}
function createStartHandler({
  createRouter: createRouter2
}) {
  let routeTreeModule = null;
  let startRoutesManifest = null;
  let processedServerRouteTree = void 0;
  return (cb) => {
    const originalFetch = globalThis.fetch;
    const startRequestResolver = async ({ request }) => {
      globalThis.fetch = async function(input, init) {
        function resolve(url2, requestOptions) {
          const fetchRequest = new Request(url2, requestOptions);
          return startRequestResolver({ request: fetchRequest });
        }
        function getOrigin() {
          return request.headers.get("Origin") || request.headers.get("Referer") || "http://localhost";
        }
        if (typeof input === "string" && input.startsWith("/")) {
          const url2 = new URL(input, getOrigin());
          return resolve(url2, init);
        } else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) {
          const url2 = new URL(input.url, getOrigin());
          return resolve(url2, init);
        }
        return originalFetch(input, init);
      };
      const url = new URL(request.url);
      const href = decodeURIComponent(url.href.replace(url.origin, ""));
      const APP_BASE = "/";
      const router2 = await createRouter2();
      const history = createMemoryHistory({
        initialEntries: [href]
      });
      router2.update({
        history,
        isShell: false
      });
      const response = await (async () => {
        try {
          if (false) ;
          const serverFnBase = joinPaths([
            APP_BASE,
            trimPath("/_serverFn"),
            "/"
          ]);
          if (href.startsWith(serverFnBase)) {
            return await handleServerAction({ request });
          }
          if (routeTreeModule === null) {
            try {
              routeTreeModule = await loadVirtualModule(
                VIRTUAL_MODULES.routeTree
              );
              if (routeTreeModule.serverRouteTree) {
                processedServerRouteTree = processRouteTree({
                  routeTree: routeTreeModule.serverRouteTree,
                  initRoute: (route, i) => {
                    route.init({
                      originalIndex: i
                    });
                  }
                });
              }
            } catch (e) {
              console.log(e);
            }
          }
          const executeRouter = () => runWithStartContext({ router: router2 }, async () => {
            const requestAcceptHeader = request.headers.get("Accept") || "*/*";
            const splitRequestAcceptHeader = requestAcceptHeader.split(",");
            const supportedMimeTypes = ["*/*", "text/html"];
            const isRouterAcceptSupported = supportedMimeTypes.some(
              (mimeType) => splitRequestAcceptHeader.some(
                (acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)
              )
            );
            if (!isRouterAcceptSupported) {
              return json(
                {
                  error: "Only HTML requests are supported here"
                },
                {
                  status: 500
                }
              );
            }
            if (startRoutesManifest === null) {
              startRoutesManifest = await getStartManifest({
                basePath: APP_BASE
              });
            }
            attachRouterServerSsrUtils(router2, startRoutesManifest);
            await router2.load();
            if (router2.state.redirect) {
              return router2.state.redirect;
            }
            await router2.serverSsr.dehydrate();
            const responseHeaders = getStartResponseHeaders({ router: router2 });
            const response2 = await cb({
              request,
              router: router2,
              responseHeaders
            });
            return response2;
          });
          if (processedServerRouteTree) {
            const [_matchedRoutes, response2] = await handleServerRoutes({
              processedServerRouteTree,
              router: router2,
              request,
              basePath: APP_BASE,
              executeRouter
            });
            if (response2) return response2;
          }
          const routerResponse = await executeRouter();
          return routerResponse;
        } catch (err) {
          if (err instanceof Response) {
            return err;
          }
          throw err;
        }
      })();
      if (isRedirect(response)) {
        if (isResolvedRedirect(response)) {
          if (request.headers.get("x-tsr-redirect") === "manual") {
            return json(
              {
                ...response.options,
                isSerializedRedirect: true
              },
              {
                headers: response.headers
              }
            );
          }
          return response;
        }
        if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) {
          throw new Error(
            `Server side redirects must use absolute paths via the 'href' or 'to' options. Received: ${JSON.stringify(response.options)}`
          );
        }
        if (["params", "search", "hash"].some(
          (d2) => typeof response.options[d2] === "function"
        )) {
          throw new Error(
            `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
              response.options
            ).filter((d2) => typeof response.options[d2] === "function").map((d2) => `"${d2}"`).join(", ")}`
          );
        }
        const redirect = router2.resolveRedirect(response);
        if (request.headers.get("x-tsr-redirect") === "manual") {
          return json(
            {
              ...response.options,
              isSerializedRedirect: true
            },
            {
              headers: response.headers
            }
          );
        }
        return redirect;
      }
      return response;
    };
    return requestHandler(startRequestResolver);
  };
}
async function handleServerRoutes(opts) {
  var _a, _b;
  const url = new URL(opts.request.url);
  const pathname = url.pathname;
  const serverTreeResult = getMatchedRoutes({
    pathname,
    basepath: opts.basePath,
    caseSensitive: true,
    routesByPath: opts.processedServerRouteTree.routesByPath,
    routesById: opts.processedServerRouteTree.routesById,
    flatRoutes: opts.processedServerRouteTree.flatRoutes
  });
  const routeTreeResult = opts.router.getMatchedRoutes(pathname, void 0);
  let response;
  let matchedRoutes = [];
  matchedRoutes = serverTreeResult.matchedRoutes;
  if (routeTreeResult.foundRoute) {
    if (serverTreeResult.matchedRoutes.length < routeTreeResult.matchedRoutes.length) {
      const closestCommon = [...routeTreeResult.matchedRoutes].reverse().find((r) => {
        return opts.processedServerRouteTree.routesById[r.id] !== void 0;
      });
      if (closestCommon) {
        let routeId = closestCommon.id;
        matchedRoutes = [];
        do {
          const route = opts.processedServerRouteTree.routesById[routeId];
          if (!route) {
            break;
          }
          matchedRoutes.push(route);
          routeId = (_a = route.parentRoute) == null ? void 0 : _a.id;
        } while (routeId);
        matchedRoutes.reverse();
      }
    }
  }
  if (matchedRoutes.length) {
    const middlewares = flattenMiddlewares(
      matchedRoutes.flatMap((r) => r.options.middleware).filter(Boolean)
    ).map((d2) => d2.options.server);
    if ((_b = serverTreeResult.foundRoute) == null ? void 0 : _b.options.methods) {
      const method = Object.keys(
        serverTreeResult.foundRoute.options.methods
      ).find(
        (method2) => method2.toLowerCase() === opts.request.method.toLowerCase()
      );
      if (method) {
        const handler = serverTreeResult.foundRoute.options.methods[method];
        if (handler) {
          if (typeof handler === "function") {
            middlewares.push(handlerToMiddleware(handler));
          } else {
            if (handler._options.middlewares && handler._options.middlewares.length) {
              middlewares.push(
                ...flattenMiddlewares(handler._options.middlewares).map(
                  (d2) => d2.options.server
                )
              );
            }
            if (handler._options.handler) {
              middlewares.push(handlerToMiddleware(handler._options.handler));
            }
          }
        }
      }
    }
    middlewares.push(handlerToMiddleware(opts.executeRouter));
    const ctx = await executeMiddleware(middlewares, {
      request: opts.request,
      context: {},
      params: serverTreeResult.routeParams,
      pathname
    });
    response = ctx.response;
  }
  return [matchedRoutes, response];
}
function handlerToMiddleware(handler) {
  return async ({ next: _next, ...rest }) => {
    const response = await handler(rest);
    if (response) {
      return { response };
    }
    return _next(rest);
  };
}
function executeMiddleware(middlewares, ctx) {
  let index2 = -1;
  const next = async (ctx2) => {
    index2++;
    const middleware = middlewares[index2];
    if (!middleware) return ctx2;
    const result = await middleware({
      ...ctx2,
      // Allow the middleware to call the next middleware in the chain
      next: async (nextCtx) => {
        const nextResult = await next({
          ...ctx2,
          ...nextCtx,
          context: {
            ...ctx2.context,
            ...(nextCtx == null ? void 0 : nextCtx.context) || {}
          }
        });
        return Object.assign(ctx2, handleCtxResult(nextResult));
      }
      // Allow the middleware result to extend the return context
    }).catch((err) => {
      if (isSpecialResponse(err)) {
        return {
          response: err
        };
      }
      throw err;
    });
    return Object.assign(ctx2, handleCtxResult(result));
  };
  return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return {
      response: result
    };
  }
  return result;
}
function isSpecialResponse(err) {
  return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
  return response instanceof Response;
}
function createServerFileRoute(_2) {
  return createServerRoute();
}
function createServerRoute(__, __opts) {
  const options = __opts || {};
  const route = {
    isRoot: false,
    path: "",
    id: "",
    fullPath: "",
    to: "",
    options,
    parentRoute: void 0,
    _types: {},
    // children: undefined as TChildren,
    middleware: (middlewares) => createServerRoute(void 0, {
      ...options,
      middleware: middlewares
    }),
    methods: (methodsOrGetMethods) => {
      const methods = (() => {
        if (typeof methodsOrGetMethods === "function") {
          return methodsOrGetMethods(createMethodBuilder());
        }
        return methodsOrGetMethods;
      })();
      return createServerRoute(void 0, {
        ...__opts,
        methods
      });
    },
    update: (opts) => createServerRoute(void 0, {
      ...options,
      ...opts
    }),
    init: (opts) => {
      var _a;
      options.originalIndex = opts.originalIndex;
      const isRoot = !options.path && !options.id;
      route.parentRoute = (_a = options.getParentRoute) == null ? void 0 : _a.call(options);
      if (isRoot) {
        route.path = rootRouteId;
      } else if (!route.parentRoute) {
        throw new Error(`Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a ServerRoute instance.`);
      }
      let path = isRoot ? rootRouteId : options.path;
      if (path && path !== "/") {
        path = trimPathLeft(path);
      }
      const customId = options.id || path;
      let id = isRoot ? rootRouteId : joinPaths([route.parentRoute.id === rootRouteId ? "" : route.parentRoute.id, customId]);
      if (path === rootRouteId) {
        path = "/";
      }
      if (id !== rootRouteId) {
        id = joinPaths(["/", id]);
      }
      const fullPath = id === rootRouteId ? "/" : joinPaths([route.parentRoute.fullPath, path]);
      route.path = path;
      route.id = id;
      route.fullPath = fullPath;
      route.to = fullPath;
      route.isRoot = isRoot;
    },
    _addFileChildren: (children) => {
      if (Array.isArray(children)) {
        route.children = children;
      }
      if (typeof children === "object" && children !== null) {
        route.children = Object.values(children);
      }
      return route;
    },
    _addFileTypes: () => route
  };
  return route;
}
const createServerRootRoute = createServerRoute;
const createMethodBuilder = (__opts) => {
  return {
    _options: __opts || {},
    _types: {},
    middleware: (middlewares) => createMethodBuilder({
      ...__opts,
      middlewares
    }),
    handler: (handler) => createMethodBuilder({
      ...__opts,
      handler
    })
  };
};
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createServerRpc = (functionId, serverBase, splitImportFn) => {
  invariant(
    splitImportFn);
  const sanitizedAppBase = sanitizeBase("/");
  const sanitizedServerBase = sanitizeBase(serverBase);
  const url = `${sanitizedAppBase ? `/${sanitizedAppBase}` : ``}/${sanitizedServerBase}/${functionId}`;
  return Object.assign(splitImportFn, {
    url,
    functionId
  });
};
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "TSS_APP_BASE": "/", "TSS_OUTPUT_PUBLIC_DIR": "/Users/wing/.t3/worktrees/chat/t3code-27afbea1/.output/public", "TSS_SERVER_FN_BASE": "/_serverFn", "TSS_SPA_MODE": "false", "VITE_PLUS_TOOL_RECURSION": "1", "VITE_PUBLIC_API_URL": "encrypted:BHpagrQQNEyczLQ87yz3BD37+CivBjZtPzAEJAr7hQa5ASY84psn22+FblZ/MYuvnTSl2yDmXHpGllaVZlJFUJejHoJ2Glkzb1HCFu9EvSOGdbmr9bPWRQ0frW/7pphh0A4bMPfw+JSMHG/Z7whltPOKC6TmEw==", "VITE_PUBLIC_ZERO_URL": "encrypted:BBFIm+ivTNrbSKxSDKj7M/XSiUSi02ZeQt5imECTtAyvy59+8PEPQ2zJY1GPUxKmkVVUSvFsc4kQByGJ+e1z7LUEazeTIxNIhHMGapoPsVRGf66smIxH10sRxK2P2/eEuNUQvkjzjW2wDoeifsV7PspAS8SFrg==" };
const env = createEnv({
  server: {
    ZERO_UPSTREAM_DB: z$1.string().url(),
    AI_GATEWAY_API_KEY: z$1.string().min(1),
    EXA_API_KEY: z$1.string().min(1),
    STRIPE_SECRET_KEY: z$1.string().min(1),
    STRIPE_WEBHOOK_SECRET: z$1.string().min(1),
    PRO_MONTHLY_PRICE_ID: z$1.string().min(1),
    CRON_SECRET: z$1.string().min(1),
    GOOGLE_CLIENT_ID: z$1.string().min(1),
    GOOGLE_CLIENT_SECRET: z$1.string().min(1),
    GITHUB_CLIENT_ID: z$1.string().min(1),
    GITHUB_CLIENT_SECRET: z$1.string().min(1),
    RESEND_API_KEY: z$1.string().min(1),
    REDIS_URL: z$1.string().url()
  },
  clientPrefix: "VITE_PUBLIC_",
  client: {
    VITE_PUBLIC_API_URL: z$1.string().url(),
    VITE_PUBLIC_ZERO_URL: z$1.string().url()
  },
  runtimeEnv: Object.assign({}, __vite_import_meta_env__, process.env),
  emptyStringAsUndefined: true
});
const authClient = createAuthClient({
  baseURL: env.VITE_PUBLIC_API_URL,
  plugins: [magicLinkClient(), anonymousClient(), organizationClient(), emailOTPClient()]
});
function useSession() {
  return authClient.useSession();
}
const DatabaseContext = createContext(void 0);
function DatabaseProvider({ children }) {
  const loaderData = Route$f.useLoaderData();
  const clientSession = useSession();
  const { session: session2, isPending } = useMemo(() => {
    return {
      session: clientSession.data,
      isPending: clientSession.isPending
    };
  }, [clientSession, loaderData.session]);
  const zero = useMemo(() => {
    {
      return void 0;
    }
  }, [session2]);
  useEffect(() => {
    if (!session2 && !isPending) {
      authClient.signIn.anonymous();
    }
  }, [session2, isPending]);
  useEffect(() => {
    if (zero) {
      zero.query.model.preload();
      zero.query.setting.where("userId", "=", zero.userID).preload();
      zero.query.thread.where("userId", "=", zero.userID).related("messages", (q) => q.orderBy("createdAt", "asc")).orderBy("updatedAt", "desc").preload();
    }
  }, [zero]);
  if (isPending || !session2 || !zero) {
    return null;
  }
  return /* @__PURE__ */ jsx(DatabaseContext.Provider, { value: zero, children: /* @__PURE__ */ jsx(ZeroProvider, { zero, children }) });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);
function seededRandom(seed) {
  let state = seed;
  return () => {
    const a = 1664525;
    const c = 1013904223;
    const m2 = 2 ** 32;
    state = (a * state + c) % m2;
    return state / m2;
  };
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--sidebar)",
        "--normal-text": "var(--sidebar-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};
const user = pgTable("user", {
  id: text$1("id").primaryKey(),
  name: text$1("name").notNull(),
  email: text$1("email").notNull().unique(),
  emailVerified: boolean("email_verified").$defaultFn(() => false).notNull(),
  image: text$1("image"),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  isAnonymous: boolean("is_anonymous")
});
const session = pgTable("session", {
  id: text$1("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text$1("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text$1("ip_address"),
  userAgent: text$1("user_agent"),
  userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text$1("active_organization_id")
});
const account = pgTable("account", {
  id: text$1("id").primaryKey(),
  accountId: text$1("account_id").notNull(),
  providerId: text$1("provider_id").notNull(),
  userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text$1("access_token"),
  refreshToken: text$1("refresh_token"),
  idToken: text$1("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text$1("scope"),
  password: text$1("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});
const verification = pgTable("verification", {
  id: text$1("id").primaryKey(),
  identifier: text$1("identifier").notNull(),
  value: text$1("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  )
});
const organization = pgTable("organization", {
  id: text$1("id").primaryKey(),
  name: text$1("name").notNull(),
  slug: text$1("slug").unique(),
  logo: text$1("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text$1("metadata")
});
const member = pgTable("member", {
  id: text$1("id").primaryKey(),
  organizationId: text$1("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: text$1("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull()
});
const invitation = pgTable("invitation", {
  id: text$1("id").primaryKey(),
  organizationId: text$1("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  email: text$1("email").notNull(),
  role: text$1("role"),
  status: text$1("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text$1("inviter_id").notNull().references(() => user.id, { onDelete: "cascade" })
});
const jwks = pgTable("jwks", {
  id: text$1("id").primaryKey(),
  publicKey: text$1("public_key").notNull(),
  privateKey: text$1("private_key").notNull(),
  createdAt: timestamp("created_at").notNull()
});
const authSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account,
  invitation,
  jwks,
  member,
  organization,
  session,
  user,
  verification
}, Symbol.toStringTag, { value: "Module" }));
const message = pgTable(
  "message",
  {
    id: text$1("id").primaryKey(),
    message: jsonb("message").$type().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    threadId: text$1("thread_id").notNull().references(() => thread.id, { onDelete: "cascade" }),
    userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
  },
  (table) => [
    index("message_thread_id_index").on(table.threadId),
    index("message_user_id_index").on(table.userId)
  ]
);
const statusEnum = pgEnum("status", ["ready", "streaming", "submitted"]);
const thread = pgTable(
  "thread",
  {
    id: text$1("id").primaryKey(),
    title: text$1("title"),
    status: statusEnum("status").notNull().default("ready"),
    streamId: text$1("stream_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
  },
  (table) => [
    index("stream_id_index").on(table.streamId),
    index("thread_user_id_index").on(table.userId)
  ]
);
const modelAccessEnum = pgEnum("access", ["public", "account_required", "premium_required"]);
const modelIconEnum = pgEnum("icon", [
  "anthropic",
  "claude",
  "deepseek",
  "gemini",
  "google",
  "grok",
  "meta",
  "mistral",
  "ollama",
  "openai",
  "openrouter",
  "x",
  "xai",
  "moonshot",
  "zai",
  "qwen"
]);
const model = pgTable("model", {
  id: text$1("id").primaryKey(),
  name: text$1("name").notNull(),
  model: text$1("model").notNull(),
  description: text$1("description").notNull(),
  capabilities: jsonb("capabilities").$type().notNull().default([]),
  icon: modelIconEnum("icon").notNull(),
  credits: integer("credits").notNull().default(0),
  // gateway price in micro-dollars per million tokens
  inputCost: integer("input_cost").notNull().default(0),
  outputCost: integer("output_cost").notNull().default(0),
  access: modelAccessEnum("access").notNull().default("public"),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const modeEnum = pgEnum("mode", ["light", "dark"]);
const setting = pgTable(
  "setting",
  {
    id: text$1("id").primaryKey(),
    mode: modeEnum("mode").notNull().default("dark"),
    theme: text$1("theme"),
    userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    nickname: text$1("nickname"),
    biography: text$1("biography"),
    instructions: text$1("instructions"),
    modelId: text$1("model_id").notNull().default("gpt-4o-mini"),
    pinnedModels: jsonb("pinned_models").$type().notNull().default([
      "claude-4.6-sonnet",
      "gpt-4o",
      "gpt-4o-mini",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-3.5-flash",
      "kimi-k2"
    ])
  },
  (table) => [index("setting_user_id_index").on(table.userId)]
);
const usage = pgTable(
  "usage",
  {
    id: text$1("id").primaryKey(),
    userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    credits: integer("credits").notNull().default(0),
    search: integer("search").notNull().default(0),
    research: integer("research").notNull().default(0),
    // spend in micro-dollars, reset daily
    cost: integer("cost").notNull().default(0)
  },
  (table) => [index("usage_user_id_index").on(table.userId)]
);
const userCustomer = pgTable(
  "user_customer",
  {
    id: text$1("id").primaryKey().unique(),
    userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
    subscription: jsonb("subscription").$type()
  },
  (table) => [index("user_customer_user_id_index").on(table.userId)]
);
const organizationCustomer = pgTable("organization_customer", {
  id: text$1("id").primaryKey().unique(),
  organizationId: text$1("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }).unique(),
  subscription: jsonb("subscription").$type()
});
const userCustomerRelations = relations(userCustomer, ({ one }) => ({
  user: one(user, {
    fields: [userCustomer.userId],
    references: [user.id]
  })
}));
const organizationCustomerRelations = relations(organizationCustomer, ({ one }) => ({
  organization: one(organization, {
    fields: [organizationCustomer.organizationId],
    references: [organization.id]
  })
}));
const threadRelations = relations(thread, ({ many, one }) => ({
  user: one(user, {
    fields: [thread.userId],
    references: [user.id]
  }),
  messages: many(message)
}));
const userRelations = relations(user, ({ many, one }) => ({
  threads: many(thread),
  messages: many(message),
  settings: one(setting, {
    fields: [user.id],
    references: [setting.userId]
  }),
  customer: one(userCustomer, {
    fields: [user.id],
    references: [userCustomer.userId]
  })
}));
const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id]
  })
}));
const organizationRelations = relations(organization, ({ one, many }) => ({
  customer: one(organizationCustomer, {
    fields: [organization.id],
    references: [organizationCustomer.organizationId]
  }),
  members: many(member)
}));
const settingRelations = relations(setting, ({ one }) => ({
  user: one(user, {
    fields: [setting.userId],
    references: [user.id]
  }),
  model: one(model, {
    fields: [setting.modelId],
    references: [model.id]
  })
}));
const messageRelations = relations(message, ({ one }) => ({
  thread: one(thread, {
    fields: [message.threadId],
    references: [thread.id]
  }),
  user: one(user, {
    fields: [message.userId],
    references: [user.id]
  })
}));
const appSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  memberRelations,
  message,
  messageRelations,
  modeEnum,
  model,
  modelAccessEnum,
  modelIconEnum,
  organizationCustomer,
  organizationCustomerRelations,
  organizationRelations,
  setting,
  settingRelations,
  statusEnum,
  thread,
  threadRelations,
  usage,
  userCustomer,
  userCustomerRelations,
  userRelations
}, Symbol.toStringTag, { value: "Module" }));
const schema = {
  ...authSchema,
  ...appSchema
};
const db = drizzle(env.ZERO_UPSTREAM_DB, { schema });
const CustomerId = Brand.nominal();
const UserId = Brand.nominal();
Brand.nominal();
const MagicLinkEmail = ({ url }) => /* @__PURE__ */ jsxs(Html, { children: [
  /* @__PURE__ */ jsx(Head, {}),
  /* @__PURE__ */ jsxs(Body, { style: main, children: [
    /* @__PURE__ */ jsx(Preview, { children: "Log in with this magic link" }),
    /* @__PURE__ */ jsxs(Container, { style: container, children: [
      /* @__PURE__ */ jsx(Heading, { style: h1, children: "Login" }),
      /* @__PURE__ */ jsx(
        Link$1,
        {
          href: url,
          target: "_blank",
          style: {
            ...link,
            display: "block",
            marginBottom: "16px"
          },
          children: "Click here to log in with this magic link"
        }
      ),
      /* @__PURE__ */ jsx(
        Text,
        {
          style: {
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px"
          },
          children: "If you didn't try to login, you can safely ignore this email."
        }
      )
    ] })
  ] })
] });
MagicLinkEmail.PreviewProps = {
  url: "https://zeron.sh"
};
const main = {
  backgroundColor: "#ffffff"
};
const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto"
};
const h1 = {
  color: "#333",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0"
};
const link = {
  color: "#2754C5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline"
};
const text = {
  color: "#333",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0"
};
const resend = new Resend(env.RESEND_API_KEY);
class APIError extends Data.TaggedError("APIError") {
  static map({
    status,
    message: message2,
    metadata
  }) {
    return Effect.mapError((cause) => {
      if (cause instanceof APIError) {
        return cause;
      }
      return new APIError({
        status,
        message: message2,
        metadata,
        cause
      });
    });
  }
  log = Effect.logError("API Error", {
    message: this.message,
    metadata: this.metadata,
    cause: this.cause
  });
  get response() {
    const response = Response.json(
      {
        message: this.message,
        metadata: this.metadata
      },
      { status: this.status }
    );
    const thisError = this;
    return Effect.gen(function* () {
      yield* thisError.log;
      return response;
    });
  }
}
const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  trustedOrigins: ["https://zeron.sh", "https://www.zeron.sh", "http://localhost:5173"],
  session: {
    expiresIn: 60 * 60 * 24 * 365,
    updateAge: 60 * 60 * 24
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user2) => {
          await db.transaction(async (tx) => {
            await tx.insert(schema.setting).values({
              id: nanoid$1(),
              userId: UserId(user2.id),
              mode: "dark",
              theme: "default",
              modelId: "kimi-k2"
            });
            await tx.insert(schema.usage).values({
              id: nanoid$1(),
              userId: UserId(user2.id),
              credits: 0,
              search: 0,
              research: 0
            });
          });
        }
      }
    }
  },
  plugins: [
    reactStartCookies(),
    organization$1(),
    jwt(),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        console.log({
          email,
          token,
          url
        });
        await resend.emails.send({
          from: "Zeron <no-reply@zeron.sh>",
          to: email,
          subject: "Your magic link",
          react: MagicLinkEmail({ url })
        });
      }
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log({
          email,
          otp,
          type
        });
      }
    }),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await db.update(schema.thread).set({ userId: UserId(newUser.user.id) }).where(eq(schema.thread.userId, UserId(anonymousUser.user.id)));
        await db.update(schema.message).set({ userId: UserId(newUser.user.id) }).where(eq(schema.message.userId, UserId(anonymousUser.user.id)));
      }
    })
  ]
});
const getSession = Effect.fn("getSession")(function* (request) {
  let session2 = yield* Effect.tryPromise(
    () => auth.api.getSession({
      headers: request.headers
    })
  );
  if (!session2) {
    const newUser = yield* Effect.tryPromise(() => {
      return auth.api.signInAnonymous({
        headers: request.headers,
        returnHeaders: true
      });
    });
    const setCookieHeader = newUser.headers.get("set-cookie");
    if (setCookieHeader) {
      setHeaders({
        "set-cookie": setCookieHeader
      });
    }
    const requestHeaders = new Headers(request.headers);
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(",").map((cookie) => cookie.trim());
      const cookieValues = [];
      const existingCookies = requestHeaders.get("Cookie");
      if (existingCookies) {
        cookieValues.push(existingCookies);
      }
      for (const cookie of cookies) {
        const [nameValue] = cookie.split(";");
        if (nameValue) {
          cookieValues.push(nameValue.trim());
        }
      }
      requestHeaders.set("Cookie", cookieValues.join("; "));
    }
    session2 = yield* Effect.tryPromise(() => {
      return auth.api.getSession({
        headers: requestHeaders
      });
    });
  }
  if (!session2) {
    return yield* new APIError({
      status: 401,
      message: "Unauthorized"
    });
  }
  return session2;
});
class Session extends Effect.Tag("Session")() {
}
const SessionLive = (request) => Layer.scoped(
  Session,
  Effect.gen(function* () {
    return yield* getSession(request);
  })
);
class Database extends Effect.Tag("Database")() {
  static transaction = (effect) => {
    return Effect.gen(function* () {
      const db2 = yield* Database.instance;
      const runtime = yield* Effect.runtime();
      function tranction(instance2) {
        return Runtime.runPromise(
          runtime,
          effect.pipe(
            Effect.provide(Layer.scoped(Database, Effect.succeed({ instance: instance2 })))
          )
        );
      }
      function callback() {
        return db2.transaction(tranction);
      }
      return yield* Effect.tryPromise(callback);
    });
  };
}
const DatabaseLive = Layer.scoped(Database, Effect.succeed({ instance: db }));
function getThreadById(threadId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.thread.findFirst({
        where: (thread2, { eq: eq2 }) => eq2(thread2.id, threadId)
      })
    );
  });
}
function getMessageById(messageId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.message.findFirst({
        where: (message2, { eq: eq2 }) => eq2(message2.id, messageId)
      })
    );
  });
}
function getUserById(userId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.user.findFirst({
        where: (user2, { eq: eq2 }) => eq2(user2.id, userId)
      })
    );
  });
}
function getModelById(modelId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.model.findFirst({
        where: (model2, { eq: eq2 }) => eq2(model2.id, modelId)
      })
    );
  });
}
function createThread(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.insert(schema.thread).values({
        id: values.id,
        userId: values.userId,
        status: "submitted"
      }).returning()
    );
  });
}
function createMessage(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.insert(schema.message).values({
        id: values.message.id,
        threadId: values.threadId,
        userId: values.userId,
        message: values.message,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning()
    );
  });
}
function updateMessage(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.message).set({
        message: values.message,
        updatedAt: values.updatedAt
      }).where(eq(schema.message.id, values.messageId)).returning()
    );
  });
}
function deleteTrailingMessages(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.delete(schema.message).where(
        and(
          eq(schema.message.threadId, values.threadId),
          gt(schema.message.createdAt, values.messageCreatedAt),
          not(eq(schema.message.id, values.messageId))
        )
      )
    );
  });
}
function getThreadMessageHistory(threadId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    const messages = yield* Effect.tryPromise(
      () => db2.query.message.findMany({
        where: (message2, { eq: eq2 }) => eq2(message2.threadId, threadId),
        orderBy: (message2, { asc }) => asc(message2.createdAt)
      })
    );
    return messages.map((message2) => message2.message);
  });
}
function updateThread(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.thread).set({
        status: values.status,
        streamId: values.streamId,
        updatedAt: values.updatedAt
      }).where(eq(schema.thread.id, values.threadId))
    );
  });
}
function updateThreadTitle(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.thread).set({ title: values.title, updatedAt: /* @__PURE__ */ new Date() }).where(eq(schema.thread.id, values.threadId))
    );
  });
}
function getSettingsByUserId(userId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.setting.findFirst({
        where: (setting2, { eq: eq2 }) => eq2(setting2.userId, userId),
        with: {
          model: true
        }
      })
    );
  });
}
function getUserCustomerByUserId(userId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.userCustomer.findFirst({
        where: (userCustomer2, { eq: eq2 }) => eq2(userCustomer2.userId, userId)
      })
    );
  });
}
function createUserCustomer(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.insert(schema.userCustomer).values({
        id: values.customerId,
        userId: values.userId
      }).returning()
    );
  });
}
function updateUserCustomerSubscription(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.userCustomer).set({ subscription: values.subscription }).where(eq(schema.userCustomer.id, values.customerId))
    );
  });
}
function updateOrganizationCustomerSubscription(values) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.organizationCustomer).set({ subscription: values.subscription }).where(eq(schema.organizationCustomer.id, values.customerId))
    );
  });
}
function getUsageByUserId(userId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.usage.findFirst({
        where: (usage2, { eq: eq2 }) => eq2(usage2.userId, userId)
      })
    );
  });
}
function incrementUsage$1(values, amount) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.usage).set({
        [values.type]: sql`${schema.usage[values.type]} + ${amount}`
      }).where(eq(schema.usage.userId, values.userId))
    );
  });
}
function decrementUsage$1(values, amount) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.usage).set({
        [values.type]: sql`${schema.usage[values.type]} - ${amount}`
      }).where(eq(schema.usage.userId, values.userId))
    );
  });
}
function resetUsage() {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.update(schema.usage).set({
        credits: 0,
        research: 0,
        search: 0,
        cost: 0
      }).execute()
    );
  });
}
function getThreadByIdAndUserId(threadId, userId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.thread.findFirst({
        where: (thread2, { eq: eq2, and: and2 }) => and2(eq2(thread2.id, threadId), eq2(thread2.userId, userId)),
        with: {
          messages: {
            orderBy: (message2, { asc }) => asc(message2.createdAt)
          }
        }
      })
    );
  });
}
function getThreadsByUserId(userId) {
  return Effect.gen(function* () {
    const db2 = yield* Database.instance;
    return yield* Effect.tryPromise(
      () => db2.query.thread.findMany({
        where: (thread2, { eq: eq2 }) => eq2(thread2.userId, userId),
        with: {
          messages: {
            orderBy: (message2, { asc }) => asc(message2.createdAt)
          }
        },
        limit: 20,
        orderBy: (thread2, { desc }) => desc(thread2.updatedAt)
      })
    );
  });
}
function getSSRData(id) {
  return Database.transaction(
    Effect.Do.pipe(
      Effect.bind(
        "results",
        () => Effect.all(
          [
            getSettingsByUserId(id),
            getUserCustomerByUserId(id),
            getUsageByUserId(id),
            getUserById(id),
            getThreadsByUserId(id)
          ],
          {
            concurrency: "unbounded"
          }
        )
      )
    )
  );
}
function useParamsThreadId() {
  const params = useParams({ from: "/_app/_thread/$threadId", shouldThrow: false });
  const { threadId } = params ?? { threadId: void 0 };
  return threadId;
}
function useDatabase() {
  const database = useContext(DatabaseContext);
  if (!database) {
    throw new Error("useZero must be used within a ZeroProvider");
  }
  return database;
}
function useSettings() {
  const db2 = useDatabase();
  const loaderData = Route$f.useLoaderData();
  const [settings] = useQuery(
    db2.query.setting.where("userId", "=", db2.userID).related("model").one()
  );
  return settings ?? loaderData.settings;
}
function useThreads() {
  const db2 = useDatabase();
  const loaderData = Route$f.useLoaderData();
  const [threads, result] = useQuery(
    db2.query.thread.where("userId", "=", db2.userID).related("messages", (q) => q.orderBy("createdAt", "desc")).orderBy("updatedAt", "desc"),
    {
      ttl: 60 * 60 * 24
    }
  );
  return threads.length > 0 || result.type === "complete" ? threads : loaderData.threads?.map((thread2) => ({
    ...thread2,
    createdAt: thread2.createdAt.getTime(),
    updatedAt: thread2.updatedAt.getTime()
  }))?.filter((thread2) => thread2.userId === db2.userID) ?? [];
}
function useCustomer() {
  const db2 = useDatabase();
  const loaderData = Route$f.useLoaderData();
  const [customer] = useQuery(
    db2.query.userCustomer.where("userId", "=", UserId(db2.userID)).one()
  );
  return customer ?? loaderData.customer;
}
function useUsage() {
  const db2 = useDatabase();
  const loaderData = Route$f.useLoaderData();
  const [usage2] = useQuery(db2.query.usage.where("userId", "=", UserId(db2.userID)).one());
  return usage2 ?? loaderData.usage;
}
function useThreadFromParams() {
  const threadId = useParamsThreadId();
  const db2 = useDatabase();
  const loaderData = Route$f.useLoaderData();
  const [thread2] = useQuery(
    db2.query.thread.where("id", "=", threadId ?? "").related("messages", (q) => q.orderBy("createdAt", "asc")).one(),
    {
      ttl: 60 * 60 * 24
    }
  );
  return thread2 ?? (loaderData.thread && loaderData.thread.id === threadId ? loaderData.thread : void 0);
}
function useUser() {
  const db2 = useDatabase();
  const loaderData = Route$f.useLoaderData();
  const [user2] = useQuery(db2.query.user.where("id", "=", UserId(db2.userID)).one());
  return user2 ?? loaderData.user;
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border border-foreground/10 shadow-xs hover:bg-muted hover:text-muted-foreground dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Dialog({ ...props }) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({ ...props }) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background/90 dark:bg-background/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-foreground/10 p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon$1, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
      ...props
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function Anonymous({ children }) {
  const session2 = useSession();
  if (!session2.data) {
    return null;
  }
  if (!session2.data.user.isAnonymous) {
    return null;
  }
  return children;
}
function NotAnonymous({ children }) {
  const session2 = useSession();
  if (!session2.data) {
    return null;
  }
  if (session2.data.user.isAnonymous) {
    return null;
  }
  return children;
}
function LogoutDialog({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsxs(DialogContent, { showCloseButton: false, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Logout" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Are you sure you want to logout?" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: async () => {
              await authClient.signOut();
              navigate({ to: "/logged-out" });
            },
            children: "Logout"
          }
        )
      ] })
    ] })
  ] });
}
function RevokeSessionDialog({
  children,
  token
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsxs(DialogContent, { showCloseButton: false, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Revoke Session" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Are you sure you want to revoke this session?" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: async () => {
              await authClient.revokeSession({ token });
              setOpen(false);
            },
            children: "Revoke"
          }
        )
      ] })
    ] })
  ] });
}
function ZeronIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 605 355",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "177.5", cy: "52.5", r: "52", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "302.5", cy: "52.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "177.5", cy: "177.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "427.5", cy: "177.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "302.5", cy: "302.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "52.5", cy: "302.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "427.5", cy: "302.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "552.5", cy: "177.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "552.5", cy: "302.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "552.5", cy: "177.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "552.5", cy: "302.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "552.5", cy: "52.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "177.5", cy: "52.5", r: "52", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "177.5", cy: "177.5", r: "52.5", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "52.5", cy: "52.5", r: "52", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "52.5", cy: "177.5", r: "52.5", fill: "currentColor" })
      ]
    }
  );
}
const Icon$7 = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 245,
    height: 245,
    fill: "currentColor",
    viewBox: "0 0 245 245",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        fillRule: "evenodd",
        d: "M141.151 35.933h36.78L245 204.166h-36.781zm-74.093 0h38.455l67.069 168.233h-37.505l-13.71-35.331H51.215l-13.72 35.321H0L67.069 35.953zm42.181 101.665L86.291 78.471l-22.948 59.137h45.886z",
        clipRule: "evenodd"
      }
    )
  }
);
const Icon$6 = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 245,
    height: 245,
    fill: "currentColor",
    viewBox: "0 0 245 245",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        fillRule: "evenodd",
        d: "M141.151 35.933h36.78L245 204.166h-36.781zm-74.093 0h38.455l67.069 168.233h-37.505l-13.71-35.331H51.215l-13.72 35.321H0L67.069 35.953zm42.181 101.665L86.291 78.471l-22.948 59.137h45.886z",
        clipRule: "evenodd"
      }
    )
  }
);
function DeepSeekIcon(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      children: /* @__PURE__ */ jsx("path", { d: "M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" })
    }
  );
}
const Icon$5 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    fill: "currentColor",
    ...props,
    children: [
      /* @__PURE__ */ jsx("g", { clipPath: "url(#gemini)", children: /* @__PURE__ */ jsx("path", { d: "M32 64A38.14 38.14 0 0 0 0 32 38.14 38.14 0 0 0 32 0a38.15 38.15 0 0 0 32 32 38.15 38.15 0 0 0-32 32" }) }),
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "gemini", children: /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M0 0h64v64H0z" }) }) })
    ]
  }
);
const Icon$4 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 221,
    height: 221,
    fill: "currentColor",
    viewBox: "0 0 221 221",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", { d: "M211.792 112.756c0-8.334-.691-14.411-2.173-20.719h-97.056v37.598h56.962c-1.141 9.337-7.339 23.407-21.124 32.864l-.193 1.253 30.682 23.297 2.118.202c19.54-17.661 30.784-43.666 30.784-74.495" }),
      /* @__PURE__ */ jsx("path", { d: "M112.572 211.792c27.901 0 51.327-9.006 68.445-24.54L148.401 162.5c-8.729 5.967-20.442 10.129-35.829 10.129a62.11 62.11 0 0 1-58.805-42.101l-1.215.102-31.907 24.199-.414 1.142c16.998 33.085 51.916 55.821 92.341 55.821" }),
      /* @__PURE__ */ jsx("path", { d: "M53.777 130.528a61.2 61.2 0 0 1-3.472-20.028c0-6.98 1.27-13.73 3.324-20.028l-.055-1.353-32.303-24.587-1.059.498A99.7 99.7 0 0 0 9.208 110.5c0 16.317 4.015 31.741 11.023 45.471z" }),
      /* @__PURE__ */ jsx("path", { d: "M112.572 48.372c19.411 0 32.496 8.213 39.964 15.083l29.163-27.91c-17.91-16.318-41.226-26.336-69.127-26.336-40.434 0-75.343 22.735-92.341 55.82l33.426 25.443a62.34 62.34 0 0 1 58.915-42.1" })
    ]
  }
);
const Icon$3 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    fill: "currentColor",
    ...props,
    children: [
      /* @__PURE__ */ jsx("g", { clipPath: "url(#grok)", children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "m24.72 40.773 21.275-15.725c1.042-.773 2.533-.472 3.032.725 2.613 6.318 1.445 13.907-3.76 19.118-5.203 5.21-12.446 6.352-19.064 3.749l-7.23 3.352c10.371 7.096 22.963 5.341 30.832-2.541 6.243-6.251 8.176-14.771 6.368-22.454l.016.019c-2.621-11.285.646-15.797 7.334-25.021q.24-.327.477-.662l-8.803 8.814v-.027L24.712 40.779m-4.384 3.816c-7.445-7.12-6.16-18.136.19-24.491 4.695-4.701 12.391-6.621 19.109-3.8l7.213-3.333c-1.5-1.103-3.14-2-4.877-2.667a23.93 23.93 0 0 0-26.006 5.243c-6.754 6.762-8.88 17.162-5.232 26.037 2.726 6.632-1.741 11.323-6.24 16.059C2.888 59.323 1.288 61 0 62.776l20.32-18.173",
          clipRule: "evenodd"
        }
      ) }),
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "grok", children: /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M0 0h64v64H0z" }) }) })
    ]
  }
);
function MetaIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 192,
      height: 192,
      viewBox: "0 0 192 192",
      fill: "currentColor",
      ...props,
      children: [
        /* @__PURE__ */ jsxs("g", { clipPath: "url(#meta)", children: [
          /* @__PURE__ */ jsx("path", { d: "M55.176 32h-.192l-.248 20.92h.176c13.72 0 24.368 10.856 47.52 49.968l1.4 2.376.096.16 12.96-19.504-.096-.152a390 390 0 0 0-8.784-13.728 224 224 0 0 0-9.4-13.032C83.304 39.456 70.504 32 55.176 32" }),
          /* @__PURE__ */ jsx("path", { d: "M54.984 32C39.6 32.08 25.976 42.064 16.16 57.36l-.08.136 18.032 9.848.088-.136c5.744-8.664 12.88-14.192 20.544-14.28h.168L55.168 32z" }),
          /* @__PURE__ */ jsx("path", { d: "m16.152 57.36-.088.136C9.6 67.576 4.784 79.96 2.192 93.312l-.04.176 20.272 4.8.032-.176c2.16-11.736 6.288-22.624 11.648-30.76l.088-.136z" }),
          /* @__PURE__ */ jsx("path", { d: "m22.456 98.112-20.264-4.8-.04.176A119 119 0 0 0 0 115.776v.184l20.784 1.864v-.184a100.7 100.7 0 0 1 1.68-19.52z" }),
          /* @__PURE__ */ jsx("path", { d: "M21.416 124.296a44 44 0 0 1-.632-6.504v-.176L0 115.744v.192a71 71 0 0 0 1.168 13.216l20.28-4.68z" }),
          /* @__PURE__ */ jsx("path", { d: "M26.16 135.12c-2.272-2.48-3.872-6.048-4.712-10.624l-.032-.168-20.28 4.68.032.168c1.536 8.08 4.544 14.8 8.848 19.896l.112.136 16.144-13.96c-.04-.042-.072-.085-.112-.128" }),
          /* @__PURE__ */ jsx("path", { d: "M86.24 77.232c-12.224 18.8-19.632 30.6-19.632 30.6-16.28 25.6-21.912 31.336-30.968 31.336a12.37 12.37 0 0 1-9.488-4.064l-16.136 13.952.112.136C16.08 156.144 24.464 160 34.848 160c15.704 0 26.992-7.424 47.072-42.64l14.128-25.04a330 330 0 0 0-9.808-15.088" }),
          /* @__PURE__ */ jsx("path", { d: "m108.016 47.568-.128.128c-3.2 3.44-6.288 7.264-9.28 11.328 3.024 3.864 6.144 8.192 9.4 13.04 3.84-5.944 7.424-10.76 10.936-14.456l.128-.128z" }),
          /* @__PURE__ */ jsx("path", { d: "M167.344 45.704C158.824 37.064 148.664 32 137.8 32c-11.456 0-21.096 6.296-29.784 15.552l-.128.128 11.056 9.92.128-.136c5.72-5.976 11.264-8.96 17.408-8.96 6.608 0 12.8 3.12 18.16 8.6l.12.128 12.712-11.4z" }),
          /* @__PURE__ */ jsx("path", { d: "M191.984 113c-.48-27.736-10.16-52.528-24.512-67.168l-.128-.128-12.704 11.392.12.128c10.8 11.136 18.216 31.84 18.888 55.768v.184h18.336z" }),
          /* @__PURE__ */ jsx("path", { d: "M191.984 113.2v-.184h-18.336v.176c.032 1.12.048 2.256.048 3.392 0 6.52-.968 11.792-2.944 15.6l-.088.176 13.664 14.256.104-.16c4.96-7.68 7.568-18.344 7.568-31.28 0-.664 0-1.32-.016-1.976" }),
          /* @__PURE__ */ jsx("path", { d: "m170.752 132.16-.088.16c-1.712 3.216-4.152 5.36-7.336 6.296l6.224 19.696a28 28 0 0 0 3.504-1.456 28.46 28.46 0 0 0 10.928-9.744l.352-.52.096-.16z" }),
          /* @__PURE__ */ jsx("path", { d: "M159.36 139.144c-2.096 0-3.936-.312-5.744-1.12l-6.384 20.176c3.592 1.224 7.416 1.776 11.68 1.776 3.936 0 7.544-.584 10.816-1.72l-6.24-19.696c-1.336.4-2.72.6-4.128.584" }),
          /* @__PURE__ */ jsx("path", { d: "m146.584 132.272-.112-.136-14.688 15.312.128.136c5.096 5.456 9.968 8.84 15.496 10.696l6.376-20.16c-2.328-1-4.584-2.824-7.2-5.848" }),
          /* @__PURE__ */ jsx("path", { d: "M146.472 132.12c-4.4-5.136-9.856-13.696-18.424-27.52L116.88 85.912l-.088-.16-12.96 19.504.096.16 7.912 13.344c7.672 12.88 13.92 22.192 19.944 28.68l.128.128 14.672-15.312z" })
        ] }),
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "meta", children: /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M0 0h192v192H0z" }) }) })
      ]
    }
  );
}
const Icon$2 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    fill: "currentColor",
    ...props,
    children: [
      /* @__PURE__ */ jsxs("g", { clipPath: "url(#mistral)", children: [
        /* @__PURE__ */ jsx("path", { d: "M9.141 9.067h9.144v9.141H9.141zm36.571 0h9.147v9.141h-9.147z" }),
        /* @__PURE__ */ jsx("path", { d: "M9.141 18.208h18.286v9.144H9.144zm27.43 0h18.285v9.144H36.571z" }),
        /* @__PURE__ */ jsx("path", { d: "M9.141 27.355H54.86v9.141H9.14z" }),
        /* @__PURE__ */ jsx("path", { d: "M9.141 36.496h9.144v9.141H9.141zm18.288 0h9.144v9.141H27.43zm18.283 0h9.147v9.141h-9.147z" }),
        /* @__PURE__ */ jsx("path", { d: "M0 45.637h27.43v9.144H0zm36.57 0H64v9.144H36.57z" })
      ] }),
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "mistral", children: /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M0 0h64v64H0z" }) }) })
    ]
  }
);
const Icon$1 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    fill: "currentColor",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", { d: "M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 4c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z" }),
      /* @__PURE__ */ jsx("circle", { cx: "32", cy: "32", r: "12" }),
      /* @__PURE__ */ jsx("circle", { cx: "32", cy: "32", r: "6", fill: "white" })
    ]
  }
);
const Icon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    fill: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        fillRule: "evenodd",
        d: "M57.467 26.677a14.44 14.44 0 0 0-1.275-12.002C52.947 9.1 46.427 6.232 40.059 7.58a14.9 14.9 0 0 0-11.176-4.914c-6.51-.014-12.286 4.122-14.288 10.234a14.8 14.8 0 0 0-9.902 7.088 14.63 14.63 0 0 0 1.843 17.334 14.44 14.44 0 0 0 1.272 12.005c3.245 5.573 9.765 8.44 16.133 7.093a14.9 14.9 0 0 0 11.174 4.912c6.514.016 12.293-4.122 14.296-10.24A14.8 14.8 0 0 0 59.317 44a14.63 14.63 0 0 0-1.848-17.325zM35.117 57.5a11.2 11.2 0 0 1-7.133-2.544c.09-.048.248-.134.352-.198l11.84-6.746a1.89 1.89 0 0 0 .97-1.662V29.88l5.006 2.85a.18.18 0 0 1 .096.134v13.64c-.008 6.064-4.987 10.981-11.13 10.995M11.18 47.413a10.82 10.82 0 0 1-1.328-7.368c.085.054.24.147.349.208L22.04 47c.6.347 1.344.347 1.947 0l14.453-8.235v5.702a.18.18 0 0 1-.072.152L26.4 51.435c-5.33 3.029-12.139 1.226-15.219-4.027zM8.06 21.91a11.07 11.07 0 0 1 5.8-4.816l-.005.403v13.493a1.9 1.9 0 0 0 .97 1.664l14.454 8.232-5.003 2.854a.18.18 0 0 1-.168.013l-11.97-6.824c-5.32-3.04-7.144-9.755-4.08-15.013zm41.112 9.44L34.72 23.115l5.003-2.848a.18.18 0 0 1 .168-.016l11.97 6.818c5.328 3.04 7.155 9.766 4.078 15.022a11.1 11.1 0 0 1-5.798 4.818V33.013a1.89 1.89 0 0 0-.968-1.661zm4.979-7.394q-.175-.106-.352-.208L41.96 17a1.95 1.95 0 0 0-1.944 0l-14.453 8.235v-5.702a.18.18 0 0 1 .072-.152L37.6 12.568c5.333-3.032 12.147-1.227 15.219 4.035a10.87 10.87 0 0 1 1.333 7.352m-31.31 10.16-5.005-2.848a.17.17 0 0 1-.096-.136V17.49c.003-6.072 4.995-10.992 11.15-10.987 2.602 0 5.12.901 7.122 2.544a10 10 0 0 0-.349.195l-11.84 6.746a1.89 1.89 0 0 0-.973 1.662l-.008 16.461zm2.72-5.782L32 24.667l6.437 3.666v7.334L32 39.333l-6.44-3.666v-7.334z",
        clipRule: "evenodd"
      }
    )
  }
);
const OpenRouterIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    height: 64,
    width: 64,
    viewBox: "0 0 64 64",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        fillRule: "evenodd",
        d: "M42.01 4.893l18.05 10.263v0.218l-18.235 10.153 0.043-5.293-2.053-0.075c-2.648-0.07-4.028 0.005-5.67 0.275-2.66 0.438-5.095 1.443-7.868 3.38l-5.415 3.743c-0.71 0.488-1.238 0.84-1.7 1.138l-1.288 0.805-0.993 0.585 0.963 0.575 1.325 0.845c1.19 0.785 2.925 1.99 6.753 4.665 2.775 1.938 5.208 2.943 7.868 3.38l0.75 0.113c1.735 0.228 3.438 0.235 7.063 0.083l0.055-5.398 18.05 10.263v0.218L41.473 55l0.035-4.655-1.588 0.055c-3.465 0.105-5.343 0.005-7.845-0.405-4.235-0.7-8.15-2.315-12.203-5.148l-5.395-3.75a54.993 54.993 0 01-1.888-1.245l-1.168-0.7a139.818 139.818 0 01-1.9-1.075C7.27 36.825 1.408 35.29 0 35.29V24.72l0.35 0.01c1.41-0.018 7.275-1.555 9.523-2.81l2.54-1.45 1.095-0.685c1.07-0.7 2.68-1.815 6.715-4.633 4.053-2.833 7.965-4.45 12.203-5.148 2.88-0.475 4.935-0.533 9.535-0.345l0.05-4.768z",
        clipRule: "evenodd"
      }
    )
  }
);
function XIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      role: "img",
      viewBox: "0 0 24 24",
      width: 24,
      height: 24,
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      children: [
        /* @__PURE__ */ jsx("title", { children: "X" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            fillRule: "evenodd",
            d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
            clipRule: "evenodd"
          }
        )
      ]
    }
  );
}
function XaiIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      fillRule: "evenodd",
      height: 24,
      viewBox: "0 0 24 24",
      width: 24,
      ...props,
      children: [
        /* @__PURE__ */ jsx("title", { children: "Grok" }),
        /* @__PURE__ */ jsx("path", { d: "M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z" })
      ]
    }
  );
}
function MoonshotIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      height: 24,
      viewBox: "0 0 24 24",
      width: 24,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx("title", { children: "MoonshotAI" }),
        /* @__PURE__ */ jsx("path", { d: "M1.052 16.916l9.539 2.552a21.007 21.007 0 00.06 2.033l5.956 1.593a11.997 11.997 0 01-5.586.865l-.18-.016-.044-.004-.084-.009-.094-.01a11.605 11.605 0 01-.157-.02l-.107-.014-.11-.016a11.962 11.962 0 01-.32-.051l-.042-.008-.075-.013-.107-.02-.07-.015-.093-.019-.075-.016-.095-.02-.097-.023-.094-.022-.068-.017-.088-.022-.09-.024-.095-.025-.082-.023-.109-.03-.062-.02-.084-.025-.093-.028-.105-.034-.058-.019-.08-.026-.09-.031-.066-.024a6.293 6.293 0 01-.044-.015l-.068-.025-.101-.037-.057-.022-.08-.03-.087-.035-.088-.035-.079-.032-.095-.04-.063-.028-.063-.027a5.655 5.655 0 01-.041-.018l-.066-.03-.103-.047-.052-.024-.096-.046-.062-.03-.084-.04-.086-.044-.093-.047-.052-.027-.103-.055-.057-.03-.058-.032a6.49 6.49 0 01-.046-.026l-.094-.053-.06-.034-.051-.03-.072-.041-.082-.05-.093-.056-.052-.032-.084-.053-.061-.039-.079-.05-.07-.047-.053-.035a7.785 7.785 0 01-.054-.036l-.044-.03-.044-.03a6.066 6.066 0 01-.04-.028l-.057-.04-.076-.054-.069-.05-.074-.054-.056-.042-.076-.057-.076-.059-.086-.067-.045-.035-.064-.052-.074-.06-.089-.073-.046-.039-.046-.039a7.516 7.516 0 01-.043-.037l-.045-.04-.061-.053-.07-.062-.068-.06-.062-.058-.067-.062-.053-.05-.088-.084a13.28 13.28 0 01-.099-.097l-.029-.028-.041-.042-.069-.07-.05-.051-.05-.053a6.457 6.457 0 01-.168-.179l-.08-.088-.062-.07-.071-.08-.042-.049-.053-.062-.058-.068-.046-.056a7.175 7.175 0 01-.027-.033l-.045-.055-.066-.082-.041-.052-.05-.064-.02-.025a11.99 11.99 0 01-1.44-2.402zm-1.02-5.794l11.353 3.037a20.468 20.468 0 00-.469 2.011l10.817 2.894a12.076 12.076 0 01-1.845 2.005L.657 15.923l-.016-.046-.035-.104a11.965 11.965 0 01-.05-.153l-.007-.023a11.896 11.896 0 01-.207-.741l-.03-.126-.018-.08-.021-.097-.018-.081-.018-.09-.017-.084-.018-.094c-.026-.141-.05-.283-.071-.426l-.017-.118-.011-.083-.013-.102a12.01 12.01 0 01-.019-.161l-.005-.047a12.12 12.12 0 01-.034-2.145zm1.593-5.15l11.948 3.196c-.368.605-.705 1.231-1.01 1.875l11.295 3.022c-.142.82-.368 1.612-.668 2.365l-11.55-3.09L.124 10.26l.015-.1.008-.049.01-.067.015-.087.018-.098c.026-.148.056-.295.088-.442l.028-.124.02-.085.024-.097c.022-.09.045-.18.07-.268l.028-.102.023-.083.03-.1.025-.082.03-.096.026-.082.031-.095a11.896 11.896 0 011.01-2.232zm4.442-4.4L17.352 4.59a20.77 20.77 0 00-1.688 1.721l7.823 2.093c.267.852.442 1.744.513 2.665L2.106 5.213l.045-.065.027-.04.04-.055.046-.065.055-.076.054-.072.064-.086.05-.065.057-.073.055-.07.06-.074.055-.069.065-.077.054-.066.066-.077.053-.06.072-.082.053-.06.067-.074.054-.058.073-.078.058-.06.063-.067.168-.17.1-.098.059-.056.076-.071a12.084 12.084 0 012.272-1.677zM12.017 0h.097l.082.001.069.001.054.002.068.002.046.001.076.003.047.002.06.003.054.002.087.005.105.007.144.011.088.007.044.004.077.008.082.008.047.005.102.012.05.006.108.014.081.01.042.006.065.01.207.032.07.012.065.011.14.026.092.018.11.022.046.01.075.016.041.01L14.7.3l.042.01.065.015.049.012.071.017.096.024.112.03.113.03.113.032.05.015.07.02.078.024.073.023.05.016.05.016.076.025.099.033.102.036.048.017.064.023.093.034.11.041.116.045.1.04.047.02.06.024.041.018.063.026.04.018.057.025.11.048.1.046.074.035.075.036.06.028.092.046.091.045.102.052.053.028.049.026.046.024.06.033.041.022.052.029.088.05.106.06.087.051.057.034.053.032.096.059.088.055.098.062.036.024.064.041.084.056.04.027.062.042.062.043.023.017c.054.037.108.075.161.114l.083.06.065.048.056.043.086.065.082.064.04.03.05.041.086.069.079.065.085.071c.712.6 1.353 1.283 1.909 2.031L7.222.994l.062-.027.065-.028.081-.034.086-.035c.113-.045.227-.09.341-.131l.096-.035.093-.033.084-.03.096-.031c.087-.03.176-.058.264-.085l.091-.027.086-.025.102-.03.085-.023.1-.026L9.04.37l.09-.023.091-.022.095-.022.09-.02.098-.021.091-.02.095-.018.092-.018.1-.018.091-.016.098-.017.092-.014.097-.015.092-.013.102-.013.091-.012.105-.012.09-.01.105-.01c.093-.01.186-.018.28-.024l.106-.008.09-.005.11-.006.093-.004.1-.004.097-.002.099-.002.197-.002z" })
      ]
    }
  );
}
function ZaiIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      version: "1.1",
      viewBox: "0 0 2000 1700",
      fill: "currentColor",
      className: "h-full w-full",
      ...props,
      children: [
        /* @__PURE__ */ jsx("polygon", { points: "1008.73 0 827.29 251.03 54.43 251.03 235.74 0 1008.73 0" }),
        /* @__PURE__ */ jsx("polygon", { points: "1937.79 1449.1 1756.47 1700 986.3 1700 1167.48 1449.1 1937.79 1449.1" }),
        /* @__PURE__ */ jsx("polygon", { points: "2000 0 771.98 1700 0 1700 1228.02 0 2000 0" })
      ]
    }
  );
}
function QwenIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className: "h-full w-full",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      children: [
        /* @__PURE__ */ jsx("title", { children: "Qwen" }),
        /* @__PURE__ */ jsx("path", { d: "M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z" })
      ]
    }
  );
}
const ModelIcon = ({ model: model2, ...props }) => {
  const icons = {
    anthropic: Icon$7,
    claude: Icon$6,
    deepseek: DeepSeekIcon,
    gemini: Icon$5,
    google: Icon$4,
    grok: Icon$3,
    meta: MetaIcon,
    mistral: Icon$2,
    ollama: Icon$1,
    openai: Icon,
    openrouter: OpenRouterIcon,
    x: XIcon,
    xai: XaiIcon,
    zai: ZaiIcon,
    moonshot: MoonshotIcon,
    qwen: QwenIcon
  };
  const Icon$8 = icons[model2];
  if (!Icon$8) {
    return null;
  }
  return /* @__PURE__ */ jsx(Icon$8, { ...props });
};
const dialogStore = createWithEqualityFn()(
  devtools(
    subscribeWithSelector((set) => ({
      proDialog: {
        open: false,
        setOpen: (open) => {
          set((state) => ({ ...state, proDialog: { ...state.proDialog, open } }));
        }
      }
    }))
  )
);
function ProDialog() {
  const { proDialog } = dialogStore();
  const location = useLocation();
  useEffect(() => {
    proDialog.setOpen(false);
  }, [location.pathname]);
  return /* @__PURE__ */ jsx(Dialog, { open: proDialog.open, onOpenChange: proDialog.setOpen, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: "p-0 overflow-hidden gap-0 bg-background",
      showCloseButton: false,
      children: [
        /* @__PURE__ */ jsx(DialogHeader, { className: "p-2", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full p-4 rounded-md text-white overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-[url('/paywall.png')] bg-cover bg-top scale-x-[-1] rounded-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 backdrop-blur-xs" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_theme(colors.yellow.300),_theme(colors.black),_theme(colors.black))] opacity-30" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ZeronIcon, { className: "size-8" }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: "PRO" })
            ] }),
            /* @__PURE__ */ jsx(DialogDescription, { asChild: true, className: "text-white/90", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: "$25" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white/80", children: "/month" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-white/70 text-left", children: "Upgrade to PRO to unlock all features and get access to premium models and higher limits for research, search, and more." }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
                /* @__PURE__ */ jsx(ModelIcon, { model: "openai", className: "size-4" }),
                /* @__PURE__ */ jsx(ModelIcon, { model: "anthropic", className: "size-4" }),
                /* @__PURE__ */ jsx(ModelIcon, { model: "gemini", className: "size-4" }),
                /* @__PURE__ */ jsx(ModelIcon, { model: "grok", className: "size-4" }),
                /* @__PURE__ */ jsx(ModelIcon, { model: "deepseek", className: "size-4" }),
                /* @__PURE__ */ jsx("span", { className: "line-through text-white/70", children: "$115.00" }),
                /* @__PURE__ */ jsx(MoveRightIcon, { className: "size-3" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "$25.00" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-white/70 mt-2 text-left", children: "Save over 70% on chat subscriptions by using Zeron" })
            ] }) }),
            /* @__PURE__ */ jsx(Anonymous, { children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                className: "backdrop-blur-md bg-white/80 border border-white/10 text-black/80 hover:bg-white/90",
                asChild: true,
                children: /* @__PURE__ */ jsx(Link, { to: "/login", search: { callbackUrl: "/api/checkout" }, children: "Get Started" })
              }
            ) }),
            /* @__PURE__ */ jsx(NotAnonymous, { children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                className: "backdrop-blur-md bg-white/80 border border-white/10 text-black/80 hover:bg-white/90",
                onClick: () => {
                  const url = new URL(
                    "/api/checkout",
                    window.location.origin
                  );
                  url.searchParams.set(
                    "redirectUrl",
                    window.location.origin + "/account/subscription"
                  );
                  window.location.href = url.toString();
                },
                children: "Get Started"
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-6 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(CheckIcon, { className: "size-3" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground/70", children: [
              "Access to ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "PRO" }),
              " models"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(CheckIcon, { className: "size-3" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground/70", children: "Access to research tool" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(CheckIcon, { className: "size-3" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground/70", children: "Higher limits for search" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(CheckIcon, { className: "size-3" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground/70", children: "10x daily usage allowance" })
          ] }),
          /* @__PURE__ */ jsxs(Anonymous, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1 border-b border-foreground/10" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/50", children: "OR" }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 border-b border-foreground/10" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-sm text-foreground/70 items-center", children: [
              /* @__PURE__ */ jsx(DiamondIcon, { className: "size-3" }),
              /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "Create account" }),
                " ",
                "to get higher daily usage and access to more models."
              ] })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
const GetContextSchema = z$1.object({
  threadId: z$1.string().optional()
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
      session: session2
    }) => getSSRData(session2.user.id)), Effect.bind("thread", ({
      session: session2
    }) => {
      if (data.threadId) {
        return getThreadByIdAndUserId(data.threadId, session2.user.id);
      }
      return Effect.succeed(null);
    }), Effect.bind("end", () => Clock.currentTimeMillis), Effect.tap(({
      now,
      end
    }) => Effect.log(`SSR Duration: ${end - now}ms`)), Effect.provide(SessionLive(request)));
  }), Effect.map(({
    context,
    session: session2,
    thread: thread2
  }) => ({
    session: session2,
    thread: thread2,
    settings: context.results[0],
    customer: context.results[1],
    usage: context.results[2],
    user: context.results[3],
    threads: context.results[4]
  })), Effect.provide(DatabaseLive), Effect.catchAll((_2) => Effect.succeed(void 0)));
  return Effect.runPromise(program);
});
const Route$f = createRootRoute({
  shouldReload: false,
  loader: async ({
    params
  }) => {
    const context = await getContext({
      data: params
    });
    return {
      settings: context?.settings,
      session: context?.session,
      threads: context?.threads,
      customer: context?.customer,
      usage: context?.usage,
      user: context?.user,
      thread: context?.thread
    };
  },
  head: (ctx) => ({
    meta: [{
      charSet: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, {
      title: ctx?.loaderData?.thread?.title ?? "Zeron"
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
  }),
  notFoundComponent: () => /* @__PURE__ */ jsx("div", { children: "Not found" }),
  component: () => /* @__PURE__ */ jsx(RootDocument, {})
});
function RootComponent({
  htmlRef
}) {
  const settings = useSettings();
  const mountedRef = useRef(false);
  useEffect(() => {
    if (htmlRef.current) {
      htmlRef.current.className = cn(settings?.mode ?? "dark", settings?.theme ?? "default");
    }
  }, [settings?.mode, settings?.theme]);
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
function RootDocument() {
  const ref = useRef(null);
  const loaderData = Route$f.useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "en", ref, className: cn(loaderData?.settings?.mode ?? "dark", loaderData?.settings?.theme ?? "default"), children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "fixed inset-0", children: [
      /* @__PURE__ */ jsx(DatabaseProvider, { children: /* @__PURE__ */ jsx(RootComponent, { htmlRef: ref }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$e = () => import('./_team-CRhcWSDo.mjs');
const Route$e = createFileRoute("/_team")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import('./_app-CpvIhd4A.mjs');
const Route$d = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import('./_account-CRhcWSDo.mjs');
const Route$c = createFileRoute("/_account")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import('./_app._thread-DUiXLWnn.mjs');
const Route$b = createFileRoute("/_app/_thread")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import('./_account.magic-link-BXEqqSUU.mjs');
const Route$a = createFileRoute("/_account/magic-link")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import('./_account.logged-out-DEfI_Thc.mjs');
const Route$9 = createFileRoute("/_account/logged-out")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import('./_account.account-MTvFHV6m.mjs');
const Route$8 = createFileRoute("/_account/account")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import('./_app._thread.index-BD5LYWc1.mjs');
const Route$7 = createFileRoute("/_app/_thread/")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import('./_account.login.index-CA2fzYyv.mjs');
const Route$6 = createFileRoute("/_account/login/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  validateSearch: zodValidator(z$2.object({
    callbackUrl: z$2.string().optional().catch("/")
  }))
});
const $$splitComponentImporter$5 = () => import('./_account.account.index-DHkY7EoT.mjs');
const Route$5 = createFileRoute("/_account/account/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import('./_app._thread._threadId-Bn_5Jy5Y.mjs');
const Route$4 = createFileRoute("/_app/_thread/$threadId")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import('./_account.account.subscription-JElZZ69C.mjs');
const Route$3 = createFileRoute("/_account/account/subscription")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import('./_account.account.preferences-85Zu96m6.mjs');
const Route$2 = createFileRoute("/_account/account/preferences")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import('./_account.account.models-Ddbl44SV.mjs');
const Route$1 = createFileRoute("/_account/account/models")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import('./_account.account.appearance-BRtoRSdX.mjs');
const Route = createFileRoute("/_account/account/appearance")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ServerRoute$9 = createServerFileRoute().methods({
  GET: ({
    request
  }) => {
    return handlers(request);
  },
  POST: ({
    request
  }) => {
    return handlers(request);
  }
});
const f = createUploadthing();
const router = {
  fileUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5
    },
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 5
    },
    text: {
      maxFileSize: "8MB",
      maxFileCount: 5
    }
  }).onUploadComplete(({
    metadata,
    file
  }) => {
    return {};
  })
};
const handlers = createRouteHandler({
  router
});
const exa = new Exa(env.EXA_API_KEY);
async function search(query) {
  try {
    const response = await exa.searchAndContents(query, {
      summary: true
    });
    return {
      query,
      results: response.results.map((result) => ({
        title: result.title,
        url: result.url,
        description: result.summary,
        image: result.image
      }))
    };
  } catch (error) {
    return {
      query,
      results: []
    };
  }
}
async function readSite(url) {
  try {
    const response = await exa.getContents(url);
    const result = response.results[0];
    if (!result) {
      return {
        url,
        text: ""
      };
    }
    return {
      url,
      text: result.text
    };
  } catch (error) {
    return {
      url,
      text: ""
    };
  }
}
const MICRO_DOLLARS = 1e6;
const SEARCH_COST = 5e3;
const RESEARCH_COST = 1e5;
const AnonymousLimits = {
  BUDGET: 0.25 * MICRO_DOLLARS,
  RESEARCH_ENABLED: false
};
const FreeLimits = {
  BUDGET: 1 * MICRO_DOLLARS,
  RESEARCH_ENABLED: false
};
const ProLimits = {
  BUDGET: 10 * MICRO_DOLLARS,
  RESEARCH_ENABLED: true
};
let streamContext = void 0;
function getStreamContext() {
  if (!streamContext) {
    streamContext = createResumableStreamContext({
      waitUntil
    });
  }
  return streamContext;
}
function prepareThreadContext(args) {
  const effects = Effect.all(
    [
      getThreadById(args.threadId),
      getMessageById(args.message.id),
      getModelById(args.modelId),
      getSettingsByUserId(args.userId),
      getUsageByUserId(args.userId),
      getUserCustomerByUserId(args.userId)
    ],
    {
      concurrency: "unbounded"
    }
  );
  const effect = Effect.gen(function* () {
    yield* Effect.logInfo("Preparing thread context");
    let [thread2, message2, model2, settings, usage2, customer] = yield* effects;
    if (!settings) {
      return yield* new APIError({
        status: 404,
        message: "Settings for user (userId) does not exist"
      });
    }
    if (!usage2) {
      return yield* new APIError({
        status: 404,
        message: "Usage for user (userId) does not exist"
      });
    }
    if (!model2) {
      return yield* new APIError({
        status: 404,
        message: "Model with (modelId) does not exist"
      });
    }
    if (!thread2) {
      yield* Effect.logInfo("Creating thread");
      [thread2] = yield* createThread({
        id: args.threadId,
        userId: args.userId
      });
    }
    if (thread2.status === "streaming") {
      return yield* new APIError({
        status: 400,
        message: "Thread is already streaming"
      });
    }
    if (thread2.userId !== args.userId) {
      return yield* new APIError({
        status: 403,
        message: "User is not the owner of the thread"
      });
    }
    const limits = getLimits({
      customer,
      isAnonymous: args.isAnonymous
    });
    if ((usage2.cost || 0) >= limits.BUDGET) {
      return yield* new APIError({
        status: 403,
        message: "You have reached your daily usage limit."
      });
    }
    yield* Effect.logInfo("Update thread status to streaming");
    yield* updateThread({
      threadId: args.threadId,
      status: "streaming",
      streamId: args.streamId,
      updatedAt: /* @__PURE__ */ new Date()
    });
    if (message2) {
      yield* Effect.logInfo("Updating message and deleting trailing messages");
      [[message2]] = yield* Effect.all(
        [
          updateMessage({
            messageId: args.message.id,
            message: args.message,
            updatedAt: /* @__PURE__ */ new Date()
          }),
          deleteTrailingMessages({
            threadId: args.threadId,
            messageId: args.message.id,
            messageCreatedAt: message2.createdAt
          })
        ],
        {
          concurrency: "unbounded"
        }
      );
    }
    if (!message2) {
      yield* Effect.logInfo("Creating message");
      [message2] = yield* createMessage({
        threadId: args.threadId,
        userId: args.userId,
        message: args.message
      });
    }
    const history = yield* getThreadMessageHistory(args.threadId);
    return {
      model: model2,
      history,
      settings,
      usage: usage2,
      limits,
      thread: thread2
    };
  });
  return Database.transaction(effect).pipe(
    APIError.map({
      status: 500,
      message: "Failed to prepare thread context"
    })
  );
}
function convertUIMessagesToModelMessages(messages, options = {
  supportsImages: false,
  supportsDocuments: false
}) {
  return Effect.tryPromise(async () => {
    return convertToModelMessages(
      await Promise.all(
        messages.map(async (message2) => {
          message2.parts = message2.parts.filter((part) => {
            if (part.type === "file") {
              if ((part.mediaType.startsWith("application/pdf") || part.mediaType.startsWith("text/plain")) && !options.supportsDocuments) {
                return false;
              }
              if (part.mediaType.startsWith("image/") && !options.supportsImages) {
                return false;
              }
            }
            return true;
          });
          for (const part of message2.parts) {
            if (part.type === "file") {
              if (part.mediaType.startsWith("application/pdf") || part.mediaType.startsWith("text/plain")) {
                part.url = await fetch(part.url).then((res) => res.blob()).then((blob) => blob.arrayBuffer());
              }
            }
          }
          return message2;
        })
      )
    );
  });
}
function createResumableStream(streamId, stream) {
  return Effect.tryPromise(async () => {
    return getStreamContext().createNewResumableStream(streamId, () => stream);
  }).pipe(
    Effect.tapError((error) => Effect.logError("Error creating resumable stream", error)),
    Effect.retry(
      Schedule.exponential(Duration.millis(200)).pipe(Schedule.compose(Schedule.recurs(3)))
    ),
    Effect.catchAll(() => Effect.succeed(stream))
  );
}
function getResumableStream(streamId) {
  return Effect.gen(function* () {
    const emptyDataStream = createUIMessageStream({
      execute: () => {
      }
    });
    return yield* Effect.tryPromise(async () => {
      return getStreamContext().resumableStream(
        streamId,
        () => emptyDataStream.pipeThrough(new JsonToSseTransformStream())
      );
    }).pipe(
      Effect.tapError((error) => Effect.logError("Error getting resumable stream", error)),
      Effect.retry(
        Schedule.exponential(Duration.millis(200)).pipe(
          Schedule.compose(Schedule.recurs(3))
        )
      ),
      Effect.catchAll(() => Effect.succeed(null))
    );
  });
}
function prepareResumeThreadContext(args) {
  return Effect.gen(function* () {
    const thread2 = yield* getThreadById(args.threadId);
    if (!thread2) {
      return yield* new APIError({
        status: 404,
        message: "Thread not found"
      });
    }
    if (thread2.userId !== args.userId) {
      return yield* new APIError({
        status: 403,
        message: "User is not the owner of the thread"
      });
    }
    if (thread2.status !== "streaming") {
      return yield* new APIError({
        status: 400,
        message: "Thread is not streaming"
      });
    }
    if (!thread2.streamId) {
      return yield* new APIError({
        status: 404,
        message: "Thread is not streaming"
      });
    }
    return thread2.streamId;
  });
}
function generateThreadTitle(threadId, message2, latch) {
  return Effect.gen(function* () {
    yield* latch.close;
    yield* Effect.logInfo("Generating thread title");
    const { text: text2 } = yield* Effect.tryPromise(
      () => generateText({
        model: "google/gemini-2.5-flash-lite",
        system: `
c
                - you will generate a short title based on the first message a user begins a conversation with
                - ensure it is not more than 80 characters long
                - the title should be a summary of the user's message
                - do not use quotes or colons`,
        temperature: 0.8,
        messages: convertToModelMessages([message2])
      })
    ).pipe(
      Effect.tapError((error) => Effect.logError("Error generating thread title", error)),
      Effect.catchAll(() => Effect.succeed({ text: "" }))
    );
    yield* updateThreadTitle({
      threadId,
      title: text2
    }).pipe(
      Effect.tapError((error) => Effect.logError("Error updating thread title", error)),
      Effect.catchAll(() => Effect.succeed(null))
    );
    yield* latch.open;
  });
}
function incrementUsage(userId, type, amount) {
  return Effect.gen(function* () {
    yield* Effect.logInfo("Incrementing usage for " + type + " by " + amount);
    yield* incrementUsage$1(
      {
        userId,
        type
      },
      amount
    );
  });
}
function decrementUsage(userId, type, amount) {
  return Effect.gen(function* () {
    yield* Effect.logInfo("Decrementing usage for " + type + " by " + amount);
    yield* decrementUsage$1(
      {
        userId,
        type
      },
      amount
    );
  });
}
function saveMessageAndResetThreadStatus(args) {
  return Database.transaction(
    Effect.gen(function* () {
      yield* Effect.logInfo("Saving message and resetting thread status");
      yield* Effect.all(
        [
          createMessage({
            threadId: args.threadId,
            userId: args.userId,
            message: args.message
          }),
          updateThread({
            threadId: args.threadId,
            status: "ready",
            streamId: null
          })
        ],
        {
          concurrency: "unbounded"
        }
      );
    })
  );
}
function getLimits(args) {
  const currentPeriodEnd = args.customer?.subscription?.currentPeriodEnd ?? 0;
  const now = (/* @__PURE__ */ new Date()).getTime() / 1e3;
  const isPro = Number(currentPeriodEnd) > now;
  return match({
    isPro,
    isAnonymous: args.isAnonymous
  }).with(
    {
      isPro: true,
      isAnonymous: false
    },
    () => ProLimits
  ).with(
    {
      isPro: false,
      isAnonymous: false
    },
    () => FreeLimits
  ).with(
    {
      isPro: false,
      isAnonymous: true
    },
    () => AnonymousLimits
  ).otherwise(() => AnonymousLimits);
}
const getSearchTool = Effect.gen(function* () {
  const ctx = yield* ToolContext;
  return tool({
    description: "Search the web for information",
    inputSchema: z$2.object({
      query: z$2.string()
    }),
    execute: async ({ query }) => {
      return Runtime.runPromise(
        ctx.runtime,
        searchTool(query).pipe(
          Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
        )
      );
    }
  });
});
function searchTool(query) {
  return Effect.gen(function* () {
    const ctx = yield* ToolContext;
    if (ctx.limits.BUDGET - (ctx.usage.cost || 0) <= 0) {
      yield* Effect.logWarning("Daily usage limit reached");
      return yield* Effect.die(null);
    }
    yield* Effect.logInfo("Running search for: " + query);
    yield* Effect.all([
      incrementUsage(ctx.userId, "search", 1),
      incrementUsage(ctx.userId, "cost", SEARCH_COST)
    ]).pipe(
      Effect.tapError(() => {
        return Effect.logError("Error incrementing usage");
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
    const results = yield* Effect.tryPromise(() => search(query)).pipe(
      Effect.tapError(() => {
        return Effect.logError("Error running search");
      }),
      Effect.tapError(() => {
        return Effect.all([
          decrementUsage(ctx.userId, "search", 1),
          decrementUsage(ctx.userId, "cost", SEARCH_COST)
        ]);
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
    yield* Effect.logInfo("Search completed for: " + query);
    return results;
  });
}
function getSystemPrompt(settings, tools2) {
  if (tools2.length > 0) {
    return tools2.map((tool2) => toolPrompts[tool2]).join("\n");
  }
  return `
    Your name is Zeron.
    The website you are on is https://zeron.sh.
	You are a helpful assistant that can help with tasks related to the user's life.

    ${settings.nickname ? `The user prefers to be called ${settings.nickname}.` : ""}
    ${settings.biography ? `The user's biography is ${settings.biography}.` : ""}

    ${settings.instructions}
    `;
}
const toolPrompts = {
  search: `
    The current date is ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short"
  })}.

    - ⚠️ MANDATORY: Do not search more than once for the same user message
    - ⚠️ MANDATORY: Every claim must have an inline citation
    - ⚠️ MANDATORY: Citations MUST be placed immediately after the sentence containing the information
    - CITATIONS SHOULD BE ON EVERYTHING YOU SAY
    - NEVER group citations at the end of paragraphs or the response
    - Citations are a MUST, do not skip them!
    - Citation format: [Source Title](URL) - use descriptive source titles
    - Present findings in a logical flow
    - Support claims with multiple sources
    - Avoid referencing citations directly, make them part of statements, do not use the word "citation" in your response
    `,
  deepSearch: `
    You are an advanced research assistant focused on deep analysis and comprehensive understanding with focus to be backed by citations in a research paper format.
    You objective is to always run the tool first and then write the response with citations!

	The current date is ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short"
  })}.

    ### CRITICAL INSTRUCTION: (MUST FOLLOW AT ALL COSTS!!!)
    - ⚠️ URGENT: Run research tool INSTANTLY when user sends ANY message - NO EXCEPTIONS
    - ⚠️ URGENT: Do not run the research tool more than once for the same user message - NO EXCEPTIONS
    - DO NOT WRITE A SINGLE WORD before running the tool
    - Run the tool with the exact user query immediately on receiving it
    - EVEN IF THE USER QUERY IS AMBIGUOUS OR UNCLEAR, YOU MUST STILL RUN THE TOOL IMMEDIATELY
    - DO NOT ASK FOR CLARIFICATION BEFORE RUNNING THE TOOL
    - If a query is ambiguous, make your best interpretation and run the appropriate tool right away
    - After getting results, you can then address any ambiguity in your response
    - DO NOT begin responses with statements like "I'm assuming you're looking for information about X" or "Based on your query, I think you want to know about Y"
    - NEVER preface your answer with your interpretation of the user's query
    - GO STRAIGHT TO ANSWERING the question after running the tool

    ### Tool Guidelines:
    #### Research Tool:
    - Your primary tool is research, which allows for:
        - Multi-step research planning
        - Parallel web and academic searches
        - Deep analysis of findings
        - Cross-referencing and validation
    - ⚠️ MANDATORY: You MUST immediately run the tool first as soon as the user asks for it and then write the response with citations!
    - ⚠️ MANDATORY: You MUST NOT write any analysis before running the tool!

    ### Response Guidelines:
    - You MUST immediately run the tool first as soon as the user asks for it and then write the response with citations!
    - ⚠️ MANDATORY: Every claim must have an inline citation
    - ⚠️ MANDATORY: Citations MUST be placed immediately after the sentence containing the information
    - ⚠️ MANDATORY: You MUST write any equations in latex format
    - NEVER group citations at the end of paragraphs or the response
    - Citations are a MUST, do not skip them!
    - Citation format: [Source Title](URL) - use descriptive source titles
    - Give proper headings to the response
    - Provide extremely comprehensive, well-structured responses in markdown format and tables
    - Include both academic, web and x (Twitter) sources
    - Focus on analysis and synthesis of information
    - Do not use Heading 1 in the response, use Heading 2 and 3 only
    - Use proper citations and evidence-based reasoning
    - The response should be in paragraphs and not in bullet points
    - Make the response as long as possible, do not skip any important details
    - All citations must be inline, placed immediately after the relevant information. Do not group citations at the end or in any references/bibliography section.

    ### ⚠️ Latex and Currency Formatting: (MUST FOLLOW AT ALL COSTS!!!)
    - ⚠️ MANDATORY: Use '$' for ALL inline equations without exception
    - ⚠️ MANDATORY: Use '$$' for ALL block equations without exception
    - ⚠️ NEVER use '$' symbol for currency - Always use "USD", "EUR", etc.
    - ⚠️ MANDATORY: Make sure the latex is properly delimited at all times!!
    - Mathematical expressions must always be properly delimited
    - Tables must use plain text without any formatting
    - don't use the h1 heading in the markdown response

    ### Response Format:
    - Start with introduction, then sections, and finally a conclusion
    - Keep it super detailed and long, do not skip any important details
    - It is very important to have citations for all facts provided
    - Be very specific, detailed and even technical in the response
    - Include equations and mathematical expressions in the response if needed
    - Present findings in a logical flow
    - Support claims with multiple sources
    - Each section should have 2-4 detailed paragraphs
    - CITATIONS SHOULD BE ON EVERYTHING YOU SAY
    - Include analysis of reliability and limitations
    - Maintain the language of the user's message and do not change it
    - Avoid referencing citations directly, make them part of statements
    `
};
function getResearchPrompt(prompt) {
  return `
    You are an autonomous deep research analyst. Your goal is to research the given research topic thoroughly with the given tools.

    Today is ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short"
  })}.

    ### PRIMARY FOCUS: SEARCH-DRIVEN RESEARCH (95% of your work)
    Your main job is to SEARCH extensively and gather comprehensive information. Search should be your go-to approach for almost everything.

    For searching:
    - Search first, search often, search comprehensively
    - Make 3-5 targeted searches per research topic to get different angles and perspectives
    - Search queries should be specific and focused, 5-15 words maximum
    - Vary your search approaches: broad overview → specific details → recent developments → expert opinions
    - Use different categories strategically: news, research papers, company info, financial reports, github
    - Follow up initial searches with more targeted queries based on what you learn
    - Cross-reference information by searching for the same topic from different angles
    - Search for contradictory information to get balanced perspectives
    - Include exact metrics, dates, technical terms, and proper nouns in queries
    - Make searches progressively more specific as you gather context
    - Search for recent developments, trends, and updates on topics
    - Always verify information with multiple searches from different sources
    - ⚠️ MANDATORY: Read the contents of sites you find that are relevant to the query
    - ⚠️ MANDATORY: Read as many sites that you find relevant as possible
    - ⚠️ MANDATORY: Always read at least 1 site after searching
    - ⚠️ MANDATORY: Read at least 5 sites before finishing the research

    ### SEARCH STRATEGY EXAMPLES:
    - Topic: "AI model performance" → Search: "GPT-4 benchmark results 2024", "LLM performance comparison studies", "AI model evaluation metrics research"
    - Topic: "Company financials" → Search: "Tesla Q3 2024 earnings report", "Tesla revenue growth analysis", "electric vehicle market share 2024"
    - Topic: "Technical implementation" → Search: "React Server Components best practices", "Next.js performance optimization techniques", "modern web development patterns"

    ### RESEARCH WORKFLOW:
    1. Start with broad searches to understand the topic landscape
    2. Read the contents of one or more sites returned by the query
    3. Identify key subtopics and drill down with specific searches or read more sites
    4. Look for recent developments and trends through targeted news/research searches
    5. Cross-validate information with searches from different categories
    6. Continue searching and reading sites to fill any gaps in understanding

    For research:
    - Do not use the same query twice to avoid duplicates
    - PRIORITIZE READING THE WEBSITE CONTENT OVER SEARCHING THE WEB
    - ⚠️ MANDATORY: YOU MUST USE read_site TOOL AT LEAST 5 SITES BEFORE FINISHING THE RESEARCH
    - You have up to 40 actions to complete the research

    Research Topic:
    ${prompt}
    `;
}
function getDeepSearchPrompt(prompt, plan) {
  return `
    You are an autonomous deep research analyst. Your goal is to research the given research topic thoroughly with the given tools.

    Today is ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short"
  })}.

    ### PRIMARY FOCUS: SEARCH-DRIVEN RESEARCH (95% of your work)
    Your main job is to SEARCH extensively and gather comprehensive information. Search should be your go-to approach for almost everything.

    For searching:
    - Search first, search often, search comprehensively
    - Make 3-5 targeted searches per research topic to get different angles and perspectives
    - Search queries should be specific and focused, 5-15 words maximum
    - Vary your search approaches: broad overview → specific details → recent developments → expert opinions
    - Use different categories strategically: news, research papers, company info, financial reports, github
    - Follow up initial searches with more targeted queries based on what you learn
    - Cross-reference information by searching for the same topic from different angles
    - Search for contradictory information to get balanced perspectives
    - Include exact metrics, dates, technical terms, and proper nouns in queries
    - Make searches progressively more specific as you gather context
    - Search for recent developments, trends, and updates on topics
    - Always verify information with multiple searches from different sources
    - ⚠️ MANDATORY: Read the contents of sites you find that are relevant to the query
    - ⚠️ MANDATORY: Read as many sites that you find relevant as possible
    - ⚠️ MANDATORY: Always read at least 1 site after searching
    - ⚠️ MANDATORY: Read at least 5 sites before finishing the research

    ### SEARCH STRATEGY EXAMPLES:
    - Topic: "AI model performance" → Search: "GPT-4 benchmark results 2024", "LLM performance comparison studies", "AI model evaluation metrics research"
    - Topic: "Company financials" → Search: "Tesla Q3 2024 earnings report", "Tesla revenue growth analysis", "electric vehicle market share 2024"
    - Topic: "Technical implementation" → Search: "React Server Components best practices", "Next.js performance optimization techniques", "modern web development patterns"

    ### RESEARCH WORKFLOW:
    1. Start with broad searches to understand the topic landscape
    2. Read the contents of one or more sites returned by the query
    3. Identify key subtopics and drill down with specific searches or read more sites
    4. Look for recent developments and trends through targeted news/research searches
    5. Cross-validate information with searches from different categories
    6. Continue searching and reading sites to fill any gaps in understanding
    7. Summarize your findings and insights

    For research:
    - Do not use the same query twice to avoid duplicates
    - PRIORITIZE READING THE WEBSITE CONTENT OVER SEARCHING THE WEB
    - ⚠️ MANDATORY: YOU MUST USE read_site TOOL AT LEAST 5 SITES BEFORE FINISHING THE RESEARCH
    - You have up to 40 actions to complete the research

    Research Plan:
    ${plan.map((item, index2) => `${index2 + 1}. ${item}`).join("\n")}

    Research Topic:
    ${prompt}
    `;
}
function getDeepSearchPlanPrompt(prompt) {
  return `
    Plan out the research for the following topic: ${prompt}.

    Today's Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", weekday: "short" })}
    `;
}
const getResearchTool = Effect.gen(function* () {
  const ctx = yield* ToolContext;
  return tool({
    description: "Perfect deep research on given topic.",
    inputSchema: z$2.object({
      thoughts: z$2.string().describe(
        "Your thoughts on how you plan to research the given topic in 20-50 words."
      ),
      prompt: z$2.string().describe(
        "This should be the users exact prompt. Do not infer or change it in any way."
      )
    }),
    execute: async ({ thoughts, prompt }, { toolCallId }) => {
      return Runtime.runPromise(
        ctx.runtime,
        researchTool(thoughts, prompt, toolCallId).pipe(
          Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
        )
      );
    }
  });
});
function researchTool(thoughts, prompt, toolCallId) {
  return Effect.gen(function* () {
    const ctx = yield* ToolContext;
    if (!ctx.limits.RESEARCH_ENABLED) {
      yield* Effect.logWarning("Research is not available");
      return yield* Effect.die(null);
    }
    if (ctx.limits.BUDGET - (ctx.usage.cost || 0) <= 0) {
      yield* Effect.logWarning("Daily usage limit reached");
      return yield* Effect.die(null);
    }
    yield* incrementUsage(ctx.userId, "cost", RESEARCH_COST).pipe(
      Effect.tapError(() => {
        return Effect.logError("Error incrementing usage");
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
    const actions = [];
    ctx.writer.write({
      type: "data-research-start",
      data: {
        toolCallId,
        thoughts
      }
    });
    const { text: summary } = yield* Effect.tryPromise(
      () => generateText({
        model: "moonshotai/kimi-k2",
        prompt: getResearchPrompt(prompt),
        stopWhen: stepCountIs(50),
        tools: {
          search: tool({
            description: "Search the web for information",
            inputSchema: z$2.object({
              thoughts: z$2.string().describe(
                "Your thoughts on what you are currently doing in 20-50 words."
              ),
              query: z$2.string()
            }),
            execute: async ({ query, thoughts: thoughts2 }) => {
              ctx.writer.write({
                type: "data-research-search",
                data: {
                  toolCallId,
                  thoughts: thoughts2,
                  query
                }
              });
              actions.push({
                toolCallId,
                thoughts: thoughts2,
                query
              });
              return search(query);
            }
          }),
          read_site: tool({
            description: "Read the contents of a URL",
            inputSchema: z$2.object({
              thoughts: z$2.string().describe(
                "Your thoughts on what you are currently doing in 20-50 words."
              ),
              url: z$2.string()
            }),
            execute: async ({ url, thoughts: thoughts2 }) => {
              ctx.writer.write({
                type: "data-research-read",
                data: { toolCallId, thoughts: thoughts2, url }
              });
              actions.push({
                toolCallId,
                thoughts: thoughts2,
                url
              });
              return readSite(url);
            }
          })
        },
        // @ts-expect-error
        experimental_repairToolCall: async ({ error, toolCall, tools: tools2, inputSchema }) => {
          if (NoSuchToolError.isInstance(error)) {
            return null;
          }
          const tool2 = tools2[toolCall.toolName];
          const { object: input } = await generateObject({
            model: "openai/gpt-4.1",
            schema: tool2.inputSchema,
            prompt: [
              `The model tried to call the tool "${toolCall.toolName}" with the following arguments:`,
              JSON.stringify(toolCall.input),
              `The tool accepts the following schema:`,
              JSON.stringify(inputSchema(toolCall)),
              "Please fix the arguments.",
              `Today's date is ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}`
            ].join("\n")
          });
          return {
            ...toolCall,
            input
          };
        }
      })
    ).pipe(
      Effect.tapError((e) => {
        return Effect.logError("Error generating text", e);
      }),
      Effect.tapError(() => {
        return decrementUsage(ctx.userId, "cost", RESEARCH_COST);
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
    ctx.writer.write({
      type: "data-research-complete",
      data: { toolCallId }
    });
    return {
      summary,
      actions
    };
  });
}
const PlanTodo = z$2.string().min(10).max(300);
const PlanSchema = z$2.object({
  plan: z$2.array(PlanTodo).min(1).max(8)
});
const getDeepSearchTool = Effect.gen(function* () {
  const ctx = yield* ToolContext;
  return tool({
    name: "Deep Search",
    description: "Performs deep search on a given topic",
    inputSchema: z$2.object({
      query: z$2.string().min(1).max(300).describe("The query to perform deep search on."),
      thoughts: z$2.string().min(1).max(300).describe("Your thoughts on how you plan to approach the search in 20-50 words.")
    }),
    execute: ({ query, thoughts }, { toolCallId }) => {
      return Runtime.runPromise(
        ctx.runtime,
        deepSearchTool({ query, thoughts, toolCallId }).pipe(
          Effect.provide(Layer.scoped(ToolContext, Effect.succeed(ctx)))
        )
      );
    }
  });
});
function deepSearchTool(args) {
  return Effect.gen(function* () {
    const ctx = yield* ToolContext;
    yield* incrementResearchUsageOrDie();
    const steps = [];
    function commit(step) {
      steps.push(step);
      ctx.writer.write({
        type: "data-deep-search",
        data: {
          toolCallId: args.toolCallId,
          ...step
        }
      });
    }
    commit({ type: "start", thoughts: args.thoughts, timestamp: Date.now() });
    commit({ type: "plan" });
    const {
      object: { plan }
    } = yield* Effect.tryPromise(
      () => generateObject({
        model: "xai/grok-4.1-fast-non-reasoning",
        schema: PlanSchema,
        prompt: getDeepSearchPlanPrompt(args.query),
        abortSignal: ctx.signal
      })
    ).pipe(
      Effect.tapError((e) => {
        return Effect.logError("Error generating plan", e);
      }),
      Effect.tapError(() => {
        return decrementUsage(ctx.userId, "cost", RESEARCH_COST);
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
    commit({ type: "plan-results", plan });
    const { text: summary } = yield* Effect.tryPromise(
      () => generateText({
        model: "moonshotai/kimi-k2",
        prompt: getDeepSearchPrompt(args.query, plan),
        stopWhen: stepCountIs(50),
        abortSignal: ctx.signal,
        tools: {
          search: tool({
            description: "Search the web for information",
            inputSchema: z$2.object({
              thoughts: z$2.string().describe(
                "Your thoughts on what you are currently doing in 20-50 words."
              ),
              query: z$2.string()
            }),
            execute: async ({ query, thoughts }) => {
              commit({ type: "search", query, thoughts });
              const response = await search(query);
              commit({ type: "search-results", query, results: response.results });
              return response;
            }
          }),
          read_site: tool({
            description: "Read the contents of a URL",
            inputSchema: z$2.object({
              thoughts: z$2.string().describe(
                "Your thoughts on what you are currently doing in 20-50 words."
              ),
              url: z$2.string()
            }),
            execute: async ({ url, thoughts }) => {
              commit({ type: "read-site", url, thoughts });
              const response = await readSite(url);
              commit({ type: "read-site-results", url, content: response.text });
              return response;
            }
          })
        },
        // @ts-expect-error
        experimental_repairToolCall: async ({ error, toolCall, tools: tools2, inputSchema }) => {
          if (NoSuchToolError.isInstance(error)) {
            return null;
          }
          const tool2 = tools2[toolCall.toolName];
          const { object: input } = await generateObject({
            model: "openai/gpt-4.1",
            schema: tool2.inputSchema,
            prompt: [
              `The model tried to call the tool "${toolCall.toolName}" with the following arguments:`,
              JSON.stringify(toolCall.input),
              `The tool accepts the following schema:`,
              JSON.stringify(inputSchema(toolCall)),
              "Please fix the arguments.",
              `Today's date is ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}`
            ].join("\n")
          });
          return {
            ...toolCall,
            input
          };
        }
      })
    ).pipe(
      Effect.tapError((e) => {
        return Effect.logError("Error generating text", e);
      }),
      Effect.tapError(() => {
        return decrementUsage(ctx.userId, "cost", RESEARCH_COST);
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
    commit({ type: "completed", timestamp: Date.now() });
    return {
      steps,
      summary
    };
  });
}
function incrementResearchUsageOrDie() {
  return Effect.gen(function* () {
    const ctx = yield* ToolContext;
    if (!ctx.limits.RESEARCH_ENABLED) {
      yield* Effect.logWarning("Research is not available");
      return yield* Effect.die(null);
    }
    if (ctx.limits.BUDGET - (ctx.usage.cost || 0) <= 0) {
      yield* Effect.logWarning("Daily usage limit reached");
      return yield* Effect.die(null);
    }
    yield* incrementUsage(ctx.userId, "cost", RESEARCH_COST).pipe(
      Effect.tapError(() => {
        return Effect.logError("Error incrementing usage");
      }),
      Effect.catchAll((e) => Effect.die(e))
    );
  });
}
const tools = {
  search: getSearchTool,
  research: getResearchTool,
  deepSearch: getDeepSearchTool
};
class ToolContext extends Effect.Tag("ToolContext")() {
}
const getTools = Effect.gen(function* () {
  const ctx = yield* ToolContext;
  const activeTools = {};
  for (const tool2 of ctx.tools) {
    activeTools[tool2] = yield* tools[tool2];
  }
  return activeTools;
});
const createStreamSSEResponse = Effect.gen(function* () {
  const runtime = yield* Effect.runtime();
  const options = yield* CreateStreamSSEResponseOptions;
  const { onFinishCallback } = yield* CreateStreamSSEResponseOnFinish;
  const { onErrorCallback } = yield* CreateStreamSSEResponseOnError;
  const { onMessageMetadataCallback } = yield* CreateStreamSSEResponseOnMessageMetadata;
  const { getToolsCallback } = yield* CreateStreamSSEResponseGetTools;
  let totalUsagePromise;
  return createUIMessageStream({
    onFinish: async ({ responseMessage }) => {
      const totalUsage = await totalUsagePromise?.catch(() => void 0);
      return Runtime.runPromise(runtime, onFinishCallback({ responseMessage, totalUsage }));
    },
    execute: ({ writer }) => {
      const tools2 = Runtime.runSync(runtime, getToolsCallback({ writer }));
      const result = streamText({
        ...options,
        tools: tools2,
        onError: (error) => {
          return Runtime.runPromise(runtime, onErrorCallback({ error, writer }));
        }
      });
      totalUsagePromise = result.totalUsage;
      result.consumeStream();
      writer.merge(
        result.toUIMessageStream({
          sendReasoning: true,
          messageMetadata: ({ part }) => {
            return Runtime.runSync(
              runtime,
              // @ts-expect-error - TODO: fix this
              onMessageMetadataCallback({ part, writer })
            );
          }
        })
      );
    }
  });
});
class CreateStreamSSEResponseOnFinish extends Effect.Tag("CreateStreamSSEResponseOnFinish")() {
}
class CreateStreamSSEResponseOnError extends Effect.Tag("CreateStreamSSEResponseOnError")() {
}
class CreateStreamSSEResponseOnMessageMetadata extends Effect.Tag(
  "CreateStreamSSEResponseOnMessageMetadata"
)() {
}
class CreateStreamSSEResponseOptions extends Effect.Tag("CreateStreamSSEResponseOptions")() {
}
class CreateStreamSSEResponseGetTools extends Effect.Tag("CreateStreamSSEResponseGetTools")() {
}
class Stream {
  static create = createStreamSSEResponse;
  static onFinish(callback) {
    return Effect.provide(
      Layer.scoped(
        CreateStreamSSEResponseOnFinish,
        Effect.succeed({ onFinishCallback: callback })
      )
    );
  }
  static onError(callback) {
    return Effect.provide(
      Layer.scoped(
        CreateStreamSSEResponseOnError,
        Effect.succeed({ onErrorCallback: callback })
      )
    );
  }
  static onMessageMetadata(callback) {
    return Effect.provide(
      Layer.scoped(
        CreateStreamSSEResponseOnMessageMetadata,
        Effect.succeed({ onMessageMetadataCallback: callback })
      )
    );
  }
  static getTools(callback) {
    return Effect.provide(
      Layer.scoped(
        CreateStreamSSEResponseGetTools,
        Effect.succeed({ getToolsCallback: callback })
      )
    );
  }
  static options(options) {
    return Effect.provide(
      Layer.scoped(CreateStreamSSEResponseOptions, Effect.succeed(options))
    );
  }
  static build = Effect.map((stream) => {
    return stream.pipeThrough(new JsonToSseTransformStream());
  });
}
function calculateTokenCost(pricing, usage2) {
  const inputTokens = usage2.inputTokens ?? 0;
  const outputTokens = usage2.totalTokens != null ? Math.max(usage2.totalTokens - inputTokens, usage2.outputTokens ?? 0) : (usage2.outputTokens ?? 0) + (usage2.reasoningTokens ?? 0);
  return Math.ceil(
    (inputTokens * pricing.inputCost + outputTokens * pricing.outputCost) / 1e6
  );
}
function formatTokenPrice(microDollarsPerMillion) {
  const dollars = (microDollarsPerMillion ?? 0) / 1e6;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}
const conn = RedisConnectionOptionsLive({
  url: env.REDIS_URL
});
const RedisLive = RedisPubSubLive.pipe(Layer.provide(conn));
const ServerRoute$8 = createServerFileRoute().methods({
  async POST({
    request
  }) {
    return threadPostApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(SessionLive(request)), Effect.provide(ThreadPostBodyLive(request)), Effect.provide(DatabaseLive), Effect.runPromise);
  }
});
const threadPostApi = Effect.gen(function* () {
  const session2 = yield* Session;
  const body = yield* ThreadPostBody;
  return yield* threadPostApiHandler.pipe(Effect.annotateLogs("requestId", nanoid$1()), Effect.annotateLogs("userId", session2.user.id), Effect.annotateLogs("threadId", body.id));
});
const threadPostApiHandler = Effect.gen(function* () {
  const runtime = yield* Effect.runtime();
  const latch = yield* Effect.makeLatch();
  yield* latch.open;
  const session2 = yield* Session;
  const body = yield* ThreadPostBody;
  const streamId = nanoid$1();
  const controller = new AbortController();
  const context = yield* prepareThreadContext({
    isAnonymous: session2.user.isAnonymous ?? false,
    userId: UserId(session2.user.id),
    threadId: body.id,
    streamId,
    modelId: body.modelId,
    message: body.message
  });
  const {
    history,
    model: model2,
    settings,
    usage: usage2,
    limits,
    thread: thread2
  } = context;
  const messages = yield* convertUIMessagesToModelMessages(history, {
    supportsImages: model2.capabilities.includes("vision"),
    supportsDocuments: model2.capabilities.includes("documents")
  });
  const activeTools = [body.tool].filter((tool2) => tool2 !== void 0);
  const MODEL_REQUIRES_MIDDLEWARE = ["zai/glm-4.5-air", "zai/glm-4.5", "deepseek/deepseek-r1-distill-llama-70b", "deepseek/deepseek-r1"];
  const actualModel = MODEL_REQUIRES_MIDDLEWARE.includes(model2.model) ? wrapLanguageModel({
    model: gateway(model2.model),
    middleware: extractReasoningMiddleware({
      tagName: "think"
    })
  }) : model2.model;
  const OPENAI_MODELS_WITH_REASONING = ["openai/gpt-5", "openai/gpt-5-mini", "openai/gpt-5-nano", "openai/gpt-5.5", "openai/gpt-5.5-pro"];
  const openai = {
    parallelToolCalls: false
  };
  if (OPENAI_MODELS_WITH_REASONING.includes(model2.model)) {
    openai.include = ["reasoning.encrypted_content"];
    openai.reasoningSummary = "auto";
  }
  const GOOGLE_MODELS_WITH_REASONING = ["google/gemini-2.5-flash", "google/gemini-2.5-pro", "google/gemini-3-pro-preview", "google/gemini-3.1-pro-preview", "google/gemini-3.5-flash"];
  const google = {};
  if (GOOGLE_MODELS_WITH_REASONING.includes(model2.model)) {
    google.thinkingConfig = {
      includeThoughts: true
    };
  }
  const ANTHROPIC_LEGACY_THINKING_MODELS = ["anthropic/claude-4-sonnet", "anthropic/claude-sonnet-4.5", "anthropic/claude-haiku-4.5"];
  const usesAdaptiveThinking = model2.model.startsWith("anthropic/") && !ANTHROPIC_LEGACY_THINKING_MODELS.includes(model2.model);
  const anthropic = {
    sendReasoning: true,
    thinking: usesAdaptiveThinking ? (
      // the installed provider types predate adaptive thinking; the
      // gateway passes this through to the Anthropic API as-is
      {
        type: "adaptive",
        display: "summarized"
      }
    ) : {
      type: "enabled",
      budgetTokens: 3e3
    },
    disableParallelToolUse: true
  };
  yield* Effect.logInfo("Creating stream");
  const stream = yield* Stream.create.pipe(Stream.options({
    model: actualModel,
    messages,
    // Fable 5 and Opus 4.8 reject temperature outright; the other
    // adaptive-thinking Claude models don't accept it alongside thinking
    temperature: usesAdaptiveThinking ? void 0 : 0.8,
    stopWhen: stepCountIs(3),
    system: getSystemPrompt(settings, activeTools),
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 3
    }),
    abortSignal: controller.signal,
    providerOptions: {
      openai,
      google,
      anthropic,
      gateway: {
        order: ["groq", "cerebras", "baseten"]
      }
    }
  }), Stream.getTools(({
    writer
  }) => {
    return getTools.pipe(Effect.provide(Layer.scoped(ToolContext, Effect.succeed({
      writer,
      usage: usage2,
      userId: UserId(session2.user.id),
      limits,
      runtime,
      tools: activeTools,
      signal: controller.signal
    }))));
  }), Stream.onFinish(({
    responseMessage,
    totalUsage
  }) => {
    return Effect.gen(function* () {
      if (totalUsage) {
        const cost = calculateTokenCost(model2, totalUsage);
        yield* Effect.logInfo(`Charging ${cost} micro-dollars for ${totalUsage.inputTokens} input / ${totalUsage.outputTokens} output tokens`);
        yield* incrementUsage(UserId(session2.user.id), "cost", cost).pipe(Effect.tapError((error) => Effect.logError("Error incrementing usage cost", error)), Effect.catchAll(() => Effect.succeed(null)));
      } else {
        yield* Effect.logWarning("No token usage reported for stream, nothing charged");
      }
      yield* saveMessageAndResetThreadStatus({
        threadId: body.id,
        userId: UserId(session2.user.id),
        message: responseMessage
      }).pipe(Effect.tapError((error) => Effect.logError("Error saving message and resetting thread status", error)), Effect.catchAll(() => Effect.succeed(null)), latch.whenOpen);
      yield* Deferred.succeed(streamCompletionDeferred, void 0);
    });
  }), Stream.onMessageMetadata(({
    part,
    writer
  }) => {
    return Effect.gen(function* () {
      if (part.type === "reasoning-start") {
        writer.write({
          type: "data-reasoning-time",
          data: {
            id: part.id,
            type: "start",
            timestamp: (/* @__PURE__ */ new Date()).getTime()
          }
        });
      }
      if (part.type === "reasoning-end") {
        writer.write({
          type: "data-reasoning-time",
          data: {
            id: part.id,
            type: "end",
            timestamp: (/* @__PURE__ */ new Date()).getTime()
          }
        });
      }
      if (part.type === "start") {
        return {
          model: {
            id: model2.id,
            name: model2.name,
            icon: model2.icon
          }
        };
      }
    });
  }), Stream.onError(({
    error,
    writer
  }) => {
    return Effect.gen(function* () {
      yield* Effect.logError("Error in stream", error);
      writer.write({
        type: "data-error",
        data: "Error generating response"
      });
      yield* Deferred.succeed(streamCompletionDeferred, void 0);
    });
  }), Stream.build);
  yield* Effect.logInfo("Creating resumable stream");
  const resumableStream = yield* createResumableStream(streamId, stream);
  const streamCompletionDeferred = yield* Deferred.make();
  yield* Effect.logInfo("Creating daemon for listening to abort command");
  yield* Effect.gen(function* () {
    const pubsub = yield* RedisPubSub;
    yield* pubsub.subscribe(`abort:${body.id}`, (_2) => {
      controller.abort();
    });
    yield* Effect.race(Effect.async((resume) => {
      controller.signal.addEventListener("abort", () => {
        resume(Effect.succeed(void 0));
      });
    }), Deferred.await(streamCompletionDeferred));
  }).pipe(Effect.tapError((error) => Effect.logError("Error in daemon subscribing to abort", error)), Effect.catchAll(() => Effect.succeed(null)), Effect.provide(RedisLive), Effect.forkDaemon);
  if (!thread2.title) {
    yield* generateThreadTitle(body.id, body.message, latch).pipe(Effect.forkDaemon);
  }
  return new Response(resumableStream);
});
const ThreadPostApiSchema = z$1.object({
  id: z$1.string(),
  modelId: z$1.string(),
  message: z$1.any(),
  tool: z$1.string().optional()
});
class ThreadPostBody extends Effect.Tag("ThreadPostBody")() {
}
const ThreadPostBodyLive = (request) => Layer.scoped(ThreadPostBody, Effect.gen(function* () {
  const json2 = yield* Effect.tryPromise({
    try: () => request.json(),
    catch: (error) => {
      return new APIError({
        status: 400,
        message: "Invalid request body",
        cause: error
      });
    }
  });
  return yield* Effect.try({
    try: () => ThreadPostApiSchema.parse(json2),
    catch: (error) => {
      return new APIError({
        status: 400,
        message: "Invalid request body",
        cause: error
      });
    }
  });
}));
const ServerRoute$7 = createServerFileRoute().methods({
  GET: async ({
    request
  }) => {
    return resetApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(ResetRequestLive(request)), Effect.provide(DatabaseLive), Effect.annotateLogs("requestId", nanoid()), Effect.runPromise);
  }
});
const resetApi = Effect.gen(function* () {
  const resetRequest = yield* ResetRequest;
  if (!resetRequest.isAuthorized) {
    return yield* new APIError({
      status: 401,
      message: "Unauthorized"
    });
  }
  yield* resetUsage();
  return new Response("OK", {
    status: 200
  });
});
class ResetRequest extends Effect.Tag("ResetRequest")() {
}
const ResetRequestLive = (request) => Layer.scoped(ResetRequest, Effect.succeed({
  isAuthorized: request.headers.get("Authorization") === `Bearer ${env.CRON_SECRET}`
}));
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil"
});
const syncStripeDataToDatabase = (customerId) => Effect.gen(function* () {
  const stripeCustomer = yield* Effect.tryPromise({
    try: () => stripe.customers.retrieve(customerId),
    catch: (error) => new APIError({
      status: 500,
      message: "Failed to retrieve customer from Stripe",
      cause: error
    })
  });
  if (!("metadata" in stripeCustomer)) {
    return yield* Effect.void;
  }
  const subscriptions = yield* Effect.tryPromise({
    try: () => stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: "all"
    }),
    catch: (error) => new APIError({
      status: 500,
      message: "Failed to retrieve subscriptions from Stripe",
      cause: error
    })
  });
  const subscription = subscriptions.data[0];
  if (!subscription) {
    return yield* Effect.void;
  }
  const item = subscription.items.data[0];
  if (!item) {
    return yield* Effect.void;
  }
  const subscriptionData = {
    priceId: item.price.id,
    subscriptionId: subscription.id,
    currentPeriodStart: item.current_period_start,
    currentPeriodEnd: item.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    seats: item.quantity ?? 1
  };
  if (stripeCustomer.metadata.userId) {
    yield* updateUserCustomerSubscription({
      customerId,
      subscription: subscriptionData
    });
  }
  if (stripeCustomer.metadata.organizationId) {
    yield* updateOrganizationCustomerSubscription({
      customerId,
      subscription: subscriptionData
    });
  }
});
const createStripeCustomer = (email, userId) => Effect.gen(function* () {
  return yield* Effect.tryPromise({
    try: () => stripe.customers.create({
      email,
      metadata: {
        userId
      }
    }),
    catch: (error) => new APIError({
      status: 500,
      message: "Failed to create customer in Stripe",
      cause: error
    })
  });
});
const createStripeCheckoutSession = (customerId, successUrl, cancelUrl, priceId) => Effect.gen(function* () {
  return yield* Effect.tryPromise({
    try: () => stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl
    }),
    catch: (error) => new APIError({
      status: 500,
      message: "Failed to create checkout session in Stripe",
      cause: error
    })
  });
});
const createStripeBillingPortalSession = (customerId, returnUrl) => Effect.gen(function* () {
  return yield* Effect.tryPromise({
    try: () => stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    }),
    catch: (error) => new APIError({
      status: 500,
      message: "Failed to create billing portal session in Stripe",
      cause: error
    })
  });
});
const ServerRoute$6 = createServerFileRoute().methods({
  GET: async ({
    request
  }) => {
    return customerPortalApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(SessionLive(request)), Effect.provide(CustomerPortalRequestLive(request)), Effect.provide(DatabaseLive), Effect.annotateLogs("requestId", nanoid()), Effect.runPromise);
  }
});
const customerPortalApi = Effect.gen(function* () {
  const session2 = yield* Session;
  const customerPortalRequest = yield* CustomerPortalRequest;
  if (session2.user.isAnonymous) {
    return yield* new APIError({
      status: 400,
      message: "anonymous user cannot access billing portal"
    });
  }
  let customer = yield* getUserCustomerByUserId(UserId(session2.user.id));
  if (!customer) {
    const stripeCustomer = yield* createStripeCustomer(session2.user.email, session2.user.id);
    const [newCustomer] = yield* createUserCustomer({
      userId: UserId(session2.user.id),
      customerId: CustomerId(stripeCustomer.id)
    });
    customer = newCustomer;
  }
  const successUrl = new URL(`${env.VITE_PUBLIC_API_URL}/api/checkout/success`);
  if (customerPortalRequest.redirectUrl) {
    successUrl.searchParams.set("redirectUrl", customerPortalRequest.redirectUrl);
  }
  const billingPortal = yield* createStripeBillingPortalSession(customer.id, successUrl.toString());
  if (!billingPortal.url) {
    return yield* new APIError({
      status: 500,
      message: "billing portal creation failed"
    });
  }
  return Response.redirect(billingPortal.url, 303);
});
class CustomerPortalRequest extends Effect.Tag("CustomerPortalRequest")() {
}
const CustomerPortalRequestLive = (request) => Layer.scoped(CustomerPortalRequest, Effect.succeed({
  redirectUrl: new URL(request.url).searchParams.get("redirectUrl")
}));
const ServerRoute$5 = createServerFileRoute().methods({
  GET: async ({
    request
  }) => {
    return checkoutApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(SessionLive(request)), Effect.provide(CheckoutRequestLive(request)), Effect.provide(DatabaseLive), Effect.annotateLogs("requestId", nanoid()), Effect.runPromise);
  }
});
const checkoutApi = Effect.gen(function* () {
  const session2 = yield* Session;
  const checkoutRequest = yield* CheckoutRequest;
  if (session2.user.isAnonymous) {
    return yield* new APIError({
      status: 400,
      message: "anonymous user cannot checkout"
    });
  }
  let customer = yield* getUserCustomerByUserId(UserId(session2.user.id));
  if (!customer) {
    const stripeCustomer = yield* createStripeCustomer(session2.user.email, session2.user.id);
    const [newCustomer] = yield* createUserCustomer({
      userId: UserId(session2.user.id),
      customerId: CustomerId(stripeCustomer.id)
    });
    customer = newCustomer;
  }
  const successUrl = new URL(`${env.VITE_PUBLIC_API_URL}/api/checkout/success`);
  if (checkoutRequest.redirectUrl) {
    successUrl.searchParams.set("redirectUrl", checkoutRequest.redirectUrl);
  }
  const cancelUrl = checkoutRequest.redirectUrl ? new URL(checkoutRequest.redirectUrl) : new URL(env.VITE_PUBLIC_API_URL);
  const checkoutSession = yield* createStripeCheckoutSession(customer.id, successUrl.toString(), cancelUrl.toString(), env.PRO_MONTHLY_PRICE_ID);
  if (!checkoutSession.url) {
    return yield* new APIError({
      status: 500,
      message: "checkout session failed"
    });
  }
  return Response.redirect(checkoutSession.url, 303);
});
class CheckoutRequest extends Effect.Tag("CheckoutRequest")() {
}
const CheckoutRequestLive = (request) => Layer.scoped(CheckoutRequest, Effect.succeed({
  redirectUrl: new URL(request.url).searchParams.get("redirectUrl")
}));
const ServerRoute$4 = createServerFileRoute().methods({
  POST: async ({
    request
  }) => {
    return stripeWebhookApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(StripeWebhookRequestLive(request)), Effect.provide(DatabaseLive), Effect.annotateLogs("requestId", nanoid()), Effect.runPromise);
  }
});
const stripeWebhookApi = Effect.gen(function* () {
  const request = yield* StripeWebhookRequest;
  const body = request.body;
  const signature = request.signature;
  if (!signature) {
    return yield* new APIError({
      status: 400,
      message: "stripe signature missing"
    });
  }
  const event = yield* Effect.try({
    try: () => stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET),
    catch: (error) => new APIError({
      status: 400,
      message: "Invalid webhook signature",
      cause: error
    })
  });
  if (ALLOWED_EVENTS.includes(event.type)) {
    const data = event.data.object;
    if (!data.customer) {
      yield* Effect.logError("stripe customer is not a string");
      return yield* Effect.void;
    }
    yield* syncStripeDataToDatabase(CustomerId(data.customer));
  }
  return Response.json({
    message: "received"
  }, {
    status: 200
  });
});
class StripeWebhookRequest extends Effect.Tag("StripeWebhookRequest")() {
}
const StripeWebhookRequestLive = (request) => Layer.scoped(StripeWebhookRequest, Effect.gen(function* () {
  const body = yield* Effect.tryPromise({
    try: () => request.text(),
    catch: (error) => new APIError({
      status: 400,
      message: "Invalid request body",
      cause: error
    })
  });
  return {
    body,
    signature: request.headers.get("stripe-signature")
  };
}));
const ALLOWED_EVENTS = ["checkout.session.completed", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted", "customer.subscription.paused", "customer.subscription.resumed", "customer.subscription.pending_update_applied", "customer.subscription.pending_update_expired", "customer.subscription.trial_will_end", "invoice.paid", "invoice.payment_failed", "invoice.payment_action_required", "invoice.upcoming", "invoice.marked_uncollectible", "invoice.payment_succeeded", "payment_intent.succeeded", "payment_intent.payment_failed", "payment_intent.canceled"];
const ServerRoute$3 = createServerFileRoute().methods({
  GET: async ({
    request
  }) => {
    return checkoutSuccessApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(SessionLive(request)), Effect.provide(CheckoutSuccessRequestLive(request)), Effect.provide(DatabaseLive), Effect.annotateLogs("requestId", nanoid()), Effect.runPromise);
  }
});
const checkoutSuccessApi = Effect.gen(function* () {
  const session2 = yield* Session;
  const checkoutSuccessRequest = yield* CheckoutSuccessRequest;
  const customer = yield* getUserCustomerByUserId(UserId(session2.user.id));
  if (!customer) {
    return Response.redirect(checkoutSuccessRequest.redirectUrl ?? "/", 303);
  }
  yield* syncStripeDataToDatabase(customer.id);
  return Response.redirect(checkoutSuccessRequest.redirectUrl ?? env.VITE_PUBLIC_API_URL, 303);
});
class CheckoutSuccessRequest extends Effect.Tag("CheckoutSuccessRequest")() {
}
const CheckoutSuccessRequestLive = (request) => Layer.scoped(CheckoutSuccessRequest, Effect.succeed({
  redirectUrl: new URL(request.url).searchParams.get("redirectUrl")
}));
const ServerRoute$2 = createServerFileRoute().methods({
  GET: ({
    request
  }) => {
    return auth.handler(request);
  },
  POST: ({
    request
  }) => {
    return auth.handler(request);
  }
});
const ServerRoute$1 = createServerFileRoute().methods({
  async GET({
    request,
    params: {
      threadId
    }
  }) {
    return threadResumeStreamApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(SessionLive(request)), Effect.provide(ThreadResumeStreamParamsLive({
      id: threadId
    })), Effect.provide(DatabaseLive), Effect.runPromise);
  }
});
const threadResumeStreamApi = Effect.gen(function* () {
  const session2 = yield* Session;
  const params = yield* ThreadResumeStreamParams;
  return yield* threadResumeStreamApiHandler.pipe(Effect.annotateLogs("requestId", nanoid()), Effect.annotateLogs("userId", session2.user.id), Effect.annotateLogs("threadId", params.id));
});
const threadResumeStreamApiHandler = Effect.gen(function* () {
  const session2 = yield* Session;
  const params = yield* ThreadResumeStreamParams;
  const streamId = yield* prepareResumeThreadContext({
    threadId: params.id,
    userId: session2.user.id
  });
  const stream = yield* getResumableStream(streamId);
  if (!stream) {
    return yield* new APIError({
      status: 404,
      message: "Stream not found"
    });
  }
  return new Response(stream);
});
const ThreadResumeStreamApiSchema = z$2.object({
  id: z$2.string()
});
class ThreadResumeStreamParams extends Effect.Tag("ThreadResumeStreamParams")() {
}
const ThreadResumeStreamParamsLive = (params) => Layer.scoped(ThreadResumeStreamParams, Effect.gen(function* () {
  return yield* Effect.try({
    try: () => ThreadResumeStreamApiSchema.parse(params),
    catch: (error) => {
      return new APIError({
        status: 400,
        message: "Invalid request params",
        cause: error
      });
    }
  });
}));
const ServerRoute = createServerFileRoute().methods({
  async POST({
    request,
    params
  }) {
    return threadStopPostApi.pipe(Effect.scoped, APIError.map({
      status: 500,
      message: "Uncaught error"
    }), Effect.catchAll((e) => e.response), Effect.provide(SessionLive(request)), Effect.provide(ThreadStopPostParamsLive({
      id: params.threadId
    })), Effect.provide(DatabaseLive), Effect.provide(RedisLive), Effect.runPromise);
  }
});
const threadStopPostApi = Effect.gen(function* () {
  const session2 = yield* Session;
  const params = yield* ThreadStopPostParams;
  return yield* threadStopPostApiHandler.pipe(Effect.annotateLogs("requestId", nanoid$1()), Effect.annotateLogs("userId", session2.user.id), Effect.annotateLogs("threadId", params.id));
});
const threadStopPostApiHandler = Effect.gen(function* () {
  const session2 = yield* Session;
  const params = yield* ThreadStopPostParams;
  const thread2 = yield* getThreadById(params.id);
  if (!thread2) {
    console.log("thread not found");
    return yield* new APIError({
      status: 404,
      message: "Thread not found"
    });
  }
  if (thread2.userId !== session2.user.id) {
    return yield* new APIError({
      status: 403,
      message: "You are not allowed to modify this thread"
    });
  }
  const pubsub = yield* RedisPubSub;
  yield* pubsub.publish(`abort:${params.id}`, "abort");
  yield* updateThread({
    threadId: params.id,
    status: "ready"
  });
  return new Response(null, {
    status: 200
  });
});
const ThreadStopPostApiSchema = z$1.object({
  id: z$1.string()
});
class ThreadStopPostParams extends Effect.Tag("ThreadStopPostParams")() {
}
const ThreadStopPostParamsLive = (params) => Layer.scoped(ThreadStopPostParams, Effect.gen(function* () {
  return yield* Effect.try({
    try: () => ThreadStopPostApiSchema.parse(params),
    catch: (error) => {
      return new APIError({
        status: 400,
        message: "Invalid request params",
        cause: error
      });
    }
  });
}));
const rootServerRouteImport = createServerRootRoute();
const TeamRoute = Route$e.update({
  id: "/_team",
  getParentRoute: () => Route$f
});
const AppRoute = Route$d.update({
  id: "/_app",
  getParentRoute: () => Route$f
});
const AccountRoute = Route$c.update({
  id: "/_account",
  getParentRoute: () => Route$f
});
const AppThreadRoute = Route$b.update({
  id: "/_thread",
  getParentRoute: () => AppRoute
});
const AccountMagicLinkRoute = Route$a.update({
  id: "/magic-link",
  path: "/magic-link",
  getParentRoute: () => AccountRoute
});
const AccountLoggedOutRoute = Route$9.update({
  id: "/logged-out",
  path: "/logged-out",
  getParentRoute: () => AccountRoute
});
const AccountAccountRoute = Route$8.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => AccountRoute
});
const AppThreadIndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppThreadRoute
});
const AccountLoginIndexRoute = Route$6.update({
  id: "/login/",
  path: "/login/",
  getParentRoute: () => AccountRoute
});
const AccountAccountIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => AccountAccountRoute
});
const AppThreadThreadIdRoute = Route$4.update({
  id: "/$threadId",
  path: "/$threadId",
  getParentRoute: () => AppThreadRoute
});
const AccountAccountSubscriptionRoute = Route$3.update({
  id: "/subscription",
  path: "/subscription",
  getParentRoute: () => AccountAccountRoute
});
const AccountAccountPreferencesRoute = Route$2.update({
  id: "/preferences",
  path: "/preferences",
  getParentRoute: () => AccountAccountRoute
});
const AccountAccountModelsRoute = Route$1.update({
  id: "/models",
  path: "/models",
  getParentRoute: () => AccountAccountRoute
});
const AccountAccountAppearanceRoute = Route.update({
  id: "/appearance",
  path: "/appearance",
  getParentRoute: () => AccountAccountRoute
});
const ApiUploadthingServerRoute = ServerRoute$9.update({
  id: "/api/uploadthing",
  path: "/api/uploadthing",
  getParentRoute: () => rootServerRouteImport
});
const ApiThreadServerRoute = ServerRoute$8.update({
  id: "/api/thread",
  path: "/api/thread",
  getParentRoute: () => rootServerRouteImport
});
const ApiResetServerRoute = ServerRoute$7.update({
  id: "/api/reset",
  path: "/api/reset",
  getParentRoute: () => rootServerRouteImport
});
const ApiCustomerPortalServerRoute = ServerRoute$6.update({
  id: "/api/customer-portal",
  path: "/api/customer-portal",
  getParentRoute: () => rootServerRouteImport
});
const ApiCheckoutServerRoute = ServerRoute$5.update({
  id: "/api/checkout",
  path: "/api/checkout",
  getParentRoute: () => rootServerRouteImport
});
const ApiWebhookStripeServerRoute = ServerRoute$4.update({
  id: "/api/webhook/stripe",
  path: "/api/webhook/stripe",
  getParentRoute: () => rootServerRouteImport
});
const ApiCheckoutSuccessServerRoute = ServerRoute$3.update({
  id: "/success",
  path: "/success",
  getParentRoute: () => ApiCheckoutServerRoute
});
const ApiAuthSplatServerRoute = ServerRoute$2.update({
  id: "/api/auth/$",
  path: "/api/auth/$",
  getParentRoute: () => rootServerRouteImport
});
const ApiThreadThreadIdStreamServerRoute = ServerRoute$1.update({
  id: "/$threadId/stream",
  path: "/$threadId/stream",
  getParentRoute: () => ApiThreadServerRoute
});
const ApiThreadThreadIdStopServerRoute = ServerRoute.update({
  id: "/$threadId/stop",
  path: "/$threadId/stop",
  getParentRoute: () => ApiThreadServerRoute
});
const AccountAccountRouteChildren = {
  AccountAccountAppearanceRoute,
  AccountAccountModelsRoute,
  AccountAccountPreferencesRoute,
  AccountAccountSubscriptionRoute,
  AccountAccountIndexRoute
};
const AccountAccountRouteWithChildren = AccountAccountRoute._addFileChildren(AccountAccountRouteChildren);
const AccountRouteChildren = {
  AccountAccountRoute: AccountAccountRouteWithChildren,
  AccountLoggedOutRoute,
  AccountMagicLinkRoute,
  AccountLoginIndexRoute
};
const AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
const AppThreadRouteChildren = {
  AppThreadThreadIdRoute,
  AppThreadIndexRoute
};
const AppThreadRouteWithChildren = AppThreadRoute._addFileChildren(AppThreadRouteChildren);
const AppRouteChildren = {
  AppThreadRoute: AppThreadRouteWithChildren
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const ApiCheckoutServerRouteChildren = {
  ApiCheckoutSuccessServerRoute
};
const ApiCheckoutServerRouteWithChildren = ApiCheckoutServerRoute._addFileChildren(ApiCheckoutServerRouteChildren);
const ApiThreadServerRouteChildren = {
  ApiThreadThreadIdStopServerRoute,
  ApiThreadThreadIdStreamServerRoute
};
const ApiThreadServerRouteWithChildren = ApiThreadServerRoute._addFileChildren(ApiThreadServerRouteChildren);
const rootRouteChildren = {
  AccountRoute: AccountRouteWithChildren,
  AppRoute: AppRouteWithChildren,
  TeamRoute
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
const rootServerRouteChildren = {
  ApiCheckoutServerRoute: ApiCheckoutServerRouteWithChildren,
  ApiCustomerPortalServerRoute,
  ApiResetServerRoute,
  ApiThreadServerRoute: ApiThreadServerRouteWithChildren,
  ApiUploadthingServerRoute,
  ApiAuthSplatServerRoute,
  ApiWebhookStripeServerRoute
};
const serverRouteTree = rootServerRouteImport._addFileChildren(rootServerRouteChildren)._addFileTypes();
const routeTree_gen = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routeTree,
  serverRouteTree
}, Symbol.toStringTag, { value: "Module" }));
const createRouter = () => {
  const router2 = createRouter$1({
    routeTree,
    scrollRestoration: true,
    defaultStaleTime: Infinity,
    defaultPreloadStaleTime: Infinity
  });
  return router2;
};
const serverEntry$1 = createStartHandler({
  createRouter
})(defaultStreamHandler);
const serverEntry = defineEventHandler(function(event) {
  const request = toWebRequest(event);
  return serverEntry$1({ request });
});

export { Anonymous as A, Button as B, getThreadByIdAndUserId as C, Dialog as D, SessionLive as E, FreeLimits as F, DatabaseLive as G, DatabaseProvider as H, ProDialog as I, LogoutDialog as L, ModelIcon as M, NotAnonymous as N, ProLimits as P, Route$6 as R, Session as S, Toaster as T, ZeronIcon as Z, useDatabase as a, DialogContent as b, cn as c, DialogHeader as d, serverEntry as default, DialogTitle as e, DialogDescription as f, DialogFooter as g, useUser as h, authClient as i, useSettings as j, useParamsThreadId as k, dialogStore as l, formatTokenPrice as m, nanoid as n, useThreadFromParams as o, useSession as p, RevokeSessionDialog as q, useCustomer as r, seededRandom as s, useUsage as t, useThreads as u, AnonymousLimits as v, createServerRpc as w, createServerFn as x, getWebRequest as y, getSSRData as z };
//# sourceMappingURL=ssr.mjs.map
