"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import { useCmdK } from "~/contexts/cmdk"
import { Button } from "./ui/button"
import { cn } from "~/lib/util"
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "./ui/command"
import { guideConfig } from "~/config/guide"
import { CircleIcon, LaptopIcon, MoonIcon, SunIcon } from "lucide-react"
import { DialogProps } from "@radix-ui/react-dialog"
import { useTheme } from "next-themes"

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const { opened, setOpened } = useCmdK()
  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpened((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown) => {
    setOpened(false)
    command()
  }, [])

  return (
    <>
    <Button variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpened(true)}
        {...props}>
<span className="hidden lg:inline-flex">Search Guide...</span>
<span className="inline-flex lg:hidden">Search...</span>
<kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
    </Button>
    <CommandDialog open={opened} onOpenChange={setOpened}>
    <CommandInput placeholder="Type a command or search..." />
    <CommandGroup heading="Links">
      {guideConfig.mainNav.map(
        (navItem) => (
          <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as __next_route_internal_types__.RouteImpl<string>))
                  }}
                >
                  
                  {navItem.title}
                </CommandItem>
             
        )
      )}
    </CommandGroup>
    {guideConfig.sidebarNav.map((group) => (
      <CommandGroup key={group.title} heading={group.title}>
        {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as __next_route_internal_types__.RouteImpl<string>))
                  }}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <CircleIcon className="h-3 w-3" />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
      </CommandGroup>
    ))}
    <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
    </CommandDialog>
    </>
  )
}
