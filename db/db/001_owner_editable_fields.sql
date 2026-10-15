alter table venues add column opening_hours text
  check (char_length(opening_hours) <= 300);

alter table venues add constraint venues_description_len
  check (char_length(description) <= 1000);
alter table venues add constraint venues_address_len
  check (char_length(address) <= 200);

-- The new column must be readable like the other public columns
grant select (opening_hours) on venues to anon, authenticated;

-- Owners may update only these four fields
revoke update on venues from anon, authenticated;
grant update (description, address, area, opening_hours) on venues to authenticated;