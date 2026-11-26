import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  DataTable,
  Icon,
  PageHeader,
  SearchInput,
  SelectInput,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui';
import { INITIAL_STUDENTS, type StudentRecord } from '../../data/mockData';

function generateLinkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All classes');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesClass = classFilter === 'All classes' || s.className === classFilter;
      const matchesSearch =
        !q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q);
      return matchesClass && matchesSearch;
    });
  }, [students, search, classFilter]);

  const regenerateCode = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, linkCode: generateLinkCode() } : s)),
    );
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Students"
        subtitle="Manage student rosters, parent link status, and verification codes."
        actions={
          <>
            <Button variant="secondary" icon="print" onClick={() => window.print()}>
              Print codes
            </Button>
            <Link
              to="/admin/students/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-light-secondary text-light-on-secondary font-body text-label-lg hover:bg-light-on-secondary-container transition-colors duration-state-change shadow-sm"
            >
              <Icon name="person_add" />
              <span>Add student</span>
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-gutter-md">
        <SearchInput
          placeholder="Search name or roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-40">
          <SelectInput
            aria-label="Filter by class"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option>All classes</option>
            <option>8-A</option>
            <option>8-B</option>
            <option>9-A</option>
            <option>9-B</option>
          </SelectInput>
        </div>
      </div>

      <DataTable>
        <TableHead>
          <TableHeaderCell>Roll</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Class</TableHeaderCell>
          <TableHeaderCell>Link code</TableHeaderCell>
          <TableHeaderCell>Parent linked</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableHead>
        <TableBody>
          {filtered.map((student) => (
            <TableRow key={student.id}>
              <td className="px-4 py-3 font-mono text-mono-md tabular-nums">{student.roll}</td>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                {student.name}
              </td>
              <td className="px-4 py-3 font-body text-body-md">{student.className}</td>
              <td className="px-4 py-3 font-mono text-mono-md text-light-primary tabular-nums">
                {student.linkCode}
              </td>
              <td className="px-4 py-3">
                <Badge variant={student.parentLinked ? 'success' : 'error'}>
                  {student.parentLinked ? 'Yes' : 'No'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-gutter-md">
                  <Link
                    to="/admin/students/new"
                    className="font-body text-label-lg text-light-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => regenerateCode(student.id)}
                    className="font-body text-label-lg text-light-secondary hover:underline"
                  >
                    New code
                  </button>
                </div>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-between pt-gutter-sm">
        <span className="font-body text-body-md text-light-on-surface-variant tabular-nums">
          Showing 1-{filtered.length} of 412
        </span>
        <nav
          aria-label="Pagination"
          className="flex items-center gap-gutter-xs font-body text-body-md tabular-nums"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low"
            aria-label="Previous page"
          >
            &lt;
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={page === n ? 'page' : undefined}
              className={`px-3 py-1 rounded ${
                page === n
                  ? 'bg-light-primary text-light-on-primary font-semibold'
                  : 'border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(3, p + 1))}
            className="px-2.5 py-1 rounded border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low"
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      </div>
    </div>
  );
};
