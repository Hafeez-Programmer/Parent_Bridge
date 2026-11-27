import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Icon, PageHeader, SelectInput, TextInput, ToggleSwitch } from '../../components/ui';
import { supabase, type ClassRow, type DbUserRole } from '../../lib/supabase';

export const AdminAddEditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<DbUserRole>('teacher');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadInitial() {
      const { data: clsData } = await supabase
        .from('classes')
        .select('*')
        .order('name')
        .order('section');

      if (!mounted) return;
      setClasses((clsData ?? []) as ClassRow[]);

      if (editId) {
        const { data: userRow, error: userErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', editId)
          .single();

        if (!mounted) return;
        if (userErr || !userRow) {
          setError(userErr?.message ?? 'User not found.');
          return;
        }

        setName(userRow.full_name);
        setEmail(userRow.email);
        setRole(userRow.role as DbUserRole);
        setActive(userRow.is_active);

        const assigned = (clsData ?? []).find((c) => c.teacher_id === editId);
        if (assigned) setClassId(assigned.id);
      }
    }
    loadInitial();
    return () => {
      mounted = false;
    };
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (isEdit && editId) {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          full_name: name.trim(),
          role,
          is_active: active,
        })
        .eq('id', editId);

      if (updateErr) {
        setError(updateErr.message);
        setSaving(false);
        return;
      }

      if (role === 'teacher') {
        // Clear previous assignment for this teacher, then assign selected class if any
        await supabase.from('classes').update({ teacher_id: null }).eq('teacher_id', editId);
        if (classId) {
          await supabase.from('classes').update({ teacher_id: editId }).eq('id', classId);
        }
      }

      setSaving(false);
      navigate('/admin/users');
      return;
    }

    // Create new user via Edge Function
    const { data, error: fnErr } = await supabase.functions.invoke('admin-create-user', {
      body: {
        email: email.trim(),
        fullName: name.trim(),
        role,
        isActive: active,
        classId: role === 'teacher' && classId ? classId : null,
        password: password.trim() || undefined,
      },
    });

    setSaving(false);

    if (fnErr || data?.error) {
      setError(data?.error || fnErr?.message || 'Failed to create user.');
      return;
    }

    if (data?.temporaryPassword) {
      setTempPassword(data.temporaryPassword);
    } else {
      navigate('/admin/users');
    }
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title={isEdit ? 'Edit User' : 'Add User'}
        subtitle="Create or update a staff or parent account and assign class permissions."
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      {tempPassword && (
        <div className="rounded border border-success bg-success-container px-4 py-3 font-body text-body-md text-on-success-container flex items-center justify-between gap-4">
          <span>
            User created! Temporary password: <strong className="font-mono">{tempPassword}</strong>
          </span>
          <Link to="/admin/users" className="font-body text-label-lg underline">
            Back to Users
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
            placeholder="e.g. Sara Ahmed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="name@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEdit}
            required
          />

          {!isEdit && (
            <TextInput
              label="Initial password (optional — auto-generated if blank)"
              type="password"
              placeholder="Leave blank to generate temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <SelectInput
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as DbUserRole)}
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="parent">Parent</option>
            </SelectInput>

            <SelectInput
              label="Class teacher of (teachers only)"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={role !== 'teacher'}
            >
              <option value="">None</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Class {cls.name}-{cls.section}
                </option>
              ))}
            </SelectInput>
          </div>

          <ToggleSwitch label="Account active" checked={active} onChange={setActive} />

          <div className="flex items-center gap-gutter-md pt-gutter-sm">
            <Button type="submit" variant="primary" icon="check" disabled={saving}>
              {saving ? 'Saving...' : 'Save user'}
            </Button>
            <Link
              to="/admin/users"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded bg-light-primary-container text-light-on-primary-container font-body text-label-lg hover:bg-light-surface-container-high transition-colors duration-state-change"
            >
              Cancel
            </Link>
          </div>
        </form>

        <aside className="bg-warning-container border border-warning rounded-md p-gutter-lg flex flex-col gap-gutter-sm">
          <div className="flex items-center gap-gutter-sm">
            <Icon name="info" className="text-title-lg text-on-warning-container" />
            <h2 className="font-headline text-title-md text-on-warning-container">How it works</h2>
          </div>
          <p className="font-body text-body-md text-on-warning-container text-pretty">
            New accounts are provisioned in Supabase Auth with role-based access rules.
          </p>
          <p className="font-body text-body-md text-on-warning-container text-pretty">
            Parents link to their children in the mobile app using the student&apos;s link code and roll number.
          </p>
          <p className="font-body text-label-md text-on-warning-container">
            Roles: Admin, Teacher, Parent.
          </p>
        </aside>
      </div>
    </div>
  );
};
