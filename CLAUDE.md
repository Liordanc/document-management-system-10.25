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

## Architecture

### Directory Structure

- **`/app`**: Next.js App Router pages and layouts
  - Each folder represents a route (dashboard `/`, search `/search`, library `/library`, etc.)
  - `layout.tsx`: Root layout with sidebar and theme provider
  - `page.tsx`: Page components for each route
  - Dynamic routes: `/view/[id]` and `/category/[type]`

- **`/components`**: Reusable React components
  - Feature components (e.g., `file-grid.tsx`, `file-uploader.tsx`, `sidebar.tsx`)
  - `/ui`: shadcn/ui primitives (buttons, cards, inputs, etc.)

- **`/lib`**: Utility functions
  - `utils.ts`: Contains `cn()` utility for merging Tailwind classes

- **`/hooks`**: Custom React hooks
  - `use-toast.ts`: Toast notification hook

- **`/public`**: Static assets

- **`/styles`**: Additional styling files

### Path Aliases

The project uses TypeScript path aliases (configured in `tsconfig.json`):
- `@/*` maps to the root directory
- Example: `@/components/ui/button` → `/components/ui/button`

### Key Patterns

1. **Client Components**: Most components use `"use client"` directive since they involve interactivity

2. **Sidebar Navigation**: Routes are defined in `components/sidebar.tsx` with corresponding pages in `/app`

3. **File Type Categorization**: Files are categorized as:
   - Documents (PDF, DOC, TXT)
   - Spreadsheets (XLS)
   - Presentations (PPT)
   - Images (JPG, PNG, GIF)

4. **Mock Data**: Currently, all data is mocked. File operations (upload, download, delete) simulate API calls with timeouts. When implementing real backend functionality, replace mock data generators with actual API calls.

5. **Theme System**: Uses `next-themes` with `ThemeProvider` in root layout. Components can use theme-aware styling via Tailwind CSS classes.

6. **Toast Notifications**: Use the `toast()` function from `@/components/ui/use-toast` for user feedback

## Component Guidelines

### Adding New UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Configuration is in `components.json` (New York style, RSC enabled, cssVariables).

### File Upload

The `FileUploader` component supports:
- Drag and drop functionality
- Multiple file selection
- File type validation (PDF, Google Docs/Sheets/Slides, TXT, Images)
- Maximum file size: 50MB
- Progress tracking during upload

### File Grid Display

The `FileGrid` component:
- Displays files in a responsive grid
- Filters files by category when provided
- Shows loading skeletons during data fetch
- Provides file actions (download, share, delete) via dropdown menu
- Links to file viewer at `/view/[id]`

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

## Implementing Backend Integration

Currently, the application uses mock data. To add backend functionality:

1. **API Routes**: Create API routes in `/app/api/[route]/route.ts`
2. **Data Fetching**: Replace mock data generators in components with actual fetch calls
3. **File Storage**: Implement file upload/download using a storage service (S3, Cloudinary, etc.)
4. **Database**: Add database integration for file metadata (consider Prisma, Drizzle, or similar)
5. **Authentication**: The UI has placeholder user elements but no auth - implement with NextAuth.js or similar

## Deployment

The project is configured for Vercel deployment and includes:
- `@vercel/analytics` for analytics tracking
- Automatic builds triggered by pushes to the repository
- Production deployment at: https://vercel.com/liordocs76-gmailcoms-projects/v0-document-management-system

## v0.app Integration

This repository stays in sync with v0.app:
- Continue building at: https://v0.app/chat/agEvK3noRLk
- Deployed changes from v0 are automatically pushed here
- Manual code changes can coexist with v0 updates
