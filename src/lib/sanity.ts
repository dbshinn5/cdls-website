import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Only create client if project ID is configured
export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

export function urlFor(source: SanityImageSource) {
  if (!sanityClient) {
    return null;
  }
  const builder = imageUrlBuilder(sanityClient);
  return builder.image(source);
}

// Query helpers - returns null if Sanity is not configured
export async function sanityFetch<T>(query: string, params = {}): Promise<T | null> {
  if (!sanityClient) {
    console.log('Sanity not configured - using placeholder data');
    return null;
  }
  return sanityClient.fetch(query, params);
}

// Check if Sanity is configured
export function isSanityConfigured(): boolean {
  return !!projectId;
}
