import React from 'react';
import { Icon } from './Icon';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  mono?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  icon,
  mono = false,
  className = '',
  ...rest
}) => (
  <label className={`flex flex-col gap-gutter-xs ${className}`}>
    <span className="font-body text-label-md text-light-on-surface-variant">{label}</span>
    <div className="relative flex items-center">
      {icon && (
        <Icon
          name={icon}
          className="absolute left-3.5 text-light-on-surface-variant text-title-md pointer-events-none"
        />
      )}
      <input
        className={`w-full rounded border border-light-outline-variant bg-light-surface ${
          icon ? 'pl-11 pr-3.5' : 'px-3.5'
        } py-2.5 ${
          mono ? 'font-mono text-mono-md tabular-nums' : 'font-body text-body-md'
        } text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary`}
        {...rest}
      />
    </div>
  </label>
);

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  children,
  className = '',
  ...rest
}) => {
  const selectEl = (
    <select
      className="w-full rounded border border-light-outline-variant bg-light-surface px-3.5 py-2.5 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
      {...rest}
    >
      {children}
    </select>
  );

  if (!label) return selectEl;

  return (
    <label className={`flex flex-col gap-gutter-xs ${className}`}>
      <span className="font-body text-label-md text-light-on-surface-variant">{label}</span>
      {selectEl}
    </label>
  );
};

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  containerClassName = 'w-72',
  ...rest
}) => (
  <label className={`relative flex items-center ${containerClassName}`}>
    <Icon
      name="search"
      className="absolute left-3 text-light-on-surface-variant text-title-md pointer-events-none"
    />
    <input
      type="search"
      className="w-full rounded border border-light-outline-variant bg-light-surface pl-10 pr-3.5 py-2 font-body text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary"
      {...rest}
    />
  </label>
);

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  className = '',
  ...rest
}) => (
  <label className={`flex flex-col gap-gutter-xs ${className}`}>
    <span className="font-body text-label-md text-light-on-surface-variant">{label}</span>
    <textarea
      className="w-full rounded border border-light-outline-variant bg-light-surface px-3.5 py-2.5 font-body text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary"
      {...rest}
    />
  </label>
);

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between max-w-xs py-gutter-sm">
    <span className="font-body text-body-md text-light-on-surface">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-label={label}
      />
      <div className="w-11 h-6 bg-light-outline-variant rounded-full peer peer-checked:bg-light-secondary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-light-surface after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  </div>
);
