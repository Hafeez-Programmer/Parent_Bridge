import React, { useState } from 'react';
import {
  Button,
  DataTable,
  PageHeader,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  type SchoolClass,
  type Subject,
} from '../../data/mockData';

export const AdminClassesSubjectsPage: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const handleAddClass = () => {
    const nextNum = classes.length + 1;
    setClasses((prev) => [
      ...prev,
      { id: `c${Date.now()}`, name: `10-B${nextNum > 6 ? `-${nextNum}` : ''}`, classTeacher: 'Not assigned', studentsCount: 0 },
    ]);
  };

  const handleAddSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { id: `s${Date.now()}`, name: `Computer Science ${prev.length + 1}` },
    ]);
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Classes & Subjects"
        subtitle="Organize class sections, assigned class teachers, and curriculum subjects."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <section className="lg:col-span-7 flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-md">
            <h2 className="font-headline text-title-lg text-light-on-surface">Classes</h2>
            <Button variant="primary" icon="add" className="px-4 py-2" onClick={handleAddClass}>
              Add class
            </Button>
          </div>
          <DataTable>
            <TableHead>
              <TableHeaderCell>Class</TableHeaderCell>
              <TableHeaderCell>Class teacher</TableHeaderCell>
              <TableHeaderCell>Students</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                    {cls.name}
                  </td>
                  <td
                    className={`px-4 py-3 font-body text-body-md ${
                      cls.classTeacher === 'Not assigned'
                        ? 'text-light-on-surface-variant'
                        : 'text-light-on-surface'
                    }`}
                  >
                    {cls.classTeacher}
                  </td>
                  <td className="px-4 py-3 font-body text-body-md tabular-nums">
                    {cls.studentsCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-gutter-md">
                      <button
                        type="button"
                        className="font-body text-label-lg text-light-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setClasses((prev) => prev.filter((c) => c.id !== cls.id))}
                        className="font-body text-label-lg text-light-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </section>

        <section className="lg:col-span-5 flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-md">
            <h2 className="font-headline text-title-lg text-light-on-surface">Subjects</h2>
            <Button variant="primary" icon="add" className="px-4 py-2" onClick={handleAddSubject}>
              Add subject
            </Button>
          </div>
          <DataTable>
            <TableHead>
              <TableHeaderCell>Subject</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {subjects.map((subj) => (
                <TableRow key={subj.id}>
                  <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                    {subj.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-gutter-md">
                      <button
                        type="button"
                        className="font-body text-label-lg text-light-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSubjects((prev) => prev.filter((s) => s.id !== subj.id))
                        }
                        className="font-body text-label-lg text-light-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </section>
      </div>
    </div>
  );
};
