import React, { useState } from 'react';
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
import { INITIAL_STUDENTS } from '../../data/mockData';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

const INITIAL_STATUS: Record<string, AttendanceStatus> = {
  st1: 'present',
  st2: 'present',
  st3: 'late',
  st4: 'present',
  st5: 'absent',
  st6: 'present',
};

export const TeacherMarkAttendancePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Class 8-A');
  const [date, setDate] = useState('18 Oct 2026');
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(INITIAL_STATUS);
  const [saved, setSaved] = useState(false);

  const markAllPresent = () => {
    const next: Record<string, AttendanceStatus> = {};
    INITIAL_STUDENTS.forEach((s) => {
      next[s.id] = 'present';
    });
    setStatuses(next);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Mark Attendance"
        subtitle="Record daily attendance status for each student in your assigned class."
      />

      <div className="flex flex-wrap items-center gap-gutter-md">
        <div className="w-40">
          <SelectInput
            aria-label="Select class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>Class 8-A</option>
            <option>Class 9-A</option>
            <option>Class 9-B</option>
          </SelectInput>
        </div>
        <input
          type="text"
          aria-label="Attendance date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-light-outline-variant bg-light-surface px-4 py-2 font-body text-body-md text-light-on-surface w-40 focus:border-light-primary focus:ring-1 focus:ring-light-primary"
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
          {INITIAL_STUDENTS.map((student) => {
            const current = statuses[student.id] || 'present';
            return (
              <TableRow key={student.id}>
                <td className="px-4 py-3 font-mono text-mono-md tabular-nums">{student.roll}</td>
                <td className="px-4 py-3 font-body text-body-md">{student.name}</td>
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
                      onChange={() =>
                        setStatuses((prev) => ({ ...prev, [student.id]: opt.value }))
                      }
                      aria-label={`${student.name} ${opt.label}`}
                      className={`w-5 h-5 ${opt.color}`}
                    />
                  </td>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </DataTable>

      <div className="flex justify-end">
        <Button variant="primary" icon="save" onClick={handleSave}>
          {saved ? 'Attendance saved' : 'Save attendance'}
        </Button>
      </div>
    </div>
  );
};
