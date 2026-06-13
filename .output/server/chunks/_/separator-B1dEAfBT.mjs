import { jsx } from 'react/jsx-runtime';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { c as cn } from './ssr.mjs';

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-foreground/10 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}

export { Separator as S };
//# sourceMappingURL=separator-B1dEAfBT.mjs.map
