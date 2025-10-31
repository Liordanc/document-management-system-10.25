"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileGrid } from "@/components/file-grid"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      setIsSearching(true)

      // In a real app, this would update the URL and trigger a search
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`)

      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false)
      }, 1000)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Search Files</h1>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg space-x-2">
        <Input
          type="text"
          placeholder="Search for files by name, type, or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>

      {query ? (
        <>
          <div className="text-muted-foreground">
            Search results for: <span className="font-medium">{query}</span>
          </div>
          <FileGrid />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium">Search for files</h2>
          <p className="text-muted-foreground">
            Enter a search term above to find files in your document management system.
          </p>
        </div>
      )}
    </div>
  )
}

