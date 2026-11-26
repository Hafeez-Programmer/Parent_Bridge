import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, MetricCard, PageHeader } from '../../components/ui';

const RECENT_ACTIVITY = [
  { id: '1', icon: 'fact_check', iconColor: 'text-light-secondary', text: 'Ms. Sara marked attendance — Class 8-A', time: '10:42', tabular: true },
  { id: '2', icon: 'assignment_turned_in', iconColor: 'text-light-primary', text: 'Mr. Imran uploaded Mid-Term results — Class 9-B', time: '09:15', tabular: true },
  { id: '3', icon: 'campaign', iconColor: 'text-light-tertiary', text: "Admin published announcement 'Sports Day'", time: '08:30', tabular: true },
  { id: '4', icon: 'link', iconColor: 'text-success', text: '3 parents linked to students', time: 'Yesterday', tabular: false },
];

export const AdminOverviewPage: React.FC = () => (
  <div className="flex flex-col gap-gutter-xl">
    <PageHeader
      title="Overview"
      subtitle="School-wide summary across students, staff, and daily attendance."
    />

    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md items-stretch"
    >
      <MetricCard label="Students" value={412} icon="school" tone="primary" />
      <MetricCard label="Teachers" value={28} icon="person" tone="success" />
      <MetricCard label="Parents linked" value={356} icon="family_restroom" tone="warning" />
      <MetricCard label="Today's attendance" value="94%" icon="event_available" tone="lavender" />
    </section>

    <section className="flex flex-col gap-gutter-md">
      <h2 className="font-headline text-title-lg text-light-on-surface">Recent activity</h2>
      <div className="bg-light-surface border border-light-outline-variant rounded-md shadow-sm divide-y divide-light-outline-variant">
        {RECENT_ACTIVITY.map((item) => (
          <div
            key={item.id}
            className="px-gutter-md py-3.5 flex items-center justify-between gap-gutter-md"
          >
            <div className="flex items-center gap-gutter-sm">
              <Icon name={item.icon} className={`text-title-md ${item.iconColor}`} />
              <span className="font-body text-body-md text-light-on-surface">{item.text}</span>
            </div>
            <span
              className={`font-body text-label-sm text-light-on-surface-variant ${
                item.tabular ? 'tabular-nums' : ''
              }`}
            >
              {item.time}
            </span>
          </div>
        ))}
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
