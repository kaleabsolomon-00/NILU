-- NILU full schema. Run once on a new, empty Supabase project.

-- ===== TABLES =====
create table venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in
    ('cafe','restaurant','hotel','bar','park','cinema','game_zone','other')),
  description text check (char_length(description) <= 1000),
  area text,
  address text check (char_length(address) <= 200),
  opening_hours text check (char_length(opening_hours) <= 300),
  cover_image_url text,
  qr_token text not null unique
    default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table tags (
  id int generated always as identity primary key,
  slug text not null unique,
  label text not null,
  sentiment text not null default 'positive'
    check (sentiment in ('positive', 'negative'))
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  device_hash text not null,
  visit_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (venue_id, device_hash, visit_date)
);

create table review_tags (
  review_id uuid not null references reviews(id) on delete cascade,
  tag_id int not null references tags(id) on delete cascade,
  primary key (review_id, tag_id)
);

create table venue_photos (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  path text not null unique,
  position smallint not null check (position between 1 and 3),
  created_at timestamptz not null default now(),
  unique (venue_id, position)
);

create index reviews_venue_created_idx on reviews (venue_id, created_at desc);

-- ===== STARTER TAGS =====
insert into tags (slug, label, sentiment) values
  ('study-friendly', 'Study-friendly', 'positive'),
  ('date-spot', 'Date spot', 'positive'),
  ('good-for-groups', 'Good for groups', 'positive'),
  ('family-friendly', 'Family-friendly', 'positive'),
  ('quiet', 'Quiet', 'positive'),
  ('lively', 'Lively', 'positive'),
  ('budget-friendly', 'Budget-friendly', 'positive'),
  ('great-view', 'Great view', 'positive'),
  ('too-noisy', 'Too noisy', 'negative'),
  ('slow-service', 'Slow service', 'negative'),
  ('pricey', 'Pricey', 'negative'),
  ('needs-cleaning', 'Needs cleaning', 'negative'),
  ('overcrowded', 'Overcrowded', 'negative'),
  ('unfriendly-staff', 'Unfriendly staff', 'negative');

-- ===== SECURITY: row level security =====
alter table venues enable row level security;
alter table tags enable row level security;
alter table reviews enable row level security;
alter table review_tags enable row level security;
alter table venue_photos enable row level security;

create policy "Public read venues" on venues for select using (true);
create policy "Public read tags" on tags for select using (true);
create policy "Public read reviews" on reviews for select using (true);
create policy "Public read review_tags" on review_tags for select using (true);
create policy "Public read photos" on venue_photos for select using (true);

create policy "Owners update own venue" on venues for update
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

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

-- ===== SECURITY: column permissions =====
-- The public can read everything except the secret QR token and device hashes
revoke select on venues from anon, authenticated;
grant select (id, slug, name, category, description, area, address,
              opening_hours, cover_image_url, owner_id, created_at)
  on venues to anon, authenticated;

revoke select on reviews from anon, authenticated;
grant select (id, venue_id, rating, comment, visit_date, created_at)
  on reviews to anon, authenticated;

-- Owners can edit only these four fields
revoke update on venues from anon, authenticated;
grant update (description, address, area, opening_hours) on venues to authenticated;

grant select on tags, review_tags, venue_photos to anon, authenticated;
grant insert, delete on venue_photos to authenticated;

-- ===== VIEWS =====
create view venue_ratings with (security_invoker = true) as
select
  v.id as venue_id,
  count(r.id) as review_count,
  coalesce(round(avg(r.rating)::numeric, 2), 0) as average_rating,
  round((
    (coalesce(sum(r.rating * w.weight), 0) + 5 * 3.8)
    / (coalesce(sum(w.weight), 0) + 5)
  )::numeric, 2) as score
from venues v
left join reviews r on r.venue_id = v.id
left join lateral (
  select power(0.5, extract(epoch from (now() - r.created_at)) / (86400 * 180)) as weight
) w on true
group by v.id;

create view venue_cards with (security_invoker = true) as
select
  v.id, v.slug, v.name, v.category, v.area, v.cover_image_url,
  r.review_count, r.average_rating, r.score,
  coalesce((
    select array_agg(x.slug order by x.slug)
    from (
      select t.slug
      from reviews rv
      join review_tags rt on rt.review_id = rv.id
      join tags t on t.id = rt.tag_id
      where rv.venue_id = v.id and t.sentiment = 'positive'
      group by t.slug
      having count(*) >= 2
    ) x
  ), '{}') as tag_slugs,
  (
    select p.path from venue_photos p
    where p.venue_id = v.id
    order by p.position
    limit 1
  ) as cover_path
from venues v
join venue_ratings r on r.venue_id = v.id;

create view venue_tag_counts with (security_invoker = true) as
select r.venue_id, t.id as tag_id, t.label, t.sentiment, count(*) as times_used
from reviews r
join review_tags rt on rt.review_id = r.id
join tags t on t.id = rt.tag_id
group by r.venue_id, t.id, t.label, t.sentiment;

grant select on venue_ratings, venue_cards to anon, authenticated;
grant select on venue_tag_counts to authenticated;

-- ===== PHOTO STORAGE =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('venue-photos', 'venue-photos', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Owners upload venue photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'venue-photos'
    and exists (
      select 1 from public.venues v
      where v.id::text = (storage.foldername(storage.objects.name))[1]
        and v.owner_id = auth.uid()
    )
  );

create policy "Owners delete venue photos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'venue-photos'
    and exists (
      select 1 from public.venues v
      where v.id::text = (storage.foldername(storage.objects.name))[1]
        and v.owner_id = auth.uid()
    )
  );

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