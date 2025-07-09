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
