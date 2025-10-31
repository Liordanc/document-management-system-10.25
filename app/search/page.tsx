"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FileGrid, type CategoryType } from "@/components/file-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, SortAsc, SortDesc } from "@/components/icons"
import { DynamicAdvancedSearch } from "@/lib/dynamic-imports"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const fileType = searchParams.get("type") || ""
  const dateFrom = searchParams.get("from") || ""
  const dateTo = searchParams.get("to") || ""
  const author = searchParams.get("author") || ""
  const minSize = searchParams.get("minSize") || ""
  const maxSize = searchParams.get("maxSize") || ""

  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")

  useEffect(() => {
    // Simulate search delay
    setIsSearching(true)
    const timer = setTimeout(() => {
      setIsSearching(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [query, fileType, dateFrom, dateTo, author, minSize, maxSize, activeTab, sortBy, sortOrder])

  // Convert fileType to CategoryType
  const getCategoryFromFileType = (type: string | null): CategoryType => {
    if (!type) return null

    switch (type) {
      case "pdf":
      case "doc":
      case "txt":
        return "documents"
      case "xls":
      case "xlsx":
        return "spreadsheets"
      case "ppt":
      case "pptx":
        return "presentations"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "images"
      default:
        return null
    }
  }

  // Build active filters text
  const getActiveFiltersText = () => {
    const filters = []

    if (fileType) filters.push(`Type: ${fileType}`)
    if (dateFrom) filters.push(`From: ${dateFrom}`)
    if (dateTo) filters.push(`To: ${dateTo}`)
    if (author) filters.push(`Author: ${author}`)
    if (minSize || maxSize) filters.push(`Size: ${minSize || "0"}MB - ${maxSize || "∞"}MB`)

    return filters.join(" • ")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Search Files</h1>

      <Suspense fallback={<Skeleton className="h-12 w-full rounded-lg" />}>
        <DynamicAdvancedSearch />
      </Suspense>

      {query || fileType || dateFrom || dateTo || author || minSize || maxSize ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">{query ? `Results for "${query}"` : "Search Results"}</h2>
              {getActiveFiltersText() && (
                <p className="text-sm text-foreground-secondary">Filters: {getActiveFiltersText()}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <SortAsc className="mr-2 h-4 w-4" />
                    Sort by: {sortBy === "date" ? "Date" : sortBy === "name" ? "Name" : "Size"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                  <DropdownMenuItem onClick={() => setSortBy("date")} className="rounded-md">
                    Date {sortBy === "date" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")} className="rounded-md">
                    Name {sortBy === "name" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("size")} className="rounded-md">
                    Size {sortBy === "size" && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="rounded-full"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card rounded-full p-1">
              <TabsTrigger value="all" className="rounded-full">
                All Results
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-full">
                Documents
              </TabsTrigger>
              <TabsTrigger value="spreadsheets" className="rounded-full">
                Spreadsheets
              </TabsTrigger>
              <TabsTrigger value="presentations" className="rounded-full">
                Presentations
              </TabsTrigger>
              <TabsTrigger value="images" className="rounded-full">
                Images
              </TabsTrigger>
            </TabsList>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-sm text-foreground-secondary">Searching...</p>
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-6">
                  <FileGrid
                    category={getCategoryFromFileType(fileType)}
                    searchQuery={query}
                    dateFrom={dateFrom ? new Date(dateFrom) : undefined}
                    dateTo={dateTo ? new Date(dateTo) : undefined}
                    author={author || undefined}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </TabsContent>
                <TabsContent value="documents" className="space-y-6">
                  <FileGrid
                    category="documents"
                    searchQuery={query}
                    dateFrom={dateFrom ? new Date(dateFrom) : undefined}
                    dateTo={dateTo ? new Date(dateTo) : undefined}
                    author={author || undefined}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </TabsContent>
                <TabsContent value="spreadsheets" className="space-y-6">
                  <FileGrid
                    category="spreadsheets"
                    searchQuery={query}
                    dateFrom={dateFrom ? new Date(dateFrom) : undefined}
                    dateTo={dateTo ? new Date(dateTo) : undefined}
                    author={author || undefined}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </TabsContent>
                <TabsContent value="presentations" className="space-y-6">
                  <FileGrid
                    category="presentations"
                    searchQuery={query}
                    dateFrom={dateFrom ? new Date(dateFrom) : undefined}
                    dateTo={dateTo ? new Date(dateTo) : undefined}
                    author={author || undefined}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </TabsContent>
                <TabsContent value="images" className="space-y-6">
                  <FileGrid
                    category="images"
                    searchQuery={query}
                    dateFrom={dateFrom ? new Date(dateFrom) : undefined}
                    dateTo={dateTo ? new Date(dateTo) : undefined}
                    author={author || undefined}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
            <CardDescription>Use the search bar and filters to find your files quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <div className="bg-background p-2 rounded-full">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Basic Search</h3>
                  <p className="text-sm text-foreground-secondary">
                    Enter keywords to search in file names and content
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-background p-2 rounded-full">
                  <Filter className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">Advanced Filters</h3>
                  <p className="text-sm text-foreground-secondary">
                    Use the filter button to narrow results by type, date, size, and more
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
