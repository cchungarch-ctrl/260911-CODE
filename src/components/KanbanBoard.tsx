import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Link2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ImageIcon,
} from 'lucide-react';
import { KanbanTask, TaskStatus, User, ProjectId } from '../types';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  users: User[];
  currentProjectId: ProjectId;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectRfi: (rfiId: string) => void;
  onImageClick: (imgUrl: string, title: string) => void;
}

const COLUMNS: { key: TaskStatus; label: string; code: string }[] = [
  { key: 'backlog', label: '待處理事項 (BACKLOG)', code: 'COL-01' },
  { key: 'in_progress', label: '現場執行中 (IN PROGRESS)', code: 'COL-02' },
  { key: 'review', label: '簽核審查中 (REVIEW)', code: 'COL-03' },
  { key: 'done', label: '檢驗合格結案 (DONE)', code: 'COL-04' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  users,
  currentProjectId,
  onUpdateTaskStatus,
  onDeleteTask,
  onSelectRfi,
  onImageClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (task.projectId !== currentProjectId) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchId = task.id.toLowerCase().includes(q);
      const matchDesc = task.desc.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchDesc) return false;
    }
    if (assigneeFilter !== 'all' && task.assigneeId !== assigneeFilter) return false;
    if (disciplineFilter !== 'all' && task.discipline !== disciplineFilter) return false;
    return true;
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: TaskStatus) => {
    setDragOverCol(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTaskStatus(taskId, newStatus);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-black text-white border border-black';
      case 'medium':
        return 'bg-neutral-200 text-black border border-black';
      default:
        return 'bg-white text-black border border-black';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'backlog') return 'in_progress';
    if (current === 'in_progress') return 'review';
    if (current === 'review') return 'done';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'done') return 'review';
    if (current === 'review') return 'in_progress';
    if (current === 'in_progress') return 'backlog';
    return null;
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-white text-black font-body">
      {/* Header & Filter Controls */}
      <div className="mb-6 border-b-2 border-black pb-4 flex flex-wrap items-center justify-between gap-4 flex-none">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="relative">
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-2.5 text-black" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH BY ID, TITLE, OR SPEC..."
              className="bg-white text-xs text-black pl-8 pr-3 py-1.5 border-2 border-black focus:outline-none focus:border-b-4 w-56 sm:w-72 font-mono uppercase placeholder:text-neutral-400"
            />
          </div>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-white text-xs text-black border-2 border-black px-3 py-1.5 focus:outline-none font-mono font-bold cursor-pointer uppercase"
          >
            <option value="all">ALL PERSONNEL (全部人員)</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name.toUpperCase()} [{u.role.split('/')[0]}]
              </option>
            ))}
          </select>

          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            className="bg-white text-xs text-black border-2 border-black px-3 py-1.5 focus:outline-none font-mono font-bold cursor-pointer uppercase"
          >
            <option value="all">ALL DISCIPLINES (全工種)</option>
            <option value="結構工程">結構工程 (STRUCTURAL)</option>
            <option value="建築設計">建築設計 (ARCHITECTURAL)</option>
            <option value="機電MEP">機電工程 (MEP SERVICES)</option>
            <option value="現場施工">現場施工 (FIELD OPERATIONS)</option>
          </select>
        </div>

        {/* Priority Legend in Minimalist Typography */}
        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-black border border-black inline-block"></span>
            <span className="font-bold">CRITICAL</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-neutral-300 border border-black inline-block"></span>
            <span>STANDARD</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-white border border-black inline-block"></span>
            <span>ROUTINE</span>
          </div>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 min-h-0 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
          const isOver = dragOverCol === col.key;

          return (
            <div
              key={col.key}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`bg-white border-2 border-black flex flex-col h-full overflow-hidden transition-none min-w-[280px] ${
                isOver ? 'bg-neutral-100' : ''
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b-2 border-black flex items-center justify-between bg-neutral-50 flex-none font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-black inline-block"></span>
                  <h3 className="font-bold text-xs text-black tracking-widest uppercase">
                    {col.label}
                  </h3>
                </div>
                <span className="text-xs bg-black text-white px-2 py-0.5 font-mono font-bold">
                  {colTasks.length < 10 ? `0${colTasks.length}` : colTasks.length}
                </span>
              </div>

              {/* Tasks List Container */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3 bg-white">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-mono text-center p-4">
                    [ NO ACTIVE TASKS IN {col.code} ]
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = users.find((u) => u.id === task.assigneeId) || {
                      name: 'UNASSIGNED',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                    };
                    const badgeStyle = getPriorityBadge(task.priority);
                    const prevStatus = getPrevStatus(task.status);
                    const nextStatus = getNextStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-white border-2 border-black p-3 hover:bg-neutral-50 transition-none cursor-grab active:cursor-grabbing select-none relative group"
                      >
                        {/* Top ID & Priority & Actions */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                          <span className="bg-black text-white px-1.5 py-0.5 font-bold tracking-wider">
                            {task.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 border border-black text-black font-semibold text-[9px] uppercase">
                              {task.discipline}
                            </span>
                            <span className={`px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wider ${badgeStyle}`}>
                              {task.priority}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task.id);
                              }}
                              className="text-neutral-400 hover:text-black transition-none p-0.5 hover:bg-neutral-200 cursor-pointer"
                              title="刪除任務"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-display font-bold text-sm text-black mb-1 leading-snug tracking-tight">
                          {task.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed font-body">
                          {task.desc}
                        </p>

                        {/* Image Thumbnail (Square 0px grayscale) */}
                        {task.image && (
                          <div
                            onClick={() => onImageClick(task.image!, task.title)}
                            className="mb-3 border border-black relative group/img cursor-pointer max-h-28 overflow-hidden bg-neutral-100"
                          >
                            <img
                              src={task.image}
                              alt="現場查驗附圖"
                              className="w-full h-24 object-cover grayscale contrast-125 group-hover/img:grayscale-0 transition-none"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-none flex items-center justify-center gap-1 text-[11px] font-mono text-white">
                              <ImageIcon size={14} />
                              <span>INSPECT [PHOTO]</span>
                            </div>
                          </div>
                        )}

                        {/* Linked RFI Badge */}
                        {task.rfiId && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRfi(task.rfiId!);
                            }}
                            className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-neutral-100 text-black border border-black px-2 py-0.5 cursor-pointer hover:bg-black hover:text-white transition-none"
                            title="點擊切換並檢視此 RFI 簽核狀態"
                          >
                            <Link2 size={12} />
                            <span>LINKED: {task.rfiId}</span>
                          </div>
                        )}

                        {/* Assignee & Date & Shift */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 border border-black object-cover grayscale contrast-125"
                            />
                            <span className="text-black font-semibold text-[11px] truncate max-w-[80px]">
                              {assignee.name}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-500 flex items-center gap-1 text-[10px]">
                              <Calendar size={11} />
                              {task.duedate.slice(5)}
                            </span>

                            {/* Quick status shift buttons */}
                            <div className="flex items-center space-x-0.5">
                              {prevStatus && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, prevStatus)}
                                  className="p-1 border border-neutral-300 hover:border-black hover:bg-black hover:text-white text-black cursor-pointer transition-none"
                                  title="移回前一階段"
                                >
                                  <ArrowLeft size={11} />
                                </button>
                              )}
                              {nextStatus && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
                                  className="p-1 border border-neutral-300 hover:border-black hover:bg-black hover:text-white text-black cursor-pointer transition-none"
                                  title="移至下一階段"
                                >
                                  <ArrowRight size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
