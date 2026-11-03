-- Counts images per user per UTC day, so a signed-in account has a spending cap.

create table public.generation_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  images integer not null check (images > 0),
  primary key (user_id, day)
);

alter table public.generation_usage enable row level security;

-- Users can read their own counts. There are no write policies, so counts only
-- change through consume_image_credit below.
create policy "Users can read their own usage"
  on public.generation_usage
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.generation_usage from public, anon, authenticated;
grant select on table public.generation_usage to authenticated;

-- Atomically takes one credit for the signed-in user, or returns false if they
-- are at the limit. Runs as the table owner so it can write past RLS, which is
-- why it only ever touches auth.uid()'s row. Calling it directly with a higher
-- limit gains nothing: it can only use up the caller's own credits, and
-- /api/generate always applies its own limit.
create function public.consume_image_credit(daily_limit integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  today date := (pg_catalog.now() at time zone 'utc')::date;
  updated integer;
begin
  if caller is null or daily_limit is null or daily_limit < 1 then
    return false;
  end if;

  insert into public.generation_usage as usage (user_id, day, images)
  values (caller, today, 1)
  on conflict (user_id, day) do update
    set images = usage.images + 1
    where usage.images < daily_limit;

  get diagnostics updated = row_count;
  return updated = 1;
end;
$$;

revoke execute on function public.consume_image_credit(integer) from public, anon;
grant execute on function public.consume_image_credit(integer) to authenticated;
