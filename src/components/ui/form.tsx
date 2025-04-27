"use client";

import * as React from "react";
import { useFormContext, useFormState } from "react-hook-form";

const FormFieldContext = React.createContext<{ name: string } | null>(null);
const FormItemContext = React.createContext<{ id: string } | null>(null);

// Enhanced Form component that properly filters React Hook Form props
export const Form = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    onSubmit?: (e: React.FormEvent) => void;
    handleSubmit?: any;
    control?: any;
    setValue?: any;
    getValues?: any;
    watch?: any;
    formState?: any;
    register?: any;
    reset?: any;
    trigger?: any;
  }
>(({ children, className, onSubmit, handleSubmit, ...props }, ref) => {
  // Filter out React Hook Form specific props that shouldn't be passed to DOM
  const {
    control,
    setValue,
    getValues,
    watch,
    formState,
    register,
    reset,
    trigger,
    ...domProps
  } = props;

  return (
    <div className={className} ref={ref} {...domProps}>
      {children}
    </div>
  );
});
Form.displayName = "Form";

export const FormField = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  );
};

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={className} ref={ref} {...props}>
        {children}
      </div>
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <label className={className} htmlFor={formItemId} ref={ref} {...props} />
  );
});
FormLabel.displayName = "FormLabel";

export const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className={className} ref={ref} {...props}>
      {children}
    </div>
  );
});
FormControl.displayName = "FormControl";

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p className={className} id={formDescriptionId} ref={ref} {...props} />
  );
});
FormDescription.displayName = "FormDescription";

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formMessageId } = useFormField();

  return <p className={className} id={formMessageId} ref={ref} {...props} />;
});
FormMessage.displayName = "FormMessage";

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext || { id: "" };

  // Check if we're in a form context
  const formContext = useFormContext();

  let fieldState;
  if (formContext) {
    const { getFieldState } = formContext;
    fieldState = useFormState({ name: fieldContext.name });
  }

  if (!formContext) {
    // Return a minimal object when not in a form context
    return {
      id,
      name: fieldContext.name,
      formItemId: `${id}-form-item`,
      formDescriptionId: `${id}-form-item-description`,
      formMessageId: `${id}-form-item-message`,
      // Add empty error state
      error: undefined,
    };
  }

  // Only access form context properties when it exists
  const { getFieldState } = formContext;

  const returnedFieldState = formContext ? fieldState : undefined;
  const actualFieldState = returnedFieldState
    ? formContext.getFieldState(fieldContext.name, returnedFieldState)
    : undefined;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...actualFieldState,
  };
};
