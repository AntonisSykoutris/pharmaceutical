export type Company = {
  id: string;
  name: string;
  created_at: string;
};

export type User = {
  id: string;
  auth_user_id: string | null; // in case you decouple auth later
  company_id: string | null;
  name: string | null;
  email: string;
  role: string;
  created_at: string;

  company?: Company | null; // optional populated company object
};
