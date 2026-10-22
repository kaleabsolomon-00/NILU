
insert into venues (slug, name, category, area, owner_id)
select 'cafe-name', 'Cafe Name', 'cafe', 'Neighborhood', u.id
from auth.users u
where lower(u.email) = lower('owner@example.com')
returning slug, qr_token, owner_id;