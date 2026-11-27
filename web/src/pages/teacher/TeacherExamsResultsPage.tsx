import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  DataTable,
  Icon,
  PageHeader,
  SelectInput,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { supabase, type ClassRow } from '../../lib/supabase';

interface ExamView {
  id: string;
  name: string;
  term: string;
  classId: string;
  className: string;
  isPublished: boolean;
}

export const TeacherExamsResultsPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [exams, setExams] = useState<ExamView[]>([]);
  const [examName, setExamName] = useState('');
  const [term, setTerm] = useState('Term 2');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setError(null);
    const { data: clsData } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('name')
      .order('section');

    const clsList = (clsData ?? []) as ClassRow[];
    setClasses(clsList);
    if (clsList.length > 0 && !classId) {
      setClassId(clsList[0].id);
    }

    const clsIds = clsList.map((c) => c.id);
    if (clsIds.length === 0) {
      setExams([]);
      setLoading(false);
      return;
    }

    const clsMap = new Map(clsList.map((c) => [c.id, `${c.name}-${c.section}`]));
    const { data: examData, error: examErr } = await supabase
      .from('exams')
      .select('*')
      .in('class_id', clsIds)
      .order('created_at', { ascending: false });

    if (examErr) setError(examErr.message);

    setExams(
      (examData ?? []).map((ex) => ({
        id: ex.id,
        name: ex.name,
        term: ex.term,
        classId: ex.class_id,
        className: clsMap.get(ex.class_id) ?? '—',
        isPublished: ex.is_published,
      })),
    );
    setLoading(false);
  }, [user, classId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !classId) return;
    setError(null);

    const { error: insErr } = await supabase.from('exams').insert({
      name: examName.trim(),
      term,
      class_id: classId,
      is_published: false,
    });

    if (insErr) {
      setError(insErr.message);
      return;
    }

    setExamName('');
    loadData();
  };

  const publishExam = async (id: string) => {
    setError(null);
    const { error: updErr } = await supabase
      .from('exams')
      .update({ is_published: true })
      .eq('id', id);

    if (updErr) {
      setError(updErr.message);
      return;
    }

    setExams((prev) => prev.map((ex) => (ex.id === id ? { ...ex, isPublished: true } : ex)));
  };

  return (
    <div className="flex flex-col gap-gutter-xl">
      <PageHeader
        title="Exams & Results"
        subtitle="Create exams, enter student marks, and publish results to parents."
        actions={
          <a
            href="#create-exam"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-light-secondary text-light-on-secondary font-body text-label-lg hover:bg-light-on-secondary-container transition-colors duration-state-change shadow-sm"
          >
            <Icon name="add" />
            <span>Create exam</span>
          </a>
        }
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <DataTable>
        <TableHead>
          <TableHeaderCell>Exam</TableHeaderCell>
          <TableHeaderCell>Term</TableHeaderCell>
          <TableHeaderCell>Class</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <td colSpan={5} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading exams...
              </td>
            </TableRow>
          ) : exams.length === 0 ? (
            <TableRow>
              <td colSpan={5} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No exams created yet.
              </td>
            </TableRow>
          ) : (
            exams.map((exam) => (
              <TableRow key={exam.id}>
                <td className="px-4 py-3 font-body text-body-md">{exam.name}</td>
                <td className="px-4 py-3 font-body text-body-md">{exam.term}</td>
                <td className="px-4 py-3 font-body text-body-md">{exam.className}</td>
                <td className="px-4 py-3">
                  <Badge variant={exam.isPublished ? 'success' : 'warning'}>
                    {exam.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-gutter-md">
                    <Link
                      to={`/teacher/enter-results?examId=${exam.id}`}
                      className="font-body text-label-lg text-light-primary hover:underline"
                    >
                      {exam.isPublished ? 'View' : 'Enter results'}
                    </Link>
                    {exam.isPublished ? (
                      <Link
                        to={`/teacher/enter-results?examId=${exam.id}`}
                        className="font-body text-label-lg text-light-secondary hover:underline"
                      >
                        Edit
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => publishExam(exam.id)}
                        className="font-body text-label-lg text-light-secondary hover:underline"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </DataTable>

      <section
        id="create-exam"
        className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-md"
      >
        <h2 className="font-headline text-title-lg text-light-on-surface">Create exam</h2>
        <form
          onSubmit={handleCreateExam}
          className="grid grid-cols-1 sm:grid-cols-4 gap-gutter-md items-end"
        >
          <TextInput
            label="Exam name"
            placeholder="e.g. Final Term"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="sm:col-span-2"
            required
          />
          <SelectInput label="Term" value={term} onChange={(e) => setTerm(e.target.value)}>
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Final</option>
          </SelectInput>
          <div className="flex items-end gap-gutter-sm">
            <SelectInput
              label="Class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="flex-1"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.name}-{c.section}
                </option>
              ))}
            </SelectInput>
            <Button type="submit" variant="primary" className="px-6">
              Create
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};
