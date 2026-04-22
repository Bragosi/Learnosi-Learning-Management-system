"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { createContext, useContext } from "react";


const FormFieldContext = createContext<{ name: string } | null>(null);

type FormProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode;
} & React.ComponentProps<typeof FormProvider<TFieldValues>>;

export function Form<TFieldValues extends FieldValues>({
  children,
  ...props
}: FormProps<TFieldValues>) {
  return <FormProvider {...props}>{children}</FormProvider>;
}

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({ name, ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error("useFormField must be used inside FormField");
  }
  return context;
}

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <label className="text-sm font-medium">{children}</label>;
}

export function FormControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function FormMessage() {
  const { formState } = useFormContext();
  const { name } = useFormField();

  const error = formState.errors[name as keyof typeof formState.errors];

  if (!error) return null;

  return (
    <p className="text-sm text-red-500">
      {String(error.message ?? "")}
    </p>
  );
}