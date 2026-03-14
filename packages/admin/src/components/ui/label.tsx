"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "oa-:flex oa-:items-center oa-:gap-2 oa-:text-sm oa-:leading-none oa-:font-medium oa-:select-none oa-:group-data-[disabled=true]:pointer-events-none oa-:group-data-[disabled=true]:opacity-50 oa-:peer-disabled:cursor-not-allowed oa-:peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
