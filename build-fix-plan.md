# Sharp Ireland - Build Error Fix Plan

## Root Cause Analysis

After examining the codebase, I've identified the following issues causing the build errors:

1. **Invalid API URL Construction**: 
   - In both `content-loader.ts` and `server-content-loader.ts`, the API base URL is constructed as:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
   ```
   - When deployed to Vercel, `process.env.VERCEL_URL` is used, but this value doesn't include the protocol (http:// or https://), resulting in invalid URLs.

2. **Content Loading Strategy**:
   - The `getAllIndustries()` function in `content-loader.ts` tries to fetch from the API first, then falls back to local files if the API request fails.
   - During the build process, there's no server running at localhost:3000, causing fetch calls to fail.
   - On Vercel, the invalid URL construction causes the API requests to fail with "Failed to parse URL" errors.

3. **Build-time vs. Runtime Behavior**:
   - The application needs different behavior during build time versus runtime.
   - During build, it should prioritize local file access.
   - During runtime, it can attempt API requests first.

## Proposed Solution

### 1. Fix API_BASE_URL Construction

Update the API_BASE_URL construction in both files to ensure URLs always have a protocol:

```typescript
const API_BASE_URL = (() => {
  // Use explicit API URL if provided
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    // Add https:// protocol for Vercel URLs
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Local development fallback
  return 'http://localhost:3000';
})();
```

### 2. Modify Content Loading Strategy

Modify the content loading strategy to prioritize local files during build time:

```typescript
export async function getAllIndustries(): Promise<Industry[]> {
  // During build, prioritize local files to avoid unnecessary network requests
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return await getAllIndustriesLocal();
  }
  
  // For runtime, try API first, then fall back to local files
  let apiUrl: string = '';
  try {
    apiUrl = constructApiUrl('/api/industries');
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (apiError) {
    if (apiError instanceof Error) {
      logError(apiError, {
        operation: 'getAllIndustries',
        source: 'api',
        url: apiUrl
      });
    }
    
    // Fallback to local files
    return await getAllIndustriesLocal();
  }
}
```

Apply the same pattern to `getIndustryBySlug()` function.

### 3. Enhance Error Handling

Improve error handling to provide more context about failures:

```typescript
function logError(error: Error, context: ErrorContext): ErrorLog {
  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    context: {
      ...context,
      environment: process.env.NODE_ENV,
      buildPhase: process.env.NEXT_PHASE || 'runtime',
      apiBaseUrl: API_BASE_URL
    }
  };
  
  console.error('Content Loading Error:', log);
  return log;
}
```

### 4. Environment Configuration

Ensure proper environment variables are set in Vercel:

1. Set `NEXT_PUBLIC_API_BASE_URL` to the full URL of your deployed application (e.g., `https://sharpireland.vercel.app`)
2. Alternatively, rely on the fixed `VERCEL_URL` handling in the code

## Implementation Steps

1. Update `content-loader.ts` and `server-content-loader.ts` with the fixed API_BASE_URL construction
2. Modify the content loading functions to prioritize local files during build
3. Enhance error handling for better debugging
4. Test the solution locally with `npm run build`
5. Deploy to Vercel and verify the build succeeds

## Testing Strategy

1. **Local Testing**:
   - Run `npm run build` locally to verify the build completes without errors
   - Check the console for any remaining fetch errors

2. **Vercel Testing**:
   - Deploy to Vercel and monitor the build logs
   - Verify all pages render correctly after deployment
   - Test navigation between pages to ensure content loads properly

## Vercel Deployment Guide

### Environment Variables

Set the following environment variables in your Vercel project settings:

1. `NEXT_PUBLIC_API_BASE_URL` (optional): The full URL of your deployed application (e.g., `https://sharpireland.vercel.app`)

### Build Settings

1. **Build Command**: `npm run build`
2. **Output Directory**: `.next`
3. **Node.js Version**: 18.x or higher

### Deployment Steps

1. Push your changes to your GitHub repository
2. Connect your repository to Vercel if not already connected
3. Configure the environment variables as described above
4. Deploy the application
5. Monitor the build logs for any errors
6. Test the deployed application to ensure all pages load correctly

### Troubleshooting

If you encounter build errors:

1. Check the Vercel build logs for specific error messages
2. Verify that the API_BASE_URL construction is correct
3. Ensure the content loading strategy is properly prioritizing local files during build
4. Check that all required environment variables are set correctly

## Maintenance Considerations

1. **Future Updates**: When updating the content loading mechanism, ensure build-time behavior is properly handled
2. **Environment Variables**: Document all required environment variables for different deployment environments
3. **Error Logging**: Consider implementing a more robust error logging system for production environments
4. **Caching Strategy**: Review and optimize the caching strategy for content loading to improve performance