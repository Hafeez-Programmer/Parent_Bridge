import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, TextInput } from '../components/ui';

const FEATURES = [
  'Instant attendance & absence alerts',
  'Verified parent-student link codes',
  'Term-wise exam marks & reports',
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('sara@school.edu');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes('admin')) {
      navigate('/admin/overview');
    } else {
      navigate('/teacher/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-light-background text-light-on-background grid grid-cols-1 lg:grid-cols-12">
      <section className="hidden lg:flex lg:col-span-5 bg-light-primary text-light-on-primary p-gutter-xl flex-col justify-between">
        <div className="flex items-center gap-gutter-sm">
          <div className="w-10 h-10 rounded bg-light-surface text-light-primary flex items-center justify-center">
            <Icon name="school" className="text-headline-md" />
          </div>
          <span className="font-headline text-headline-md text-light-on-primary">ParentBridge</span>
        </div>

        <div className="flex flex-col gap-gutter-lg max-w-md">
          <h1 className="font-headline text-display-md text-light-on-primary text-balance">
            Keep every parent connected to school life.
          </h1>
          <p className="font-body text-body-lg text-light-primary-container text-pretty">
            Record daily attendance, publish exam results, and share class announcements in seconds
            from one unified dashboard.
          </p>
          <div className="flex flex-col gap-gutter-sm pt-gutter-sm">
            {FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-gutter-sm">
                <Icon name="check_circle" className="text-title-lg text-light-secondary-container" />
                <span className="font-body text-body-md text-light-on-primary">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-body text-label-sm text-light-primary-container">
          SMI University · Secure Parent-School Platform
        </p>
      </section>

      <section className="lg:col-span-7 flex items-center justify-center p-gutter-lg lg:p-gutter-xl">
        <div className="w-full max-w-md bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl shadow-sm flex flex-col gap-gutter-lg">
          <div className="flex flex-col gap-gutter-xs">
            <div className="flex items-center gap-gutter-sm lg:hidden mb-2">
              <div className="w-9 h-9 rounded bg-light-primary text-light-on-primary flex items-center justify-center">
                <Icon name="school" className="text-title-lg" />
              </div>
              <span className="font-headline text-title-lg text-light-primary">ParentBridge</span>
            </div>
            <h2 className="font-headline text-headline-lg text-light-on-surface">Welcome back</h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Sign in to the Admin &amp; Teacher Dashboard
            </p>
          </div>

          <form className="flex flex-col gap-gutter-md" onSubmit={handleSubmit}>
            <TextInput
              label="Email address"
              icon="mail"
              type="email"
              placeholder="name@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextInput
              label="Password"
              icon="lock"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-label-md">
              <button
                type="button"
                onClick={() => setEmail('admin@school.edu')}
                className="font-body text-label-sm text-light-on-surface-variant hover:text-light-primary"
              >
                Demo: Use Admin email
              </button>
              <a
                href="#forgot-password"
                onClick={(e) => e.preventDefault()}
                className="font-body text-label-md text-light-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon="arrow_forward"
              iconPosition="right"
              className="w-full py-3"
            >
              Sign in to dashboard
            </Button>
          </form>

          <div className="pt-gutter-sm border-t border-light-outline-variant flex items-center justify-between gap-gutter-sm">
            <Button
              variant="outline"
              className="flex-1 text-label-md py-2"
              onClick={() => navigate('/admin/overview')}
            >
              Admin Portal
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-label-md py-2"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Teacher Portal
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
