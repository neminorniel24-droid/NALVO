-- Nalvo database setup. Paste this whole file into Supabase > SQL Editor > Run.

create table public.listings (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  approved    boolean not null default true,
  name        text not null check (char_length(name) between 2 and 80),
  cat         text not null check (char_length(cat) <= 40),
  state       text not null check (state in ('Tamil Nadu','Kerala')),
  dist        text not null check (char_length(dist) <= 40),
  area        text not null check (char_length(area) <= 60),
  ph          text not null check (char_length(ph) <= 15),
  timings     text check (char_length(timings) <= 80),
  addr        text check (char_length(addr) <= 160),
  maplink     text check (maplink is null or maplink ~ '^https://[^ ]+$'),
  descr       text check (char_length(descr) <= 400),
  tags        text[] not null default '{}',
  extra       jsonb not null default '{}',
  img         text,
  lat         double precision check (lat between -90 and 90),
  lng         double precision check (lng between -180 and 180)
);

alter table public.listings enable row level security;

-- Anyone can read approved listings. Owners can also see their own.
create policy "read listings" on public.listings
  for select using (approved or owner = auth.uid());

-- Only signed-in users can add listings, and only as themselves.
create policy "owners insert" on public.listings
  for insert to authenticated with check (owner = auth.uid());

-- Owners can delete only their own listings.
create policy "owners delete" on public.listings
  for delete to authenticated using (owner = auth.uid());

-- Photo storage
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
  on conflict (id) do nothing;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'photos');

create policy "users upload own photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users delete own photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
