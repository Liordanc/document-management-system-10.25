# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for the Document Management System.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Document Management System"
4. Click "Create"

## Step 2: Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"
4. Also enable "Google Docs API", "Google Sheets API", and "Google Slides API"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type (unless you have Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - App name: Document Management System
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
5. Click "Save and Continue"
6. On the Scopes screen, click "Add or Remove Scopes"
7. Add these scopes:
   - `https://www.googleapis.com/auth/drive.file` - View and manage files in Google Drive
   - `https://www.googleapis.com/auth/drive.metadata.readonly` - View metadata for files
   - `https://www.googleapis.com/auth/userinfo.profile` - View your basic profile info
   - `https://www.googleapis.com/auth/userinfo.email` - View your email address
8. Click "Update" → "Save and Continue"
9. Add test users (your email) if in testing mode
10. Click "Save and Continue" → "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name it: "Document Management System Web Client"
5. Add Authorized JavaScript origins:
   - http://localhost:3000
   - https://your-production-domain.vercel.app (if deployed)
6. Add Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://your-production-domain.vercel.app/api/auth/callback/google (if deployed)
7. Click "Create"
8. Copy the Client ID and Client Secret

## Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=your-random-secret
   NEXTAUTH_URL=http://localhost:3000
   ```
3. Generate NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## Step 6: Run the Application

```bash
pnpm dev
```

Visit http://localhost:3000 and click "Sign in with Google"

## For Production Deployment (Vercel)

1. Go to your Vercel project settings
2. Add the same environment variables:
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (set to your production domain)
3. Redeploy your application

## Important Notes

- The app starts in Testing mode with a limit of 100 users
- To publish your app, go to OAuth consent screen and click "Publish App"
- Users will see a warning screen during testing mode
- Make sure to keep your Client Secret secure and never commit it to git
- The `.env.local` file is already in `.gitignore`

## Troubleshooting

### "Access blocked" error
- Make sure all required APIs are enabled in Google Cloud Console
- Check that the redirect URI exactly matches what's in your OAuth client settings

### "Invalid client" error
- Verify your Client ID and Client Secret are correct
- Check that NEXTAUTH_URL matches your current domain

### Files not showing up
- Make sure you granted the necessary Drive permissions
- Check browser console for API errors
- Verify the Drive API is enabled in Google Cloud Console
