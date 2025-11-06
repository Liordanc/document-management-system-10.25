import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { GoogleDriveService } from "@/lib/google-drive"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    const driveService = new GoogleDriveService(session.accessToken)
    const result = await driveService.uploadFile({
      name: file.name,
      mimeType: file.type,
      buffer,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
