import { jsx, jsxs } from 'react/jsx-runtime';
import { T as Tooltip, a as TooltipTrigger, b as TooltipPositioner, c as TooltipContent } from './tooltip-D6Wn3Zfb.mjs';
import { BrainIcon, EyeIcon, FileIcon, WrenchIcon } from 'lucide-react';
import { match } from 'ts-pattern';
import { c as cn } from './ssr.mjs';

function CapabilityBadges({ capabilities, className }) {
  if (!capabilities || capabilities.length === 0) {
    return null;
  }
  const sortedCapabilities = [...capabilities].sort((a, b) => a.localeCompare(b));
  return /* @__PURE__ */ jsx("div", { className: cn("flex items-center gap-1", className), children: sortedCapabilities.map((capability) => /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "text-[10px] font-medium text-primary p-1 rounded-lg z-1",
          match(capability).with("reasoning", () => "bg-pink-400/10").with("vision", () => "bg-blue-400/10").with("documents", () => "bg-yellow-400/10").with("tools", () => "bg-green-400/10").exhaustive()
        ),
        children: match(capability).with("reasoning", () => /* @__PURE__ */ jsx(BrainIcon, { className: "size-3.5 text-pink-400" })).with("vision", () => /* @__PURE__ */ jsx(EyeIcon, { className: "size-3.5 text-blue-400" })).with("documents", () => /* @__PURE__ */ jsx(FileIcon, { className: "size-3.5 text-yellow-400" })).with("tools", () => /* @__PURE__ */ jsx(WrenchIcon, { className: "size-3.5 text-green-400" })).exhaustive()
      }
    ) }),
    /* @__PURE__ */ jsx(TooltipPositioner, { children: /* @__PURE__ */ jsx(TooltipContent, { children: capability.charAt(0).toUpperCase() + capability.slice(1) }) })
  ] }, capability)) });
}

export { CapabilityBadges as C };
//# sourceMappingURL=capability-badges-B_Ev6rdj.mjs.map
