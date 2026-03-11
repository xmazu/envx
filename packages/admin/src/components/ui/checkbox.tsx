"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "oa-:peer oa-:size-4 oa-:shrink-0 oa-:rounded-[4px] oa-:border oa-:border-input oa-:shadow-xs oa-:transition-shadow oa-:outline-none oa-:focus-visible:border-ring oa-:focus-visible:ring-[3px] oa-:focus-visible:ring-ring/50 oa-:disabled:cursor-not-allowed oa-:disabled:opacity-50 oa-:aria-invalid:border-destructive oa-:aria-invalid:ring-destructive/20 oa-:data-[state=checked]:border-primary oa-:data-[state=checked]:bg-primary oa-:data-[state=checked]:text-primary-foreground oa-:dark:bg-input/30 oa-:dark:aria-invalid:ring-destructive/40 oa-:dark:data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="oa-:grid oa-:place-content-center oa-:text-current oa-:transition-none"
      >
        <CheckIcon className="oa-:size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
