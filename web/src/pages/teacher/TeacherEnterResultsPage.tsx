import React, { useState } from 'react';
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

const INITIAL_MARKS = [
  { id: '1', roll: '01', name: 'Ali Khan', marks: 82 },
  { id: '2', roll: '02', name: 'Ayesha Noor', marks: 91 },
  { id: '3', roll: '03', name: 'Bilal Ahmed', marks: 67 },
  { id: '4', roll: '04', name: 'Fatima Raza', marks: 88 },
  { id: '5', roll: '05', name: 'Hamza Iqbal', marks: 74 },
];

export const TeacherEnterResultsPage: React.FC = () => {
  const [subject, setSubject] = useState('Mathematics');
  const [totalMarks, setTotalMarks] = useState(100);
  const [rows, setRows] = useState(INITIAL_MARKS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const updateMarks = (id: string, value: number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, marks: value } : r)));
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader title="Enter Results" subtitle="Mid-Term | Class 8-A" />

      <div className="flex flex-wrap items-end gap-gutter-md">
        <div className="w-64">
          <SelectInput
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option>Mathematics</option>
            <option>English</option>
            <option>Science</option>
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
          {rows.map((row) => {
            const pct = Math.round((row.marks / (totalMarks || 100)) * 100);
            return (
              <TableRow key={row.id}>
                <td className="px-4 py-3 font-mono text-mono-md">{row.roll}</td>
                <td className="px-4 py-3 font-body text-body-md">{row.name}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={row.marks}
                    onChange={(e) => updateMarks(row.id, Number(e.target.value) || 0)}
                    aria-label={`${row.name} marks`}
                    className="w-24 rounded border border-light-outline-variant bg-light-surface px-3 py-1.5 text-center font-mono text-mono-md tabular-nums focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </td>
                <td className="px-4 py-3 font-body text-body-md">{pct}%</td>
              </TableRow>
            );
          })}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-end gap-gutter-md">
        {statusMessage && (
          <span className="font-body text-label-md text-success mr-auto">{statusMessage}</span>
        )}
        <Button
          variant="secondary"
          icon="save"
          onClick={() => setStatusMessage('Draft saved.')}
        >
          Save draft
        </Button>
        <Button
          variant="primary"
          icon="publish"
          onClick={() => setStatusMessage('Results published to parents.')}
        >
          Publish results
        </Button>
      </div>
    </div>
  );
};
