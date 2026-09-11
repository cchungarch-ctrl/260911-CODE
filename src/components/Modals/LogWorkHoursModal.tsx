import React, { useState } from 'react';
import { Timer, X } from 'lucide-react';
import { WorkLog, KanbanTask, User, ProjectId } from '../../types';

interface LogWorkHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: KanbanTask[];
  users: User[];
  currentProjectId: ProjectId;
  worklogs: WorkLog[];
  onCreateWorkLog: (log: Omit<WorkLog, 'id' | 'createdAt'>) => void;
}

export const LogWorkHoursModal: React.FC<LogWorkHoursModalProps> = ({
  isOpen,
  onClose,
  tasks,
  users,
  currentProjectId,
  worklogs,
  onCreateWorkLog,
}) => {
  const projectTasks = tasks.filter((t) => t.projectId === currentProjectId);
  const [taskId, setTaskId] = useState(projectTasks[0]?.id || '');
  const [userId, setUserId] = useState(users[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('8');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    const ot = parseFloat(overtimeHours || '0');
    if (!taskId) return;
    if (isNaN(h) || h <= 0) return;
    if (ot < 0) return;

    const selectedTask = tasks.find((t) => t.id === taskId);

    onCreateWorkLog({
      taskId,
      userId,
      projectId: selectedTask?.projectId || currentProjectId,
      date,
      hours: h,
      overtimeHours: isNaN(ot) ? 0 : ot,
      note: note.trim(),
    });

    setHours('8');
    setOvertimeHours('0');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-lg overflow-hidden shadow-none font-mono">
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Timer size={14} strokeWidth={2} />
            <span>LOG WORK HOURS / 工時填報</span>
          </h3>
          <button onClick={onClose} className="text-white hover:text-neutral-300 cursor-pointer font-bold">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {projectTasks.length === 0 && (
            <div className="border-2 border-black bg-neutral-50 p-3 text-black font-bold">
              目前專案尚無工作項目，請先建立任務再填報工時。
            </div>
          )}

          <div>
            <label className="block text-black font-bold uppercase mb-1">TASK / ACTIVITY *</label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none font-bold"
              disabled={projectTasks.length === 0}
            >
              <option value="">-- 請選擇任務 --</option>
              {projectTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} · {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-1">REPORTED BY / 填報人員 *</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none font-bold"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-black font-bold uppercase mb-1">DATE</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold uppercase mb-1">HOURS *</label>
              <input
                type="number"
                required
                min="0.5"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold uppercase mb-1">OVERTIME</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-1">WORK DESCRIPTION / NOTE</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.G. 12F REBAR TYING & INSPECTION..."
              className="w-full bg-white border-2 border-black p-2.5 text-black focus:outline-none placeholder:text-neutral-400"
            ></textarea>
          </div>

          <div className="text-[11px] text-neutral-500">
            已累計 {worklogs.length} 筆工時紀錄；單日工時上限 24 小時。
          </div>

          <div className="pt-3 border-t-2 border-black flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-black uppercase font-bold cursor-pointer transition-none"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={projectTasks.length === 0}
              className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold cursor-pointer transition-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              SAVE WORK LOG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};