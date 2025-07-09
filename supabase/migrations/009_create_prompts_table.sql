-- Prompts table (store system prompts for RAG or assistants)
create table if not exists prompts (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for updated_at
create trigger update_prompts_updated_at
before update on prompts
for each row
execute procedure update_updated_at_column();

-- Enable RLS
alter table prompts enable row level security;

-- Policies

-- Allow users to read prompts of their company
create policy "Allow users to read prompts of their company"
on prompts
for select
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = prompts.company_id
  )
);

-- Allow users to insert prompts for their company
create policy "Allow users to insert prompts for their company"
on prompts
for insert
to authenticated
with check (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = prompts.company_id
  )
);

-- Allow users to update prompts of their company
create policy "Allow users to update prompts of their company"
on prompts
for update
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = prompts.company_id
  )
)
with check (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = prompts.company_id
  )
);

-- Allow users to delete prompts of their company
create policy "Allow users to delete prompts of their company"
on prompts
for delete
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = prompts.company_id
  )
);
