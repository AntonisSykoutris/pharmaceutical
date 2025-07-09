export type Company = {
  id: string;
  name: string;
  address?: string | null;
  industry?: string | null;
  website?: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type User = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  email: string; // Supabase auth.users.email
  company_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
  company?: Company | null; // linked company object
};
