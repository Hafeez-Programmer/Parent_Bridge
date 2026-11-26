import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Badge, Icon } from '../ui';

export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

interface DashboardLayoutProps {
  portal: 'admin' | 'teacher';
  navItems: NavItem[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ portal, navItems }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isAdmin = portal === 'admin';

  return (
    <div className="bg-light-background text-light-on-background font-body min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-light-surface border-b border-light-outline-variant px-gutter-lg h-16 flex items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container-low"
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileNavOpen ? 'close' : 'menu'} className="text-title-lg" />
          </button>
          <div className="w-9 h-9 rounded bg-light-primary text-light-on-primary flex items-center justify-center">
            <Icon name="school" className="text-title-lg" />
          </div>
          <span className="font-headline text-title-lg text-light-on-surface">ParentBridge</span>
          <Badge variant={isAdmin ? 'primary' : 'secondary'}>
            {isAdmin ? 'Admin Portal' : 'Teacher Portal'}
          </Badge>
        </div>

        <div className="flex items-center gap-gutter-md">
          <div className="flex items-center gap-gutter-sm">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-label-md ${
                isAdmin
                  ? 'bg-light-primary-container text-light-on-primary-container'
                  : 'bg-light-secondary-container text-light-on-secondary-container'
              }`}
            >
              {isAdmin ? 'AD' : 'SA'}
            </div>
            <span className="hidden sm:inline font-body text-label-md text-light-on-surface">
              {isAdmin ? 'Admin' : 'Ms. Sara (Teacher)'}
            </span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container-low font-body text-label-md transition-colors duration-state-change"
          >
            <Icon name="logout" className="text-title-md" />
            <span>Logout</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <aside
          className={`${
            mobileNavOpen ? 'block fixed inset-y-16 left-0 z-10 shadow-lg' : 'hidden'
          } md:block md:static w-60 shrink-0 bg-light-surface-container-low border-r border-light-outline-variant p-gutter-md`}
        >
          <nav
            aria-label={isAdmin ? 'Admin navigation' : 'Teacher navigation'}
            className="flex flex-col gap-gutter-xs"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-gutter-sm px-3.5 py-2.5 rounded transition-colors duration-state-change ${
                    isActive
                      ? 'bg-light-primary text-light-on-primary font-body text-label-lg shadow-sm'
                      : 'text-light-on-surface-variant hover:bg-light-surface-container font-body text-body-md'
                  }`
                }
              >
                <Icon name={item.icon} className="text-title-md" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-gutter-lg lg:p-gutter-xl flex flex-col gap-gutter-lg min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
