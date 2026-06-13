import { jsxs, jsx } from 'react/jsx-runtime';
import { c as cn } from './ssr.mjs';

function Section(props) {
  return /* @__PURE__ */ jsxs("div", { className: cn("grid grid-cols-1 md:grid-cols-3 gap-6", props.className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "font-bold", children: props.title }),
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: props.description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "col-span-2 flex flex-col gap-6", children: props.children })
  ] });
}

export { Section as S };
//# sourceMappingURL=section-DSNePGi9.mjs.map
