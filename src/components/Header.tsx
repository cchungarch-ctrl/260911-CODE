import React from 'react';
import {
  Building2,
  Plus,
  FilePlus2,
  CalendarDays,
  Columns3,
  ClipboardList,
  Users,
  PieChart,
  Terminal,
  Code2,
} from 'lucide-react';
import { Project, ProjectId, TabType } from '../types';

interface HeaderProps {
  currentProject: ProjectId;
  projects: Project[];
  onSelectProject: (id: ProjectId) => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenNewTask: () => void;
  onOpenNewRfi: () => void;
  onOpenHtmlModal: () => void;
  pendingRfiCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  activeTab,
  onChangeTab,
  onOpenNewTask,
  onOpenNewRfi,
  onOpenHtmlModal,
  pendingRfiCount,
}) => {
  return (
    <header className="bg-white border-b-2 border-black flex-none z-20 text-black select-none transition-none">
      {/* Top Editorial Masthead Bar */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Architectural Title */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border-2 border-black bg-black text-white flex items-center justify-center font-display font-black text-base tracking-tighter">
            NP
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-black text-xl lg:text-2xl text-black tracking-tight">
                NEXUS / PM
              </h1>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-black bg-neutral-100 text-black">
                SPEC. V2.6
              </span>
            </div>
            <p className="font-body italic text-xs text-neutral-600 hidden sm:block">
              Architectural Project Schedule, Coordination & RFI Dispatches
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center flex-wrap gap-3 font-mono">
          {/* Project Selector */}
          <div className="bg-white border-2 border-black px-3.5 py-1.5 flex items-center space-x-2 text-xs">
            <Building2 size={15} strokeWidth={1.5} className="text-black" />
            <span className="text-neutral-500 uppercase tracking-widest text-[10px] hidden md:inline">
              PROJECT:
            </span>
            <select
              value={currentProject}
              onChange={(e) => onSelectProject(e.target.value as ProjectId)}
              className="bg-transparent text-black font-mono font-bold focus:outline-none cursor-pointer max-w-[180px] sm:max-w-[260px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-black font-mono">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-[2px] bg-black hidden sm:block"></div>

          {/* HTML Preview Button */}
          <button
            onClick={onOpenHtmlModal}
            className="bg-white hover:bg-black hover:text-white border-2 border-black text-black text-xs font-mono uppercase tracking-widest px-3.5 py-2 transition-none flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="查看或匯出獨立純 HTML5 預覽頁面"
          >
            <Code2 size={15} strokeWidth={1.5} />
            <span className="hidden md:inline">EXPORT HTML</span>
          </button>

          {/* New Task Button (Primary Button in Minimalist Monochrome: Pure Black, Invert on Hover) */}
          <button
            onClick={onOpenNewTask}
            className="bg-black hover:bg-white hover:text-black border-2 border-black text-white text-xs font-mono uppercase tracking-widest px-4 py-2 transition-none flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus size={15} strokeWidth={2} />
            <span>+ 建立任務</span>
          </button>

          {/* New RFI Button (Outline Button: Invert on Hover) */}
          <button
            onClick={onOpenNewRfi}
            className="bg-transparent hover:bg-black hover:text-white border-2 border-black text-black text-xs font-mono uppercase tracking-widest px-4 py-2 transition-none flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <FilePlus2 size={15} strokeWidth={1.5} />
            <span>+ 發起 RFI</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Architectural Grid Layout with 0px Radius) */}
      <div className="px-6 flex space-x-2 border-t-2 border-black bg-neutral-50 overflow-x-auto custom-scrollbar font-mono text-xs">
        <button
          onClick={() => onChangeTab('gantt')}
          className={`px-4 py-3 uppercase tracking-widest flex items-center gap-2 transition-none border-r border-l border-black whitespace-nowrap cursor-pointer ${
            activeTab === 'gantt'
              ? 'bg-black text-white font-bold border-b-0'
              : 'bg-white text-black hover:bg-neutral-200 border-b border-black'
          }`}
        >
          <CalendarDays size={16} strokeWidth={1.5} />
          <span>[01] 甘特時間軸 (GANTT)</span>
        </button>

        <button
          onClick={() => onChangeTab('kanban')}
          className={`px-4 py-3 uppercase tracking-widest flex items-center gap-2 transition-none border-r border-l border-black whitespace-nowrap cursor-pointer ${
            activeTab === 'kanban'
              ? 'bg-black text-white font-bold border-b-0'
              : 'bg-white text-black hover:bg-neutral-200 border-b border-black'
          }`}
        >
          <Columns3 size={16} strokeWidth={1.5} />
          <span>[02] 敏捷看板 (KANBAN)</span>
        </button>

        <button
          onClick={() => onChangeTab('rfi')}
          className={`px-4 py-3 uppercase tracking-widest flex items-center gap-2 transition-none border-r border-l border-black whitespace-nowrap cursor-pointer ${
            activeTab === 'rfi'
              ? 'bg-black text-white font-bold border-b-0'
              : 'bg-white text-black hover:bg-neutral-200 border-b border-black'
          }`}
        >
          <ClipboardList size={16} strokeWidth={1.5} />
          <span>[03] RFI 簽核清冊</span>
          {pendingRfiCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 border ${
              activeTab === 'rfi' ? 'bg-white text-black border-black font-bold' : 'bg-black text-white border-black'
            }`}>
              {pendingRfiCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onChangeTab('analytics')}
          className={`px-4 py-3 uppercase tracking-widest flex items-center gap-2 transition-none border-r border-l border-black whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-black text-white font-bold border-b-0'
              : 'bg-white text-black hover:bg-neutral-200 border-b border-black'
          }`}
        >
          <PieChart size={16} strokeWidth={1.5} />
          <span>[04] 專案圖表 (ANALYTICS)</span>
        </button>

        <button
          onClick={() => onChangeTab('users')}
          className={`px-4 py-3 uppercase tracking-widest flex items-center gap-2 transition-none border-r border-l border-black whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-black text-white font-bold border-b-0'
              : 'bg-white text-black hover:bg-neutral-200 border-b border-black'
          }`}
        >
          <Users size={16} strokeWidth={1.5} />
          <span>[05] 團隊名冊 (TEAM)</span>
        </button>

        <button
          onClick={() => onChangeTab('api')}
          className={`px-4 py-3 uppercase tracking-widest flex items-center gap-2 transition-none border-r border-l border-black whitespace-nowrap cursor-pointer ${
            activeTab === 'api'
              ? 'bg-black text-white font-bold border-b-0'
              : 'bg-white text-black hover:bg-neutral-200 border-b border-black'
          }`}
        >
          <Terminal size={16} strokeWidth={1.5} />
          <span>[06] REST API 控制台</span>
        </button>
      </div>
    </header>
  );
};
