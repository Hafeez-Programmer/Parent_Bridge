import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, PageHeader, SelectInput, TextInput, ToggleSwitch } from '../../components/ui';

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const AdminAddStudentPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('12');
  const [className, setClassName] = useState('Class 8-A');
  const [active, setActive] = useState(true);
  const [linkCode, setLinkCode] = useState('K7P2M9QX');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkCode(randomCode());
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(linkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Add Student"
        subtitle="Register a student and generate a unique parent link code."
      />

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
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              inputMode="numeric"
              mono
            />

            <SelectInput
              label="Class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option>Class 8-A</option>
              <option>Class 8-B</option>
              <option>Class 9-A</option>
              <option>Class 9-B</option>
            </SelectInput>
          </div>

          <ToggleSwitch label="Student active" checked={active} onChange={setActive} />

          <div className="flex items-center gap-gutter-md pt-gutter-sm">
            <Button type="submit" variant="primary" icon="check">
              Save student
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
