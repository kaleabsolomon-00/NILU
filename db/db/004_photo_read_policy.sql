create policy "Owners read own venue photos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'venue-photos'
    and exists (
      select 1 from public.venues v
      where v.id::text = (storage.foldername(storage.objects.name))[1]
        and v.owner_id = auth.uid()
    )
  );