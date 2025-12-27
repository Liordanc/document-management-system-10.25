"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Area } from "recharts"

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
          <TabsList className="bg-background rounded-full p-1 mb-4">
            <TabsTrigger value="count" className="rounded-full">
              File Count
            </TabsTrigger>
            <TabsTrigger value="size" className="rounded-full">
              Storage Size
            </TabsTrigger>
          </TabsList>
          <TabsContent value="count" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#666A7A" />
                <YAxis stroke="#666A7A" />
                <Tooltip
                  formatter={(value) => [`${value} files`, "Count"]}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Bar dataKey="count" fill="#5F56FF" name="File Count" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="size" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#666A7A" />
                <YAxis stroke="#666A7A" />
                <Tooltip
                  formatter={(value) => [`${value} GB`, "Size"]}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="size"
                  stroke="#3D4FFF"
                  fill="rgba(95, 86, 255, 0.1)"
                  strokeWidth={2}
                  name="Storage Size (GB)"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
