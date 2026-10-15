insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'venue-photos', 'venue-photos', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp']
);

create policy "Owners upload venue photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'venue-photos'
    and exists (
      select 1 from public.venues v
      where v.id::text = (storage.foldername(name))[1]
        and v.owner_id = auth.uid()
    )
  );

create policy "Owners delete venue photos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'venue-photos'
    and exists (
      select 1 from public.venues v
      where v.id::text = (storage.foldername(name))[1]
        and v.owner_id = auth.uid()
    )
  );