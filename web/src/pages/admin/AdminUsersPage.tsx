import React, { useEffect, useMemo, useState } from 'react';
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
import { supabase, type ProfileRow } from '../../lib/supabase';

const PAGE_SIZE = 10;

function formatRole(role: ProfileRow['role']): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mounted) return;
      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setUsers((data ?? []) as ProfileRow[]);
      }
      setLoading(false);
    }
    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === 'All roles' || formatRole(u.role) === roleFilter;
      const matchesQuery =
        !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const toggleStatus = async (user: ProfileRow) => {
    setError(null);
    const nextActive = !user.is_active;
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ is_active: nextActive })
      .eq('id', user.id);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }

    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: nextActive } : u)));
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

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-gutter-md">
        <SearchInput
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="w-40">
          <SelectInput
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
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
          {loading ? (
            <TableRow>
              <td colSpan={5} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                Loading users...
              </td>
            </TableRow>
          ) : paginatedUsers.length === 0 ? (
            <TableRow>
              <td colSpan={5} className="px-4 py-6 text-center font-body text-body-md text-light-on-surface-variant">
                No users match your filter.
              </td>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                  {user.full_name}
                </td>
                <td className="px-4 py-3 font-body text-body-md text-light-on-surface-variant">
                  {user.email}
                </td>
                <td className="px-4 py-3 font-body text-body-md text-light-on-surface">
                  {formatRole(user.role)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.is_active ? 'success' : 'error'}>
                    {user.is_active ? 'Active' : 'Inactive'}
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
                    {user.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        className={`font-body text-label-lg hover:underline ${
                          user.is_active ? 'text-light-on-surface-variant' : 'text-light-secondary'
                        }`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </DataTable>

      <div className="flex items-center justify-between pt-gutter-sm">
        <span className="font-body text-body-md text-light-on-surface-variant tabular-nums">
          Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
          {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={currentPage === n ? 'page' : undefined}
              className={`px-3 py-1 rounded ${
                currentPage === n
                  ? 'bg-light-primary text-light-on-primary font-semibold'
                  : 'border border-light-outline-variant bg-light-surface text-light-on-surface-variant hover:bg-light-surface-container-low'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
