import { ObjectId } from 'mongodb';

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

export interface AdminUser {
  _id: string | ObjectId;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  status?: 'active' | 'inactive';
  created_at: Date;
  updated_at?: Date;
  last_login?: Date;
}

// ... rest of the file ... 