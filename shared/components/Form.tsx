'use client';

import { Textarea, Checkbox, Input, Field, FieldContent, FieldDescription, FieldError, FieldLabel, Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui"
import type { ReactNode } from "react"
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form"

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName
  label?: ReactNode
  description?: ReactNode
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"]
}

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean
  controlFirst?: boolean
  children: (
    field: Parameters<ControllerProps<TFieldValues, TName, TTransformedValues>["render"]>[0]["field"] & {
      "aria-invalid": boolean
      id: string
    }
  ) => ReactNode
}

type FormControlFunc<ExtraProps extends Record<string, unknown> = Record<never, never>> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode

export default function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  control,
  label,
  name,
  description,
  controlFirst,
  horizontal
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        )
        const control = children({ ...field, id: field.name, "aria-invalid": fieldState.invalid })
        const errorElement = fieldState.invalid && <FieldError errors={[fieldState.error]} />

        return (
          <Field data-invalid={fieldState.invalid} orientation={horizontal ? "horizontal" : undefined}>
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {errorElement}
              </>
            )}
          </Field>
        )
      }}
    />
  )
}

export const FormInput: FormControlFunc<
  Omit<React.ComponentProps<typeof Input>, "name" | "value" | "defaultValue">
> = ({ type, placeholder, ...props }) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
        />
      )}
    </FormBase>
  )
}

export const FormSelect: FormControlFunc<{
  children: ReactNode
  placeholder?: string
  disabled?: boolean
  className?: string
}> = ({ children, placeholder, disabled, className, ...props }) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, value, ...field }) => (
        <Select {...field} value={value ?? ""} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
            className={`w-full ${className || ""}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  )
}

export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => <Checkbox {...field} checked={value} onCheckedChange={onChange} />}
    </FormBase>
  )
}

export const FormTextarea: FormControlFunc<
  Omit<React.ComponentProps<typeof Textarea>, "name" | "value" | "defaultValue">
> = (props) => {
  const { control, label, name, description, ...textareaProps } = props
  return (
    <FormBase control={control} name={name} label={label} description={description}>
      {(field) => (
        <Textarea
          {...field}
          {...textareaProps}
        />
      )}
    </FormBase>
  )
}

