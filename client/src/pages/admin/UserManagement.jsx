import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers(filter ? { role: filter } : {});
      setUsers(res.data.data);
    } catch { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const toggleUser = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Failed to toggle user'); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));

  if (loading) return <LoadingSpinner text="Loading users..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">User Management</h1>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search by name or email..." />
          </div>
          <div className="flex gap-2">
            {['', 'farmer', 'consumer', 'delivery', 'admin'].map(role => (
              <button key={role} onClick={() => setFilter(role)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === role ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50'}`}>
                {role || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <th className="text-left pb-3">Name</th>
            <th className="text-left pb-3">Email</th>
            <th className="text-left pb-3">Role</th>
            <th className="text-left pb-3">City</th>
            <th className="text-left pb-3">Phone</th>
            <th className="text-left pb-3">Joined</th>
            <th className="text-right pb-3">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map(u => (
              <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xs">{u.name[0]}</div>
                    <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="py-3"><span className={`badge capitalize ${u.role === 'farmer' ? 'badge-green' : u.role === 'admin' ? 'badge-blue' : u.role === 'delivery' ? 'badge-orange' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                <td className="py-3 text-gray-500">{u.city || '—'}</td>
                <td className="py-3 text-gray-500">{u.phone || '—'}</td>
                <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="py-3 text-right">
                  <button onClick={() => toggleUser(u._id)} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ml-auto transition-all ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {u.isActive ? <><FaToggleOn />Active</> : <><FaToggleOff />Inactive</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No users found</p>}
      </div>
    </div>
  );
}
