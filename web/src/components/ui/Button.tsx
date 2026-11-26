import React from 'react';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-light-secondary text-light-on-secondary hover:bg-light-on-secondary-container shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary',
  secondary:
    'bg-light-primary-container text-light-on-primary-container hover:bg-light-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary',
  outline:
    'bg-light-surface text-light-on-surface-variant border border-light-outline-variant hover:bg-light-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  type = 'button',
  disabled,
  ...rest
}) => {
  const disabledClasses = disabled
    ? 'opacity-60 cursor-not-allowed bg-light-surface-variant text-light-on-surface-variant hover:bg-light-surface-variant'
    : variantClasses[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded font-body text-label-lg transition-colors duration-state-change ease-state-change ${disabledClasses} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' && <Icon name={icon} className="text-title-md" />}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <Icon name={icon} className="text-title-md" />}
    </button>
  );
};
