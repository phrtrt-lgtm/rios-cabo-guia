CREATE POLICY "Public read guia-ilustracoes"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'guia-ilustracoes');