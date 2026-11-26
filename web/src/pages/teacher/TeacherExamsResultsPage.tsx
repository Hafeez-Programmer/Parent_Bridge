import React, { useState } from 'react';
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
import { INITIAL_EXAMS, type ExamRecord } from '../../data/mockData';

export const TeacherExamsResultsPage: React.FC = () => {
  const [exams, setExams] = useState<ExamRecord[]>(INITIAL_EXAMS);
  const [examName, setExamName] = useState('');
  const [term, setTerm] = useState('Term 2');
  const [className, setClassName] = useState('Class 8-A');

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;
    setExams((prev) => [
      ...prev,
      {
        id: `ex${Date.now()}`,
        name: examName.trim(),
        term,
        className: className.replace('Class ', ''),
        status: 'Draft',
      },
    ]);
    setExamName('');
  };

  const publishExam = (id: string) => {
    setExams((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, status: 'Published' } : ex)),
    );
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

      <DataTable>
        <TableHead>
          <TableHeaderCell>Exam</TableHeaderCell>
          <TableHeaderCell>Term</TableHeaderCell>
          <TableHeaderCell>Class</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableHead>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <td className="px-4 py-3 font-body text-body-md">{exam.name}</td>
              <td className="px-4 py-3 font-body text-body-md">{exam.term}</td>
              <td className="px-4 py-3 font-body text-body-md">{exam.className}</td>
              <td className="px-4 py-3">
                <Badge variant={exam.status === 'Published' ? 'success' : 'warning'}>
                  {exam.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-gutter-md">
                  <Link
                    to="/teacher/enter-results"
                    className="font-body text-label-lg text-light-primary hover:underline"
                  >
                    {exam.status === 'Published' ? 'View' : 'Enter results'}
                  </Link>
                  {exam.status === 'Published' ? (
                    <Link
                      to="/teacher/enter-results"
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
          ))}
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
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="flex-1"
            >
              <option>Class 8-A</option>
              <option>Class 9-A</option>
              <option>Class 9-B</option>
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
