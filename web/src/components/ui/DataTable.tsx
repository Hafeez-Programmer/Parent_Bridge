import React from 'react';

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ children, className = '' }) => (
  <div
    className={`w-full overflow-x-auto rounded-md border border-light-outline-variant bg-light-surface shadow-sm ${className}`}
  >
    <table className="w-full text-left border-collapse">{children}</table>
  </div>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-light-surface-container-low text-light-on-surface-variant border-b border-light-outline-variant">
    <tr>{children}</tr>
  </thead>
);

export const TableHeaderCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <th scope="col" className={`px-4 py-3 font-body text-label-md ${className}`}>
    {children}
  </th>
);

export const TableBody: React.FC<{ children: React.ReactNode; tabular?: boolean }> = ({
  children,
  tabular = false,
}) => (
  <tbody className={`divide-y divide-light-outline-variant ${tabular ? 'tabular-nums' : ''}`}>
    {children}
  </tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="hover:bg-light-surface-container-low transition-colors duration-state-change">
    {children}
  </tr>
);
