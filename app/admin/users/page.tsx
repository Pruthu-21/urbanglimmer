'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  AdminUser,
  AdminRole,
  getStoredAdmins,
  saveStoredAdmins,
  getAdminSession,
} from '@/lib/customerStore';
import { logAdminAction } from '@/lib/settingsStore';

const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  'Super Admin': [
    'Full Master Control',
    'Staff & Role Authorization',
    'Financial Reports & GSTIN',
    'Catalog & Inventory CRUD',
    'Order Fulfillment & Refunds',
    'Campaigns & Discounts',
  ],
  'Store Manager': [
    'Order Fulfillment & Dispatch',
    'Promotional Campaigns & Banners',
    'Reviews & Moderation',
    'Customer Support Notes',
    'Inventory Adjustments',
  ],
  'Product Manager': [
    'Product Creation & Editing',
    'Inventory SKU Restock',
    'Categories & Collections',
    '3D GLB Model Association',
  ],
  'Order Manager': [
    'Order Status Transitions',
    'BlueDart AWB Tracking',
    'Shipping Address Inspection',
    'Customer Contact Records',
  ],
};

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('Store Manager');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAdmins(getStoredAdmins());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newStaff: AdminUser = {
      id: `ADM-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      lastLogin: 'Never',
    };

    const updated = [...admins, newStaff];
    setAdmins(updated);
    saveStoredAdmins(updated);

    const activeSession = getAdminSession();
    logAdminAction(
      activeSession?.name || 'Admin',
      'STAFF_CREATED',
      newStaff.email,
      `Assigned role ${newStaff.role}`
    );

    showToast(`Staff member ${newStaff.name} created!`);
    setIsAdding(false);
    setNewName('');
    setNewEmail('');
  };

  const handleRoleChange = (id: string, role: AdminRole) => {
    const updated = admins.map((a) => (a.id === id ? { ...a, role } : a));
    setAdmins(updated);
    saveStoredAdmins(updated);

    const target = admins.find((a) => a.id === id);
    const activeSession = getAdminSession();
    logAdminAction(
      activeSession?.name || 'Admin',
      'STAFF_ROLE_CHANGE',
      target?.email || id,
      `Updated role to ${role}`
    );

    showToast(`Role updated for ${target?.name}`);
    setEditingId(null);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (admins.length <= 1) {
      alert('Cannot delete the sole surviving administrator.');
      return;
    }
    if (!confirm(`Are you sure you want to revoke administrative access for ${name}?`)) return;

    const updated = admins.filter((a) => a.id !== id);
    setAdmins(updated);
    saveStoredAdmins(updated);

    const activeSession = getAdminSession();
    logAdminAction(
      activeSession?.name || 'Admin',
      'STAFF_DELETED',
      name,
      'Revoked admin credentials'
    );

    showToast(`Access revoked for ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/30 px-4 py-3 rounded-md shadow-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#211B1C] font-normal">Staff Accounts & Access Control (RBAC)</h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Manage authorized staff members, role tiers, and server-side permission capabilities.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#603A46] hover:bg-[#852F3A] text-white px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4 text-[#C6A064]" />
          <span>{isAdding ? 'Cancel' : 'Invite Staff Member'}</span>
        </button>
      </div>

      {/* Add Staff Form Modal / Card */}
      {isAdding && (
        <form onSubmit={handleAddAdmin} className="bg-white p-6 rounded-lg border border-[#C6A064]/40 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8DFD5]">
            <KeyRound className="w-4 h-4 text-[#603A46]" />
            <h3 className="font-serif text-sm font-semibold text-[#211B1C]">
              Grant Administrative Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Kashyap"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">Corporate Staff Email</label>
              <input
                type="email"
                required
                placeholder="priya@urbanglimmer.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              />
            </div>

            <div>
              <label className="font-semibold text-[#211B1C] block mb-1">Role Hierarchy</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full p-2.5 border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
              >
                <option value="Super Admin">Super Admin (All Privileges)</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Order Manager">Order Manager</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-[#766D6D] hover:text-[#211B1C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#603A46] hover:bg-[#852F3A] text-white font-semibold rounded-md shadow-xs"
            >
              Issue Credentials
            </button>
          </div>
        </form>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-lg border border-[#E8DFD5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F4EE] border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider font-bold">
              <th className="p-4">Staff Member</th>
              <th className="p-4">Role Tier</th>
              <th className="p-4">Last Authentication</th>
              <th className="p-4">Granted Permissions</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-[#F8F4EE]/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#603A46] text-[#C6A064] font-serif font-bold flex items-center justify-center border border-[#C6A064]/30">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#211B1C]">{admin.name}</p>
                      <p className="text-[11px] text-[#766D6D] font-mono">{admin.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  {editingId === admin.id ? (
                    <select
                      value={admin.role}
                      onChange={(e) => handleRoleChange(admin.id, e.target.value as AdminRole)}
                      className="p-1.5 border border-[#C6A064] rounded text-xs bg-white focus:outline-none"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Store Manager">Store Manager</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Order Manager">Order Manager</option>
                    </select>
                  ) : (
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                        admin.role === 'Super Admin'
                          ? 'bg-[#603A46]/10 text-[#603A46] border-[#603A46]/30'
                          : admin.role === 'Store Manager'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : admin.role === 'Product Manager'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {admin.role}
                    </span>
                  )}
                </td>

                <td className="p-4 text-[#766D6D] font-mono text-[11px]">
                  {admin.lastLogin}
                </td>

                <td className="p-4 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {ROLE_PERMISSIONS[admin.role]?.slice(0, 3).map((p, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-[#F8F4EE] border border-[#E8DFD5] text-[#211B1C] px-1.5 py-0.5 rounded"
                      >
                        {p}
                      </span>
                    ))}
                    {(ROLE_PERMISSIONS[admin.role]?.length || 0) > 3 && (
                      <span className="text-[9px] text-[#766D6D] self-center">
                        +{(ROLE_PERMISSIONS[admin.role]?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingId(editingId === admin.id ? null : admin.id)}
                      className="p-1.5 text-[#603A46] hover:bg-[#F8F4EE] rounded transition-colors"
                      title="Change Staff Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(admin.id, admin.name)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-[#F8F4EE] rounded transition-colors"
                      title="Revoke Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RBAC Role Capabilities Guide */}
      <div className="bg-white p-6 rounded-lg border border-[#E8DFD5] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8DFD5]">
          <ShieldCheck className="w-4 h-4 text-[#603A46]" />
          <h2 className="font-serif text-base font-semibold text-[#211B1C]">
            Role-Based Authorization Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(ROLE_PERMISSIONS) as AdminRole[]).map((r) => (
            <div key={r} className="p-4 rounded-lg bg-[#F8F4EE]/40 border border-[#E8DFD5] space-y-2">
              <span className="font-bold text-xs text-[#603A46] uppercase tracking-wider block">
                {r}
              </span>
              <ul className="space-y-1 text-[11px] text-[#766D6D]">
                {ROLE_PERMISSIONS[r].map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
