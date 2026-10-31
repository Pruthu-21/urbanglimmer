'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  Activity,
  Trash2,
} from 'lucide-react';
import { AuditLogEntry, getAuditLogs } from '@/lib/settingsStore';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    setLogs(getAuditLogs());
    const handleUpdate = () => setLogs(getAuditLogs());
    window.addEventListener('ug_audit_logs_updated', handleUpdate);
    return () => window.removeEventListener('ug_audit_logs_updated', handleUpdate);
  }, []);

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Staff Member', 'Action', 'Target', 'Details'];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.adminName.replace(/"/g, '""')}"`,
      l.action,
      `"${l.target.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UrbanGlimmer_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || l.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#211B1C] font-normal">Administrative Audit Trail</h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Immutable system event logs recording every staff action, stock adjustment, price change, and status transition.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-[#603A46] hover:bg-[#852F3A] text-white px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-[#C6A064]" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#E8DFD5] flex flex-col sm:flex-row items-center gap-4 justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#766D6D]" />
          <input
            type="text"
            placeholder="Search by staff, target, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#766D6D]" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="p-2 text-xs border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/40"
          >
            <option value="all">All Event Types</option>
            <option value="STATUS_UPDATE">Order Status Updates</option>
            <option value="INVENTORY">Inventory Adjustments</option>
            <option value="CAMPAIGN">Campaign & Modal Config</option>
            <option value="STAFF">Staff & Access Control</option>
            <option value="SETTINGS">Settings Changes</option>
            <option value="REVIEW">Review Moderation</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg border border-[#E8DFD5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F4EE] border-b border-[#E8DFD5] text-[#766D6D] uppercase text-[10px] tracking-wider font-bold">
              <th className="p-4">Timestamp (IST)</th>
              <th className="p-4">Staff Member</th>
              <th className="p-4">Action Event</th>
              <th className="p-4">Target Entity</th>
              <th className="p-4">Details & Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#766D6D]">
                  No audit logs matching this search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F8F4EE]/30 transition-colors">
                  <td className="p-4 text-[#766D6D] font-mono text-[11px] whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>

                  <td className="p-4 font-semibold text-[#211B1C] whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#603A46]" />
                      {entry.adminName}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#603A46]/10 text-[#603A46] border border-[#603A46]/20">
                      {entry.action}
                    </span>
                  </td>

                  <td className="p-4 font-medium text-[#211B1C]">
                    {entry.target}
                  </td>

                  <td className="p-4 text-[#766D6D] leading-relaxed max-w-md">
                    {entry.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
