"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, User, Search } from "@/components/icons"

export function Header() {
  return (
    <header className="bg-card rounded-b-[16px] shadow-card w-full">
      <div className="flex h-16 items-center px-6 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-semibold text-lg">
            DocManager
          </Link>
        </div>

        <div className="flex-1 mx-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
            <Input placeholder="Search files..." className="pl-10 bg-background border-0 h-10 rounded-full" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
