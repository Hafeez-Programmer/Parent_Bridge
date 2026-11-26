export type UserRole = 'Admin' | 'Teacher' | 'Parent';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classTeacherOf?: string;
  active: boolean;
}

export interface SchoolClass {
  id: string;
  name: string;
  classTeacher: string;
  studentsCount: number;
}

export interface Subject {
  id: string;
  name: string;
}

export interface StudentRecord {
  id: string;
  roll: string;
  name: string;
  className: string;
  linkCode: string;
  parentLinked: boolean;
  active: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message?: string;
  audience: string;
  date: string;
  schoolWide?: boolean;
}

export interface AttendanceLog {
  id: string;
  date: string;
  className: string;
  month: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export interface ExamRecord {
  id: string;
  name: string;
  term: string;
  className: string;
  status: 'Published' | 'Draft';
}

export interface StudentReportRow {
  id: string;
  name: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const INITIAL_USERS: UserAccount[] = [
  { id: 'u1', name: 'Sara Ahmed', email: 'sara@school.edu', role: 'Teacher', classTeacherOf: 'Class 8-A', active: true },
  { id: 'u2', name: 'Imran Khan', email: 'imran@school.edu', role: 'Teacher', classTeacherOf: 'Class 9-B', active: true },
  { id: 'u3', name: 'Nadia Raza', email: 'nadia@mail.com', role: 'Parent', active: true },
  { id: 'u4', name: 'Bilal Shah', email: 'bilal@mail.com', role: 'Parent', active: true },
  { id: 'u5', name: 'Hina Malik', email: 'hina@mail.com', role: 'Parent', active: false },
  { id: 'u6', name: 'Admin User', email: 'admin@school.edu', role: 'Admin', active: true },
];

export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'c1', name: '8-A', classTeacher: 'Sara Ahmed', studentsCount: 32 },
  { id: 'c2', name: '8-B', classTeacher: 'Imran Khan', studentsCount: 30 },
  { id: 'c3', name: '9-A', classTeacher: 'Sara Ahmed', studentsCount: 28 },
  { id: 'c4', name: '9-B', classTeacher: 'Imran Khan', studentsCount: 31 },
  { id: 'c5', name: '10-A', classTeacher: 'Not assigned', studentsCount: 25 },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Mathematics' },
  { id: 's2', name: 'English' },
  { id: 's3', name: 'Science' },
  { id: 's4', name: 'Urdu' },
  { id: 's5', name: 'Islamiyat' },
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  { id: 'st1', roll: '01', name: 'Ali Khan', className: '8-A', linkCode: 'K7P2M9QX', parentLinked: true, active: true },
  { id: 'st2', roll: '02', name: 'Ayesha Noor', className: '8-A', linkCode: 'R4T8W2LD', parentLinked: true, active: true },
  { id: 'st3', roll: '03', name: 'Bilal Ahmed', className: '8-A', linkCode: 'H9C3Z6NV', parentLinked: false, active: true },
  { id: 'st4', roll: '04', name: 'Fatima Raza', className: '8-A', linkCode: 'M2X7B5QA', parentLinked: true, active: true },
  { id: 'st5', roll: '05', name: 'Hamza Iqbal', className: '8-A', linkCode: 'T6J1P8EK', parentLinked: false, active: true },
  { id: 'st6', roll: '06', name: 'Hira Malik', className: '8-A', linkCode: 'D3S9Y4UG', parentLinked: true, active: true },
];

export const INITIAL_ADMIN_ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: 'a1', title: 'Sports Day - 5 Nov', audience: 'All parents', date: '18 Oct', schoolWide: true },
  { id: 'a2', title: 'Class 8-A: Math quiz', audience: 'Class 8-A', date: '17 Oct' },
  { id: 'a3', title: 'Winter break notice', audience: 'All parents', date: '15 Oct', schoolWide: true },
  { id: 'a4', title: 'Uniform policy update', audience: 'All parents', date: '10 Oct', schoolWide: true },
];

export const INITIAL_TEACHER_ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: 'ta1', title: 'Sports Day - 5 Nov', audience: 'All parents', date: '18 Oct', schoolWide: true },
  { id: 'ta2', title: 'Class 8-A: Math quiz', audience: 'Class 8-A', date: '17 Oct' },
  { id: 'ta3', title: 'Class 9-A: Lab submission', audience: 'Class 9-A', date: '15 Oct' },
];

export const ATTENDANCE_HISTORY: AttendanceLog[] = [
  { id: 'al1', date: 'Mon, 19 Oct', className: 'Class 8-A', month: 'October', present: 29, absent: 2, late: 1, leave: 0 },
  { id: 'al2', date: 'Fri, 16 Oct', className: 'Class 8-A', month: 'October', present: 30, absent: 1, late: 1, leave: 0 },
  { id: 'al3', date: 'Thu, 15 Oct', className: 'Class 8-A', month: 'October', present: 28, absent: 3, late: 0, leave: 1 },
  { id: 'al4', date: 'Wed, 14 Oct', className: 'Class 8-A', month: 'October', present: 31, absent: 0, late: 1, leave: 0 },
  { id: 'al5', date: 'Tue, 13 Oct', className: 'Class 8-A', month: 'October', present: 30, absent: 1, late: 0, leave: 1 },
  { id: 'al6', date: 'Mon, 12 Oct', className: 'Class 8-A', month: 'October', present: 29, absent: 2, late: 1, leave: 0 },
];

export const INITIAL_EXAMS: ExamRecord[] = [
  { id: 'ex1', name: 'Mid-Term', term: 'Term 1', className: '8-A', status: 'Published' },
  { id: 'ex2', name: 'Quiz 1', term: 'Term 1', className: '8-A', status: 'Draft' },
  { id: 'ex3', name: 'Mid-Term', term: 'Term 1', className: '9-A', status: 'Draft' },
];

export const REPORT_ROWS: StudentReportRow[] = [
  { id: 'r1', name: 'Ali Khan', present: 21, absent: 2, late: 1, percentage: 91 },
  { id: 'r2', name: 'Ayesha Noor', present: 23, absent: 0, late: 1, percentage: 98 },
  { id: 'r3', name: 'Bilal Ahmed', present: 16, absent: 6, late: 2, percentage: 70 },
  { id: 'r4', name: 'Fatima Raza', present: 22, absent: 1, late: 1, percentage: 96 },
];
