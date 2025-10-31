"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  FileText,
  Image,
  LayoutGrid,
  Library,
  FileSpreadsheet,
  FileIcon as FilePresentation,
  Search,
  Upload,
  Settings,
  PlusCircle,
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Search",
    icon: Search,
    href: "/search",
    color: "text-violet-500",
  },
  {
    label: "Library",
    icon: Library,
    href: "/library",
    color: "text-pink-700",
  },
  {
    label: "Upload",
    icon: Upload,
    href: "/upload",
    color: "text-orange-500",
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/category/documents",
    color: "text-emerald-500",
  },
  {
    label: "Spreadsheets",
    icon: FileSpreadsheet,
    href: "/category/spreadsheets",
    color: "text-green-700",
  },
  {
    label: "Presentations",
    icon: FilePresentation,
    href: "/category/presentations",
    color: "text-yellow-500",
  },
  {
    label: "Images",
    icon: Image,
    href: "/category/images",
    color: "text-rose-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full py-4 space-y-4 border-r bg-muted/40 w-[240px]">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">DocManager</h2>
        <div className="space-y-1">
          <Button variant="secondary" className="w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            New File
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent" : "transparent",
              )}
            >
              <route.icon className={cn("mr-3 h-5 w-5", route.color)} />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

