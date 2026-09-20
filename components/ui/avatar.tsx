import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.ComponentProps<"div"> {
  src?: string | null
  alt?: string
  fallback?: string
}

function Avatar({ className, src, alt = "Avatar", fallback = "U", ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(!src)

  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted",
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="aspect-square size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center font-medium uppercase text-muted-foreground">
          {fallback.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

export { Avatar }
