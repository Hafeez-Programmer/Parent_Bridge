import React from 'react';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'primary' | 'secondary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-container text-on-success-container',
  error: 'bg-light-error-container text-light-on-error-container',
  warning: 'bg-warning-container text-on-warning-container',
  primary: 'bg-light-primary-container text-light-on-primary-container',
  secondary: 'bg-light-secondary-container text-light-on-secondary-container',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => (
  <span
    role="status"
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-label-sm ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
);
