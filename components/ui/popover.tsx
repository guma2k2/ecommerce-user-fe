"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverPortal = PopoverPrimitive.Portal
const PopoverClose = PopoverPrimitive.Close
const PopoverTitle = PopoverPrimitive.Title
const PopoverDescription = PopoverPrimitive.Description

function PopoverContent({
  className,
  align = "end",
  side = "bottom",
  sideOffset = 8,
  showArrow = true,
  children,
  ...props
}: PopoverPrimitive.Popup.Props & {
  align?: PopoverPrimitive.Positioner.Props["align"]
  side?: PopoverPrimitive.Positioner.Props["side"]
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"]
  showArrow?: boolean
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 w-72 rounded-xl border border-border/80 shadow-xl outline-hidden",
            "data-[transition=starting]:scale-95 data-[transition=starting]:opacity-0",
            "data-[transition=ending]:scale-95 data-[transition=ending]:opacity-0",
            "transition-[transform,opacity] duration-150 ease-out",
            className
          )}
          {...props}
        >
          {showArrow && (
            <PopoverPrimitive.Arrow className="data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 z-10 size-3 rotate-45 border-l border-t border-border/80 bg-popover" />
          )}
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
}
