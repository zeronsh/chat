import { jsx, jsxs } from 'react/jsx-runtime';
import { Tooltip as Tooltip$1 } from '@base-ui-components/react/tooltip';
import { c as cn } from './ssr.mjs';

function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tooltip$1.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(Tooltip$1.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipPositioner({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Portal, { children: /* @__PURE__ */ jsx(
    Tooltip$1.Positioner,
    {
      "data-slot": "tooltip-positioner",
      sideOffset: 8,
      className: cn("z-50", className),
      ...props
    }
  ) });
}
function TooltipContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Tooltip$1.Popup,
    {
      "data-slot": "tooltip-content",
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipArrow, {})
      ]
    }
  );
}
function TooltipArrow({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tooltip$1.Arrow,
    {
      "data-slot": "tooltip-arrow",
      className: cn(
        "bg-primary fill-primary z-50 size-2.5 rotate-45 rounded-[2px]",
        "data-[side=bottom]:-translate-y-1/2 data-[side=bottom]:top-px",
        "data-[side=top]:translate-y-1/2 data-[side=top]:bottom-px",
        "data-[side=left]:translate-x-1/2 data-[side=left]:right-px",
        "data-[side=right]:-translate-x-1/2 data-[side=right]:left-px",
        className
      ),
      ...props
    }
  );
}

export { Tooltip as T, TooltipTrigger as a, TooltipPositioner as b, TooltipContent as c, TooltipProvider as d };
//# sourceMappingURL=tooltip-D6Wn3Zfb.mjs.map
