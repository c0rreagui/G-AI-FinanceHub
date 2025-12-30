import * as React from "react"
import { cn } from "@/utils/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-white/10 hover:border-white/20",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
