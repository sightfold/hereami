create extension if not exists pgcrypto with schema extensions;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  brand_color text,
  status text not null default 'active' check (status in ('active', 'suspended')),
  timezone text not null default 'Africa/Lagos',
  contact_name text not null default '',
  contact_email text not null default '',
  created_at timestamptz not null default now()
);

create table public.org_settings (
  org_id uuid primary key references public.organizations on delete cascade,
  lat double precision not null default 6.4541,
  lng double precision not null default 3.3947,
  radius_m integer not null default 50 check (radius_m between 10 and 5000),
  late_after_min integer not null default 15 check (late_after_min between 0 and 240)
);

create table public.org_secrets (
  org_id uuid primary key references public.organizations on delete cascade,
  qr_secret bytea not null default extensions.gen_random_bytes(32)
);

create table public.owners (
  user_id uuid primary key references auth.users on delete cascade,
  name text not null,
  email text not null
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners on delete cascade,
  org_id uuid not null references public.organizations on delete cascade,
  org_name text not null,
  target text not null,
  time timestamptz not null default now()
);

create table public.roles (
  org_id uuid not null references public.organizations on delete cascade,
  id text not null,
  name text not null,
  permissions text[] not null default '{}',
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (org_id, id)
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  name text not null,
  roles text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (id, org_id)
);

create unique index departments_name_key on public.departments (org_id, lower(name));

create table public.units (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  department_id uuid not null,
  name text not null,
  created_at timestamptz not null default now(),
  foreign key (department_id, org_id) references public.departments (id, org_id) on delete cascade
);

create unique index units_name_key on public.units (department_id, lower(name));

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  user_id uuid unique references auth.users on delete set null,
  name text not null,
  email text not null,
  phone text not null default '',
  role text not null default 'member',
  departments uuid[] not null default '{}',
  units uuid[] not null default '{}',
  has_passkey boolean not null default false,
  is_primary_admin boolean not null default false,
  photo text,
  created_at timestamptz not null default now(),
  unique (id, org_id),
  foreign key (org_id, role) references public.roles (org_id, id) on update cascade
);

create unique index profiles_email_key on public.profiles (lower(email));
create index profiles_org_idx on public.profiles (org_id);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  date date not null,
  name text not null,
  start_time time not null,
  call_time time not null,
  unique (org_id, date, name),
  unique (id, org_id)
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  member_id uuid not null,
  service_id uuid not null,
  time timestamptz not null default now(),
  status text not null check (status in ('onTime', 'late', 'override')),
  method text not null check (method in ('gps', 'qr', 'override')),
  dist_m integer,
  reason text,
  approved_by text,
  unique (member_id, service_id),
  foreign key (member_id, org_id) references public.profiles (id, org_id) on delete cascade,
  foreign key (service_id, org_id) references public.services (id, org_id) on delete cascade
);

create index attendance_org_idx on public.attendance (org_id);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  service_id uuid not null,
  member_id uuid not null,
  department_id uuid not null,
  role text not null default '',
  is_lead boolean not null default false,
  foreign key (service_id, org_id) references public.services (id, org_id) on delete cascade,
  foreign key (member_id, org_id) references public.profiles (id, org_id) on delete cascade,
  foreign key (department_id, org_id) references public.departments (id, org_id) on delete cascade
);

create index assignments_org_idx on public.assignments (org_id);

create table public.child_classes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  name text not null,
  emoji text not null default '',
  min_age integer not null default 0,
  max_age integer not null default 16,
  created_at timestamptz not null default now(),
  unique (id, org_id)
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  serial integer not null,
  first_name text not null,
  surname text not null,
  dob date,
  age integer not null,
  gender text not null check (gender in ('male', 'female')),
  parent_name text,
  parent_phone text,
  class_id uuid not null,
  notes text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (org_id, serial),
  unique (id, org_id),
  foreign key (class_id, org_id) references public.child_classes (id, org_id)
);

create table public.child_marks (
  org_id uuid not null references public.organizations on delete cascade,
  child_id uuid not null,
  service_id uuid not null,
  status text not null check (status in ('present', 'absent')),
  primary key (child_id, service_id),
  foreign key (child_id, org_id) references public.children (id, org_id) on delete cascade,
  foreign key (service_id, org_id) references public.services (id, org_id) on delete cascade
);

create or replace function public.is_internal()
returns boolean language sql stable as $$
  select coalesce(current_setting('heartbeat.internal', true), '') = 'on'
$$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from owners where user_id = auth.uid())
$$;

