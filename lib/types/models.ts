export type Company = {
  id: string;
  name: string;
  address?: string | null;
  industry?: string | null;
  website?: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  auth_user_id: string; // maps to Supabase auth.users.id
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  email: string; // Supabase auth.users.email
  company_id?: string | null;
  created_at: string;
  updated_at: string;
  company?: Company | null; // linked company object
};
