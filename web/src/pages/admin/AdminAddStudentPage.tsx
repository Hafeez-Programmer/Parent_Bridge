import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Icon, PageHeader, SelectInput, TextInput, ToggleSwitch } from '../../components/ui';
import { supabase, type ClassRow } from '../../lib/supabase';

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const AdminAddStudentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);

  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [active, setActive] = useState(true);
  const [linkCode, setLinkCode] = useState(() => randomCode());
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data: clsData } = await supabase
        .from('classes')
        .select('*')
        .order('name')
        .order('section');

      if (!mounted) return;
      const clsList = (clsData ?? []) as ClassRow[];
      setClasses(clsList);
      if (clsList.length > 0 && !editId) {
        setClassId(clsList[0].id);
      }

      if (editId) {
        const { data: st, error: stErr } = await supabase
          .from('students')
          .select('*')
          .eq('id', editId)
          .single();

        if (!mounted) return;
        if (stErr || !st) {
          setError(stErr?.message ?? 'Student not found.');
          return;
        }
        setFullName(st.full_name);
        setRollNumber(st.roll_no);
        setClassId(st.class_id);
        setLinkCode(st.link_code);
        setActive(st.is_active ?? true);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !rollNumber.trim() || !classId) return;
    setError(null);
    setSavedMessage(null);
    setSaving(true);

    if (isEdit && editId) {
      const { error: updErr } = await supabase
        .from('students')
        .update({
          full_name: fullName.trim(),
          roll_no: rollNumber.trim(),
          class_id: classId,
          is_active: active,
        })
        .eq('id', editId);

      setSaving(false);
      if (updErr) {
        setError(updErr.message);
        return;
      }
      setSavedMessage('Student updated successfully.');
      return;
    }

    const code = randomCode();
    const { data: inserted, error: insErr } = await supabase
      .from('students')
      .insert({
        full_name: fullName.trim(),
        roll_no: rollNumber.trim(),
        class_id: classId,
        link_code: code,
        is_active: active,
      })
      .select()
      .single();

    setSaving(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }

    if (inserted) {
      setLinkCode(inserted.link_code);
    }
    setCopied(false);
    setSavedMessage('Student saved and link code generated.');
    setFullName('');
    setRollNumber('');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(linkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title={isEdit ? 'Edit Student' : 'Add Student'}
        subtitle="Register a student and generate a unique parent link code."
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      {savedMessage && (
        <div className="rounded border border-success bg-success-container px-4 py-3 font-body text-body-md text-on-success-container flex items-center justify-between">
          <span>{savedMessage}</span>
          <Link to="/admin/students" className="font-body text-label-lg underline">
            View all students
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-lg"
        >
          <TextInput
            label="Full name"
            placeholder="e.g. Ali Khan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <TextInput
              label="Roll number"
              placeholder="e.g. 12"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              inputMode="numeric"
              mono
              required
            />

            <SelectInput
              label="Class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.name}-{c.section}
                </option>
              ))}
            </SelectInput>
          </div>

          <ToggleSwitch label="Student active" checked={active} onChange={setActive} />

          <div className="flex items-center gap-gutter-md pt-gutter-sm">
            <Button type="submit" variant="primary" icon="check" disabled={saving}>
              {saving ? 'Saving...' : 'Save student'}
            </Button>
            <Link
              to="/admin/students"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded bg-light-primary-container text-light-on-primary-container font-body text-label-lg hover:bg-light-surface-container-high transition-colors duration-state-change"
            >
              Cancel
            </Link>
          </div>
        </form>

        <article className="bg-success-container border border-success rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-md">
          <header className="flex items-center gap-gutter-sm">
            <Icon name="qr_code_2" className="text-title-lg text-on-success-container" />
            <h2 className="font-headline text-title-lg text-on-success-container">
              Link code generated
            </h2>
          </header>
          <div className="text-center py-3 rounded bg-light-surface border border-light-outline-variant">
            <p className="font-mono text-mono-lg text-light-primary tabular-nums">{linkCode}</p>
          </div>
          <footer className="flex items-center gap-gutter-sm">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-light-surface text-light-primary font-body text-label-lg border border-light-outline-variant hover:bg-light-surface-container-low transition-colors duration-state-change whitespace-nowrap"
            >
              <Icon name="content_copy" />
              <span>{copied ? 'Copied' : 'Copy code'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-light-surface text-light-primary font-body text-label-lg border border-light-outline-variant hover:bg-light-surface-container-low transition-colors duration-state-change whitespace-nowrap"
            >
              <Icon name="print" />
              <span>Print slip</span>
            </button>
          </footer>
          <p className="font-body text-body-md text-on-success-container text-pretty">
            Give this code to the parent. They enter it with the roll number to link their child.
          </p>
        </article>
      </div>
    </div>
  );
};
