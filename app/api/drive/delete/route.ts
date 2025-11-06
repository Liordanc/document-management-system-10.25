import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { GoogleDriveService } from "@/lib/google-drive"

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json(
        { error: "No fileId provided" },
        { status: 400 }
      )
    }

    const driveService = new GoogleDriveService(session.accessToken)
    const result = await driveService.deleteFile(fileId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}
