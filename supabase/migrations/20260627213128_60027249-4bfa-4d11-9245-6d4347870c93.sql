
-- Tighten SECURITY DEFINER function privileges
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Storage policies for the 3 public buckets
CREATE POLICY "Public read avatars/logos/assets"
ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('avatars', 'logos', 'assets'));

CREATE POLICY "Users upload to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('avatars', 'logos', 'assets')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('avatars', 'logos', 'assets')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('avatars', 'logos', 'assets')
  AND (storage.foldername(name))[1] = auth.uid()::text
);
