"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function FileStats() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockData = [
          { name: "Documents", count: 42, size: 1.2 },
          { name: "Spreadsheets", count: 18, size: 0.5 },
          { name: "Presentations", count: 24, size: 0.8 },
          { name: "Images", count: 58, size: 1.5 },
        ]

        setData(mockData)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="count">
          <TabsList className="mb-4">
            <TabsTrigger value="count">File Count</TabsTrigger>
            <TabsTrigger value="size">Storage Size</TabsTrigger>
          </TabsList>
          <TabsContent value="count" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} files`, "Count"]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="count" fill="#8884d8" name="File Count" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="size" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} GB`, "Size"]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="size" fill="#82ca9d" name="Storage Size (GB)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

