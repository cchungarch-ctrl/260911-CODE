import React, { useState } from 'react';
import { UserPlus, Mail, ShieldCheck, CheckSquare, FileQuestion } from 'lucide-react';
import { User, KanbanTask, RfiItem } from '../types';

interface UsersViewProps {
  users: User[];
  tasks: KanbanTask[];
  rfis: RfiItem[];
  onAddUser: (user: Omit<User, 'id'>) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, tasks, rfis, onAddUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    onAddUser({
      name,
      role,
      title: title || 'ENGINEERING CONSULTANT',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      email: email || `${name.toLowerCase()}@nexuspm.com`,
    });

    setName('');
    setRole('');
    setTitle('');
    setEmail('');
    setIsModalOpen(false);
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-y-auto bg-white text-black font-body">
      {/* Editorial Title */}
      <div className="mb-6 border-b-2 border-black pb-4 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-black uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck size={26} strokeWidth={2} />
            <span>PROJECT ROSTER & GOVERNANCE</span>
          </h2>
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-1">
            AUTHORIZED SIGNATORIES · SITE ENGINEERS · ARCHITECTURAL DIRECTORS
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-white hover:text-black text-white text-xs font-mono font-bold px-4 py-2 border-2 border-black transition-none flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
        >
          <UserPlus size={14} strokeWidth={2} />
          <span>+ ADD TEAM MEMBER</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((u) => {
          const assignedTasks = tasks.filter((t) => t.assigneeId === u.id).length;
          const assignedRfis = rfis.filter((r) => r.assigneeId === u.id).length;

          return (
            <div
              key={u.id}
              className="bg-white border-2 border-black p-5 flex flex-col items-center text-center relative group hover:bg-neutral-50 transition-none"
            >
              <div className="relative mb-4">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-20 h-20 border-2 border-black object-cover grayscale contrast-125"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-black border-2 border-white inline-block"></span>
              </div>

              <h4 className="font-display font-bold text-lg text-black tracking-tight">{u.name}</h4>
              <span className="font-mono text-xs font-bold text-black border border-black px-2 py-0.5 mt-1 uppercase">
                {u.role}
              </span>
              <span className="text-xs text-neutral-500 font-mono mt-1 mb-3">{u.title}</span>

              <div className="text-[11px] font-mono text-neutral-600 flex items-center gap-1 mb-5">
                <Mail size={12} />
                <span className="truncate max-w-[180px]">{u.email}</span>
              </div>

              <div className="w-full pt-3 border-t-2 border-black grid grid-cols-2 gap-2 text-xs mt-auto font-mono">
                <div className="p-2 border border-black bg-neutral-50 text-center">
                  <span className="text-neutral-500 block text-[9px] uppercase flex items-center justify-center gap-1">
                    <CheckSquare size={10} />
                    TASKS
                  </span>
                  <span className="font-bold text-black text-sm font-mono">{assignedTasks}</span>
                </div>
                <div className="p-2 border border-black bg-neutral-50 text-center">
                  <span className="text-neutral-500 block text-[9px] uppercase flex items-center justify-center gap-1">
                    <FileQuestion size={10} />
                    RFIS
                  </span>
                  <span className="font-bold text-black text-sm font-mono">{assignedRfis}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black w-full max-w-md overflow-hidden shadow-none font-mono">
            <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
              <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <UserPlus size={14} strokeWidth={2} />
                <span>ENROLL TEAM PERSONNEL</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-neutral-300 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-black font-bold uppercase mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.G. WANG TA-MING"
                  className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none uppercase placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-black font-bold uppercase mb-1">DESIGNATION / ROLE *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="E.G. STRUCTURAL PE / MEP LEAD"
                  className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none uppercase placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-black font-bold uppercase mb-1">ORGANIZATION / AFFILIATION</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.G. TAIWAN STRUCTURAL CONSULTANTS"
                  className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none uppercase placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-black font-bold uppercase mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none placeholder:text-neutral-400"
                />
              </div>

              <div className="pt-3 border-t-2 border-black flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-black uppercase font-bold cursor-pointer transition-none"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 uppercase font-bold cursor-pointer transition-none"
                >
                  ENROLL MEMBER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
