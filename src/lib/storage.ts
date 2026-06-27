/**
 * Storage helpers for the public buckets (avatars, logos, assets).
 * RLS enforces "users can only write inside a folder named after their UID".
 */
import { supabase } from "@/integrations/supabase/client";

export type Bucket = "avatars" | "logos" | "assets";

export async function uploadUserFile(
  bucket: Bucket,
  userId: string,
  file: File,
  filename?: string,
): Promise<{ path: string; publicUrl: string }> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${userId}/${filename ?? `${Date.now()}.${ext}`}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function getPublicUrl(bucket: Bucket, path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
