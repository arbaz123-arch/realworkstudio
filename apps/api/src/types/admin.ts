export type AdminRole = 'super_admin' | 'content_manager';

export type AdminUserRecord = {
  id: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  created_at: Date;
  updated_at: Date;
};

export type AdminUserPublic = {
  id: string;
  email: string;
  role: AdminRole;
};
