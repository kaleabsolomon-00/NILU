create or replace view venue_cards with (security_invoker = true) as
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