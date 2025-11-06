# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Document Management System built with Next.js 15 and deployed on Vercel. The project was originally generated with v0.app and is synchronized with v0.app deployments. Any changes made to deployed chats on v0.app will be automatically pushed to this repository.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **React**: Version 19
- **TypeScript**: Version 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style variant)
- **Icons**: lucide-react
- **Form Handling**: react-hook-form with zod validation
- **Theme**: next-themes for dark/light mode support
- **Notifications**: sonner for toast notifications
- **Authentication**: NextAuth.js v5 (beta) with Google OAuth
- **File Storage**: Google Drive API integration
- **API Client**: googleapis package for Drive operations

## Architecture

### Directory Structure

- **`/app`**: Next.js App Router pages and layouts
  - Each folder represents a route (dashboard `/`, search `/search`, library `/library`, etc.)
  - `layout.tsx`: Root layout with sidebar, theme provider, and SessionProvider
  - `page.tsx`: Page components for each route
  - Dynamic routes: `/view/[id]` and `/category/[type]`
  - `/api`: API routes for server-side operations
    - `/api/auth/[...nextauth]`: NextAuth.js authentication endpoint
    - `/api/drive/*`: Google Drive API operations

- **`/components`**: Reusable React components
  - Feature components (e.g., `file-grid.tsx`, `file-uploader.tsx`, `sidebar.tsx`)
  - `session-provider.tsx`: Client-side wrapper for NextAuth SessionProvider
  - `/ui`: shadcn/ui primitives (buttons, cards, inputs, etc.)

- **`/lib`**: Utility functions
  - `utils.ts`: Contains `cn()` utility for merging Tailwind classes
  - `google-drive.ts`: Google Drive service class with all Drive operations

- **`/hooks`**: Custom React hooks
  - `use-toast.ts`: Toast notification hook

- **`/types`**: TypeScript type definitions
  - `next-auth.d.ts`: Extended NextAuth types for custom session data

- **`/public`**: Static assets

- **`/styles`**: Additional styling files

- **`auth.ts`**: NextAuth.js configuration at root level

### Path Aliases

The project uses TypeScript path aliases (configured in `tsconfig.json`):
- `@/*` maps to the root directory
- Example: `@/components/ui/button` → `/components/ui/button`

### Key Patterns

1. **Client Components**: Most components use `"use client"` directive since they involve interactivity

2. **Sidebar Navigation**: Routes are defined in `components/sidebar.tsx` with corresponding pages in `/app`. The sidebar displays user info when authenticated and provides sign-in/sign-out functionality.

3. **Authentication Flow**:
   - Users sign in with Google OAuth via NextAuth.js
   - Session includes Google access token for Drive API calls
   - All API routes check for valid session before processing
   - Access tokens are automatically included in Drive API requests

4. **File Type Categorization**: Files are categorized by MIME type:
   - Documents: `application/pdf`, `*document*`, `text/plain`
   - Spreadsheets: `*spreadsheet*`
   - Presentations: `*presentation*`
   - Images: `image/*`

5. **Google Drive Integration**: All file operations are connected to Google Drive:
   - Files are stored in and retrieved from the user's Google Drive
   - Thumbnails and previews use Drive's built-in capabilities
   - File sharing creates Drive sharing permissions
   - File deletion moves files to Drive trash

6. **Theme System**: Uses `next-themes` with `ThemeProvider` in root layout. Components can use theme-aware styling via Tailwind CSS classes.

7. **Toast Notifications**: Use the `toast()` function from `@/components/ui/use-toast` for user feedback

## Component Guidelines

### Adding New UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Configuration is in `components.json` (New York style, RSC enabled, cssVariables).

### File Upload

The `FileUploader` component (`components/file-uploader.tsx`):
- Drag and drop functionality
- Multiple file selection
- File type validation (PDF, Google Docs/Sheets/Slides, TXT, Images)
- Maximum file size: 50MB
- Real-time progress tracking during upload
- **Uploads directly to Google Drive** via `/api/drive/upload`
- Sequential upload of multiple files with progress updates

