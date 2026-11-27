import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';
import { supabase, type SubjectRow } from '../../lib/supabase';

interface StudentMarkRow {
  studentId: string;
  rollNo: string;
  fullName: string;
  marks: number;
}

interface ExamInfo {
  id: string;
  name: string;
  term: string;
  classId: string;
  classLabel: string;
  isPublished: boolean;
}

export const TeacherEnterResultsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const paramExamId = searchParams.get('examId');

  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [rows, setRows] = useState<StudentMarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    async function loadMeta() {
      const [clsRes, subjRes] = await Promise.all([
        supabase.from('classes').select('id, name, section').eq('teacher_id', user!.id),
        supabase.from('subjects').select('*').order('name'),
      ]);

      const clsList = clsRes.data ?? [];
      const clsIds = clsList.map((c) => c.id);
      const clsMap = new Map(clsList.map((c) => [c.id, `Class ${c.name}-${c.section}`]));

      const subjList = (subjRes.data ?? []) as SubjectRow[];
      setSubjects(subjList);
      if (subjList.length > 0) setSelectedSubjectId(subjList[0].id);

      if (clsIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .in('class_id', clsIds)
        .order('created_at', { ascending: false });

      const examList: ExamInfo[] = (examData ?? []).map((ex) => ({
        id: ex.id,
        name: ex.name,
        term: ex.term,
        classId: ex.class_id,
        classLabel: clsMap.get(ex.class_id) ?? 'Class',
        isPublished: ex.is_published,
      }));
      setExams(examList);

      if (examList.length > 0) {
        const initial =
          paramExamId && examList.some((e) => e.id === paramExamId) ? paramExamId : examList[0].id;
        setSelectedExamId(initial);
      } else {
        setLoading(false);
      }
    }
    loadMeta();
  }, [user, paramExamId]);

  const currentExam = exams.find((e) => e.id === selectedExamId) ?? null;

  const loadRosterAndMarks = useCallback(async () => {
    if (!currentExam || !selectedSubjectId) return;
    setLoading(true);
    setError(null);

    const [studRes, resRes] = await Promise.all([
      supabase
        .from('students')
        .select('id, roll_no, full_name')
        .eq('class_id', currentExam.classId)
        .eq('is_active', true)
        .order('roll_no'),
      supabase
        .from('results')
        .select('student_id, marks_obtained, total_marks')
        .eq('exam_id', currentExam.id)
        .eq('subject_id', selectedSubjectId),
    ]);

    if (studRes.error) {
      setError(studRes.error.message);
      setLoading(false);
      return;
    }

    const existingMap = new Map(
      (resRes.data ?? []).map((r) => [r.student_id, r]),
    );

    if (resRes.data && resRes.data.length > 0) {
      setTotalMarks(Number(resRes.data[0].total_marks) || 100);
    }

    setRows(
      (studRes.data ?? []).map((s) => ({
        studentId: s.id,
        rollNo: s.roll_no,
        fullName: s.full_name,
        marks: existingMap.has(s.id) ? Number(existingMap.get(s.id)!.marks_obtained) : 0,
      })),
    );
    setLoading(false);
  }, [currentExam, selectedSubjectId]);

  useEffect(() => {
    loadRosterAndMarks();
  }, [loadRosterAndMarks]);

  const updateMarks = (studentId: string, value: number) => {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, marks: value } : r)));
    setStatusMessage(null);
  };

  const saveMarks = async (publish: boolean) => {
    if (!currentExam || !selectedSubjectId || rows.length === 0) return;
    setSaving(true);
    setError(null);
    setStatusMessage(null);

    const payload = rows.map((r) => ({
      exam_id: currentExam.id,
      student_id: r.studentId,
      subject_id: selectedSubjectId,
      marks_obtained: r.marks,
      total_marks: totalMarks || 100,
    }));

    const { error: upsertErr } = await supabase
      .from('results')
      .upsert(payload, { onConflict: 'exam_id,student_id,subject_id' });

    if (upsertErr) {
      setError(upsertErr.message);
      setSaving(false);
      return;
    }

    if (publish && !currentExam.isPublished) {
      const { error: pubErr } = await supabase
        .from('exams')
        .update({ is_published: true })
        .eq('id', currentExam.id);
      if (pubErr) {
        setError(pubErr.message);
        setSaving(false);
        return;
      }
      setExams((prev) =>
        prev.map((e) => (e.id === currentExam.id ? { ...e, isPublished: true } : e)),
      );
    }

    setSaving(false);
    setStatusMessage(publish ? 'Results published to parents.' : 'Draft saved.');
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Enter Results"
        subtitle={
          currentExam
            ? `${currentExam.name} (${currentExam.term}) | ${currentExam.classLabel}`
            : 'Select an exam to enter marks'
        }
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-gutter-md">
        <div className="w-64">
          <SelectInput
            label="Exam"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} — {ex.classLabel}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="w-56">
          <SelectInput
            label="Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="w-36">
          <TextInput
            label="Total marks"
            type="number"
            mono
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value) || 100)}
          />
        </div>
      </div>

      <DataTable>
        <TableHead>
          <TableHeaderCell className="w-20">Roll</TableHeaderCell>
          <TableHeaderCell>Student</TableHeaderCell>
          <TableHeaderCell>Marks obtained</TableHeaderCell>
          <TableHeaderCell>Percentage</TableHeaderCell>
        </TableHead>
        <TableBody tabular>
          {loading ? (
            <TableRow>
              <td colSpan={4} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading students...
              </td>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <td colSpan={4} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No students found for this exam.
              </td>
            </TableRow>
          ) : (
            rows.map((row) => {
              const pct = Math.round((row.marks / (totalMarks || 100)) * 100);
              return (
                <TableRow key={row.studentId}>
                  <td className="px-4 py-3 font-mono text-mono-md">{row.rollNo}</td>
                  <td className="px-4 py-3 font-body text-body-md">{row.fullName}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={totalMarks}
                      value={row.marks}
                      onChange={(e) => updateMarks(row.studentId, Number(e.target.value) || 0)}
                      aria-label={`${row.fullName} marks`}
                      className="w-24 rounded border border-light-outline-variant bg-light-surface px-3 py-1.5 text-center font-mono text-mono-md tabular-nums focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-body text-body-md">{pct}%</td>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-end gap-gutter-md">
        {statusMessage && (
          <span className="font-body text-label-md text-success mr-auto">{statusMessage}</span>
        )}
        <Button
          variant="secondary"
          icon="save"
          onClick={() => saveMarks(false)}
          disabled={saving || rows.length === 0}
        >
          Save draft
        </Button>
        <Button
          variant="primary"
          icon="publish"
          onClick={() => saveMarks(true)}
          disabled={saving || rows.length === 0}
        >
          Publish results
        </Button>
      </div>
    </div>
  );
};
