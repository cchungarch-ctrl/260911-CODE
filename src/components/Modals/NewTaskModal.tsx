import React, { useState } from 'react';
import { SquarePlus, Paperclip, X } from 'lucide-react';
import { User, TaskDiscipline, TaskPriority, KanbanTask, ProjectId } from '../../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentProjectId: ProjectId;
  onCreateTask: (task: Omit<KanbanTask, 'id' | 'createdAt'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  users,
  currentProjectId,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState<TaskDiscipline>('結構工程');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState(users[0]?.id || '');
  const [startDate, setStartDate] = useState('2026-09-10');
  const [duedate, setDuedate] = useState('2026-09-18');
  const [desc, setDesc] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImageBase64(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      projectId: currentProjectId,
      title: title.trim(),
      discipline,
      priority,
      status: 'backlog',
      assigneeId: assigneeId || users[0]?.id || 'usr_1',
      startDate,
      duedate,
      desc: desc.trim(),
      image: imageBase64,
      rfiId: null,
      progress: 0,
    });

    setTitle('');
    setDesc('');
    setImageBase64(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-lg overflow-hidden shadow-none font-mono">
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <SquarePlus size={14} strokeWidth={2} />
            <span>CREATE WORK PACKAGE / TASK</span>
          </h3>
          <button onClick={onClose} className="text-white hover:text-neutral-300 cursor-pointer font-bold">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-black font-bold uppercase mb-1">TASK TITLE / ACTIVITY *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.G. 12F COLUMN REBAR TYING & INSPECTION"
              className="w-full bg-white border-2 border-black p-2.5 text-black focus:outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-black font-bold uppercase mb-1">DISCIPLINE</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as TaskDiscipline)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none uppercase font-bold"
              >
                <option value="結構工程">STRUCTURAL</option>
                <option value="建築設計">ARCHITECTURAL</option>
                <option value="機電MEP">MEP SERVICES</option>
                <option value="現場施工">CIVIL / SITE</option>
              </select>
            </div>
            <div>
              <label className="block text-black font-bold uppercase mb-1">PRIORITY LEVEL</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none uppercase font-bold"
              >
                <option value="high">HIGH CRITICAL</option>
                <option value="medium">MEDIUM STANDARD</option>
                <option value="low">LOW ROUTINE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-black font-bold uppercase mb-1">ASSIGNEE</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none font-bold"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-black font-bold uppercase mb-1">START DATE</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold uppercase mb-1">DUE DATE</label>
              <input
                type="date"
                required
                value={duedate}
                onChange={(e) => setDuedate(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-1">SPECIFICATION / NOTES</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Specify structural codes, tolerances, and milestone criteria..."
              className="w-full bg-white border-2 border-black p-2.5 text-black focus:outline-none placeholder:text-neutral-400"
            ></textarea>
          </div>

          {/* Attachment / Image Upload Input */}
          <div>
            <label className="block text-black font-bold uppercase mb-1 flex items-center gap-1">
              <Paperclip size={12} />
              ATTACH SITE PHOTO / DRAWING SPEC
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-white border-2 border-black p-1.5 text-black text-xs file:mr-3 file:py-1 file:px-3 file:border-2 file:border-black file:text-xs file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
            />
            {imageBase64 && (
              <div className="mt-2 relative border-2 border-black inline-block">
                <img
                  src={imageBase64}
                  alt="Task Preview"
                  className="max-h-32 object-cover grayscale contrast-125"
                />
                <button
                  type="button"
                  onClick={() => setImageBase64(null)}
                  className="absolute top-1 right-1 bg-black text-white p-1 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            )}
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
              className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold cursor-pointer transition-none"
            >
              CREATE TASK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
