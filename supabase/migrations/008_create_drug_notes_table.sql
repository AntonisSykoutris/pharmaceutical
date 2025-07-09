-- Drug notes table (AI suggestions or user notes per drug)
create table if not exists drug_notes (
  id uuid primary key default uuid_generate_v4(),
  drug_id uuid not null references drugs(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  note text not null,
  source text, -- AI, Analyst, External API, etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for updated_at
create trigger update_drug_notes_updated_at
before update on drug_notes
for each row
execute procedure update_updated_at_column();

-- Enable RLS
alter table drug_notes enable row level security;

-- Policies

-- Allow users to read drug notes linked to drugs of their company
create policy "Allow users to read drug notes of their company drugs"
on drug_notes
for select
to authenticated
using (
  exists (
    select 1
    from drugs
    join users on users.company_id = drugs.company_id
    where drugs.id = drug_notes.drug_id
    and users.id = auth.uid()
  )
);

-- Allow users to insert notes on drugs of their company
create policy "Allow users to insert notes for drugs of their company"
on drug_notes
for insert
to authenticated
with check (
  exists (
    select 1
    from drugs
    join users on users.company_id = drugs.company_id
    where drugs.id = drug_notes.drug_id
    and users.id = auth.uid()
  )
);

-- Allow users to update their own notes on drugs of their company
create policy "Allow users to update their own notes for company drugs"
on drug_notes
for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from drugs
    join users on users.company_id = drugs.company_id
    where drugs.id = drug_notes.drug_id
    and users.id = auth.uid()
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from drugs
    join users on users.company_id = drugs.company_id
    where drugs.id = drug_notes.drug_id
    and users.id = auth.uid()
  )
);

-- Allow users to delete their own notes on drugs of their company
create policy "Allow users to delete their own notes for company drugs"
on drug_notes
for delete
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from drugs
    join users on users.company_id = drugs.company_id
    where drugs.id = drug_notes.drug_id
    and users.id = auth.uid()
  )
);
