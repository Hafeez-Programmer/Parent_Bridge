import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-center justify-between gap-gutter-md">
    <div className="flex flex-col gap-gutter-xs">
      <h1 className="font-headline text-headline-lg text-light-on-surface">{title}</h1>
      <p className="font-body text-body-md text-light-on-surface-variant">{subtitle}</p>
    </div>
    {actions && <div className="flex items-center gap-gutter-md">{actions}</div>}
  </div>
);
