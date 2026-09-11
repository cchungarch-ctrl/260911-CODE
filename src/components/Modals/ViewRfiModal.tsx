import React, { useState, useEffect } from 'react';
import {
  X,
  CircleHelp,
  CheckCircle,
  Reply,
  PenTool,
  AlertTriangle,
  Calendar,
  Link2,
} from 'lucide-react';
import { RfiItem, User, RfiStatus } from '../../types';

interface ViewRfiModalProps {
  rfi: RfiItem | null;
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSubmitResponse: (
    rfiId: string,
    status: RfiStatus,
    replyText: string,
    impactDays: number,
    impactCost: number
  ) => void;
  onImageClick: (imgUrl: string, title: string) => void;
  onJumpToTask?: (taskId: string) => void;
}

export const ViewRfiModal: React.FC<ViewRfiModalProps> = ({
  rfi,
  isOpen,
  onClose,
  users,
  onSubmitResponse,
  onImageClick,
  onJumpToTask,
}) => {
  const [replyText, setReplyText] = useState('');
  const [impactDays, setImpactDays] = useState(0);
  const [impactCost, setImpactCost] = useState(0);

  useEffect(() => {
    if (rfi) {
      setReplyText(rfi.response || '');
      setImpactDays(rfi.impactDays || 0);
      setImpactCost(rfi.impactCost || 0);
    }
  }, [rfi]);

  if (!isOpen || !rfi) return null;

  const raisedUser = users.find((u) => u.id === rfi.raisedBy) || {
    name: 'UNASSIGNED ORIGINATOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  };
  const assigneeUser = users.find((u) => u.id === rfi.assigneeId) || {
    name: 'UNASSIGNED SIGNATORY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  };

  const handleAction = (status: RfiStatus) => {
    if (!replyText.trim()) {
      alert('請填寫簽核審查意見 (Review determination required)');
      return;
    }
    onSubmitResponse(rfi.id, status, replyText.trim(), impactDays, impactCost);
    onClose();
  };

  const getStatusBadge = (st: RfiStatus) => {
    switch (st) {
      case '已回覆':
        return 'bg-black text-white border-2 border-black';
      case '審查中':
        return 'bg-neutral-200 text-black border-2 border-black';
      case '待處理':
        return 'bg-white text-black border-2 border-black';
      case '已駁回':
        return 'bg-black text-white line-through border-2 border-black';
      default:
        return 'bg-neutral-100 text-black border border-black';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-white border-2 border-black w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-none">
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white flex-none">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white text-black px-2 py-0.5">
                {rfi.id}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold ${getStatusBadge(rfi.status)}`}>
                {rfi.status}
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-white mt-1 uppercase tracking-tight">{rfi.subject}</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-neutral-300 cursor-pointer font-bold">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs font-mono text-black">
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-50 p-3 border-2 border-black">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">DISCIPLINE</span>
              <span className="font-bold text-black uppercase">{rfi.discipline}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">ORIGINATOR</span>
              <span className="font-bold text-black uppercase">{raisedUser.name}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">SIGNATORY</span>
              <span className="font-bold text-black uppercase">{assigneeUser.name}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">DUE DATE</span>
              <span className="font-bold text-black flex items-center gap-1 font-mono">
                <Calendar size={11} />
                {rfi.deadline}
              </span>
            </div>
          </div>

          {/* Linked Task Link */}
          {rfi.linkedTaskId && (
            <div className="p-3 border-2 border-black bg-white flex items-center justify-between">
              <span className="text-black flex items-center gap-1.5 text-xs uppercase font-bold">
                <Link2 size={13} />
                LINKED WORK TASK: <strong className="font-mono underline">{rfi.linkedTaskId}</strong>
              </span>
              {onJumpToTask && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpToTask(rfi.linkedTaskId!);
                  }}
                  className="text-xs bg-black text-white hover:bg-neutral-800 px-2.5 py-1 uppercase font-bold cursor-pointer transition-none"
                >
                  GOTO TASK →
                </button>
              )}
            </div>
          )}

          {/* Original Question Box */}
          <div className="p-4 border-2 border-black bg-white space-y-2">
            <h4 className="font-bold text-black flex items-center gap-2 uppercase tracking-wide">
              <CircleHelp size={14} />
              SUBMITTED QUERY & SPECIFICATION DISCREPANCY
            </h4>
            <p className="text-neutral-800 font-body leading-relaxed whitespace-pre-wrap">{rfi.question}</p>

            {rfi.image && (
              <div className="mt-3">
                <p className="text-[10px] text-neutral-500 mb-1 uppercase font-mono">
                  ATTACHED FIELD DRAWING / MARKUP (CLICK TO EXPAND):
                </p>
                <div
                  onClick={() => onImageClick(rfi.image!, rfi.subject)}
                  className="relative group cursor-pointer inline-block border-2 border-black"
                >
                  <img
                    src={rfi.image}
                    alt="RFI attachment"
                    className="max-h-40 object-contain grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs uppercase tracking-widest font-mono">
                    EXPAND SPEC
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Architectural Response Log */}
          <div className="space-y-2">
            <h4 className="font-bold text-black flex items-center gap-2 uppercase tracking-wide">
              <Reply size={14} />
              SIGNATORY / PROFESSIONAL ENGINEER DETERMINATION
            </h4>
            <div className="p-4 border-2 border-black bg-neutral-50 space-y-2">
              {rfi.response ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-mono border-b border-black pb-2">
                    <span className="font-bold text-black flex items-center gap-1 uppercase">
                      <CheckCircle size={13} />
                      {assigneeUser.name} DETERMINATION:
                    </span>
                    <span className="font-mono text-neutral-500">{rfi.responseDate || 'SIGNED OFF'}</span>
                  </div>
                  <p className="text-black font-body leading-relaxed">{rfi.response}</p>
                  {(rfi.impactCost > 0 || rfi.impactDays > 0) && (
                    <div className="mt-2 text-xs border border-black bg-black text-white p-2.5 flex items-center gap-2">
                      <AlertTriangle size={14} className="flex-none" />
                      <span className="font-mono uppercase">
                        CONTRACT VARIATION: AMOUNT <strong>+NT$ {rfi.impactCost.toLocaleString()}</strong> / SCHEDULE EXTENSION <strong>+{rfi.impactDays} DAYS</strong>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-neutral-500 italic py-2 uppercase">
                  // PENDING DETERMINATION BY ASSIGNED PROFESSIONAL ENGINEER...
                </div>
              )}
            </div>
          </div>

          {/* Official Sign-off Action Form */}
          <div className="p-4 border-2 border-black bg-white space-y-3">
            <h4 className="font-bold text-xs uppercase text-black flex items-center gap-1.5 tracking-wider">
              <PenTool size={13} />
              TRANSMIT OFFICIAL ARCHITECTURAL / STRUCTURAL ENDORSEMENT
            </h4>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="State structural approval conditions, revised sheet numbers, or technical rectifications..."
              className="w-full bg-white border-2 border-black p-2.5 text-black focus:outline-none text-xs"
            ></textarea>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-black block mb-1 uppercase font-bold">SCHEDULE IMPACT (DAYS)</label>
                <input
                  type="number"
                  min="0"
                  value={impactDays}
                  onChange={(e) => setImpactDays(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border-2 border-black p-2 text-black"
                />
              </div>
              <div>
                <label className="text-black block mb-1 uppercase font-bold">VARIATION COST (NTD)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={impactCost}
                  onChange={(e) => setImpactCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border-2 border-black p-2 text-black"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t-2 border-black">
              <button
                type="button"
                onClick={() => handleAction('已駁回')}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-black uppercase font-bold cursor-pointer transition-none"
              >
                REJECT / 駁回
              </button>
              <button
                type="button"
                onClick={() => handleAction('已回覆')}
                className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold cursor-pointer transition-none"
              >
                APPROVE & SIGN-OFF / 核定答覆
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
