import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, MetricCard, PageHeader } from '../../components/ui';
import { supabase } from '../../lib/supabase';

interface ActivityItem {
  id: string;
  icon: string;
  iconColor: string;
  text: string;
  time: string;
}

export const AdminOverviewPage: React.FC = () => {
  const [studentCount, setStudentCount] = useState<number>(0);
  const [teacherCount, setTeacherCount] = useState<number>(0);
  const [linkedCount, setLinkedCount] = useState<number>(0);
  const [todayAttendancePct, setTodayAttendancePct] = useState<string>('—');
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      const today = new Date().toISOString().slice(0, 10);

      const [studentsRes, teachersRes, linksRes, attTodayRes, announcementsRes, examsRes] =
        await Promise.all([
          supabase.from('students').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
          supabase.from('parent_students').select('student_id'),
          supabase.from('attendance').select('status').eq('date', today),
          supabase
            .from('announcements')
            .select('id, title, created_at')
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('exams')
            .select('id, name, is_published, created_at, classes(name, section)')
            .order('created_at', { ascending: false })
            .limit(2),
        ]);

      if (!mounted) return;

      setStudentCount(studentsRes.count ?? 0);
      setTeacherCount(teachersRes.count ?? 0);

      const uniqueLinked = new Set((linksRes.data ?? []).map((r) => r.student_id));
      setLinkedCount(uniqueLinked.size);

      const todayRows = attTodayRes.data ?? [];
      if (todayRows.length > 0) {
        const presentOrLate = todayRows.filter(
          (r) => r.status === 'present' || r.status === 'late',
        ).length;
        setTodayAttendancePct(`${Math.round((presentOrLate / todayRows.length) * 100)}%`);
      } else {
        setTodayAttendancePct('0%');
      }

      const items: ActivityItem[] = [];
      (announcementsRes.data ?? []).forEach((a) => {
        items.push({
          id: `ann-${a.id}`,
          icon: 'campaign',
          iconColor: 'text-light-tertiary',
          text: `Announcement published: '${a.title}'`,
          time: new Date(a.created_at).toLocaleDateString(),
        });
      });

      (examsRes.data ?? []).forEach((ex) => {
        const cls = ex.classes as unknown as { name: string; section: string } | null;
        const clsLabel = cls ? `Class ${cls.name}-${cls.section}` : 'Class';
        items.push({
          id: `ex-${ex.id}`,
          icon: 'assignment_turned_in',
          iconColor: 'text-light-primary',
          text: `${ex.name} (${clsLabel}) — ${ex.is_published ? 'Published' : 'Draft'}`,
          time: new Date(ex.created_at).toLocaleDateString(),
        });
      });

      if (uniqueLinked.size > 0) {
        items.push({
          id: 'links-summary',
          icon: 'link',
          iconColor: 'text-success',
          text: `${uniqueLinked.size} student(s) currently linked to parent accounts`,
          time: 'Active',
        });
      }

      setRecentActivity(items.slice(0, 5));
      setLoading(false);
    }

    loadOverview();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-gutter-xl">
      <PageHeader
        title="Overview"
        subtitle="School-wide summary across students, staff, and daily attendance."
      />

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md items-stretch"
      >
        <MetricCard
          label="Students"
          value={loading ? '...' : studentCount}
          icon="school"
          tone="primary"
        />
        <MetricCard
          label="Teachers"
          value={loading ? '...' : teacherCount}
          icon="person"
          tone="success"
        />
        <MetricCard
          label="Parents linked"
          value={loading ? '...' : linkedCount}
          icon="family_restroom"
          tone="warning"
        />
        <MetricCard
          label="Today's attendance"
          value={loading ? '...' : todayAttendancePct}
          icon="event_available"
          tone="lavender"
        />
      </section>

      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-title-lg text-light-on-surface">Recent activity</h2>
        <div className="bg-light-surface border border-light-outline-variant rounded-md shadow-sm divide-y divide-light-outline-variant">
          {loading ? (
            <div className="px-gutter-md py-4 font-body text-body-md text-light-on-surface-variant">
              Loading recent activity...
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="px-gutter-md py-4 font-body text-body-md text-light-on-surface-variant">
              No recent activity yet.
            </div>
          ) : (
            recentActivity.map((item) => (
              <div
                key={item.id}
                className="px-gutter-md py-3.5 flex items-center justify-between gap-gutter-md"
              >
                <div className="flex items-center gap-gutter-sm">
                  <Icon name={item.icon} className={`text-title-md ${item.iconColor}`} />
                  <span className="font-body text-body-md text-light-on-surface">{item.text}</span>
                </div>
                <span className="font-body text-label-sm text-light-on-surface-variant tabular-nums">
                  {item.time}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-title-lg text-light-on-surface">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
          <Link
            to="/admin/students/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-light-secondary text-light-on-secondary font-body text-label-lg hover:bg-light-on-secondary-container transition-colors duration-state-change shadow-sm"
          >
            <Icon name="person_add" />
            <span>Add student</span>
          </Link>
          <Link
            to="/admin/users/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-light-secondary text-light-on-secondary font-body text-label-lg hover:bg-light-on-secondary-container transition-colors duration-state-change shadow-sm"
          >
            <Icon name="group_add" />
            <span>Add user</span>
          </Link>
          <Link
            to="/admin/announcements"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-light-primary-container text-light-on-primary-container font-body text-label-lg hover:bg-light-surface-container-high transition-colors duration-state-change"
          >
            <Icon name="campaign" />
            <span>New announcement</span>
          </Link>
          <Link
            to="/admin/reports"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-light-primary-container text-light-on-primary-container font-body text-label-lg hover:bg-light-surface-container-high transition-colors duration-state-change"
          >
            <Icon name="bar_chart" />
            <span>View reports</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
