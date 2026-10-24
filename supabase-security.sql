-- Nalvo security and moderation upgrade.
-- Run ONCE in Supabase > SQL Editor. Safe to run on top of the first setup file.
-- WARNING: existing listings (your test shop) are marked approved. New listings start as 'pending'.

-- 1) New columns
alter table public.listings
  add column if not exists status     text    not null default 'pending',
  add column if not exists licence    text,
  add column if not exists verified   boolean not null default false,
  add column if not exists flagged    boolean not null default false,
  add column if not exists ack        boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

update public.listings set status = 'approved', ack = true where status = 'pending';
update public.listings set ph = right(regexp_replace(ph, '\D', '', 'g'), 10);

-- 2) Stricter rules (NOT VALID = enforced for new and changed rows)
alter table public.listings drop constraint if exists listings_cat_check;
alter table public.listings
  add constraint listings_status_chk check (status in ('pending','approved','rejected','hidden')) not valid,
  add constraint listings_cat_chk check (cat in ('Mechanics & Repair','Gyms & Fitness','Training & Courses','Tuition & Coaching','Salon & Beauty','Food & Catering','Electronics & Tech','Ayurveda & Wellness','Health & Pharmacy','Home Services','Grocery & Daily Needs','Textiles & Fashion','Jewellery','Stay & Tourism','Travel & Rentals','Events & Photography','Agriculture & Farm','Professional Services','Other')) not valid,
  add constraint listings_ph_chk check (ph ~ '^[6-9][0-9]{9}$') not valid,
  add constraint listings_tags_chk check (cardinality(tags) <= 12) not valid,
  add constraint listings_extra_chk check (pg_column_size(extra) <= 4000) not valid,
  add constraint listings_licence_chk check (licence is null or char_length(licence) <= 60) not valid,
  add constraint listings_ack_chk check (ack) not valid;
create unique index if not exists listings_owner_name_dist on public.listings (owner, lower(name), dist);

-- 3) Blocked words (flag listings for your attention; nobody can read this table through the website)
create table if not exists public.blocked_terms (term text primary key);
alter table public.blocked_terms enable row level security;
insert into public.blocked_terms (term) values
 ('ganja'),('cannabis'),('marijuana'),('mdma'),('lsd'),('cocaine'),('heroin'),('opium'),('brown sugar'),('hashish'),
 ('escort'),('call girl'),('matka'),('satta'),('betting'),('casino'),('lottery'),
 ('fake certificate'),('fake degree'),('fake marksheet'),('fake licence'),('fake license'),
 ('firearm'),('pistol'),('ammunition'),('hawala'),('double your money'),('tiger skin'),('ivory')
on conflict do nothing;

-- 4) Guard: forces safe values, limits spam, flags risky words
create or replace function public.listings_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare hit boolean; txt text;
begin
  if coalesce(auth.role(), '') = 'authenticated' and current_setting('nalvo.system', true) is distinct from '1' then
    if tg_op = 'INSERT' then
      new.status := 'pending'; new.verified := false; new.flagged := false; new.owner := auth.uid();
      if (select count(*) from public.listings where owner = auth.uid() and created_at > now() - interval '1 day') >= 5 then
        raise exception 'Daily listing limit reached. Please try again tomorrow.';
      end if;
      if (select count(*) from public.listings where owner = auth.uid()) >= 25 then
        raise exception 'Listing limit reached for this account.';
      end if;
    else
      new.owner := old.owner; new.created_at := old.created_at;
      new.verified := old.verified; new.flagged := old.flagged;
      new.status := 'pending';   -- every edit goes back to review
    end if;
  end if;
  new.updated_at := now();
  txt := lower(concat_ws(' ', new.name, new.descr, array_to_string(new.tags, ' '), new.addr, new.extra::text));
  select exists (select 1 from public.blocked_terms b where txt ~ ('\m' || b.term || '\M')) into hit;
  if hit then new.flagged := true; end if;
  return new;
end $$;
revoke all on function public.listings_guard() from public, anon, authenticated;
drop trigger if exists listings_guard_trg on public.listings;
create trigger listings_guard_trg before insert or update on public.listings
  for each row execute function public.listings_guard();

-- 5) Access rules
drop policy if exists "read listings" on public.listings;
drop policy if exists "owners insert" on public.listings;
drop policy if exists "owners delete" on public.listings;
alter table public.listings drop column if exists approved;

create policy "read approved or own" on public.listings
  for select using (status = 'approved' or owner = auth.uid());
create policy "owners insert" on public.listings
  for insert to authenticated with check (owner = auth.uid());
create policy "owners update" on public.listings
  for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
create policy "owners delete" on public.listings
  for delete to authenticated using (owner = auth.uid());

-- 6) Reports from the public (signed-in users only)
create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reporter   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason     text not null check (reason in ('Illegal item or service','Fake business or scam','Wrong or misleading information','Spam or duplicate','Other')),
  note       text check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  unique (listing_id, reporter)
);
alter table public.reports enable row level security;
create policy "signed in users can report" on public.reports
  for insert to authenticated
  with check (reporter = auth.uid()
    and not exists (select 1 from public.listings l where l.id = listing_id and l.owner = auth.uid()));
-- No select policy on purpose: only you can read reports, in the dashboard.

create or replace function public.reports_after() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(distinct reporter) into n from public.reports where listing_id = new.listing_id;
  if n >= 3 then
    perform set_config('nalvo.system', '1', true);
    update public.listings set status = 'hidden' where id = new.listing_id and status = 'approved';
  end if;
  return new;
end $$;
revoke all on function public.reports_after() from public, anon, authenticated;
drop trigger if exists reports_after_trg on public.reports;
create trigger reports_after_trg after insert on public.reports
  for each row execute function public.reports_after();

-- 7) Photos: JPEG only, max 1 MB
update storage.buckets set file_size_limit = 1048576, allowed_mime_types = array['image/jpeg'] where id = 'photos';
