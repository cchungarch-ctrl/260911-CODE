import React, { useEffect, useState } from 'react';
import { Settings2, X } from 'lucide-react';
import { User, UserRate } from '../../types';

interface EditUserRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  userRates: UserRate[];
  onUpdateUserRate: (rate: UserRate) => void;
}

export const EditUserRateModal: React.FC<EditUserRateModalProps> = ({
  isOpen,
  onClose,
  users,
  userRates,
  onUpdateUserRate,
}) => {
  const [userId, setUserId] = useState(users[0]?.id || '');
  const [hourlyRate, setHourlyRate] = useState('900');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');

  useEffect(() => {
    if (isOpen && users.length > 0) {
      const first = users[0].id;
      setUserId(first);
      const existing = userRates.find((r) => r.userId === first);
      setHourlyRate(String(existing?.hourlyRate ?? 900));
      setOvertimeMultiplier(String(existing?.overtimeMultiplier ?? 1.5));
    }
  }, [isOpen, users, userRates]);

  if (!isOpen) return null;

  const handleUserChange = (id: string) => {
    setUserId(id);
    const existing = userRates.find((r) => r.userId === id);
    setHourlyRate(String(existing?.hourlyRate ?? 900));
    setOvertimeMultiplier(String(existing?.overtimeMultiplier ?? 1.5));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(hourlyRate);
    const mult = parseFloat(overtimeMultiplier);
    if (!userId || isNaN(rate) || rate <= 0) return;

    onUpdateUserRate({
      userId,
      hourlyRate: rate,
      overtimeMultiplier: isNaN(mult) || mult < 1 ? 1 : mult,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-md overflow-hidden shadow-none font-mono">
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Settings2 size={14} strokeWidth={2} />
            <span>SET HOURLY RATE / 費率設定</span>
          </h3>
          <button onClick={onClose} className="text-white hover:text-neutral-300 cursor-pointer font-bold">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-black font-bold uppercase mb-1">PERSONNEL *</label>
            <select
              value={userId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none font-bold"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-1">HOURLY RATE (NTD / HR) *</label>
            <input
              type="number"
              required
              min="1"
              step="50"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-1">OVERTIME MULTIPLIER</label>
            <input
              type="number"
              min="1"
              max="4"
              step="0.1"
              value={overtimeMultiplier}
              onChange={(e) => setOvertimeMultiplier(e.target.value)}
              className="w-full bg-white border-2 border-black p-2 text-black focus:outline-none"
            />
          </div>

          <div className="text-[11px] text-neutral-500">
            加班費 = 加班時數 × 時薪 × 倍數；未設定之成員將使用預設費率 NT$ 900/hr。
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
              SAVE RATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};