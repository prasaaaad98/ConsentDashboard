"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  // Add sliding indicator logic
  const listRef = React.useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector('[data-state="active"]') as HTMLElement | null
    if (active) {
      setIndicatorStyle({
        width: `${active.offsetWidth}px`,
        left: `${active.offsetLeft}px`,
        transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)'
      })
    }
  }, [children])

  return (
    <div className={cn("relative", className)}>
  <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node as HTMLDivElement
          if (typeof ref === 'function') ref(node as HTMLDivElement)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement
        }}
    className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground relative z-10",
      className
    )}
    {...props}
      >
        {children}
      </TabsPrimitive.List>
      {/* Sliding indicator */}
      <span
        className="absolute bottom-1 left-0 h-7 bg-white rounded-md shadow transition-all duration-300 ease-in-out z-0"
        style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
        aria-hidden="true"
      />
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Add fade/slide transition for tab switching
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 ease-in-out data-[state=active]:opacity-100 data-[state=inactive]:opacity-0 data-[state=active]:translate-y-0 data-[state=inactive]:-translate-y-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
