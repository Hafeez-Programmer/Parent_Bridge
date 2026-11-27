import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  DataTable,
  PageHeader,
  SelectInput,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { supabase, type ClassRow } from '../../lib/supabase';

interface DailyAggregate {
  date: string;
  label: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export const TeacherAttendanceHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const paramClassId = searchParams.get('classId');

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [logs, setLogs] = useState<DailyAggregate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('name')
      .order('section')
      .then(({ data }) => {
        const list = (data ?? []) as ClassRow[];
        setClasses(list);
        if (list.length > 0) {
          const initial =
            paramClassId && list.some((c) => c.id === paramClassId) ? paramClassId : list[0].id;
          setSelectedClassId(initial);
        } else {
          setLoading(false);
        }
      });
  }, [user, paramClassId]);

  const loadHistory = useCallback(async () => {
    if (!selectedClassId || !month) return;
    setLoading(true);

    const { data: students } = await supabase
      .from('students')
      .select('id')
      .eq('class_id', selectedClassId);

    const studentIds = (students ?? []).map((s) => s.id);
    if (studentIds.length === 0) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const startDate = `${month}-01`;
    const [y, m] = month.split('-').map(Number);
    const endDate = new Date(y, m, 0).toISOString().slice(0, 10);

    const { data: attData } = await supabase
      .from('attendance')
      .select('date, status')
      .in('student_id', studentIds)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    const byDate = new Map<string, DailyAggregate>();
    (attData ?? []).forEach((row) => {
      if (!byDate.has(row.date)) {
        const d = new Date(`${row.date}T00:00:00`);
        byDate.set(row.date, {
          date: row.date,
          label: d.toLocaleDateString(undefined, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          }),
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
        });
      }
      const agg = byDate.get(row.date)!;
      if (row.status === 'present') agg.present += 1;
      else if (row.status === 'absent') agg.absent += 1;
      else if (row.status === 'late') agg.late += 1;
      else if (row.status === 'leave') agg.leave += 1;
    });

    setLogs(Array.from(byDate.values()));
    setLoading(false);
  }, [selectedClassId, month]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Attendance History"
        subtitle="Review and edit past daily attendance logs by class and month."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadHistory();
        }}
        className="flex flex-wrap items-end gap-gutter-md"
      >
        <div className="w-44">
          <SelectInput
            label="Class"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name}-{c.section}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="w-44">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-label-md text-light-on-surface-variant">Month</span>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded border border-light-outline-variant bg-light-surface px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
            />
          </label>
        </div>
        <Button type="submit" variant="primary" icon="filter_list">
          Show records
        </Button>
      </form>

      <DataTable>
        <TableHead>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Present</TableHeaderCell>
          <TableHeaderCell>Absent</TableHeaderCell>
          <TableHeaderCell>Late</TableHeaderCell>
          <TableHeaderCell>Leave</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableHead>
        <TableBody tabular>
          {loading ? (
            <TableRow>
              <td colSpan={6} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading history...
              </td>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <td colSpan={6} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No attendance records for this month.
              </td>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.date}>
                <td className="px-4 py-3 font-body text-body-md">{log.label}</td>
                <td className="px-4 py-3 font-body text-body-md">{log.present}</td>
                <td className="px-4 py-3 font-body text-body-md">{log.absent}</td>
                <td className="px-4 py-3 font-body text-body-md">{log.late}</td>
                <td className="px-4 py-3 font-body text-body-md">{log.leave}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-gutter-md">
                    <Link
                      to={`/teacher/mark-attendance?classId=${selectedClassId}&date=${log.date}`}
                      className="font-body text-label-lg text-light-primary hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      to={`/teacher/mark-attendance?classId=${selectedClassId}&date=${log.date}`}
                      className="font-body text-label-lg text-light-secondary hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </DataTable>
    </div>
  );
};
