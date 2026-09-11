import React, { useState } from 'react';
import { FilePlus2, X, Image as ImageIcon } from 'lucide-react';
import { User, TaskDiscipline, RfiItem, ProjectId, KanbanTask } from '../../types';

interface NewRfiModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentProjectId: ProjectId;
  tasks: KanbanTask[];
  onCreateRfi: (rfi: Omit<RfiItem, 'id' | 'createdAt'>) => void;
}

export const NewRfiModal: React.FC<NewRfiModalProps> = ({
  isOpen,
  onClose,
  users,
  currentProjectId,
  tasks,
  onCreateRfi,
}) => {
  const [subject, setSubject] = useState('');
  const [raisedBy, setRaisedBy] = useState(users[2]?.id || users[0]?.id || '');
  const [assigneeId, setAssigneeId] = useState(users[1]?.id || users[0]?.id || '');
  const [discipline, setDiscipline] = useState<TaskDiscipline>('機電MEP');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [linkedTaskId, setLinkedTaskId] = useState('');
  const [question, setQuestion] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  if (!isOpen) return null;

  const projectTasks = tasks.filter((t) => t.projectId === currentProjectId);

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
    if (!subject.trim() || !question.trim()) return;

    onCreateRfi({
      projectId: currentProjectId,
      subject: subject.trim(),
      discipline,
      raisedBy,
      assigneeId,
      deadline,
      question: question.trim(),
      image: imageBase64,
      status: '審查中',
      impactDays: 0,
      impactCost: 0,
      response: null,
      responseDate: null,
      linkedTaskId: linkedTaskId || null,
    });

    setSubject('');
    setQuestion('');
    setLinkedTaskId('');
    setImageBase64(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-xl overflow-hidden shadow-none font-mono">
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <FilePlus2 size={14} strokeWidth={2} />
            <span>ORIGINATE FORMAL RFI TRANSMITTAL</span>
          </h3>
          <button onClick={onClose} className="text-white hover:text-neutral-300 cursor-pointer font-bold">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-black font-bold uppercase mb-1">RFI CLARIFICATION SUBJECT *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.G. B2 SLAB SLEEVE PENETRATION CONFLICT RESOLUTION"
              className="w-full bg-white border-2 border-black p-2.5 text-black focus:outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-black font-bold uppercase mb-1">RAISED BY *</label>
              <select
                value={raisedBy}
                onChange={(e) => setRaisedBy(e.target.value)}
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
              <label className="block text-black font-bold uppercase mb-1">DESIGNATED SIGNATORY *</label>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <label className="block text-black font-bold uppercase mb-1">RESPONSE DEADLINE</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold uppercase mb-1">LINKED TASK (OPTIONAL)</label>
              <select
                value={linkedTaskId}
                onChange={(e) => setLinkedTaskId(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
              >
                <option value="">-- NONE --</option>
                {projectTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.title.slice(0, 14)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-1">QUESTION / INQUIRY PARTICULARS *</label>
            <textarea
              rows={3}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="State discrepancy against contract drawings, site constraints, or statutory conflicts..."
              className="w-full bg-white border-2 border-black p-2.5 text-black focus:outline-none placeholder:text-neutral-400"
            ></textarea>
          </div>

          {/* RFI Image Attachment */}
          <div>
            <label className="block text-black font-bold uppercase mb-1 flex items-center gap-1">
              <ImageIcon size={12} />
              ATTACH DRAWING EXCERPT / ANNOTATED MARKUP
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
                  alt="RFI Attachment Preview"
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
              DISPATCH RFI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
