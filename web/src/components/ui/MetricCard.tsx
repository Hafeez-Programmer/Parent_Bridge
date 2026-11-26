import React from 'react';
import { Icon } from './Icon';

export type MetricTone = 'primary' | 'success' | 'warning' | 'lavender' | 'error';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  tone?: MetricTone;
}

const toneClasses: Record<MetricTone, string> = {
  primary: 'bg-light-primary-container text-light-on-primary-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  lavender: 'bg-lavender-container text-on-lavender-container',
  error: 'bg-light-error-container text-light-on-error-container',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  tone = 'primary',
}) => (
  <article className="h-full bg-light-surface border border-light-outline-variant rounded-md p-gutter-md shadow-sm flex items-start justify-between gap-gutter-sm">
    <div className="flex flex-col gap-gutter-xs">
      <span className="font-body text-label-md text-light-on-surface-variant">{label}</span>
      <span className="font-headline text-headline-lg text-light-on-surface tabular-nums">
        {value}
      </span>
    </div>
    <div
      className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${toneClasses[tone]}`}
    >
      <Icon name={icon} className="text-title-lg" />
    </div>
  </article>
);