### File Grid Display

The `FileGrid` component (`components/file-grid.tsx`):
- Fetches files from Google Drive via `/api/drive/files` or `/api/drive/category`
- Displays files in a responsive grid with thumbnails
- Filters files by category (documents, spreadsheets, presentations, images)
- Shows loading skeletons during data fetch
- Provides file actions via dropdown menu:
  - **Open in Drive**: Opens file in Google Drive web interface
  - **Share**: Creates sharing permission and copies link to clipboard
  - **Delete**: Moves file to Google Drive trash
- Links to file viewer at `/view/[id]`
- Displays file metadata (size, modified date, owner)

### File Viewer

The `FileViewer` component (`components/file-viewer.tsx`):
- Embeds Google Drive files using iframe for preview
- Displays image thumbnails for image files
- Supports zoom and rotation for images
- Provides direct link to open in Google Drive

## Important Configuration Notes

### Next.js Config (`next.config.mjs`)

```javascript
eslint: {
  ignoreDuringBuilds: true,  // ESLint errors won't fail builds
}
typescript: {
  ignoreBuildErrors: true,     // TypeScript errors won't fail builds
}
images: {
  unoptimized: true,           // Images are not optimized
}
```

**Note**: These settings allow builds to succeed despite errors. When adding new features, run `pnpm lint` locally to catch issues.

## Google Drive Integration Setup

This application is fully integrated with Google Drive for file storage and management. To set up:

### Prerequisites

1. Google Cloud Project with Drive API enabled
2. OAuth 2.0 credentials (Client ID and Secret)
3. Required OAuth scopes configured

### Setup Steps

**Detailed instructions are in `GOOGLE_DRIVE_SETUP.md`**. Quick summary:

1. Create a Google Cloud Project
2. Enable Google Drive API, Docs API, Sheets API, and Slides API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=generate-with-openssl
   NEXTAUTH_URL=http://localhost:3000
   ```

### API Routes

All Google Drive operations are handled through API routes in `/app/api/drive/`:

- **`GET /api/drive/files`**: List all files with pagination
- **`GET /api/drive/files/[fileId]`**: Get specific file details
- **`POST /api/drive/upload`**: Upload file to Drive
- **`DELETE /api/drive/delete`**: Delete file (moves to trash)
- **`POST /api/drive/share`**: Create sharing permission
- **`GET /api/drive/search?q=query`**: Search files by name
- **`GET /api/drive/category?type=category`**: Get files by category

### Google Drive Service

The `GoogleDriveService` class (`lib/google-drive.ts`) provides:
- File listing with pagination
- File upload with buffer support
- File deletion
- File sharing (public link or specific email)
- File download
- Search functionality
- Category filtering by MIME type

### Authentication

- Uses NextAuth.js v5 (beta) with Google provider
- Session includes access token for API calls
- Tokens are automatically refreshed
- All API routes require authentication
- User info displayed in sidebar with sign-out option

## Deployment

The project is configured for Vercel deployment and includes:
- `@vercel/analytics` for analytics tracking
- Automatic builds triggered by pushes to the repository
- Production deployment at: https://vercel.com/liordocs76-gmailcoms-projects/v0-document-management-system

### Vercel Environment Variables

Add these environment variables in Vercel project settings:
- `GOOGLE_CLIENT_ID`: OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: OAuth client secret
- `NEXTAUTH_SECRET`: Random secret for session encryption
- `NEXTAUTH_URL`: Your production domain (e.g., `https://your-app.vercel.app`)

**Important**: Update your Google OAuth redirect URIs to include the production domain

## v0.app Integration

This repository stays in sync with v0.app:
- Continue building at: https://v0.app/chat/agEvK3noRLk
- Deployed changes from v0 are automatically pushed here
- Manual code changes can coexist with v0 updates
