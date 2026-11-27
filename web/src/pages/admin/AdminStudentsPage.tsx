import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { supabase, type ClassRow } from '../../lib/supabase';

interface StudentView {
  id: string;
  rollNo: string;
  fullName: string;
  classId: string;
  className: string;
  linkCode: string;
  parentLinked: boolean;
  isActive: boolean;
}

const PAGE_SIZE = 10;

function generateLinkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentView[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All classes');
  const [page, setPage] = useState(1);

  const loadStudents = useCallback(async () => {
    setError(null);
    const [studRes, clsRes, linksRes] = await Promise.all([
      supabase.from('students').select('*').order('roll_no'),
      supabase.from('classes').select('*').order('name').order('section'),
      supabase.from('parent_students').select('student_id'),
    ]);

    if (studRes.error) {
      setError(studRes.error.message);
      setLoading(false);
      return;
    }

    const clsList = (clsRes.data ?? []) as ClassRow[];
    setClasses(clsList);
    const clsMap = new Map(clsList.map((c) => [c.id, `${c.name}-${c.section}`]));
    const linkedSet = new Set((linksRes.data ?? []).map((l) => l.student_id));

    setStudents(
      (studRes.data ?? []).map((s) => ({
        id: s.id,
        rollNo: s.roll_no,
        fullName: s.full_name,
        classId: s.class_id,
        className: clsMap.get(s.class_id) ?? '—',
        linkCode: s.link_code,
        parentLinked: linkedSet.has(s.id),
        isActive: s.is_active ?? true,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesClass = classFilter === 'All classes' || s.className === classFilter;
      const matchesSearch =
        !q || s.fullName.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
      return matchesClass && matchesSearch;
    });
  }, [students, search, classFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const regenerateCode = async (id: string) => {
    setError(null);
    const nextCode = generateLinkCode();
    const { error: updErr } = await supabase
      .from('students')
      .update({ link_code: nextCode })
      .eq('id', id);

    if (updErr) {
      setError(updErr.message);
      return;
    }

    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, linkCode: nextCode } : s)));
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

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-gutter-md">
        <SearchInput
          placeholder="Search name or roll no..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="w-40">
          <SelectInput
            aria-label="Filter by class"
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={`${c.name}-${c.section}`}>
                {c.name}-{c.section}
              </option>
            ))}
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
          {loading ? (
            <TableRow>
              <td colSpan={6} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading students...
              </td>
            </TableRow>
          ) : paginated.length === 0 ? (
            <TableRow>
              <td colSpan={6} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No students match your filter.
              </td>
            </TableRow>
          ) : (
            paginated.map((student) => (
              <TableRow key={student.id}>
                <td className="px-4 py-3 font-mono text-mono-md tabular-nums">{student.rollNo}</td>
                <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                  {student.fullName}
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
                      to={`/admin/students/new?edit=${student.id}`}
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
            ))
          )}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-between pt-gutter-sm">
        <span className="font-body text-body-md text-light-on-surface-variant tabular-nums">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={currentPage === n ? 'page' : undefined}
              className={`px-3 py-1 rounded ${
                currentPage === n
                  ? 'bg-light-primary text-light-on-primary font-semibold'
                  : 'border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
