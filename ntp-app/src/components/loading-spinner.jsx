import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const LoadingSpinner = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  return (
    <div 
      ref={ref}
      className={cn(
        "flex items-center justify-center",
        className
      )} 
      {...props}
    >
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )} 
      />
    </div>
  )
})
LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner } 