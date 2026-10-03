import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance",
      h2: "scroll-m-20 text-2xl sm:text-3xl font-bold tracking-tight text-balance",
      h3: "scroll-m-20 text-xl sm:text-2xl font-semibold tracking-tight text-balance",
      h4: "scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight text-balance",
      h5: "scroll-m-20 text-base sm:text-lg font-semibold tracking-tight text-balance",
      h6: "text-sm sm:text-base font-semibold tracking-tight text-balance",
      p: "leading-7 [&:not(:first-child)]:mt-3",
      lead: "text-lg sm:text-xl text-muted-foreground leading-relaxed",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      caption: "text-xs text-muted-foreground",
      subtitle: "text-sm sm:text-base font-medium text-muted-foreground",
      overline: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      label: "text-sm font-semibold text-foreground",
      code: "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      blockquote: "mt-6 border-l-2 border-border pl-6 italic",
      tabular: "tabular-nums tracking-tight",
    },
    affects: {
      default: "",
      removeMargin: "!mt-0 !mb-0",
      truncate: "truncate min-w-0",
      balance: "text-balance",
    },
  },
  defaultVariants: {
    variant: "p",
    affects: "default",
  },
})

export type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>

const defaultTagMap: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
  caption: "span",
  subtitle: "p",
  overline: "span",
  label: "span",
  code: "code",
  blockquote: "blockquote",
  tabular: "span",
}

export type TypographyProps<E extends React.ElementType = "p"> = {
  as?: E
  className?: string
  children?: React.ReactNode
} & VariantProps<typeof typographyVariants> &
  Omit<React.ComponentPropsWithoutRef<E>, "as" | "className" | "children">

export function Typography<E extends React.ElementType = "p">({
  as,
  variant = "p",
  affects = "default",
  className,
  children,
  ...props
}: TypographyProps<E>) {
  const Component = as || (variant ? defaultTagMap[variant] : "p") || "p"

  return (
    <Component
      data-slot="typography"
      className={cn(typographyVariants({ variant, affects }), className)}
      {...props}
    >
      {children}
    </Component>
  )
}

type SubComponentProps<E extends React.ElementType> = {
  as?: React.ElementType
  affects?: VariantProps<typeof typographyVariants>["affects"]
} & React.ComponentPropsWithoutRef<E>

export function TypographyH1({ as, className, affects, ...props }: SubComponentProps<"h1">) {
  return <Typography as={as || "h1"} variant="h1" affects={affects} className={className} {...props} />
}

export function TypographyH2({ as, className, affects, ...props }: SubComponentProps<"h2">) {
  return <Typography as={as || "h2"} variant="h2" affects={affects} className={className} {...props} />
}

export function TypographyH3({ as, className, affects, ...props }: SubComponentProps<"h3">) {
  return <Typography as={as || "h3"} variant="h3" affects={affects} className={className} {...props} />
}

export function TypographyH4({ as, className, affects, ...props }: SubComponentProps<"h4">) {
  return <Typography as={as || "h4"} variant="h4" affects={affects} className={className} {...props} />
}

export function TypographyH5({ as, className, affects, ...props }: SubComponentProps<"h5">) {
  return <Typography as={as || "h5"} variant="h5" affects={affects} className={className} {...props} />
}

export function TypographyH6({ as, className, affects, ...props }: SubComponentProps<"h6">) {
  return <Typography as={as || "h6"} variant="h6" affects={affects} className={className} {...props} />
}

export function TypographyP({ as, className, affects, ...props }: SubComponentProps<"p">) {
  return <Typography as={as || "p"} variant="p" affects={affects} className={className} {...props} />
}

export function TypographyLead({ as, className, affects, ...props }: SubComponentProps<"p">) {
  return <Typography as={as || "p"} variant="lead" affects={affects} className={className} {...props} />
}

export function TypographyLarge({ as, className, affects, ...props }: SubComponentProps<"div">) {
  return <Typography as={as || "div"} variant="large" affects={affects} className={className} {...props} />
}

export function TypographySmall({ as, className, affects, ...props }: SubComponentProps<"small">) {
  return <Typography as={as || "small"} variant="small" affects={affects} className={className} {...props} />
}

export function TypographyMuted({ as, className, affects, ...props }: SubComponentProps<"p">) {
  return <Typography as={as || "p"} variant="muted" affects={affects} className={className} {...props} />
}

export function TypographyCaption({ as, className, affects, ...props }: SubComponentProps<"span">) {
  return <Typography as={as || "span"} variant="caption" affects={affects} className={className} {...props} />
}

export function TypographySubtitle({ as, className, affects, ...props }: SubComponentProps<"p">) {
  return <Typography as={as || "p"} variant="subtitle" affects={affects} className={className} {...props} />
}

export function TypographyOverline({ as, className, affects, ...props }: SubComponentProps<"span">) {
  return <Typography as={as || "span"} variant="overline" affects={affects} className={className} {...props} />
}

export function TypographyLabel({ as, className, affects, ...props }: SubComponentProps<"span">) {
  return <Typography as={as || "span"} variant="label" affects={affects} className={className} {...props} />
}

export function TypographyCode({ as, className, affects, ...props }: SubComponentProps<"code">) {
  return <Typography as={as || "code"} variant="code" affects={affects} className={className} {...props} />
}

export function TypographyBlockquote({ as, className, affects, ...props }: SubComponentProps<"blockquote">) {
  return <Typography as={as || "blockquote"} variant="blockquote" affects={affects} className={className} {...props} />
}

export function TypographyTabular({ as, className, affects, ...props }: SubComponentProps<"span">) {
  return <Typography as={as || "span"} variant="tabular" affects={affects} className={className} {...props} />
}

Typography.H1 = TypographyH1
Typography.H2 = TypographyH2
Typography.H3 = TypographyH3
Typography.H4 = TypographyH4
Typography.H5 = TypographyH5
Typography.H6 = TypographyH6
Typography.P = TypographyP
Typography.Lead = TypographyLead
Typography.Large = TypographyLarge
Typography.Small = TypographySmall
Typography.Muted = TypographyMuted
Typography.Caption = TypographyCaption
Typography.Subtitle = TypographySubtitle
Typography.Overline = TypographyOverline
Typography.Label = TypographyLabel
Typography.Code = TypographyCode
Typography.Blockquote = TypographyBlockquote
Typography.Tabular = TypographyTabular
