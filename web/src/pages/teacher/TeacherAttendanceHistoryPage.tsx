import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ATTENDANCE_HISTORY } from '../../data/mockData';

export const TeacherAttendanceHistoryPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Class 8-A');
  const [month, setMonth] = useState('October');

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Attendance History"
        subtitle="Review and edit past daily attendance logs by class and month."
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap items-end gap-gutter-md"
      >
        <div className="w-44">
          <SelectInput
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>Class 8-A</option>
            <option>Class 9-A</option>
            <option>Class 9-B</option>
          </SelectInput>
        </div>
        <div className="w-44">
          <SelectInput label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option>October</option>
            <option>September</option>
            <option>August</option>
          </SelectInput>
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
          {ATTENDANCE_HISTORY.map((log) => (
            <TableRow key={log.id}>
              <td className="px-4 py-3 font-body text-body-md">{log.date}</td>
              <td className="px-4 py-3 font-body text-body-md">{log.present}</td>
              <td className="px-4 py-3 font-body text-body-md">{log.absent}</td>
              <td className="px-4 py-3 font-body text-body-md">{log.late}</td>
              <td className="px-4 py-3 font-body text-body-md">{log.leave}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-gutter-md">
                  <Link
                    to="/teacher/mark-attendance"
                    className="font-body text-label-lg text-light-primary hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to="/teacher/mark-attendance"
                    className="font-body text-label-lg text-light-secondary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
};
