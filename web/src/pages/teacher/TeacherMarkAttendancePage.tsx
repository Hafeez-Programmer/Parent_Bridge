import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { supabase, type ClassRow, type DbAttendanceStatus } from '../../lib/supabase';

interface StudentAttendanceRow {
  id: string;
  rollNo: string;
  fullName: string;
}

export const TeacherMarkAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const paramClassId = searchParams.get('classId');
  const paramDate = searchParams.get('date');

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [date, setDate] = useState(() => paramDate || new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<StudentAttendanceRow[]>([]);
  const [statuses, setStatuses] = useState<Record<string, DbAttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const loadRosterAndAttendance = useCallback(async () => {
    if (!selectedClassId || !date) return;
    setLoading(true);
    setError(null);

    const { data: studData, error: studErr } = await supabase
      .from('students')
      .select('id, roll_no, full_name')
      .eq('class_id', selectedClassId)
      .eq('is_active', true)
      .order('roll_no');

    if (studErr) {
      setError(studErr.message);
      setLoading(false);
      return;
    }

    const roster: StudentAttendanceRow[] = (studData ?? []).map((s) => ({
      id: s.id,
      rollNo: s.roll_no,
      fullName: s.full_name,
    }));
    setStudents(roster);

    const nextStatuses: Record<string, DbAttendanceStatus> = {};
    roster.forEach((s) => {
      nextStatuses[s.id] = 'present';
    });

    if (roster.length > 0) {
      const { data: attData } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('date', date)
        .in(
          'student_id',
          roster.map((s) => s.id),
        );

      (attData ?? []).forEach((row) => {
        nextStatuses[row.student_id] = row.status as DbAttendanceStatus;
      });
    }

    setStatuses(nextStatuses);
    setSaved(false);
    setLoading(false);
  }, [selectedClassId, date]);

  useEffect(() => {
    loadRosterAndAttendance();
  }, [loadRosterAndAttendance]);

  const markAllPresent = () => {
    const next: Record<string, DbAttendanceStatus> = {};
    students.forEach((s) => {
      next[s.id] = 'present';
    });
    setStatuses(next);
    setSaved(false);
  };

  const handleSave = async () => {
    if (students.length === 0) return;
    setSaving(true);
    setError(null);

    const rows = students.map((s) => ({
      student_id: s.id,
      date,
      status: statuses[s.id] || 'present',
    }));

    const { error: upsertErr } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id,date' });

    setSaving(false);
    if (upsertErr) {
      setError(upsertErr.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Mark Attendance"
        subtitle="Record daily attendance status for each student in your assigned class."
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-gutter-md">
        <div className="w-44">
          <SelectInput
            aria-label="Select class"
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
        <input
          type="date"
          aria-label="Attendance date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-light-outline-variant bg-light-surface px-4 py-2 font-body text-body-md text-light-on-surface w-44 focus:border-light-primary focus:ring-1 focus:ring-light-primary"
        />
        <Button variant="secondary" icon="done_all" onClick={markAllPresent}>
          Mark all Present
        </Button>
      </div>

      <DataTable>
        <TableHead>
          <TableHeaderCell className="w-20">Roll</TableHeaderCell>
          <TableHeaderCell>Student name</TableHeaderCell>
          <TableHeaderCell className="text-center">Present</TableHeaderCell>
          <TableHeaderCell className="text-center">Absent</TableHeaderCell>
          <TableHeaderCell className="text-center">Late</TableHeaderCell>
          <TableHeaderCell className="text-center">Leave</TableHeaderCell>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <td colSpan={6} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading students...
              </td>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <td colSpan={6} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No students in this class.
              </td>
            </TableRow>
          ) : (
            students.map((student) => {
              const current = statuses[student.id] || 'present';
              return (
                <TableRow key={student.id}>
                  <td className="px-4 py-3 font-mono text-mono-md tabular-nums">
                    {student.rollNo}
                  </td>
                  <td className="px-4 py-3 font-body text-body-md">{student.fullName}</td>
                  {(
                    [
                      { value: 'present', label: 'Present', color: 'text-light-secondary focus:ring-light-secondary' },
                      { value: 'absent', label: 'Absent', color: 'text-light-error focus:ring-light-error' },
                      { value: 'late', label: 'Late', color: 'text-warning focus:ring-warning' },
                      { value: 'leave', label: 'Leave', color: 'text-light-primary focus:ring-light-primary' },
                    ] as const
                  ).map((opt) => (
                    <td key={opt.value} className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`att_${student.id}`}
                        value={opt.value}
                        checked={current === opt.value}
                        onChange={() => {
                          setStatuses((prev) => ({ ...prev, [student.id]: opt.value }));
                          setSaved(false);
                        }}
                        aria-label={`${student.fullName} ${opt.label}`}
                        className={`w-5 h-5 ${opt.color}`}
                      />
                    </td>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </DataTable>

      <div className="flex justify-end">
        <Button
          variant="primary"
          icon="save"
          onClick={handleSave}
          disabled={saving || students.length === 0}
        >
          {saving ? 'Saving...' : saved ? 'Attendance saved' : 'Save attendance'}
        </Button>
      </div>
    </div>
  );
};
