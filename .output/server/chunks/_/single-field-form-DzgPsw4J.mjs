import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { B as Button } from './ssr.mjs';
import { Label } from '@radix-ui/react-label';
import { useForm } from '@tanstack/react-form';
import z$2 from 'zod';

const DefaultSingleFieldSchema = z$2.object({
  value: z$2.string().min(1).max(32)
});
function SingleFieldForm(props) {
  const schema = props.schema || DefaultSingleFieldSchema;
  const form = useForm({
    defaultValues: {
      value: props.defaultValue
    },
    validators: {
      onBlur: schema,
      onSubmit: schema,
      onMount: schema,
      onChange: schema
    },
    onSubmit: async ({ value }) => {
      props.onSubmit(value.value);
    }
  });
  return /* @__PURE__ */ jsx(
    "form",
    {
      className: "flex flex-col border rounded-lg overflow-hidden bg-card",
      onSubmit: (e) => {
        e.preventDefault();
        form.handleSubmit();
      },
      children: /* @__PURE__ */ jsx(form.Field, { name: "value", children: (field) => {
        var _a;
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "username", className: "text-lg font-semibold", children: props.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: props.description }),
            props.renderInput({
              value: field.state.value,
              onChange: field.handleChange
            })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-sidebar p-4 flex justify-between items-center border-t", children: [
            field.state.meta.errors.length > 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: (_a = field.state.meta.errors[0]) == null ? void 0 : _a.message }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: props.footerMessage }),
            /* @__PURE__ */ jsx(
              form.Subscribe,
              {
                selector: (state) => ({
                  isSubmitting: state.isSubmitting,
                  isValid: state.isValid,
                  isDirty: state.isDirty
                }),
                children: ({ isSubmitting, isDirty, isValid }) => /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    type: "submit",
                    disabled: isSubmitting || !isValid || !isDirty,
                    children: /* @__PURE__ */ jsx("span", { children: "Save" })
                  }
                )
              }
            )
          ] })
        ] });
      } })
    }
  );
}

export { SingleFieldForm as S };
//# sourceMappingURL=single-field-form-DzgPsw4J.mjs.map
