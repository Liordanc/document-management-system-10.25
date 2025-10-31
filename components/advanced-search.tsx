"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePicker } from "@/components/ui/date-picker"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, FileType, User } from "@/components/icons"
import { format } from "date-fns"

export function AdvancedSearch() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fileType, setFileType] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [author, setAuthor] = useState("")
  const [sizeRange, setSizeRange] = useState([0, 100])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Build query parameters
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (fileType) params.set("type", fileType)
    if (dateFrom) params.set("from", format(dateFrom, "yyyy-MM-dd"))
    if (dateTo) params.set("to", format(dateTo, "yyyy-MM-dd"))
    if (author) params.set("author", author)
    if (sizeRange[0] > 0 || sizeRange[1] < 100) {
      params.set("minSize", sizeRange[0].toString())
      params.set("maxSize", sizeRange[1].toString())
    }

    // Navigate to search page with parameters
    router.push(`/search?${params.toString()}`)

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }

  const fileTypeOptions = [
    { value: "", label: "All Types" },
    { value: "pdf", label: "PDF Documents" },
    { value: "doc", label: "Word Documents" },
    { value: "xls", label: "Excel Spreadsheets" },
    { value: "ppt", label: "PowerPoint Presentations" },
    { value: "img", label: "Images" },
    { value: "txt", label: "Text Files" },
  ]

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
            <Input
              type="text"
              placeholder="Search files by name, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-0 h-11 rounded-lg"
            />
          </div>
        </div>

        <Popover open={isExpanded} onOpenChange={setIsExpanded}>
          <PopoverTrigger asChild>
            <Button variant="outline" type="button" aria-label="Advanced search options" className="rounded-lg">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 rounded-lg p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Advanced Search</h4>
                <p className="text-sm text-foreground-secondary">Refine your search with additional filters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-type">File Type</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger id="file-type" className="rounded-lg">
                    <FileType className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All file types" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {fileTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <DatePicker date={dateFrom} setDate={setDateFrom} placeholder="Any date" />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <DatePicker date={dateTo} setDate={setDateTo} placeholder="Any date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-secondary" />
                  <Input
                    id="author"
                    placeholder="Any author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>File Size</Label>
                  <span className="text-xs text-foreground-secondary">
                    {sizeRange[0]}MB - {sizeRange[1] === 100 ? "∞" : `${sizeRange[1]}MB`}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 100]}
                  max={100}
                  step={1}
                  value={sizeRange}
                  onValueChange={(value) => setSizeRange(value as [number, number])}
                  className="py-2"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="submit" disabled={isSearching} className="rounded-lg">
          {isSearching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "Search"}
        </Button>
      </form>
    </div>
  )
}
