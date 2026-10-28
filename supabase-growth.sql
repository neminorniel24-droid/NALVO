-- Nalvo growth upgrade: featured listings and owner statistics.
-- Run ONCE in Supabase > SQL Editor, after supabase-security.sql.

alter table public.listings
  add column if not exists featured_until timestamptz,
  add column if not exists views int not null default 0,
  add column if not exists calls int not null default 0,
  add column if not exists wa    int not null default 0,
  add column if not exists dirs  int not null default 0;

-- Updated guard: owners can never change featured status or the counters.
create or replace function public.listings_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare hit boolean; txt text;
begin
  if coalesce(auth.role(), '') = 'authenticated' and current_setting('nalvo.system', true) is distinct from '1' then
    if tg_op = 'INSERT' then
      new.status := 'pending'; new.verified := false; new.flagged := false; new.owner := auth.uid();
      new.featured_until := null; new.views := 0; new.calls := 0; new.wa := 0; new.dirs := 0;
      if (select count(*) from public.listings where owner = auth.uid() and created_at > now() - interval '1 day') >= 5 then
        raise exception 'Daily listing limit reached. Please try again tomorrow.';
      end if;
      if (select count(*) from public.listings where owner = auth.uid()) >= 25 then
        raise exception 'Listing limit reached for this account.';
      end if;
    else
      new.owner := old.owner; new.created_at := old.created_at;
      new.verified := old.verified; new.flagged := old.flagged;
      new.featured_until := old.featured_until;
      new.views := old.views; new.calls := old.calls; new.wa := old.wa; new.dirs := old.dirs;
      new.status := 'pending';
    end if;
  end if;
  new.updated_at := now();
  txt := lower(concat_ws(' ', new.name, new.descr, array_to_string(new.tags, ' '), new.addr, new.extra::text));
  select exists (select 1 from public.blocked_terms b where txt ~ ('\m' || b.term || '\M')) into hit;
  if hit then new.flagged := true; end if;
  return new;
end $$;
revoke all on function public.listings_guard() from public, anon, authenticated;

-- Counts views and taps. Visitors can only add one to a counter, nothing else.
create or replace function public.track(p_id uuid, p_kind text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform set_config('nalvo.system', '1', true);
  if    p_kind = 'view' then update public.listings set views = views + 1 where id = p_id and status = 'approved';
  elsif p_kind = 'call' then update public.listings set calls = calls + 1 where id = p_id and status = 'approved';
  elsif p_kind = 'wa'   then update public.listings set wa    = wa    + 1 where id = p_id and status = 'approved';
  elsif p_kind = 'dir'  then update public.listings set dirs  = dirs  + 1 where id = p_id and status = 'approved';
  end if;
end $$;
revoke all on function public.track(uuid, text) from public;
grant execute on function public.track(uuid, text) to anon, authenticated;
