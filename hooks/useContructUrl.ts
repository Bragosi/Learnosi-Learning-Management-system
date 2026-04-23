// hooks/useContructUrl.ts

import { env } from "@/lib/env";

export function useConstructUrl(key: string): string {
  // Use the .t3.tigrisfiles.io domain for public access
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`;
}