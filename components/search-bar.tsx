"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

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
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] md:w-[300px]"
            autoFocus
          />
          <Button type="button" variant="ghost" size="icon" className="absolute right-0" onClick={toggleSearch}>
            <X className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <Button variant="outline" size="icon" onClick={toggleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

