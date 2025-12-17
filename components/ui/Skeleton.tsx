import { cn } from "@/utils/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-muted/40",
        "animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
