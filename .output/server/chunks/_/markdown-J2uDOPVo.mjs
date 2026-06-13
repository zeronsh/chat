import { jsx, jsxs } from 'react/jsx-runtime';
import { c as cn, B as Button } from './ssr.mjs';
import { memo, useMemo, createContext, useId, useContext, useState, useEffect } from 'react';
import { Streamdown } from 'streamdown';
import { createHighlighter, createCssVariablesTheme } from 'shiki';
import { Check, Copy } from 'lucide-react';
import { T as Tooltip, a as TooltipTrigger, b as TooltipPositioner, c as TooltipContent } from './tooltip-D6Wn3Zfb.mjs';
import '@tanstack/react-router';
import '@t3-oss/env-core';
import 'zod';
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

const Response = memo(
  ({ className, ...props }) => /* @__PURE__ */ jsx(
    Streamdown,
    {
      className: cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className),
      ...props
    }
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
Response.displayName = "Response";
let highlighterInstance = null;
let highlighterPromise = null;
const myTheme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true
});
const getHighlighter = async () => {
  if (highlighterInstance) {
    return highlighterInstance;
  }
  if (highlighterPromise) {
    return highlighterPromise;
  }
  highlighterPromise = createHighlighter({
    themes: [myTheme],
    langs: [
      "javascript",
      "typescript",
      "jsx",
      "tsx",
      "python",
      "java",
      "c",
      "cpp",
      "csharp",
      "php",
      "ruby",
      "go",
      "rust",
      "swift",
      "kotlin",
      "scala",
      "html",
      "css",
      "scss",
      "sass",
      "json",
      "xml",
      "yaml",
      "markdown",
      "bash",
      "shell",
      "sql",
      "dockerfile",
      "nginx",
      "apache",
      "plaintext"
    ]
  });
  highlighterInstance = await highlighterPromise;
  return highlighterInstance;
};
const useCodeHighlighter = ({
  codeString,
  language,
  shouldHighlight = true
}) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isHighlighting, setIsHighlighting] = useState(true);
  useEffect(() => {
    if (!shouldHighlight) {
      setIsHighlighting(false);
      return;
    }
    setIsHighlighting(true);
    const timer = requestAnimationFrame(async () => {
      try {
        const highlighter = await getHighlighter();
        const supportedLangs = highlighter.getLoadedLanguages();
        const langToUse = supportedLangs.includes(language) ? language : "plaintext";
        const highlighted = highlighter.codeToHtml(codeString, {
          lang: langToUse,
          theme: "css-variables"
        });
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(`<pre><code>${codeString}</code></pre>`);
      } finally {
        setIsHighlighting(false);
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [codeString, language, shouldHighlight]);
  return {
    highlightedCode,
    isHighlighting
  };
};
function CodeBlock({ children, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "not-prose flex min-w-full w-0 flex-col overflow-clip border",
        "border-border bg-card text-card-foreground rounded-xl",
        className
      ),
      ...props,
      children
    }
  );
}
function CodeBlockCode({
  code,
  language = "tsx",
  theme = "css-variables",
  className,
  ...props
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { highlightedCode } = useCodeHighlighter({
    codeString: code,
    language,
    shouldHighlight: true
  });
  function handleCopy() {
    if (isCopied) return;
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2e3);
    });
  }
  const classNames = cn("w-full overflow-x-auto", className);
  const content = useMemo(() => {
    if (!(code == null ? void 0 : code.trim())) {
      return /* @__PURE__ */ jsx("pre", { className: "px-4" });
    }
    if (!highlightedCode) {
      return /* @__PURE__ */ jsx("pre", { className: "px-4 py-0! font-mono", children: /* @__PURE__ */ jsx("code", { children: code }) });
    }
    return /* @__PURE__ */ jsx("div", { className: "px-4", dangerouslySetInnerHTML: { __html: highlightedCode } });
  }, [highlightedCode, code]);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center border-b justify-between p-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: language }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: handleCopy,
          className: "rounded-lg h-6 w-6 hover:bg-sidebar/50",
          children: isCopied ? /* @__PURE__ */ jsx(Check, { className: "size-3" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: classNames, ...props, children: /* @__PURE__ */ jsx("div", { className: "py-4 text-[13px] [&>pre]:px-4 [&>pre]:py-4", children: content }) })
  ] });
}
const citationSources = [
  {
    name: "Wikipedia",
    pattern: /Wikipedia/i,
    urlGenerator: (title, source) => {
      const searchTerm = `${title} ${source.replace(/\s+[-–—]\s+Wikipedia/i, "")}`.trim();
      return `https://en.wikipedia.org/wiki/${encodeURIComponent(
        searchTerm.replace(/\s+/g, "_")
      )}`;
    }
  },
  {
    name: "arXiv",
    pattern: /arXiv:(\d+\.\d+)/i,
    urlGenerator: (_, source) => {
      const match = source.match(/arXiv:(\d+\.\d+)/i);
      return match ? `https://arxiv.org/abs/${match[1]}` : null;
    }
  },
  {
    name: "GitHub",
    pattern: /github\.com\/[^\/]+\/[^\/\s]+/i,
    urlGenerator: (_, source) => {
      const match = source.match(/(https?:\/\/github\.com\/[^\/]+\/[^\/\s]+)/i);
      return match ? match[1] : null;
    }
  },
  {
    name: "DOI",
    pattern: /doi:(\S+)/i,
    urlGenerator: (_, source) => {
      const match = source.match(/doi:(\S+)/i);
      return match ? `https://doi.org/${match[1]}` : null;
    }
  }
];
const processCitation = (title, source) => {
  for (const citationSource of citationSources) {
    if (citationSource.pattern.test(source)) {
      const url = citationSource.urlGenerator(title, source);
      if (url) {
        return {
          text: `${title} - ${source}`,
          url
        };
      }
    }
  }
  return null;
};
function extractDomain(url) {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
    return match ? match[1] : url;
  }
}
function extractLanguage(className) {
  if (!className) return "plaintext";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "plaintext";
}
const INITIAL_COMPONENTS = {
  p: function TextComponent({ children, className }) {
    const id = useId();
    const { animated } = useMarkdownContext();
    if (typeof children === "string" && animated) {
      const words = children.split(/\s+/);
      const segments = words.reduce((acc, cur, idx) => {
        if (idx % 10 === 0) {
          const segment = words.slice(idx, idx + 10).join(" ");
          acc.push(idx + 10 >= words.length ? segment : segment + " ");
        }
        return acc;
      }, []);
      return /* @__PURE__ */ jsx("p", { className: cn(className, "w-full"), children: segments.map((segment, idx) => {
        return /* @__PURE__ */ jsx(
          "span",
          {
            className: "fade-segment",
            style: {
              animationDelay: `${idx * 1.5}ms`
            },
            children: segment
          },
          `${id}-${idx}`
        );
      }) });
    }
    return /* @__PURE__ */ jsx("p", { className: cn(className, "w-full"), children });
  },
  code: function CodeComponent(props) {
    var _a, _b, _c, _d, _e, _f, _g;
    const isInline = !((_b = (_a = props.node) == null ? void 0 : _a.position) == null ? void 0 : _b.start.line) || ((_d = (_c = props.node) == null ? void 0 : _c.position) == null ? void 0 : _d.start.line) === ((_f = (_e = props.node) == null ? void 0 : _e.position) == null ? void 0 : _f.end.line);
    if (isInline) {
      return /* @__PURE__ */ jsx("span", { className: cn("bg-muted rounded-sm px-1 font-mono text-sm"), children: props.children });
    }
    const language = extractLanguage(props.className);
    return /* @__PURE__ */ jsx(CodeBlock, { children: /* @__PURE__ */ jsx(
      CodeBlockCode,
      {
        code: (_g = props.children) == null ? void 0 : _g.replace("\n```*", ""),
        language: (language == null ? void 0 : language.trim()) || "plaintext"
      }
    ) });
  },
  pre: function PreComponent(props) {
    return props.children;
  },
  a: function LinkComponent({ href, children }) {
    const { citations } = useMarkdownContext();
    const citationIndex = citations.findIndex((citation) => citation.link === href);
    if (citationIndex !== -1) {
      const domain = extractDomain(href);
      return /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger, { children: /* @__PURE__ */ jsx(
          "a",
          {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-xs bg-muted rounded-xl px-1 flex items-center no-underline",
            children: domain || citationIndex + 1
          }
        ) }),
        /* @__PURE__ */ jsx(TooltipPositioner, { children: /* @__PURE__ */ jsx(TooltipContent, { children: citations[citationIndex].text }) })
      ] });
    }
    return /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", children });
  }
};
const MarkdownContext = createContext(null);
const useMarkdownContext = () => {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error("useMarkdownContext must be used within a MarkdownProvider");
  }
  return context;
};
function MarkdownComponent({
  children,
  className,
  components = INITIAL_COMPONENTS,
  animated = false
}) {
  const citations = useMemo(() => {
    const citations2 = [];
    const stdLinkRegex = /\[([^\]]+)\]\(((?:\([^()]*\)|[^()])*)\)/g;
    children = children.replace(stdLinkRegex, (_, text, url) => {
      citations2.push({ text, link: url });
      return `[${text}](${url})`;
    });
    const refWithUrlRegex = /(?:\[(?:(?:\[?(PDF|DOC|HTML)\]?\s+)?([^\]]+))\]|\b([^.!?\n]+?(?:\s+[-–—]\s+\w+|\s+\([^)]+\)))\b)(?:\s*(?:\(|\[\s*|\s+))(https?:\/\/[^\s)]+)(?:\s*[)\]]|\s|$)/g;
    children = children.replace(refWithUrlRegex, (_, docType, bracketText, plainText, url) => {
      const text = bracketText || plainText;
      const fullText = (docType ? `[${docType}] ` : "") + text;
      const cleanUrl = url.replace(/[.,;:]+$/, "");
      citations2.push({ text: fullText.trim(), link: cleanUrl });
      return `[${fullText.trim()}](${cleanUrl})`;
    });
    const quotedTitleRegex = /"([^"]+)"(?:\s+([^.!?\n]+?)(?:\s+[-–—]\s+(?:[A-Z][a-z]+(?:\.[a-z]+)?|\w+:\S+)))/g;
    children = children.replace(quotedTitleRegex, (match, title, source) => {
      const citation = processCitation(title, source);
      if (citation) {
        citations2.push({ text: citation.text.trim(), link: citation.url });
        return `[${citation.text.trim()}](${citation.url})`;
      }
      return match;
    });
    const rawUrlRegex = /(https?:\/\/[^\s]+\.(?:pdf|doc|docx|ppt|pptx|xls|xlsx))\b/gi;
    children = children.replace(rawUrlRegex, (match, url) => {
      const filename = url.split("/").pop() || url;
      const alreadyLinked = citations2.some((citation) => citation.link === url);
      if (!alreadyLinked) {
        citations2.push({ text: filename, link: url });
      }
      return match;
    });
    return citations2.filter((citation) => citation.link !== citation.text);
  }, [children]);
  return /* @__PURE__ */ jsx(MarkdownContext.Provider, { value: { citations, animated }, children: /* @__PURE__ */ jsx(Response, { className, components, children }) });
}
const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
//# sourceMappingURL=markdown-J2uDOPVo.mjs.map
