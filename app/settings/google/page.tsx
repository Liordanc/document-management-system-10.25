import { CredentialsUploader } from "@/components/credentials-uploader"
import { CredentialsChecker } from "@/components/credentials-checker"

export default function GoogleSettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Google Integration Settings</h1>
      <p className="text-muted-foreground">
        Configure your Google Drive integration by uploading your credentials.json file.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <CredentialsChecker />
        <CredentialsUploader />
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">How to get your credentials.json file</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>
            Go to the{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Cloud Console
            </a>
          </li>
          <li>Create a new project or select an existing one</li>
          <li>Navigate to "APIs & Services" &gt; "Credentials"</li>
          <li>Click "Create Credentials" and select "OAuth client ID"</li>
          <li>Set the application type to "Web application"</li>
          <li>Add authorized JavaScript origins (e.g., http://localhost:3000)</li>
          <li>Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/google/callback)</li>
          <li>Click "Create" and download the JSON file</li>
          <li>Upload the downloaded file using the form above</li>
        </ol>
      </div>
    </div>
  )
}
