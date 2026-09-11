import React, { useState } from 'react';
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  Coins,
  Plus,
  Eye,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { RfiItem, RfiStatus, User, ProjectId } from '../types';

interface RfiTrackerProps {
  rfis: RfiItem[];
  users: User[];
  currentProjectId: ProjectId;
  onOpenNewRfi: () => void;
  onOpenViewRfi: (rfiId: string) => void;
}

export const RfiTracker: React.FC<RfiTrackerProps> = ({
  rfis,
  users,
  currentProjectId,
  onOpenNewRfi,
  onOpenViewRfi,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | RfiStatus>('all');

  const projectRfis = rfis.filter((r) => r.projectId === currentProjectId);

  const filteredRfis = projectRfis.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const totalCount = projectRfis.length;
  const pendingCount = projectRfis.filter((r) => r.status === '審查中' || r.status === '待處理').length;
  const approvedCount = projectRfis.filter((r) => r.status === '已回覆').length;
  const totalCostImpact = projectRfis.reduce((acc, curr) => acc + (curr.impactCost || 0), 0);

  const getStatusBadge = (status: RfiStatus) => {
    switch (status) {
      case '已回覆':
        return 'bg-black text-white border border-black';
      case '審查中':
        return 'bg-neutral-200 text-black border border-black';
      case '待處理':
        return 'bg-white text-black border border-black';
      case '已駁回':
        return 'bg-black text-white line-through border border-black';
      default:
        return 'bg-neutral-100 text-black border border-black';
    }
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-y-auto bg-white text-black font-body">
      {/* Editorial Title Bar */}
      <div className="mb-6 border-b-2 border-black pb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-black">
            REQUEST FOR INFORMATION
          </h2>
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-1">
            ARCHITECTURAL SPECIFICATION & SUBMITTAL LEDGER · {currentProjectId}
          </p>
        </div>

        <button
          onClick={onOpenNewRfi}
          className="bg-black hover:bg-white hover:text-black text-white text-xs font-mono font-bold px-4 py-2 border-2 border-black transition-none flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
        >
          <Plus size={14} strokeWidth={2} />
          <span>+ ISSUE NEW RFI</span>
        </button>
      </div>

      {/* Inverted Monochrome Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-black text-white border-2 border-black p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest">TOTAL LOGS</span>
            <FolderOpen size={16} strokeWidth={1.5} />
          </div>
          <h4 className="text-3xl font-display font-black font-mono tracking-tight">{totalCount}</h4>
          <span className="font-mono text-[10px] text-neutral-400 mt-2 uppercase">ALL SUBMITTALS IN SCOPE</span>
        </div>

        <div className="bg-white text-black border-2 border-black p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest">AWAITING REVIEW</span>
            <Clock size={16} strokeWidth={1.5} />
          </div>
          <h4 className="text-3xl font-display font-black font-mono tracking-tight">{pendingCount}</h4>
          <span className="font-mono text-[10px] text-neutral-500 mt-2 uppercase">ARCHITECT / ENGR SIGN-OFF</span>
        </div>

        <div className="bg-black text-white border-2 border-black p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest">ENDORSED / RESOLVED</span>
            <CheckCircle2 size={16} strokeWidth={1.5} />
          </div>
          <h4 className="text-3xl font-display font-black font-mono tracking-tight">{approvedCount}</h4>
          <span className="font-mono text-[10px] text-neutral-400 mt-2 uppercase">VERIFIED TECHNICAL SOLUTIONS</span>
        </div>

        <div className="bg-white text-black border-2 border-black p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest">VARIATION ESTIMATE</span>
            <Coins size={16} strokeWidth={1.5} />
          </div>
          <h4 className="text-2xl font-display font-black font-mono tracking-tight">
            NT$ {totalCostImpact.toLocaleString()}
          </h4>
          <span className="font-mono text-[10px] text-neutral-500 mt-2 uppercase">CONTRACT COST IMPACT</span>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="border-2 border-black bg-white">
        {/* Table Filter & Subheader */}
        <div className="p-4 border-b-2 border-black flex flex-wrap items-center justify-between gap-3 bg-neutral-50 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black inline-block"></span>
            <span className="font-bold uppercase tracking-wider">OFFICIAL TRANSMITTAL REGISTER</span>
            <span className="text-neutral-400">({filteredRfis.length} RECORDS)</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-bold">STATUS FILTER:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | RfiStatus)}
              className="bg-white text-xs text-black border-2 border-black px-3 py-1 font-mono font-bold focus:outline-none cursor-pointer uppercase"
            >
              <option value="all">ALL STATUSES (全部狀態)</option>
              <option value="待處理">待處理 (OPEN)</option>
              <option value="審查中">審查中 (IN REVIEW)</option>
              <option value="已回覆">已回覆 (APPROVED)</option>
              <option value="已駁回">已駁回 (REJECTED)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-100 text-black uppercase border-b-2 border-black font-mono font-bold">
                <th className="py-3 px-4">RFI #</th>
                <th className="py-3 px-4 min-w-[240px]">SUBJECT & TECHNICAL QUERY</th>
                <th className="py-3 px-4">DISCIPLINE</th>
                <th className="py-3 px-4">ISSUED BY</th>
                <th className="py-3 px-4">RECIPIENT</th>
                <th className="py-3 px-4">DUE DATE</th>
                <th className="py-3 px-4">IMPACT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-black">
              {filteredRfis.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400 font-mono text-xs">
                    [ NO RFI RECORDS CORRESPONDING TO CURRENT FILTER ]
                  </td>
                </tr>
              ) : (
                filteredRfis.map((rfi) => {
                  const raisedUser = users.find((u) => u.id === rfi.raisedBy) || {
                    name: 'UNKNOWN',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                  };
                  const assigneeUser = users.find((u) => u.id === rfi.assigneeId) || {
                    name: 'UNASSIGNED',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
                  };

                  return (
                    <tr
                      key={rfi.id}
                      className="hover:bg-neutral-50 transition-none border-b border-neutral-200"
                    >
                      <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                        {rfi.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-display font-bold text-sm text-black line-clamp-1">{rfi.subject}</div>
                        <div className="text-neutral-500 text-xs line-clamp-1 mt-0.5 font-body">{rfi.question}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="border border-black px-1.5 py-0.5 uppercase">
                          {rfi.discipline}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <img
                            src={raisedUser.avatar}
                            alt={raisedUser.name}
                            className="w-4 h-4 border border-black object-cover grayscale"
                          />
                          <span>{raisedUser.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <img
                            src={assigneeUser.avatar}
                            alt={assigneeUser.name}
                            className="w-4 h-4 border border-black object-cover grayscale"
                          />
                          <span>{assigneeUser.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {rfi.deadline}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        {rfi.impactCost > 0 || rfi.impactDays > 0 ? (
                          <div className="font-bold text-black flex items-center gap-1">
                            <AlertTriangle size={12} />
                            {rfi.impactDays > 0 && <span>+{rfi.impactDays}D </span>}
                            {rfi.impactCost > 0 && <span>+${rfi.impactCost.toLocaleString()}</span>}
                          </div>
                        ) : (
                          <span className="text-neutral-400">NONE</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                            rfi.status
                          )}`}
                        >
                          {rfi.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onOpenViewRfi(rfi.id)}
                          className="bg-white hover:bg-black hover:text-white text-black border-2 border-black px-3 py-1 font-mono font-bold text-[10px] uppercase transition-none flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>REVIEW</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
