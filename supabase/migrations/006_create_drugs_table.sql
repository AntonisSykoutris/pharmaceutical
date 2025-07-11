-- Create drugs table
create table if not exists drugs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  molecule_type text,
  therapeutic_area text,
  mechanism_of_action text,
  development_phase development_phase,
  status drug_status,
  target_indication text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to auto-update updated_at
create or replace function update_drugs_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language 'plpgsql';

create trigger update_drugs_updated_at
before update on drugs
for each row
execute procedure update_drugs_updated_at_column();

-- Enable RLS
alter table drugs enable row level security;

-- Policies

-- Adjust this policy if you have a user-company join table or user.company_id FK
create policy "Allow users to read drugs of their company"
on drugs
for select
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = drugs.company_id
  )
);

create policy "Allow users to insert drugs for their company"
on drugs
for insert
to authenticated
with check (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = drugs.company_id
  )
);

create policy "Allow users to update drugs of their company"
on drugs
for update
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = drugs.company_id
  )
)
with check (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = drugs.company_id
  )
);

create policy "Allow users to delete drugs of their company"
on drugs
for delete
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = drugs.company_id
  )
);
