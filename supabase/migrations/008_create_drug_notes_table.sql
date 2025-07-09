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