create or replace function public.my_profile_id(org uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select id from profiles where user_id = auth.uid() and org_id = org
$$;

create or replace function public.is_member(org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select is_owner() or exists (
    select 1 from profiles p join organizations o on o.id = p.org_id
    where p.user_id = auth.uid() and p.org_id = org and o.status = 'active'
  )
$$;

create or replace function public.has_perm(org uuid, perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select is_owner() or exists (
    select 1 from profiles p
    join organizations o on o.id = p.org_id
    join roles r on r.org_id = p.org_id and r.id = p.role
    where p.user_id = auth.uid() and p.org_id = org and o.status = 'active'
      and perm = any (r.permissions)
  )
$$;

create or replace function public.can_see_children(org uuid)
returns boolean language sql stable as $$
  select has_perm(org, 'children.view') or has_perm(org, 'children.mark')
    or has_perm(org, 'children.manage')
$$;

create or replace function public.org_today(org uuid)
returns date language sql stable security definer set search_path = public as $$
  select (now() at time zone timezone)::date from organizations where id = org
$$;

create or replace function public.service_started(service uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from services s where s.id = service and s.date <= org_today(s.org_id))
$$;

alter table public.organizations enable row level security;
alter table public.org_settings enable row level security;
alter table public.org_secrets enable row level security;
alter table public.owners enable row level security;
alter table public.audit_log enable row level security;
alter table public.roles enable row level security;
alter table public.departments enable row level security;
alter table public.units enable row level security;
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.child_classes enable row level security;
alter table public.children enable row level security;
alter table public.child_marks enable row level security;

create policy "orgs readable by their people" on public.organizations for select
  using (is_owner() or exists (
    select 1 from profiles p where p.org_id = organizations.id and p.user_id = auth.uid()
  ));
create policy "orgs branded by managers" on public.organizations for update
  using (has_perm(id, 'branding.manage')) with check (has_perm(id, 'branding.manage'));

create policy "settings readable" on public.org_settings for select using (is_member(org_id));
create policy "settings managed" on public.org_settings for update
  using (has_perm(org_id, 'settings.manage')) with check (has_perm(org_id, 'settings.manage'));

create policy "owners see themselves" on public.owners for select using (user_id = auth.uid());

create policy "audit readable by owners" on public.audit_log for select using (is_owner());
create policy "audit written by owners" on public.audit_log for insert
  with check (is_owner() and owner_id = auth.uid());

create policy "roles readable" on public.roles for select using (is_member(org_id));
create policy "roles inserted" on public.roles for insert with check (has_perm(org_id, 'roles.manage'));
create policy "roles updated" on public.roles for update
  using (has_perm(org_id, 'roles.manage')) with check (has_perm(org_id, 'roles.manage'));
create policy "roles deleted" on public.roles for delete using (has_perm(org_id, 'roles.manage'));

create policy "departments readable" on public.departments for select using (is_member(org_id));
create policy "departments inserted" on public.departments for insert
  with check (has_perm(org_id, 'departments.manage'));
create policy "departments updated" on public.departments for update
  using (has_perm(org_id, 'departments.manage')) with check (has_perm(org_id, 'departments.manage'));
create policy "departments deleted" on public.departments for delete
  using (has_perm(org_id, 'departments.manage'));

create policy "units readable" on public.units for select using (is_member(org_id));
create policy "units inserted" on public.units for insert
  with check (has_perm(org_id, 'departments.manage'));
create policy "units updated" on public.units for update
  using (has_perm(org_id, 'departments.manage')) with check (has_perm(org_id, 'departments.manage'));
create policy "units deleted" on public.units for delete using (has_perm(org_id, 'departments.manage'));

create policy "profiles readable" on public.profiles for select
  using (user_id = auth.uid() or is_member(org_id));
create policy "profiles inserted" on public.profiles for insert
  with check (has_perm(org_id, 'members.manage'));
create policy "profiles updated" on public.profiles for update
  using (has_perm(org_id, 'members.manage')) with check (has_perm(org_id, 'members.manage'));
create policy "profiles deleted" on public.profiles for delete using (has_perm(org_id, 'members.manage'));

create policy "services readable" on public.services for select using (is_member(org_id));

create policy "attendance readable" on public.attendance for select using (is_member(org_id));

create policy "assignments readable" on public.assignments for select using (is_member(org_id));
create policy "assignments inserted" on public.assignments for insert
  with check (has_perm(org_id, 'roster.manage'));
create policy "assignments updated" on public.assignments for update
  using (has_perm(org_id, 'roster.manage')) with check (has_perm(org_id, 'roster.manage'));
create policy "assignments deleted" on public.assignments for delete
  using (has_perm(org_id, 'roster.manage'));

create policy "classes readable" on public.child_classes for select using (can_see_children(org_id));
create policy "classes inserted" on public.child_classes for insert
  with check (has_perm(org_id, 'children.manage'));
create policy "classes updated" on public.child_classes for update
  using (has_perm(org_id, 'children.manage')) with check (has_perm(org_id, 'children.manage'));
create policy "classes deleted" on public.child_classes for delete
  using (has_perm(org_id, 'children.manage'));

create policy "children readable" on public.children for select using (can_see_children(org_id));
create policy "children inserted" on public.children for insert
  with check (has_perm(org_id, 'children.manage'));
create policy "children updated" on public.children for update
  using (has_perm(org_id, 'children.manage')) with check (has_perm(org_id, 'children.manage'));

create policy "marks readable" on public.child_marks for select using (can_see_children(org_id));
create policy "marks inserted" on public.child_marks for insert
  with check (has_perm(org_id, 'children.mark') and service_started(service_id));
create policy "marks updated" on public.child_marks for update
  using (has_perm(org_id, 'children.mark'))
  with check (has_perm(org_id, 'children.mark') and service_started(service_id));
create policy "marks deleted" on public.child_marks for delete
  using (has_perm(org_id, 'children.mark') and service_started(service_id));

create or replace function public.guard_organization()
returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status and not is_owner() and not is_internal() then
    raise exception 'Only the platform owner can change an organization''s status';
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end $$;

create trigger organizations_guard before update on public.organizations
  for each row execute function public.guard_organization();

create or replace function public.guard_role()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  holders integer;
begin
  if is_internal() then
    return coalesce(new, old);
  end if;
  if tg_op = 'UPDATE' then
    if old.id = 'admin' then
      raise exception 'The Administrator role always has full access';
    end if;
    new.is_system := old.is_system;
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.is_system := false;
    return new;
  end if;
  if old.is_system then
    raise exception '% is a built-in role and can''t be deleted', old.name;
  end if;
  select count(*) into holders from profiles where org_id = old.org_id and role = old.id;
  if holders > 0 then
    raise exception 'Move % % to another role first', holders,
      case when holders = 1 then 'person' else 'people' end;
  end if;
  return old;
end $$;

create trigger roles_guard before insert or update or delete on public.roles
  for each row execute function public.guard_role();

create or replace function public.guard_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if is_internal() then
    return coalesce(new, old);
  end if;
  if tg_op = 'DELETE' then
    if old.is_primary_admin then
      raise exception 'The primary administrator can''t be removed';
    end if;
    if old.user_id = auth.uid() then
      raise exception 'You can''t remove yourself';
    end if;
    return old;
  end if;
  if tg_op = 'INSERT' then
    new.has_passkey := false;
    new.is_primary_admin := false;
    new.user_id := (
      select id from auth.users
      where lower(email) = lower(new.email) and email_confirmed_at is not null
      limit 1
    );
    if new.role <> 'member' and not has_perm(new.org_id, 'roles.manage') then
      raise exception 'You don''t have permission to change roles';
    end if;
    return new;
  end if;
  new.org_id := old.org_id;
  new.user_id := old.user_id;
  new.has_passkey := old.has_passkey;
  new.is_primary_admin := old.is_primary_admin;
  if new.role <> old.role and not has_perm(new.org_id, 'roles.manage') then
    raise exception 'You don''t have permission to change roles';
  end if;
  if old.is_primary_admin and new.role <> 'admin' then
    raise exception 'The primary administrator always stays an Administrator';
  end if;
  return new;
end $$;

create trigger profiles_guard before insert or update or delete on public.profiles
  for each row execute function public.guard_profile();

create or replace function public.tidy_department()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform set_config('heartbeat.internal', 'on', true);
  if tg_op = 'DELETE' then
    update profiles set departments = array_remove(departments, old.id)
      where org_id = old.org_id and old.id = any (departments);
  else
    delete from assignments
      where department_id = new.id and not (role = any (new.roles));
  end if;
  perform set_config('heartbeat.internal', '', true);
  return null;
end $$;

create trigger departments_tidy after update or delete on public.departments
  for each row execute function public.tidy_department();

create or replace function public.tidy_unit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform set_config('heartbeat.internal', 'on', true);
  update profiles set units = array_remove(units, old.id)
    where org_id = old.org_id and old.id = any (units);
  perform set_config('heartbeat.internal', '', true);
  return null;
end $$;

create trigger units_tidy after delete on public.units
  for each row execute function public.tidy_unit();

create or replace function public.number_child()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtext(new.org_id::text));
  select coalesce(max(serial), 0) + 1 into new.serial from children where org_id = new.org_id;
  new.created_at := now();
  new.archived := false;
  return new;
end $$;

create trigger children_number before insert on public.children
  for each row execute function public.number_child();

create or replace function public.make_service(org uuid, day date)
returns void language sql security definer set search_path = public as $$
  insert into services (org_id, date, name, start_time, call_time)
  select org, day,
    case when extract(dow from day) = 0 then 'Sunday Service' else 'Midweek Service' end,
    case when extract(dow from day) = 0 then time '09:00' else time '18:00' end,
    case when extract(dow from day) = 0 then time '07:30' else time '16:30' end
  where not exists (select 1 from services where org_id = org and date = day)
$$;

create or replace function public.ensure_services(org uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  today date := org_today(org);
  first_sunday date;
begin
  if not is_member(org) then
    raise exception 'You don''t have access to this organization';
  end if;
  perform make_service(org, today);
  first_sunday := today + (7 - extract(dow from today)::integer);
  for week in 0..3 loop
    perform make_service(org, first_sunday + week * 7);
  end loop;
end $$;

create or replace function public.create_org(
  org_name text, admin_name text, admin_email text, admin_phone text,
  admin_user uuid default null, org_logo text default null, org_brand text default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  org uuid;
  media uuid;
begin
  perform set_config('heartbeat.internal', 'on', true);
  insert into organizations (name, logo, brand_color, contact_name, contact_email)
    values (org_name, org_logo, org_brand, admin_name, admin_email) returning id into org;
  insert into org_settings (org_id) values (org);
  insert into org_secrets (org_id) values (org);
  insert into roles (org_id, id, name, permissions, is_system) values
    (org, 'admin', 'Administrator', array[
      'dashboard.view', 'attendance.view', 'attendance.override', 'roster.manage',
      'members.manage', 'departments.manage', 'settings.manage', 'branding.manage',
      'roles.manage', 'children.view', 'children.mark', 'children.manage'], true),
    (org, 'lead', 'Team lead',
      array['dashboard.view', 'attendance.view', 'attendance.override', 'roster.manage'], false),
    (org, 'teacher', 'Children''s teacher',
      array['children.view', 'children.mark', 'children.manage'], false),
    (org, 'member', 'Member', '{}', true);
  insert into departments (org_id, name, roles, created_at) values
    (org, 'Ushers', array['Front Door', 'Main Hall'], now()),
    (org, 'Choir', array['Lead Vocal', 'Backing Vocal'], now() + interval '1 ms');
  insert into departments (org_id, name, roles, created_at)
    values (org, 'Media', array['Sound', 'Camera', 'Slides'], now() + interval '2 ms')
    returning id into media;
  insert into child_classes (org_id, name, emoji, min_age, max_age, created_at) values
    (org, 'Seedlings', '🌱', 0, 6, now()),
    (org, 'Buds', '🌷', 7, 12, now() + interval '1 ms'),
    (org, 'Blooms', '🌸', 13, 16, now() + interval '2 ms');
  insert into profiles (org_id, user_id, name, email, phone, role, is_primary_admin)
    values (org, admin_user, admin_name, admin_email, coalesce(admin_phone, ''), 'admin', true);
  perform make_service(org, org_today(org));
  perform set_config('heartbeat.internal', '', true);
  return org;
end $$;

create or replace function public.onboard_organization(
  org_name text, contact_name text, contact_email text, contact_phone text,
  org_logo text default null, org_brand text default null
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  if not is_owner() then
    raise exception 'Only the platform owner can do that';
  end if;
  if exists (select 1 from profiles where lower(email) = lower(contact_email)) then
    raise exception 'That email already has an account';
  end if;
  return create_org(org_name, contact_name, contact_email, contact_phone,
    (select id from auth.users where lower(email) = lower(contact_email)
      and email_confirmed_at is not null limit 1),
    org_logo, org_brand);
end $$;

create or replace function public.handle_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if new.email_confirmed_at is null then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.email_confirmed_at is not null then
    return new;
  end if;
  perform set_config('heartbeat.internal', 'on', true);
  update profiles set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  if not found and coalesce(meta ->> 'org_name', '') <> ''
    and not exists (select 1 from profiles where lower(email) = lower(new.email)) then
    perform create_org(meta ->> 'org_name', coalesce(meta ->> 'name', new.email), new.email,
      meta ->> 'phone', new.id);
  end if;
  perform set_config('heartbeat.internal', '', true);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_auth_user();
create trigger on_auth_user_confirmed after update of email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user();

create or replace function public.is_invited(email_address text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where lower(email) = lower(trim(email_address)) and user_id is null
  )
$$;

create or replace function public.code_for(org uuid, service uuid, slot bigint)
returns text language sql stable security definer set search_path = public, extensions as $$
  select lpad(
    (('x' || substr(encode(hmac(convert_to(service::text || ':' || slot::text, 'UTF8'), qr_secret, 'sha256'), 'hex'), 1, 8))::bit(32)::bigint % 1000000)::text,
    6, '0')
  from org_secrets where org_id = org
$$;

create or replace function public.current_checkin_code(service uuid)
returns table (code text, seconds_left integer)
language plpgsql stable security definer set search_path = public as $$
declare
  org uuid;
  epoch double precision := extract(epoch from now());
begin
  select org_id into org from services where id = service;
  if org is null or not (has_perm(org, 'attendance.override') or has_perm(org, 'dashboard.view')) then
    raise exception 'You don''t have permission to do that';
  end if;
  return query select code_for(org, service, floor(epoch / 30)::bigint),
    (30 - floor(epoch)::bigint % 30)::integer;
end $$;

create or replace function public.check_in(
  service uuid, check_method text, lat double precision default null,
  lng double precision default null, code text default null
) returns public.attendance
language plpgsql security definer set search_path = public as $$
declare
  svc services;
  cfg org_settings;
  member uuid;
  dist integer;
  slot bigint := floor(extract(epoch from now()) / 30)::bigint;
  late_at timestamptz;
  saved attendance;
begin
  select * into svc from services where id = service;
  if svc.id is null then
    raise exception 'No service found for today';
  end if;
  if not is_member(svc.org_id) then
    raise exception 'You don''t have access to this organization';
  end if;
  member := my_profile_id(svc.org_id);
  if member is null then
    raise exception 'Sign in to check in';
  end if;
  if svc.date <> org_today(svc.org_id) then
    raise exception 'Check-in is only open on the day of the service';
  end if;
  if exists (select 1 from attendance where member_id = member and service_id = service) then
    raise exception 'Already checked in for this service';
  end if;
  select * into cfg from org_settings where org_id = svc.org_id;
  if check_method = 'gps' then
    if lat is null or lng is null then
      raise exception 'We couldn''t read your location';
    end if;
    dist := round(2 * 6371000 * asin(sqrt(
      power(sin(radians(cfg.lat - lat) / 2), 2) +
      cos(radians(lat)) * cos(radians(cfg.lat)) * power(sin(radians(cfg.lng - lng) / 2), 2)
    )));
    if dist > cfg.radius_m then
      raise exception 'You are outside the church perimeter';
    end if;
  elsif check_method = 'qr' then
    if coalesce(code, '') not in (code_for(svc.org_id, service, slot), code_for(svc.org_id, service, slot - 1)) then
      raise exception 'That check-in code has expired. Scan the screen again.';
    end if;
  else
    raise exception 'Unknown check-in method';
  end if;
  late_at := ((svc.date + svc.start_time) at time zone (select timezone from organizations where id = svc.org_id))
    + make_interval(mins => cfg.late_after_min);
  insert into attendance (org_id, member_id, service_id, time, status, method, dist_m)
    values (svc.org_id, member, service, now(),
      case when now() > late_at then 'late' else 'onTime' end, check_method, dist)
    returning * into saved;
  return saved;
end $$;

create or replace function public.override_check_in(service uuid, member uuid, why text)
returns public.attendance
language plpgsql security definer set search_path = public as $$
declare
  org uuid;
  saved attendance;
begin
  select org_id into org from services where id = service;
  if org is null or not has_perm(org, 'attendance.override') then
    raise exception 'You don''t have permission to do that';
  end if;
  if not exists (select 1 from profiles where id = member and org_id = org) then
    raise exception 'Member not found';
  end if;
  if length(trim(coalesce(why, ''))) < 3 then
    raise exception 'Enter a reason';
  end if;
  if exists (select 1 from attendance where member_id = member and service_id = service) then
    raise exception 'Already checked in for this service';
  end if;
  insert into attendance (org_id, member_id, service_id, time, status, method, reason, approved_by)
    values (org, member, service, now(), 'override', 'override', trim(why),
      coalesce(my_profile_id(org)::text, auth.uid()::text))
    returning * into saved;
  return saved;
end $$;

revoke execute on function public.create_org(text, text, text, text, uuid, text, text) from public, anon, authenticated;
revoke execute on function public.make_service(uuid, date) from public, anon, authenticated;
revoke execute on function public.code_for(uuid, uuid, bigint) from public, anon, authenticated;
revoke execute on function public.handle_auth_user() from public, anon, authenticated;
