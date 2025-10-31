import { notFound } from "next/navigation"
import { FileGrid } from "@/components/file-grid"
import { FileText, FileSpreadsheet, FileIcon as FilePresentation, ImageIcon } from "lucide-react"

export default function CategoryPage({ params }) {
  const categories = {
    documents: {
      title: "Documents",
      description: "PDF, Google Docs, and text files",
      icon: FileText,
      color: "text-blue-500",
    },
    spreadsheets: {
      title: "Spreadsheets",
      description: "Excel and Google Sheets files",
      icon: FileSpreadsheet,
      color: "text-green-500",
    },
    presentations: {
      title: "Presentations",
      description: "PowerPoint and Google Slides files",
      icon: FilePresentation,
      color: "text-yellow-500",
    },
    images: {
      title: "Images",
      description: "JPG, PNG, and GIF files",
      icon: ImageIcon,
      color: "text-purple-500",
    },
  }

  const category = categories[params.type]

  if (!category) {
    notFound()
  }

  const CategoryIcon = category.icon

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
          <CategoryIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category.title}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <FileGrid category={params.type} />
    </div>
  )
}

