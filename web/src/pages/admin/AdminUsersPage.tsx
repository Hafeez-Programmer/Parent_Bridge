import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  DataTable,
  Icon,
  PageHeader,
  SearchInput,
  SelectInput,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/ui';
import { INITIAL_USERS, type UserAccount } from '../../data/mockData';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === 'All roles' || u.role === roleFilter;
      const matchesQuery =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, search, roleFilter]);

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Users"
        subtitle="Manage teacher, parent, and administrator accounts."
        actions={
          <Link
            to="/admin/users/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-light-secondary text-light-on-secondary font-body text-label-lg hover:bg-light-on-secondary-container transition-colors duration-state-change shadow-sm"
          >
            <Icon name="group_add" />
            <span>Add user</span>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-gutter-md">
        <SearchInput
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-40">
          <SelectInput
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All roles</option>
            <option>Admin</option>
            <option>Teacher</option>
            <option>Parent</option>
          </SelectInput>
        </div>
      </div>

      <DataTable>
        <TableHead>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell>Role</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                {user.name}
              </td>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface-variant">
                {user.email}
              </td>
              <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                {user.role}
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.active ? 'success' : 'error'}>
                  {user.active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-gutter-md">
                  <Link
                    to={`/admin/users/new?edit=${user.id}`}
                    className="font-body text-label-lg text-light-primary hover:underline"
                  >
                    Edit
                  </Link>
                  {user.role !== 'Admin' && (
                    <button
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                      className={`font-body text-label-lg hover:underline ${
                        user.active ? 'text-light-on-surface-variant' : 'text-light-secondary'
                      }`}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-between pt-gutter-sm">
        <span className="font-body text-body-md text-light-on-surface-variant tabular-nums">
          Showing 1-{filteredUsers.length} of 40
        </span>
        <nav
          aria-label="Pagination"
          className="flex items-center gap-gutter-xs font-body text-body-md tabular-nums"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low"
            aria-label="Previous page"
          >
            &lt;
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={page === n ? 'page' : undefined}
              className={`px-3 py-1 rounded ${
                page === n
                  ? 'bg-light-primary text-light-on-primary font-semibold'
                  : 'border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(3, p + 1))}
            className="px-2.5 py-1 rounded border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low"
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      </div>
    </div>
  );
};
