import React from 'react';
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

const MY_CLASSES = [
  { id: '8-A', name: '8-A', students: 32, marked: false },
  { id: '9-A', name: '9-A', students: 28, marked: true },
  { id: '9-B', name: '9-B', students: 31, marked: true },
];

export const TeacherDashboardPage: React.FC = () => (
  <div className="flex flex-col gap-gutter-xl">
    <PageHeader
      title="Welcome, Ms. Sara"
      subtitle="Your assigned classes, today's attendance status, and pending exams."
    />

    <section
      aria-label="Today summary"
      className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md items-stretch"
    >
      <MetricCard label="My classes" value={3} icon="class" tone="primary" />
      <MetricCard
        label="Attendance not marked today"
        value="1 class"
        icon="pending_actions"
        tone="warning"
      />
      <MetricCard label="Results to publish" value="1 exam" icon="grading" tone="lavender" />
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
          {MY_CLASSES.map((cls) => (
            <TableRow key={cls.id}>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface">{cls.name}</td>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface tabular-nums">
                {cls.students}
              </td>
              <td className="px-4 py-3">
                <Badge variant={cls.marked ? 'success' : 'error'}>
                  {cls.marked ? 'Marked' : 'Not marked'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-gutter-md">
                  <Link
                    to={cls.marked ? '/teacher/attendance-history' : '/teacher/mark-attendance'}
                    className="font-body text-label-lg text-light-primary hover:underline"
                  >
                    {cls.marked ? 'View attendance' : 'Mark attendance'}
                  </Link>
                  <Link
                    to="/teacher/enter-results"
                    className="font-body text-label-lg text-light-secondary hover:underline"
                  >
                    Enter results
                  </Link>
                </div>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </section>

    <section className="flex flex-col gap-gutter-md">
      <h2 className="font-headline text-title-lg text-light-on-surface">Latest announcements</h2>
      <div className="bg-light-surface border border-light-outline-variant rounded-md shadow-sm divide-y divide-light-outline-variant">
        <div className="px-gutter-md py-3.5 flex items-center gap-gutter-sm">
          <Icon name="campaign" className="text-title-md text-light-primary" />
          <span className="font-body text-body-md text-light-on-surface">
            Sports Day - 5 Nov (All parents)
          </span>
        </div>
        <div className="px-gutter-md py-3.5 flex items-center gap-gutter-sm">
          <Icon name="campaign" className="text-title-md text-light-secondary" />
          <span className="font-body text-body-md text-light-on-surface">
            Class 8-A: Math quiz (Class 8-A)
          </span>
        </div>
      </div>
    </section>
  </div>
);
