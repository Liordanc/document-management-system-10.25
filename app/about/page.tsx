export const dynamic = "force-static"
export const revalidate = 86400 // Revalidate once per day (optional)

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">About Document Management System</h1>

      <div className="prose max-w-none">
        <p>
          Our Document Management System is a comprehensive solution for organizing, storing, and accessing your
          documents securely. Built with modern web technologies, it provides a seamless experience across devices and
          platforms.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>Secure document storage and management</li>
          <li>Advanced search capabilities</li>
          <li>Google Drive integration</li>
          <li>Offline access to important documents</li>
          <li>File sharing and collaboration tools</li>
          <li>Support for multiple file formats</li>
        </ul>

        <h2>Technology Stack</h2>
        <p>
          This application is built using Next.js, React, and TypeScript, providing a fast and responsive user
          experience. It leverages modern web capabilities like offline support and progressive enhancement.
        </p>

        <h2>Privacy and Security</h2>
        <p>
          We take your privacy and security seriously. All documents are stored securely, and access is controlled
          through robust authentication mechanisms. Your data remains yours, and we provide tools to help you manage
          access and permissions.
        </p>
      </div>
    </div>
  )
}
