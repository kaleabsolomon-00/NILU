create table venue_photos (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  path text not null unique,
  position smallint not null check (position between 1 and 3),
  created_at timestamptz not null default now(),
  unique (venue_id, position)
);

alter table venue_photos enable row level security;

grant select on venue_photos to anon, authenticated;
grant insert, delete on venue_photos to authenticated;

create policy "Public read photos" on venue_photos
  for select using (true);

create policy "Owners add photos" on venue_photos
  for insert to authenticated
  with check (exists (
    select 1 from venues v where v.id = venue_id and v.owner_id = auth.uid()
  ));

create policy "Owners delete photos" on venue_photos
  for delete to authenticated
  using (exists (
    select 1 from venues v where v.id = venue_id and v.owner_id = auth.uid()
  ));