import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Icon, PageHeader, SelectInput, TextInput, ToggleSwitch } from '../../components/ui';

export const AdminAddEditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Teacher');
  const [classTeacherOf, setClassTeacherOf] = useState('Class 8-A');
  const [active, setActive] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => navigate('/admin/users'), 450);
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Add / Edit User"
        subtitle="Create a new staff or parent account and assign class permissions."
      />

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
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <SelectInput label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Teacher</option>
              <option>Admin</option>
              <option>Parent</option>
            </SelectInput>

            <SelectInput
              label="Class teacher of (teachers only)"
              value={classTeacherOf}
              onChange={(e) => setClassTeacherOf(e.target.value)}
              disabled={role !== 'Teacher'}
            >
              <option>Class 8-A</option>
              <option>Class 8-B</option>
              <option>Class 9-A</option>
              <option>Class 9-B</option>
              <option>None</option>
            </SelectInput>
          </div>

          <ToggleSwitch label="Account active" checked={active} onChange={setActive} />

          <div className="flex items-center gap-gutter-md pt-gutter-sm">
            <Button type="submit" variant="primary" icon="check">
              {saved ? 'User saved' : 'Save user'}
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
            New users get an email to set their password.
          </p>
          <p className="font-body text-body-md text-on-warning-container text-pretty">
            Parents are linked to a child later using the link code.
          </p>
          <p className="font-body text-label-md text-on-warning-container">
            Roles: Admin, Teacher, Parent.
          </p>
        </aside>
      </div>
    </div>
  );
};
