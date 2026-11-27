import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout, type NavItem } from './components/layout/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAddEditUserPage } from './pages/admin/AdminAddEditUserPage';
import { AdminClassesSubjectsPage } from './pages/admin/AdminClassesSubjectsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminAddStudentPage } from './pages/admin/AdminAddStudentPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { TeacherMarkAttendancePage } from './pages/teacher/TeacherMarkAttendancePage';
import { TeacherAttendanceHistoryPage } from './pages/teacher/TeacherAttendanceHistoryPage';
import { TeacherExamsResultsPage } from './pages/teacher/TeacherExamsResultsPage';
import { TeacherEnterResultsPage } from './pages/teacher/TeacherEnterResultsPage';
import { TeacherAnnouncementsPage } from './pages/teacher/TeacherAnnouncementsPage';
import { TeacherReportsPage } from './pages/teacher/TeacherReportsPage';

const ADMIN_NAV: NavItem[] = [
  { to: '/admin/overview', label: 'Overview', icon: 'dashboard' },
  { to: '/admin/users', label: 'Users', icon: 'group' },
  { to: '/admin/classes-subjects', label: 'Classes & Subjects', icon: 'menu_book' },
  { to: '/admin/students', label: 'Students', icon: 'badge' },
  { to: '/admin/announcements', label: 'Announcements', icon: 'campaign' },
  { to: '/admin/reports', label: 'Reports', icon: 'bar_chart' },
];

const TEACHER_NAV: NavItem[] = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/teacher/mark-attendance', label: 'Mark Attendance', icon: 'fact_check' },
  { to: '/teacher/attendance-history', label: 'Attendance History', icon: 'history' },
  { to: '/teacher/exams-results', label: 'Exams & Results', icon: 'assignment' },
  { to: '/teacher/announcements', label: 'Announcements', icon: 'campaign' },
  { to: '/teacher/reports', label: 'Reports', icon: 'bar_chart' },
];

const RequireRole: React.FC<{ role: 'admin' | 'teacher'; children: React.ReactNode }> = ({
  role,
  children,
}) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-light-background flex items-center justify-center font-body text-body-lg text-light-on-surface-variant">
        Loading ParentBridge...
      </div>
    );
  }

  if (!session || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.role !== role) {
    if (profile.role === 'admin') return <Navigate to="/admin/overview" replace />;
    if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <DashboardLayout portal="admin" navItems={ADMIN_NAV} />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/new" element={<AdminAddEditUserPage />} />
            <Route path="classes-subjects" element={<AdminClassesSubjectsPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="students/new" element={<AdminAddStudentPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>

          <Route
            path="/teacher"
            element={
              <RequireRole role="teacher">
                <DashboardLayout portal="teacher" navItems={TEACHER_NAV} />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboardPage />} />
            <Route path="mark-attendance" element={<TeacherMarkAttendancePage />} />
            <Route path="attendance-history" element={<TeacherAttendanceHistoryPage />} />
            <Route path="exams-results" element={<TeacherExamsResultsPage />} />
            <Route path="enter-results" element={<TeacherEnterResultsPage />} />
            <Route path="announcements" element={<TeacherAnnouncementsPage />} />
            <Route path="reports" element={<TeacherReportsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
