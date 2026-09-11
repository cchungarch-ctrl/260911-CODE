import React from 'react';
import {
  CalendarDays,
  Columns3,
  ClipboardList,
  Users,
  PieChart,
  Terminal,
  Code2,
  UserPlus,
  Search,
  HelpCircle,
} from 'lucide-react';
import { TabType, User } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  pendingRfiCount: number;
  currentUser: User;
  onOpenHtmlModal: () => void;
  onOpenNewTask: () => void;
  onOpenNewRfi: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  pendingRfiCount,
  currentUser,
  onOpenHtmlModal,
}) => {
  return (
    <aside className="w-[70px] flex-none bg-black text-white flex flex-col items-center py-5 border-r-2 border-black select-none z-30 transition-none font-mono">
      {/* Top Architectural Monogram Logo */}
      <div
        className="w-11 h-11 border-2 border-white flex items-center justify-center cursor-pointer mb-6 transition-none hover:bg-white hover:text-black group"
        title="Nexus Architectural Project Management"
      >
        <span className="font-display font-black text-lg tracking-tighter">N</span>
      </div>

      {/* Primary Navigation Buttons */}
      <div className="flex flex-col items-center space-y-2 w-full px-2">
        {/* Gantt Timeline */}
        <button
          onClick={() => onChangeTab('gantt')}
          className={`w-11 h-11 border flex items-center justify-center transition-none cursor-pointer relative group ${
            activeTab === 'gantt'
              ? 'bg-white text-black border-white'
              : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900'
          }`}
          title="甘特排程 [01]"
        >
          <CalendarDays size={20} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            01. 甘特排程 (Timeline)
          </span>
        </button>

        {/* Kanban Board */}
        <button
          onClick={() => onChangeTab('kanban')}
          className={`w-11 h-11 border flex items-center justify-center transition-none cursor-pointer relative group ${
            activeTab === 'kanban'
              ? 'bg-white text-black border-white'
              : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900'
          }`}
          title="工作看板 [02]"
        >
          <Columns3 size={20} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            02. 工作看板 (Kanban)
          </span>
        </button>

        {/* RFI Tracker */}
        <button
          onClick={() => onChangeTab('rfi')}
          className={`w-11 h-11 border flex items-center justify-center transition-none cursor-pointer relative group ${
            activeTab === 'rfi'
              ? 'bg-white text-black border-white'
              : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900'
          }`}
          title="RFI 簽核 [03]"
        >
          <ClipboardList size={20} strokeWidth={1.5} />
          {pendingRfiCount > 0 && (
            <span className="absolute top-1 right-1 bg-white text-black text-[9px] font-bold px-1 border border-black">
              {pendingRfiCount}
            </span>
          )}
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            03. RFI 追蹤 [{pendingRfiCount} 待簽]
          </span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => onChangeTab('analytics')}
          className={`w-11 h-11 border flex items-center justify-center transition-none cursor-pointer relative group ${
            activeTab === 'analytics'
              ? 'bg-white text-black border-white'
              : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900'
          }`}
          title="專案指標 [04]"
        >
          <PieChart size={20} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            04. 專案指標 (Analytics)
          </span>
        </button>

        {/* Team Members */}
        <button
          onClick={() => onChangeTab('users')}
          className={`w-11 h-11 border flex items-center justify-center transition-none cursor-pointer relative group ${
            activeTab === 'users'
              ? 'bg-white text-black border-white'
              : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900'
          }`}
          title="團隊成員 [05]"
        >
          <Users size={20} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            05. 團隊花名冊 (Directory)
          </span>
        </button>

        <div className="w-8 h-[1px] bg-neutral-800 my-2" />

        {/* REST API Console */}
        <button
          onClick={() => onChangeTab('api')}
          className={`w-11 h-11 border flex items-center justify-center transition-none cursor-pointer relative group ${
            activeTab === 'api'
              ? 'bg-white text-black border-white'
              : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900'
          }`}
          title="API 控制台 [06]"
        >
          <Terminal size={20} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            06. REST API 終端 (Console)
          </span>
        </button>

        {/* HTML Preview */}
        <button
          onClick={onOpenHtmlModal}
          className="w-11 h-11 border border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900 flex items-center justify-center transition-none cursor-pointer relative group"
          title="HTML 獨立單檔"
        >
          <Code2 size={20} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            HTML 獨立輸出 (Export)
          </span>
        </button>
      </div>

      <div className="flex-1" />

      {/* Bottom Utility Actions */}
      <div className="flex flex-col items-center space-y-2 w-full px-2">
        <button
          onClick={() => onChangeTab('users')}
          className="w-10 h-10 border border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-none cursor-pointer relative group"
          title="指派與權限"
        >
          <UserPlus size={18} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            成員授權
          </span>
        </button>

        <button
          onClick={() => onChangeTab('gantt')}
          className="w-10 h-10 border border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-none cursor-pointer relative group"
          title="排程查閱"
        >
          <Search size={18} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            檢索排程
          </span>
        </button>

        <button
          className="w-10 h-10 border border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-none cursor-pointer relative group"
          title="指南"
        >
          <HelpCircle size={18} strokeWidth={1.5} />
          <span className="absolute left-16 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1.5 border border-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-none z-50">
            系統規範說明
          </span>
        </button>

        {/* User Portrait (Sharp Square & Grayscale) */}
        <div
          className="mt-2 w-10 h-10 border-2 border-white overflow-hidden cursor-pointer hover:border-neutral-300 transition-none bg-neutral-900"
          title={`${currentUser.name} — ${currentUser.role}`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </aside>
  );
};
