"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "@/components/icons"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleSearch = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setSearchQuery("")
    }
  }

  return (
    <div className="relative">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-10 bg-background border-0 h-10 rounded-full"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
              onClick={toggleSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="ghost" size="icon" onClick={toggleSearch} className="rounded-full">
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
