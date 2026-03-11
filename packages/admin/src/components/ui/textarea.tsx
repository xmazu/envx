import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "oa-:flex oa-:field-sizing-content oa-:min-h-16 oa-:w-full oa-:rounded-md oa-:border oa-:border-input oa-:bg-transparent oa-:px-3 oa-:py-2 oa-:text-base oa-:shadow-xs oa-:transition-[color,box-shadow] oa-:outline-none oa-:placeholder:text-muted-foreground oa-:focus-visible:border-ring oa-:focus-visible:ring-[3px] oa-:focus-visible:ring-ring/50 oa-:disabled:cursor-not-allowed oa-:disabled:opacity-50 oa-:aria-invalid:border-destructive oa-:aria-invalid:ring-destructive/20 oa-:md:text-sm oa-:dark:bg-input/30 oa-:dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
