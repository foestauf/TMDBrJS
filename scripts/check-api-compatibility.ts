import { readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: Record<string, unknown>;
  responses?: Record<string, unknown>;
}

interface ApiVersion {
  version: string;
  endpoints: ApiEndpoint[];
}

export async function fetchApiVersion(): Promise<string> {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: TMDB_API_KEY environment variable is not set');
      console.error('Please set it in one of these ways:');
      console.error('1. Create a .env file with TMDB_API_KEY=your_key');
      console.error('2. Export it in your shell: export TMDB_API_KEY=your_key');
      console.error('3. Set it inline: TMDB_API_KEY=your_key pnpm check-api');
      return 'unknown';
    }

    const response = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${apiKey}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Error: API request failed with status ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      console.error('Error details:', errorData);
      return 'unknown';
    }

    const data = await response.json();
    return data.version ?? '3'; // TMDB API v3 doesn't explicitly return version
  } catch (error) {
    console.error('❌ Error: Failed to fetch API version:', error);
    return 'unknown';
  }
}

export async function checkApiCompatibility() {
  try {
    const currentVersion = await fetchApiVersion();
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
    const supportedVersion = packageJson.tmdbApiVersion ?? '3';

    console.log(`Current TMDB API Version: ${currentVersion}`);
    console.log(`Supported Version: ${supportedVersion}`);

    if (currentVersion === 'unknown') {
      console.error('❌ Could not determine API version. Please check your API key and try again.');
      process.exit(1);
    }

    // Check for breaking changes first, regardless of version match
    const breakingChanges = await checkBreakingChanges(currentVersion);
    if (breakingChanges.length > 0) {
      console.warn('⚠️ Breaking changes detected:');
      breakingChanges.forEach(change => console.warn(`- ${change}`));
    }

    // Then check for version mismatch
    if (currentVersion !== supportedVersion) {
      console.warn('⚠️ Warning: API version mismatch!');
      console.warn('Please update the wrapper to support the latest API version.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function checkBreakingChanges(version: string): Promise<string[]> {
  const changes: string[] = [];
  
  // Add checks for known breaking changes
  // This would be updated when TMDB announces breaking changes
  if (version.startsWith('4')) {
    changes.push('API v4 requires authentication changes');
    changes.push('Some endpoints have been deprecated');
  }

  return changes;
}

// Only run if this file is executed directly
if (require.main === module) {
  checkApiCompatibility();
} 