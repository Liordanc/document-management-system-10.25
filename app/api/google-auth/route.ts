import { type NextRequest, NextResponse } from "next/server"
import { loadGoogleCredentials } from "@/lib/google-credentials"
import fs from "fs"
import path from "path"

// This API route helps with server-side Google authentication
// and can be used to securely handle credentials

export async function GET(request: NextRequest) {
  try {
    // Get the credentials from environment variables or file
    const credentials = await loadGoogleCredentials()

    // Only return the client ID and API key, never the client secret
    return NextResponse.json({
      clientId: credentials.clientId,
      apiKey: credentials.apiKey,
    })
  } catch (error) {
    console.error("Error in Google auth API route:", error)
    return NextResponse.json({ error: "Failed to load Google credentials" }, { status: 500 })
  }
}

// This endpoint allows uploading a credentials.json file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("credentials") as File

    if (!file) {
      return NextResponse.json({ error: "No credentials file provided" }, { status: 400 })
    }

    // Read the file
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse the JSON to validate it
    const credentials = JSON.parse(buffer.toString())

    // Check if it has the required fields
    if (!credentials.web || !credentials.web.client_id) {
      return NextResponse.json({ error: "Invalid credentials file format" }, { status: 400 })
    }

    // Save the file (in a real app, you'd store this securely)
    const credentialsPath = path.join(process.cwd(), "credentials.json")
    fs.writeFileSync(credentialsPath, buffer)

    return NextResponse.json({
      success: true,
      message: "Credentials uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading credentials:", error)
    return NextResponse.json({ error: "Failed to process credentials file" }, { status: 500 })
  }
}
