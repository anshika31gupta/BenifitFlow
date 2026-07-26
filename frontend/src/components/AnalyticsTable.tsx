import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit3, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CreditCard, 
  Mail, 
  User as UserIcon,
  Sparkles,
  Loader2
} from 'lucide-react';
import { AdminUser, CardType, UserBenefitStatus, INITIAL_MOCK_USERS } from '../data/mockUsers';
import { StatusBadge } from './StatusBadge';

const CARD_TYPES: CardType[] = [
  'Amex Centurion',
  'Visa Signature',
  'Visa Infinite',
  'Mastercard World Elite',
  'HDFC Infinia',
  'ICICI Emeralde',
  'Axis Magnus',
  'Chase Sapphire Reserve',
];

const BENEFIT_STATUSES: UserBenefitStatus[] = [
  'Active',
  'Dormant',
  'Claimed',
  'Detected Not Claimed',
];

type SortField = 'name' | 'lastLogin' | 'benefitStatus';
type SortOrder = 'asc' | 'desc';

export const AnalyticsTable: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('lastLogin');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Inline edit state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ cardType: CardType; benefitStatus: UserBenefitStatus }>({
    cardType: 'HDFC Infinia',
    benefitStatus: 'Active',
  });

  // Simulate API loading on mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setUsers(INITIAL_MOCK_USERS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Search
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.cardType.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (selectedFilter === 'Active Users') matchesFilter = u.benefitStatus === 'Active';
      else if (selectedFilter === 'Dormant Users') matchesFilter = u.benefitStatus === 'Dormant';
      else if (selectedFilter === 'Claimed') matchesFilter = u.benefitStatus === 'Claimed';
      else if (selectedFilter === 'Detected Not Claimed') matchesFilter = u.benefitStatus === 'Detected Not Claimed';

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, selectedFilter]);

  // Sort
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'lastLogin') {
        comparison = a.lastLogin.localeCompare(b.lastLogin);
      } else if (sortField === 'benefitStatus') {
        comparison = a.benefitStatus.localeCompare(b.benefitStatus);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredUsers, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage]);

  const handleStartEdit = (user: AdminUser) => {
    setEditingUserId(user.id);
    setEditForm({
      cardType: user.cardType,
      benefitStatus: user.benefitStatus,
    });
  };

  const handleSaveEdit = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              cardType: editForm.cardType,
              benefitStatus: editForm.benefitStatus,
            }
          : u
      )
    );
    setEditingUserId(null);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  return (
    <div className="space-y-6">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>User Protection & Portfolio Directory</span>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              {filteredUsers.length} Users Found
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time user benefit statuses, card portfolios, and active engagement metrics.
          </p>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
          className="self-start sm:self-auto bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-medium px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Search Bar & Filter Chips */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-white/10">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by user name, email, or card type..."
            className="w-full bg-[#09090b]/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1 flex-shrink-0" />
          {['All', 'Active Users', 'Dormant Users', 'Claimed', 'Detected Not Claimed'].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSelectedFilter(chip);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex-shrink-0 ${
                selectedFilter === chip
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Avatar</th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>User Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Card Type</th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('lastLogin')}>
                  <div className="flex items-center gap-1">
                    <span>Last Login</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('benefitStatus')}>
                  <div className="flex items-center gap-1">
                    <span>Benefit Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs">
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-white/10 rounded w-28 mb-1" />
                      <div className="h-3 bg-white/5 rounded w-16" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-white/10 rounded w-36" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 bg-white/10 rounded-lg w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-white/10 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 bg-white/10 rounded-full w-24" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-6 bg-white/10 rounded w-12 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                    <UserIcon className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-bold text-sm">No matching users found</p>
                    <p className="text-xs text-slate-500">Try refining your search or active quick filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isEditing = editingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-600/10 transition-colors group"
                    >
                      {/* Avatar */}
                      <td className="py-4 px-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          <div className="w-full h-full bg-[#131315] rounded-full flex items-center justify-center font-mono font-bold text-blue-300 text-xs">
                            {user.avatar}
                          </div>
                        </div>
                      </td>

                      {/* User Name */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          ID: {user.id} • Joined {user.joinDate}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Card Type (Inline editable) */}
                      <td className="py-4 px-4">
                        {isEditing ? (
                          <select
                            value={editForm.cardType}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, cardType: e.target.value as CardType }))
                            }
                            className="bg-[#09090b] text-slate-200 border border-blue-500/50 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none"
                          >
                            {CARD_TYPES.map((c) => (
                              <option key={c} value={c} className="bg-[#09090b] text-slate-200">
                                {c}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-mono text-slate-300 text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit">
                            <CreditCard className="w-3 h-3 text-purple-400" />
                            {user.cardType}
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                        {user.lastLogin}
                      </td>

                      {/* Benefit Status (Inline editable) */}
                      <td className="py-4 px-4">
                        {isEditing ? (
                          <select
                            value={editForm.benefitStatus}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                benefitStatus: e.target.value as UserBenefitStatus,
                              }))
                            }
                            className="bg-[#09090b] text-slate-200 border border-blue-500/50 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none"
                          >
                            {BENEFIT_STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-[#09090b] text-slate-200">
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={user.benefitStatus} />
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(user.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-all"
                              title="Save changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 transition-all"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-white/10 transition-all flex items-center gap-1 ml-auto font-mono text-[11px]"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && sortedUsers.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedUsers.length)} to{' '}
              {Math.min(currentPage * pageSize, sortedUsers.length)} of {sortedUsers.length} users
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
