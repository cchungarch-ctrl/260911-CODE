import React, { useState, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Filter,
  User as UserIcon,
  Layers,
  ExternalLink,
  Trash2,
  X,
} from 'lucide-react';
import { KanbanTask, User, ProjectId, TaskStatus, TaskDiscipline } from '../types';

interface GanttChartProps {
  tasks: KanbanTask[];
  users: User[];
  currentProjectId: ProjectId;
  onUpdateTask: (task: KanbanTask) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTask: () => void;
  onSelectRfi?: (rfiId: string) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  users,
  currentProjectId,
  onUpdateTask,
  onDeleteTask,
  onOpenNewTask,
  onSelectRfi,
}) => {
  const [baseDate, setBaseDate] = useState<Date>(new Date(2026, 8, 8)); // 2026-09-08
  const totalDays = 17; // 8 through 24
  const todayDateStr = '2026-09-16'; // Day 16 is today

  const [groupBy, setGroupBy] = useState<'assignee' | 'discipline'>('assignee');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('all');
  const [hoveredTask, setHoveredTask] = useState<KanbanTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [dragState, setDragState] = useState<{
    task: KanbanTask;
    type: 'move' | 'resize-left' | 'resize-right';
    startX: number;
    initialStartDay: number;
    initialEndDay: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const list = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dayNum = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayOfWeek = d.getDay();
      const isSunday = dayOfWeek === 0;
      const isToday = dateStr === todayDateStr;

      list.push({
        date: d,
        dayNum,
        dateStr,
        isSunday,
        isToday,
        dayOfWeek,
      });
    }
    return list;
  }, [baseDate, totalDays]);

  const projectTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesProject = t.projectId === currentProjectId;
      const matchesDiscipline = filterDiscipline === 'all' || t.discipline === filterDiscipline;
      return matchesProject && matchesDiscipline;
    });
  }, [tasks, currentProjectId, filterDiscipline]);

  const groupedRows = useMemo(() => {
    if (groupBy === 'assignee') {
      return users.map((user) => {
        const userTasks = projectTasks.filter((t) => t.assigneeId === user.id);
        return {
          id: user.id,
          title: user.name,
          subtitle: user.role,
          avatar: user.avatar,
          user,
          tasks: userTasks,
        };
      }).filter((row) => row.tasks.length > 0 || currentProjectId === 'PRJ-TEAM');
    } else {
      const disciplines: TaskDiscipline[] = ['結構工程', '建築設計', '機電MEP', '現場施工'];
      return disciplines.map((disc) => {
        const discTasks = projectTasks.filter((t) => t.discipline === disc);
        return {
          id: disc,
          title: disc,
          subtitle: `${discTasks.length} 項任務`,
          avatar: null,
          user: null,
          tasks: discTasks,
        };
      });
    }
  }, [groupBy, users, projectTasks, currentProjectId]);

  const timelineStart = days[0].date.getTime();
  const timelineEnd = days[days.length - 1].date.getTime() + 24 * 60 * 60 * 1000;
  const totalDuration = timelineEnd - timelineStart;

  const getTaskBarCoords = (task: KanbanTask) => {
    const start = task.startDate ? new Date(task.startDate).getTime() : new Date(task.createdAt).getTime();
    const end = new Date(task.duedate).getTime() + 24 * 60 * 60 * 1000;

    const leftPercent = Math.max(0, Math.min(100, ((start - timelineStart) / totalDuration) * 100));
    const rightPercent = Math.max(0, Math.min(100, ((end - timelineStart) / totalDuration) * 100));
    const widthPercent = Math.max(3, rightPercent - leftPercent);

    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  // Minimalist Monochrome task bar visual differentiation
  const getTaskStyle = (task: KanbanTask) => {
    switch (task.discipline) {
      case '建築設計':
        return 'bg-black text-white border-2 border-black hover:bg-neutral-800';
      case '結構工程':
        return 'bg-white text-black border-2 border-black hover:bg-neutral-100';
      case '機電MEP':
        return 'bg-neutral-200 text-black border-2 border-black hover:bg-neutral-300';
      case '現場施工':
        return 'bg-neutral-900 text-white border-2 border-black hover:bg-black';
      default:
        return 'bg-white text-black border-2 border-black';
    }
  };

  const handleShiftDate = (daysCount: number) => {
    setBaseDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + daysCount);
      return next;
    });
  };

  const handleResetToToday = () => {
    setBaseDate(new Date(2026, 8, 8));
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    task: KanbanTask,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const start = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
    const end = new Date(task.duedate);

    setDragState({
      task,
      type,
      startX: e.clientX,
      initialStartDay: start.getDate(),
      initialEndDay: end.getDate(),
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState || !containerRef.current) return;

    const dx = e.clientX - dragState.startX;
    const dayWidth = containerRef.current.clientWidth / totalDays;
    const daysShift = Math.round(dx / dayWidth);

    if (daysShift === 0) return;

    const currentTask = dragState.task;
    const baseStart = new Date(currentTask.startDate || currentTask.createdAt);
    const baseEnd = new Date(currentTask.duedate);

    if (dragState.type === 'move') {
      const newStart = new Date(baseStart);
      newStart.setDate(dragState.initialStartDay + daysShift);
      const newEnd = new Date(baseEnd);
      newEnd.setDate(dragState.initialEndDay + daysShift);

      const startStr = newStart.toISOString().split('T')[0];
      const endStr = newEnd.toISOString().split('T')[0];

      onUpdateTask({
        ...currentTask,
        startDate: startStr,
        duedate: endStr,
      });
    } else if (dragState.type === 'resize-left') {
      const newStart = new Date(baseStart);
      newStart.setDate(dragState.initialStartDay + daysShift);
      if (newStart <= baseEnd) {
        onUpdateTask({
          ...currentTask,
          startDate: newStart.toISOString().split('T')[0],
        });
      }
    } else if (dragState.type === 'resize-right') {
      const newEnd = new Date(baseEnd);
      newEnd.setDate(dragState.initialEndDay + daysShift);
      if (newEnd >= baseStart) {
        onUpdateTask({
          ...currentTask,
          duedate: newEnd.toISOString().split('T')[0],
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (dragState) {
      setDragState(null);
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-white text-black select-none overflow-hidden font-body"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Editorial Header / Controls */}
      <div className="px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-black flex-none bg-white">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-display font-black text-black tracking-tight">
              TIMELINE / SCHEDULE
            </h2>
            <span className="font-mono text-xs px-2.5 py-0.5 border border-black bg-black text-white uppercase tracking-widest">
              GANTT MATRIX
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-500 mt-0.5 tracking-wider">
            WINDOW: 2026.09.08 — 2026.09.24 · 17-DAY ARCHITECTURAL CYCLE
          </p>
        </div>

        {/* View Switchers & Minimalist Controls */}
        <div className="flex items-center flex-wrap gap-3 font-mono text-xs">
          {/* Grouping switcher */}
          <div className="flex items-center border-2 border-black bg-white">
            <button
              onClick={() => setGroupBy('assignee')}
              className={`px-3 py-1.5 transition-none cursor-pointer flex items-center gap-1.5 uppercase tracking-widest ${
                groupBy === 'assignee' ? 'bg-black text-white font-bold' : 'text-black hover:bg-neutral-100'
              }`}
            >
              <UserIcon size={14} strokeWidth={1.5} />
              <span>依成員</span>
            </button>
            <div className="w-[2px] h-full bg-black"></div>
            <button
              onClick={() => setGroupBy('discipline')}
              className={`px-3 py-1.5 transition-none cursor-pointer flex items-center gap-1.5 uppercase tracking-widest ${
                groupBy === 'discipline' ? 'bg-black text-white font-bold' : 'text-black hover:bg-neutral-100'
              }`}
            >
              <Layers size={14} strokeWidth={1.5} />
              <span>依專業工種</span>
            </button>
          </div>

          {/* Discipline filter */}
          <div className="flex items-center border-2 border-black px-3 py-1.5 bg-white">
            <Filter size={14} strokeWidth={1.5} className="mr-2 text-black" />
            <select
              value={filterDiscipline}
              onChange={(e) => setFilterDiscipline(e.target.value)}
              className="bg-transparent text-black font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">全部專業 (ALL DISCIPLINES)</option>
              <option value="結構工程">結構工程 (STRUCTURE)</option>
              <option value="建築設計">建築設計 (ARCHITECTURE)</option>
              <option value="機電MEP">機電工程 (MEP SERVICES)</option>
              <option value="現場施工">現場施工 (SITE OPS)</option>
            </select>
          </div>

          {/* Date range navigators */}
          <div className="flex items-center border-2 border-black bg-white">
            <button
              onClick={() => handleShiftDate(-7)}
              className="p-1.5 hover:bg-black hover:text-white transition-none cursor-pointer text-black"
              title="往前 7 天"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleResetToToday}
              className="px-3 py-1 text-xs font-mono font-bold hover:bg-black hover:text-white transition-none cursor-pointer text-black border-r border-l border-black flex items-center gap-1.5"
            >
              <Calendar size={13} strokeWidth={1.5} />
              <span>TODAY [16]</span>
            </button>
            <button
              onClick={() => handleShiftDate(7)}
              className="p-1.5 hover:bg-black hover:text-white transition-none cursor-pointer text-black"
              title="往後 7 天"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={onOpenNewTask}
            className="bg-black hover:bg-white hover:text-black text-white text-xs font-mono font-bold px-4 py-2 border-2 border-black transition-none flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={2} />
            <span>+ 新增排程</span>
          </button>
        </div>
      </div>

      {/* Main Gantt Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
        {/* Timeline Header (Days across top) */}
        <div className="flex items-center border-b-2 border-black bg-neutral-50 h-14 flex-none select-none px-6 font-mono text-xs">
          {/* Left spacer for avatar / entity column */}
          <div className="w-20 flex-none font-bold text-black uppercase tracking-widest text-center border-r-2 border-black h-full flex items-center justify-center">
            {groupBy === 'assignee' ? 'MEMBER' : 'DISCIPLINE'}
          </div>

          {/* Day Columns Header */}
          <div
            className="flex-1 grid h-full text-center relative"
            style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}
          >
            {days.map((day) => (
              <div
                key={day.dateStr}
                className={`h-full flex flex-col items-center justify-center relative border-r border-neutral-300 ${
                  day.isSunday ? 'bg-neutral-100' : ''
                }`}
              >
                {day.isToday ? (
                  <div className="flex flex-col items-center relative z-20">
                    <div className="w-7 h-7 bg-black text-white font-mono font-bold text-xs flex items-center justify-center border border-black shadow-none">
                      {day.dayNum}
                    </div>
                  </div>
                ) : (
                  <div className="text-black font-semibold text-xs font-mono">{day.dayNum}</div>
                )}

                {day.isSunday && (
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono mt-0.5">
                    SUN
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows Body */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden relative px-6 divide-y border-b border-black"
          ref={containerRef}
        >
          {/* Today vertical bold black line passing through the whole height of the chart! */}
          {days.some((d) => d.isToday) && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-20"
              style={{
                left: `calc(5rem + (100% - 5rem) * (${days.findIndex((d) => d.isToday) + 0.5} / ${totalDays}))`,
              }}
            >
              <div className="w-[2px] h-full bg-black"></div>
            </div>
          )}

          {/* Background vertical column lines */}
          <div
            className="absolute inset-0 pl-20 pointer-events-none grid h-full"
            style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}
          >
            {days.map((d) => (
              <div
                key={`bg-col-${d.dateStr}`}
                className={`border-r border-neutral-200 h-full ${d.isSunday ? 'bg-neutral-50/70' : ''}`}
              />
            ))}
          </div>

          {/* Render each grouped row */}
          {groupedRows.map((row) => (
            <div
              key={row.id}
              className="flex items-center min-h-[76px] py-2 relative hover:bg-neutral-50 transition-none group"
            >
              {/* Left Column Avatar or Category Icon (Sharp Square & Grayscale) */}
              <div className="w-20 flex-none flex flex-col items-center justify-center z-10 pr-3 border-r-2 border-black h-full">
                {row.avatar ? (
                  <div
                    className="w-11 h-11 border-2 border-black overflow-hidden cursor-pointer hover:border-neutral-600 transition-none"
                    title={`${row.title} — ${row.subtitle}`}
                  >
                    <img
                      src={row.avatar}
                      alt={row.title}
                      className="w-full h-full object-cover grayscale contrast-125"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 border-2 border-black bg-neutral-100 text-black flex items-center justify-center font-mono font-bold text-xs">
                    {row.title.substring(0, 2)}
                  </div>
                )}
                <span className="font-mono text-[10px] text-black font-semibold mt-1 truncate max-w-[70px] text-center">
                  {row.title}
                </span>
              </div>

              {/* Timeline Track for this row */}
              <div className="flex-1 h-14 relative flex items-center pl-2">
                {row.tasks.map((task) => {
                  const coords = getTaskBarCoords(task);
                  const styleClass = getTaskStyle(task);

                  return (
                    <div
                      key={task.id}
                      style={{
                        left: coords.left,
                        width: coords.width,
                      }}
                      className={`absolute h-10 flex items-center justify-between px-3 cursor-pointer transition-none select-none z-10 ${styleClass}`}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsEditModalOpen(true);
                      }}
                      onMouseEnter={() => setHoveredTask(task)}
                      onMouseLeave={() => setHoveredTask(null)}
                      onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                    >
                      {/* Left resize handle */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/20"
                        onMouseDown={(e) => handleMouseDown(e, task, 'resize-left')}
                        title="拖曳以縮短或提前開始日"
                      >
                        <div className="w-[1px] h-5 bg-current"></div>
                      </div>

                      {/* Pill Title Text */}
                      <span className="font-mono text-xs font-bold truncate flex-1 text-center select-none px-2 uppercase tracking-wide">
                        {task.title}
                      </span>

                      {/* Square Progress Marker (0px radius) */}
                      <div
                        className="w-4 h-4 border border-current flex items-center justify-center font-mono text-[9px] font-bold flex-none ml-1"
                        title={`進度: ${task.progress || 50}%`}
                      >
                        {task.progress || 50}
                      </div>

                      {/* Right resize handle */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/20"
                        onMouseDown={(e) => handleMouseDown(e, task, 'resize-right')}
                        title="拖曳以延長或延後截止日"
                      >
                        <div className="w-[1px] h-5 bg-current"></div>
                      </div>

                      {/* Linked RFI badge */}
                      {task.rfiId && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectRfi) onSelectRfi(task.rfiId!);
                          }}
                          className="absolute -top-2.5 right-2 bg-black text-white text-[9px] font-mono font-bold px-1.5 py-0.2 border border-white cursor-pointer hover:bg-neutral-800 flex items-center gap-0.5"
                          title="關聯 RFI 待簽核圖說，點擊查看"
                        >
                          RFI
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* If row has no tasks */}
                {row.tasks.length === 0 && (
                  <div className="w-full flex items-center justify-center text-xs font-mono text-neutral-400 italic">
                    [ NO ACTIVE TASKS SCHEDULED IN THIS PERIOD ]
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Tooltip when hovering over a task */}
        {hoveredTask && (
          <div className="fixed bottom-6 left-28 z-40 bg-black text-white text-xs px-5 py-3 border-2 border-white flex items-center gap-5 font-mono shadow-none animate-none">
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-white inline-block"></span>
                <span>{hoveredTask.title}</span>
                <span className="text-[10px] text-neutral-400 border border-neutral-700 px-1">
                  {hoveredTask.discipline}
                </span>
              </div>
              <div className="text-neutral-400 text-xs mt-1 flex items-center gap-3">
                <span>
                  {hoveredTask.startDate || hoveredTask.createdAt} → {hoveredTask.duedate}
                </span>
                <span>|</span>
                <span className="text-white">
                  OWNER: {users.find((u) => u.id === hoveredTask.assigneeId)?.name || 'UNASSIGNED'}
                </span>
                <span>|</span>
                <span className="text-white font-bold">PROGRESS: {hoveredTask.progress || 50}%</span>
              </div>
            </div>
            <div className="text-[11px] text-neutral-400 border-l border-neutral-700 pl-4 uppercase tracking-wider">
              CLICK TO EDIT · DRAG TO SHIFT
            </div>
          </div>
        )}
      </div>

      {/* Task Quick Detail / Edit Modal (Sharp 0px Borders & Monograph Styling) */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-none">
          <div className="bg-white border-4 border-black max-w-lg w-full overflow-hidden text-black font-body shadow-none">
            {/* Modal Header */}
            <div className="p-5 border-b-2 border-black flex items-center justify-between bg-neutral-100">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-3 h-3 bg-black"></div>
                <h3 className="font-display font-black text-lg text-black tracking-tight">
                  SCHEDULE SPECIFICATION
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedTask(null);
                }}
                className="p-1 border border-black hover:bg-black hover:text-white transition-none cursor-pointer"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-black mb-1.5">
                  TASK NAME (任務名稱)
                </label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border-2 border-black text-sm text-black font-mono focus:border-b-4 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-black mb-1.5">
                    START DATE (起始)
                  </label>
                  <input
                    type="date"
                    value={selectedTask.startDate || selectedTask.createdAt}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black text-sm text-black font-mono focus:border-b-4 focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-black mb-1.5">
                    DUE DATE (期限)
                  </label>
                  <input
                    type="date"
                    value={selectedTask.duedate}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, duedate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black text-sm text-black font-mono focus:border-b-4 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-black mb-1.5">
                    ASSIGNEE (主辦)
                  </label>
                  <select
                    value={selectedTask.assigneeId}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, assigneeId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black text-sm text-black font-mono focus:border-b-4 focus:outline-none cursor-pointer"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} [{u.role}]
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-black mb-1.5">
                    STATUS (進度狀態)
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border-2 border-black text-sm text-black font-mono focus:border-b-4 focus:outline-none cursor-pointer"
                  >
                    <option value="backlog">待處理 [BACKLOG]</option>
                    <option value="in_progress">進行中 [IN PROGRESS]</option>
                    <option value="review">簽核審查 [REVIEW]</option>
                    <option value="done">已竣工 [DONE]</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs uppercase tracking-widest font-bold text-black">
                    COMPLETION PROGRESS (完成度)
                  </label>
                  <span className="font-mono font-bold text-sm">{selectedTask.progress || 50}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedTask.progress || 50}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      progress: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-black mb-1.5">
                  SCOPE NOTES (說明與施工備註)
                </label>
                <textarea
                  rows={3}
                  value={selectedTask.desc}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, desc: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border-2 border-black text-sm text-black font-body focus:border-b-4 focus:outline-none"
                />
              </div>

              {selectedTask.rfiId && (
                <div className="border-2 border-black p-3 flex items-center justify-between bg-neutral-100 font-mono">
                  <div className="flex items-center gap-2 text-xs text-black">
                    <span className="font-bold">[ RFI LINKED ]</span>
                    <span>{selectedTask.rfiId}</span>
                  </div>
                  {onSelectRfi && (
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        onSelectRfi(selectedTask.rfiId!);
                      }}
                      className="text-xs text-black font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      VIEW RFI <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-black flex items-center justify-between bg-neutral-100 font-mono text-xs">
              <button
                onClick={() => {
                  onDeleteTask(selectedTask.id);
                  setIsEditModalOpen(false);
                  setSelectedTask(null);
                }}
                className="px-3 py-2 text-black hover:bg-black hover:text-white border border-black font-medium transition-none cursor-pointer flex items-center gap-1.5 uppercase"
              >
                <Trash2 size={14} />
                刪除任務
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="px-4 py-2 font-mono uppercase tracking-wider text-black border border-black hover:bg-neutral-200 transition-none cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    onUpdateTask(selectedTask);
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="px-5 py-2 font-mono font-bold uppercase tracking-widest text-white bg-black hover:bg-white hover:text-black border-2 border-black transition-none cursor-pointer"
                >
                  SAVE SPECIFICATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
