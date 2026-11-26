import React, { useState } from 'react';
import {
  Button,
  DataTable,
  MetricCard,
  PageHeader,
  SelectInput,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui';
import { REPORT_ROWS } from '../../data/mockData';

export const TeacherReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('Attendance');
  const [selectedClass, setSelectedClass] = useState('Class 8-A');
  const [month, setMonth] = useState('October');

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Reports"
        subtitle="View monthly attendance and exam performance for your assigned classes."
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap items-end gap-gutter-md"
      >
        <div className="w-48">
          <SelectInput
            label="Report"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option>Attendance</option>
            <option>Exam Results</option>
          </SelectInput>
        </div>
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
        <Button type="submit" variant="primary" icon="analytics">
          Generate
        </Button>
      </form>

      <section
        aria-label="Report summary"
        className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md items-stretch"
      >
        <MetricCard label="Class average" value="94%" icon="trending_up" tone="success" />
        <MetricCard label="Absent today" value={6} icon="person_off" tone="error" />
        <MetricCard label="Below 75%" value="3 students" icon="warning" tone="warning" />
      </section>

      <DataTable>
        <TableHead>
          <TableHeaderCell>Student</TableHeaderCell>
          <TableHeaderCell>Present</TableHeaderCell>
          <TableHeaderCell>Absent</TableHeaderCell>
          <TableHeaderCell>Late</TableHeaderCell>
          <TableHeaderCell>Attendance %</TableHeaderCell>
        </TableHead>
        <TableBody tabular>
          {REPORT_ROWS.map((row) => (
            <TableRow key={row.id}>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                {row.name}
              </td>
              <td className="px-4 py-3 font-body text-body-md">{row.present}</td>
              <td className="px-4 py-3 font-body text-body-md">{row.absent}</td>
              <td className="px-4 py-3 font-body text-body-md">{row.late}</td>
              <td
                className={`px-4 py-3 font-body ${
                  row.percentage < 75
                    ? 'text-label-lg text-light-error'
                    : 'text-body-md text-light-on-surface'
                }`}
              >
                {row.percentage}%
              </td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-end gap-gutter-md">
        <Button variant="secondary" icon="print" onClick={() => window.print()}>
          Print report
        </Button>
        <Button variant="primary" icon="download" onClick={() => window.print()}>
          Download PDF
        </Button>
      </div>
    </div>
  );
};
