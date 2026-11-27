import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  DataTable,
  PageHeader,
  SelectInput,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
} from '../../components/ui';
import { supabase, type ProfileRow, type SubjectRow } from '../../lib/supabase';

interface ClassView {
  id: string;
  name: string;
  section: string;
  teacher_id: string | null;
  teacherName: string;
  studentsCount: number;
}

export const AdminClassesSubjectsPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassView[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [teachers, setTeachers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Class form state
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [clsName, setClsName] = useState('');
  const [clsSection, setClsSection] = useState('A');
  const [clsTeacherId, setClsTeacherId] = useState('');

  // Subject form state
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjName, setSubjName] = useState('');

  const loadData = useCallback(async () => {
    setError(null);
    const [clsRes, subjRes, teachRes, studRes] = await Promise.all([
      supabase.from('classes').select('*').order('name').order('section'),
      supabase.from('subjects').select('*').order('name'),
      supabase.from('profiles').select('*').eq('role', 'teacher').order('full_name'),
      supabase.from('students').select('id, class_id'),
    ]);

    if (clsRes.error) setError(clsRes.error.message);
    if (subjRes.error) setError(subjRes.error.message);

    const teacherList = (teachRes.data ?? []) as ProfileRow[];
    setTeachers(teacherList);
    const teacherMap = new Map(teacherList.map((t) => [t.id, t.full_name]));

    const countMap = new Map<string, number>();
    (studRes.data ?? []).forEach((s) => {
      countMap.set(s.class_id, (countMap.get(s.class_id) ?? 0) + 1);
    });

    setClasses(
      (clsRes.data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section,
        teacher_id: c.teacher_id,
        teacherName: c.teacher_id ? teacherMap.get(c.teacher_id) ?? 'Assigned' : 'Not assigned',
        studentsCount: countMap.get(c.id) ?? 0,
      })),
    );
    setSubjects((subjRes.data ?? []) as SubjectRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsName.trim() || !clsSection.trim()) return;
    setError(null);

    const payload = {
      name: clsName.trim(),
      section: clsSection.trim().toUpperCase(),
      teacher_id: clsTeacherId || null,
    };

    const res = editingClassId
      ? await supabase.from('classes').update(payload).eq('id', editingClassId)
      : await supabase.from('classes').insert(payload);

    if (res.error) {
      setError(res.error.message);
      return;
    }

    setShowClassForm(false);
    setEditingClassId(null);
    setClsName('');
    setClsSection('A');
    setClsTeacherId('');
    loadData();
  };

  const handleDeleteClass = async (id: string) => {
    setError(null);
    const { error: delErr } = await supabase.from('classes').delete().eq('id', id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    loadData();
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName.trim()) return;
    setError(null);

    const res = editingSubjectId
      ? await supabase.from('subjects').update({ name: subjName.trim() }).eq('id', editingSubjectId)
      : await supabase.from('subjects').insert({ name: subjName.trim() });

    if (res.error) {
      setError(res.error.message);
      return;
    }

    setShowSubjectForm(false);
    setEditingSubjectId(null);
    setSubjName('');
    loadData();
  };

  const handleDeleteSubject = async (id: string) => {
    setError(null);
    const { error: delErr } = await supabase.from('subjects').delete().eq('id', id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    loadData();
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Classes & Subjects"
        subtitle="Organize class sections, assigned class teachers, and curriculum subjects."
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <section className="lg:col-span-7 flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-md">
            <h2 className="font-headline text-title-lg text-light-on-surface">Classes</h2>
            <Button
              variant="primary"
              icon="add"
              className="px-4 py-2"
              onClick={() => {
                setEditingClassId(null);
                setClsName('');
                setClsSection('A');
                setClsTeacherId('');
                setShowClassForm((prev) => !prev);
              }}
            >
              Add class
            </Button>
          </div>

          {showClassForm && (
            <form
              onSubmit={handleSaveClass}
              className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-gutter-sm items-end"
            >
              <TextInput
                label="Class"
                placeholder="e.g. 10"
                value={clsName}
                onChange={(e) => setClsName(e.target.value)}
                required
              />
              <TextInput
                label="Section"
                placeholder="e.g. B"
                value={clsSection}
                onChange={(e) => setClsSection(e.target.value)}
                required
              />
              <SelectInput
                label="Class teacher"
                value={clsTeacherId}
                onChange={(e) => setClsTeacherId(e.target.value)}
              >
                <option value="">Not assigned</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name}
                  </option>
                ))}
              </SelectInput>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="px-4">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-3"
                  onClick={() => setShowClassForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <DataTable>
            <TableHead>
              <TableHeaderCell>Class</TableHeaderCell>
              <TableHeaderCell>Class teacher</TableHeaderCell>
              <TableHeaderCell>Students</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                    Loading classes...
                  </td>
                </TableRow>
              ) : (
                classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                      {cls.name}-{cls.section}
                    </td>
                    <td
                      className={`px-4 py-3 font-body text-body-md ${
                        cls.teacherName === 'Not assigned'
                          ? 'text-light-on-surface-variant'
                          : 'text-light-on-surface'
                      }`}
                    >
                      {cls.teacherName}
                    </td>
                    <td className="px-4 py-3 font-body text-body-md tabular-nums">
                      {cls.studentsCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-gutter-md">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingClassId(cls.id);
                            setClsName(cls.name);
                            setClsSection(cls.section);
                            setClsTeacherId(cls.teacher_id ?? '');
                            setShowClassForm(true);
                          }}
                          className="font-body text-label-lg text-light-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClass(cls.id)}
                          className="font-body text-label-lg text-light-error hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </DataTable>
        </section>

        <section className="lg:col-span-5 flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-md">
            <h2 className="font-headline text-title-lg text-light-on-surface">Subjects</h2>
            <Button
              variant="primary"
              icon="add"
              className="px-4 py-2"
              onClick={() => {
                setEditingSubjectId(null);
                setSubjName('');
                setShowSubjectForm((prev) => !prev);
              }}
            >
              Add subject
            </Button>
          </div>

          {showSubjectForm && (
            <form
              onSubmit={handleSaveSubject}
              className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md shadow-sm flex items-end gap-gutter-sm"
            >
              <TextInput
                label="Subject name"
                placeholder="e.g. Computer Science"
                value={subjName}
                onChange={(e) => setSubjName(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" variant="primary" className="px-4">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="px-3"
                onClick={() => setShowSubjectForm(false)}
              >
                Cancel
              </Button>
            </form>
          )}

          <DataTable>
            <TableHead>
              <TableHeaderCell>Subject</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={2} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                    Loading subjects...
                  </td>
                </TableRow>
              ) : (
                subjects.map((subj) => (
                  <TableRow key={subj.id}>
                    <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                      {subj.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-gutter-md">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubjectId(subj.id);
                            setSubjName(subj.name);
                            setShowSubjectForm(true);
                          }}
                          className="font-body text-label-lg text-light-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(subj.id)}
                          className="font-body text-label-lg text-light-error hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </DataTable>
        </section>
      </div>
    </div>
  );
};
