"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  FileText,
  ImageIcon,
  LayoutGrid,
  Library,
  FileSpreadsheet,
  FileIcon,
  Search,
  Upload,
  Settings,
  PlusCircle,
} from "@/components/icons"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    href: "/",
    color: "text-primary",
  },
  {
    label: "Search",
    icon: Search,
    href: "/search",
    color: "text-accent",
  },
  {
    label: "Library",
    icon: Library,
    href: "/library",
    color: "text-primary",
  },
  {
    label: "Upload",
    icon: Upload,
    href: "/upload",
    color: "text-accent",
  },
  {
    label: "Google Drive",
    icon: FileText,
    href: "/integrations/google-drive",
    color: "text-primary",
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/category/documents",
    color: "text-accent",
  },
  {
    label: "Spreadsheets",
    icon: FileSpreadsheet,
    href: "/category/spreadsheets",
    color: "text-primary",
  },
  {
    label: "Presentations",
    icon: FileIcon,
    href: "/category/presentations",
    color: "text-accent",
  },
  {
    label: "Images",
    icon: ImageIcon,
    href: "/category/images",
    color: "text-primary",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-accent",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-[220px] h-full py-6 px-4 bg-card rounded-[16px] shadow-card m-6 mr-0 flex flex-col">
      <div className="px-3 py-2 flex-shrink-0">
        <div className="space-y-1">
          <Button variant="default" className="w-full justify-start bg-primary text-white hover:bg-primary-hover">
            <PlusCircle className="mr-2 h-4 w-4" />
            New File
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ease-in-out",
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-background text-foreground hover:text-primary",
              )}
            >
              <route.icon
                className={cn("mr-3 h-5 w-5", pathname === route.href ? "text-primary-foreground" : route.color)}
              />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
