import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  DataTable,
  Icon,
  MetricCard,
  PageHeader,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface ClassSummary {
  id: string;
  label: string;
  studentsCount: number;
  markedToday: boolean;
}

interface AnnouncementSummary {
  id: string;
  title: string;
  audience: string;
  schoolWide: boolean;
}

export const TeacherDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [draftExamsCount, setDraftExamsCount] = useState(0);
  const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    async function loadDashboard() {
      const today = new Date().toISOString().slice(0, 10);

      const { data: clsData } = await supabase
        .from('classes')
        .select('id, name, section')
        .eq('teacher_id', user!.id)
        .order('name')
        .order('section');

      if (!mounted) return;
      const clsList = clsData ?? [];
      const clsIds = clsList.map((c) => c.id);
      const clsMap = new Map(clsList.map((c) => [c.id, `Class ${c.name}-${c.section}`]));

      if (clsIds.length === 0) {
        setClasses([]);
        setLoading(false);
        return;
      }

      const [studRes, attRes, examsRes, annRes] = await Promise.all([
        supabase.from('students').select('id, class_id').in('class_id', clsIds),
        supabase.from('attendance').select('student_id').eq('date', today),
        supabase
          .from('exams')
          .select('id')
          .in('class_id', clsIds)
          .eq('is_published', false),
        supabase
          .from('announcements')
          .select('id, title, class_id')
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      if (!mounted) return;

      const students = studRes.data ?? [];
      const markedStudentIds = new Set((attRes.data ?? []).map((a) => a.student_id));

      const summaries: ClassSummary[] = clsList.map((c) => {
        const clsStudents = students.filter((s) => s.class_id === c.id);
        const markedToday =
          clsStudents.length > 0 && clsStudents.some((s) => markedStudentIds.has(s.id));
        return {
          id: c.id,
          label: `${c.name}-${c.section}`,
          studentsCount: clsStudents.length,
          markedToday,
        };
      });

      setClasses(summaries);
      setDraftExamsCount((examsRes.data ?? []).length);
      setAnnouncements(
        (annRes.data ?? []).map((a) => ({
          id: a.id,
          title: a.title,
          audience: a.class_id ? clsMap.get(a.class_id) ?? 'Class' : 'All parents',
          schoolWide: a.class_id === null,
        })),
      );
      setLoading(false);
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [user]);

  const unmarkedCount = classes.filter((c) => !c.markedToday).length;

  return (
    <div className="flex flex-col gap-gutter-xl">
      <PageHeader
        title={`Welcome, ${profile?.full_name || 'Teacher'}`}
        subtitle="Your assigned classes, today's attendance status, and pending exams."
      />

      <section
        aria-label="Today summary"
        className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md items-stretch"
      >
        <MetricCard
          label="My classes"
          value={loading ? '...' : classes.length}
          icon="class"
          tone="primary"
        />
        <MetricCard
          label="Attendance not marked today"
          value={loading ? '...' : `${unmarkedCount} class${unmarkedCount === 1 ? '' : 'es'}`}
          icon="pending_actions"
          tone="warning"
        />
        <MetricCard
          label="Results to publish"
          value={loading ? '...' : `${draftExamsCount} exam${draftExamsCount === 1 ? '' : 's'}`}
          icon="grading"
          tone="lavender"
        />
      </section>

      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-title-lg text-light-on-surface">My classes</h2>
        <DataTable>
          <TableHead>
            <TableHeaderCell>Class</TableHeaderCell>
            <TableHeaderCell>Students</TableHeaderCell>
            <TableHeaderCell>Today</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={4} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                  Loading classes...
                </td>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                  No classes assigned yet.
                </td>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls.id}>
                  <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                    {cls.label}
                  </td>
                  <td className="px-4 py-3 font-body text-body-md text-light-on-surface tabular-nums">
                    {cls.studentsCount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cls.markedToday ? 'success' : 'error'}>
                      {cls.markedToday ? 'Marked' : 'Not marked'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-gutter-md">
                      <Link
                        to={
                          cls.markedToday
                            ? `/teacher/attendance-history?classId=${cls.id}`
                            : `/teacher/mark-attendance?classId=${cls.id}`
                        }
                        className="font-body text-label-lg text-light-primary hover:underline"
                      >
                        {cls.markedToday ? 'View attendance' : 'Mark attendance'}
                      </Link>
                      <Link
                        to="/teacher/exams-results"
                        className="font-body text-label-lg text-light-secondary hover:underline"
                      >
                        Enter results
                      </Link>
                    </div>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </DataTable>
      </section>

      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-title-lg text-light-on-surface">Latest announcements</h2>
        <div className="bg-light-surface border border-light-outline-variant rounded-md shadow-sm divide-y divide-light-outline-variant">
          {announcements.length === 0 ? (
            <div className="px-gutter-md py-3.5 font-body text-body-md text-light-on-surface-variant">
              No announcements yet.
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="px-gutter-md py-3.5 flex items-center gap-gutter-sm">
                <Icon
                  name="campaign"
                  className={`text-title-md ${
                    a.schoolWide ? 'text-light-primary' : 'text-light-secondary'
                  }`}
                />
                <span className="font-body text-body-md text-light-on-surface">
                  {a.title} ({a.audience})
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
