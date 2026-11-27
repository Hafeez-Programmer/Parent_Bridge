import React, { useCallback, useEffect, useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { supabase, type ClassRow } from '../../lib/supabase';

interface ReportRow {
  id: string;
  name: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const TeacherReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [reportType, setReportType] = useState<'Attendance' | 'Exam Results'>('Attendance');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [classAverage, setClassAverage] = useState('0%');
  const [absentToday, setAbsentToday] = useState(0);
  const [below75, setBelow75] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('name')
      .order('section')
      .then(({ data }) => {
        const list = (data ?? []) as ClassRow[];
        setClasses(list);
        if (list.length > 0) setSelectedClassId(list[0].id);
        setLoading(false);
      });
  }, [user]);

  const generateReport = useCallback(async () => {
    if (!selectedClassId) return;
    setLoading(true);

    const { data: students } = await supabase
      .from('students')
      .select('id, full_name')
      .eq('class_id', selectedClassId)
      .order('roll_no');

    const studentList = students ?? [];
    if (studentList.length === 0) {
      setRows([]);
      setClassAverage('0%');
      setAbsentToday(0);
      setBelow75(0);
      setLoading(false);
      return;
    }

    const studentIds = studentList.map((s) => s.id);

    if (reportType === 'Attendance') {
      const startDate = `${month}-01`;
      const [y, m] = month.split('-').map(Number);
      const endDate = new Date(y, m, 0).toISOString().slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);

      const { data: attData } = await supabase
        .from('attendance')
        .select('student_id, date, status')
        .in('student_id', studentIds)
        .gte('date', startDate)
        .lte('date', endDate);

      const records = attData ?? [];
      let todayAbs = 0;

      const computed: ReportRow[] = studentList.map((st) => {
        const stRecs = records.filter((r) => r.student_id === st.id);
        const present = stRecs.filter((r) => r.status === 'present').length;
        const absent = stRecs.filter((r) => r.status === 'absent').length;
        const late = stRecs.filter((r) => r.status === 'late').length;
        if (stRecs.some((r) => r.date === today && r.status === 'absent')) {
          todayAbs += 1;
        }
        const total = stRecs.length;
        const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 100;
        return { id: st.id, name: st.full_name, present, absent, late, percentage: pct };
      });

      const avg =
        computed.length > 0
          ? Math.round(computed.reduce((acc, r) => acc + r.percentage, 0) / computed.length)
          : 0;
      setRows(computed);
      setClassAverage(`${avg}%`);
      setAbsentToday(todayAbs);
      setBelow75(computed.filter((r) => r.percentage < 75).length);
    } else {
      const { data: resData } = await supabase
        .from('results')
        .select('student_id, marks_obtained, total_marks')
        .in('student_id', studentIds);

      const results = resData ?? [];
      const computed: ReportRow[] = studentList.map((st) => {
        const stRes = results.filter((r) => r.student_id === st.id);
        const obtained = stRes.reduce((acc, r) => acc + Number(r.marks_obtained), 0);
        const total = stRes.reduce((acc, r) => acc + Number(r.total_marks), 0);
        const pct = total > 0 ? Math.round((obtained / total) * 100) : 0;
        return {
          id: st.id,
          name: st.full_name,
          present: Math.round(obtained),
          absent: Math.round(total),
          late: stRes.length,
          percentage: pct,
        };
      });

      const avg =
        computed.length > 0
          ? Math.round(computed.reduce((acc, r) => acc + r.percentage, 0) / computed.length)
          : 0;
      setRows(computed);
      setClassAverage(`${avg}%`);
      setAbsentToday(0);
      setBelow75(computed.filter((r) => r.percentage < 75).length);
    }

    setLoading(false);
  }, [selectedClassId, month, reportType]);

  useEffect(() => {
    if (selectedClassId) generateReport();
  }, [selectedClassId, generateReport]);

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Reports"
        subtitle="View monthly attendance and exam performance for your assigned classes."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateReport();
        }}
        className="flex flex-wrap items-end gap-gutter-md"
      >
        <div className="w-48">
          <SelectInput
            label="Report"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'Attendance' | 'Exam Results')}
          >
            <option value="Attendance">Attendance</option>
            <option value="Exam Results">Exam Results</option>
          </SelectInput>
        </div>
        <div className="w-44">
          <SelectInput
            label="Class"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name}-{c.section}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="w-44">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-label-md text-light-on-surface-variant">Month</span>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded border border-light-outline-variant bg-light-surface px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
            />
          </label>
        </div>
        <Button type="submit" variant="primary" icon="analytics">
          Generate
        </Button>
      </form>

      <section
        aria-label="Report summary"
        className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md items-stretch"
      >
        <MetricCard label="Class average" value={classAverage} icon="trending_up" tone="success" />
        <MetricCard label="Absent today" value={absentToday} icon="person_off" tone="error" />
        <MetricCard
          label="Below 75%"
          value={`${below75} student${below75 === 1 ? '' : 's'}`}
          icon="warning"
          tone="warning"
        />
      </section>

      <DataTable>
        <TableHead>
          <TableHeaderCell>Student</TableHeaderCell>
          <TableHeaderCell>{reportType === 'Attendance' ? 'Present' : 'Marks'}</TableHeaderCell>
          <TableHeaderCell>{reportType === 'Attendance' ? 'Absent' : 'Total'}</TableHeaderCell>
          <TableHeaderCell>{reportType === 'Attendance' ? 'Late' : 'Subjects'}</TableHeaderCell>
          <TableHeaderCell>{reportType === 'Attendance' ? 'Attendance %' : 'Result %'}</TableHeaderCell>
        </TableHead>
        <TableBody tabular>
          {loading ? (
            <TableRow>
              <td colSpan={5} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading report...
              </td>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <td colSpan={5} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No students in this class.
              </td>
            </TableRow>
          ) : (
            rows.map((row) => (
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
            ))
          )}
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
