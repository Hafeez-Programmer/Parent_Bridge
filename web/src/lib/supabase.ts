import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in environment variables.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DbUserRole = 'admin' | 'teacher' | 'parent';
export type DbAttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: DbUserRole;
  is_active: boolean;
  fcm_token: string | null;
  created_at: string;
}

export interface ClassRow {
  id: string;
  name: string;
  section: string;
  teacher_id: string | null;
  created_at: string;
}

export interface SubjectRow {
  id: string;
  name: string;
  created_at: string;
}

export interface StudentRow {
  id: string;
  roll_no: string;
  full_name: string;
  class_id: string;
  link_code: string;
  is_active: boolean;
  created_at: string;
}

export interface ExamRow {
  id: string;
  name: string;
  term: string;
  class_id: string;
  is_published: boolean;
  created_at: string;
}

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  class_id: string | null;
  created_by: string;
  created_at: string;
}
