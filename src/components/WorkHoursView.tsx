import React, { useMemo, useState } from 'react';
import {
  Clock,
  Timer,
  Users,
  Coins,
  Plus,
  Settings2,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { WorkLog, UserRate, User, KanbanTask, ProjectId } from '../types';

interface WorkHoursViewProps {
  worklogs: WorkLog[];
  userRates: UserRate[];
  tasks: KanbanTask[];
  users: User[];
  currentProjectId: ProjectId;
  onOpenLogModal: () => void;
  onOpenRateModal: () => void;
  onDeleteWorkLog: (id: string) => void;
}

export const WorkHoursView: React.FC<WorkHoursViewProps> = ({
  worklogs,
  userRates,
  tasks,
  users,
  currentProjectId,
  onOpenLogModal,
  onOpenRateModal,
  onDeleteWorkLog,
}) => {
  const [filterDiscipline, setFilterDiscipline] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');

  const projectTasks = tasks.filter((t) => t.projectId === currentProjectId);
  const projectWorklogs = worklogs.filter((w) => w.projectId === currentProjectId);

  const rateOf = (userId: string): UserRate => {
    const found = userRates.find((r) => r.userId === userId);
    return found || { userId, hourlyRate: 900, overtimeMultiplier: 1.5 };
  };

  const totalEstimatedHours = useMemo(
    () => projectTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0),
    [projectTasks]
  );

  const stats = useMemo(() => {
    return users.map((u) => {
      const logs = projectWorklogs.filter((w) => w.userId === u.id);
      const hours = logs.reduce((acc, w) => acc + (w.hours || 0), 0);
      const overtimeHours = logs.reduce((acc, w) => acc + (w.overtimeHours || 0), 0);
      const rate = rateOf(u.id);
      const rawCost = hours * rate.hourlyRate;
      const overtimeCost = overtimeHours * rate.hourlyRate * rate.overtimeMultiplier;
      const totalCost = rawCost + overtimeCost;
      const logsCount = logs.length;
      return {
        user: u,
        hours,
        overtimeHours,
        rawCost,
        overtimeCost,
        totalCost,
        logsCount,
        rate,
      };
    });
  }, [users, projectWorklogs, userRates]);

  const totalHours = stats.reduce((acc, s) => acc + s.hours, 0);
  const totalOvertime = stats.reduce((acc, s) => acc + s.overtimeHours, 0);
  const totalCost = stats.reduce((acc, s) => acc + s.totalCost, 0);

  const disciplineStats = useMemo(() => {
    const disciplines = ['結構工程', '建築設計', '機電MEP', '現場施工'] as const;
    return disciplines.map((disc) => {
      const discTaskIds = new Set(
        projectTasks.filter((t) => t.discipline === disc).map((t) => t.id)
      );
      const logs = projectWorklogs.filter((w) => discTaskIds.has(w.taskId));
      const hours = logs.reduce((acc, w) => acc + (w.hours || 0), 0);
      const overtimeHours = logs.reduce((acc, w) => acc + (w.overtimeHours || 0), 0);
      let cost = 0;
      logs.forEach((w) => {
        const r = rateOf(w.userId);
        cost += (w.hours || 0) * r.hourlyRate;
        cost += (w.overtimeHours || 0) * r.hourlyRate * r.overtimeMultiplier;
      });
      return { name: disc, hours, overtimeHours, cost, taskCount: discTaskIds.size };
    });
  }, [projectTasks, projectWorklogs, userRates]);

  const monthlyStats = useMemo(() => {
    const map = new Map<string, { hours: number; overtimeHours: number; cost: number; count: number }>();
    projectWorklogs.forEach((w) => {
      const month = w.date.slice(0, 7);
      const r = rateOf(w.userId);
      const entry = map.get(month) || { hours: 0, overtimeHours: 0, cost: 0, count: 0 };
      entry.hours += w.hours || 0;
      entry.overtimeHours += w.overtimeHours || 0;
      entry.cost += (w.hours || 0) * r.hourlyRate;
      entry.cost += (w.overtimeHours || 0) * r.hourlyRate * r.overtimeMultiplier;
      entry.count += 1;
      map.set(month, entry);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, v]) => ({ month, ...v }));
  }, [projectWorklogs, userRates]);

  const filteredLogs = projectWorklogs.filter((w) => {
    if (filterDiscipline !== 'all') {
      const task = tasks.find((t) => t.id === w.taskId);
      if (!task || task.discipline !== filterDiscipline) return false;
    }
    if (filterUser !== 'all' && w.userId !== filterUser) return false;
    return true;
  });

  const userNameOf = (id: string) => users.find((u) => u.id === id)?.name || id;
  const taskNameOf = (id: string) => tasks.find((t) => t.id === id)?.title || id;
  const sortedLogs = useMemo(
    () => [...filteredLogs].sort((a, b) => b.date.localeCompare(a.date)),
    [filteredLogs]
  );

  const varianceHours = totalEstimatedHours - totalHours;
  const variancePct =
    totalEstimatedHours > 0
      ? Math.round(((totalHours - totalEstimatedHours) / totalEstimatedHours) * 100)
      : 0;

  return (
    <div className="h-full p-6 lg:p-8 overflow-y-auto bg-white text-black font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="border-b-2 border-black pb-4 flex flex-wrap justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-display font-black text-black uppercase tracking-tight flex items-center gap-3">
              <Clock size={26} strokeWidth={2} />
              <span>WORK HOURS & LABOR COST</span>
            </h2>
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-1">
              TIME SHEET LOGGING · WORKFORCE UTILIZATION · LABOR COST SHADOW
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenRateModal}
              className="bg-transparent hover:bg-black hover:text-white text-black text-xs font-mono font-bold px-4 py-2 border-2 border-black transition-none flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
            >
              <Settings2 size={14} strokeWidth={1.5} />
              <span>費率設定</span>
            </button>
            <button
              onClick={onOpenLogModal}
              className="bg-black hover:bg-white hover:text-black text-white text-xs font-mono font-bold px-4 py-2 border-2 border-black transition-none flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
            >
              <Plus size={14} strokeWidth={2} />
              <span>+ 填報工時</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Hours */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h3 className="font-mono text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <Timer size={14} strokeWidth={2} />
                <span>TOTAL MAN-HOURS</span>
              </h3>
              <span className="font-mono font-bold text-xs bg-black text-white px-2 py-0.5">
                {projectWorklogs.length} LOGS
              </span>
            </div>
            <div className="text-center py-2">
              <span className="text-5xl font-display font-black font-mono tracking-tight block">
                {totalHours.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-neutral-500 block mt-2 uppercase tracking-widest">
                HOURS · 含加班 {totalOvertime.toFixed(1)} HR
              </span>
            </div>
            <div className="mt-4 text-xs font-mono border-2 border-black bg-neutral-50 p-3">
              <div className="flex justify-between mb-1">
                <span className="text-neutral-600 uppercase">ESTIMATED BASELINE</span>
                <span className="font-bold">{totalEstimatedHours.toFixed(0)} HR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 uppercase">VARIANCE</span>
                <span className={`font-bold ${varianceHours <= 0 ? 'text-black' : 'text-black'}`}>
                  {varianceHours >= 0 ? '+' : ''}
                  {varianceHours.toFixed(0)} HR ({variancePct >= 0 ? '+' : ''}
                  {variancePct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Labor Cost (Inverted Black Card) */}
          <div className="bg-black text-white border-2 border-black p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3 mb-4 font-mono text-xs">
              <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
                <Coins size={14} strokeWidth={2} />
                <span>TOTAL LABOR COST</span>
              </h3>
              <span className="border border-white px-2 py-0.5 font-bold text-[10px]">
                NTD / HR
              </span>
            </div>
            <div className="text-center py-2">
              <span className="text-4xl font-display font-black font-mono tracking-tight block">
                NT$ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs font-mono text-neutral-400 block mt-2 uppercase tracking-widest">
                ACCRUAL LABOR EXPOSURE
              </span>
            </div>
            <div className="text-xs font-mono border-2 border-white p-3 text-center">
              <span className="text-neutral-300">平均時薪費率 NT$ </span>
              <span className="font-bold">
                {users.length > 0
                  ? Math.round(
                      users.reduce((acc, u) => acc + rateOf(u.id).hourlyRate, 0) / users.length
                    ).toLocaleString()
                  : '—'}
              </span>
              <span className="text-neutral-300"> / HR</span>
            </div>
          </div>

          {/* Card 3: Utilization & Overtime */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4 font-mono text-xs">
              <h3 className="font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14} strokeWidth={2} />
                <span>WORKFORCE UTILIZATION</span>
              </h3>
              <span className="bg-black text-white px-2 py-0.5 font-bold text-[10px]">
                TEAM OF {stats.length}
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border border-black flex justify-between items-center bg-neutral-50">
                <span className="text-neutral-600 uppercase">ACTIVE LOGGERS</span>
                <span className="font-bold text-base text-black">
                  {stats.filter((s) => s.logsCount > 0).length} / {stats.length}
                </span>
              </div>
              <div className="p-3 border border-black flex justify-between items-center bg-neutral-50">
                <span className="text-neutral-600 uppercase">OVERTIME WEIGHT</span>
                <span className="font-bold text-base text-black">
                  {totalHours > 0 ? Math.round((totalOvertime / totalHours) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-3 border-t border-neutral-200 mt-3">
              OVERTIME APPLIES ×{1.5} MULTIPLIER BY DEFAULT
            </div>
          </div>
        </div>

        {/* Personnel Statistics Panel */}
        <div className="border-2 border-black bg-white">
          <div className="border-b-2 border-black px-5 py-3 flex items-center justify-between bg-black text-white">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Users size={14} strokeWidth={2} />
              <span>PER-PERSONNEL WORK HOUR & COST LEDGER</span>
            </h4>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              {currentProjectId}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-black bg-neutral-100 text-[10px] uppercase tracking-widest text-neutral-600">
                  <th className="py-2.5 px-4 font-bold">PERSONNEL</th>
                  <th className="py-2.5 px-4 font-bold">RATE (NTD/HR)</th>
                  <th className="py-2.5 px-4 font-bold">LOGS</th>
                  <th className="py-2.5 px-4 font-bold">HOURS</th>
                  <th className="py-2.5 px-4 font-bold">OVERTIME</th>
                  <th className="py-2.5 px-4 font-bold">REGULAR COST</th>
                  <th className="py-2.5 px-4 font-bold">OVERTIME COST</th>
                  <th className="py-2.5 px-4 font-bold text-right">LABOR COST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {stats.map((s) => (
                  <tr key={s.user.id} className="hover:bg-neutral-50 transition-none">
                    <td className="py-2.5 px-4 font-bold text-black">
                      {s.user.name}
                      <span className="block text-[10px] text-neutral-400 font-medium">
                        {s.user.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">{s.rate.hourlyRate.toLocaleString()}</td>
                    <td className="py-2.5 px-4">{s.logsCount}</td>
                    <td className="py-2.5 px-4 font-bold">{s.hours.toFixed(1)}</td>
                    <td className="py-2.5 px-4">{s.overtimeHours.toFixed(1)}</td>
                    <td className="py-2.5 px-4">
                      NT$ {s.rawCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-4">
                      NT$ {s.overtimeCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold bg-neutral-100">
                      NT$ {s.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
                <tr className="bg-black text-white">
                  <td className="py-3 px-4 font-bold uppercase">GRAND TOTAL</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">{projectWorklogs.length}</td>
                  <td className="py-3 px-4 font-bold">{totalHours.toFixed(1)}</td>
                  <td className="py-3 px-4">{totalOvertime.toFixed(1)}</td>
                  <td className="py-3 px-4">
                    NT$ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-right font-bold">
                    NT$ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Breakdown: Discipline + Monthly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By Discipline */}
          <div className="border-2 border-black p-6 bg-white">
            <h4 className="font-mono font-bold text-xs text-black uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b-2 border-black">
              <Timer size={14} strokeWidth={2} />
              <span>COST BY DISCIPLINE</span>
            </h4>
            <div className="space-y-3.5 text-xs font-mono">
              {disciplineStats.map((d) => {
                const maxHours = Math.max(...disciplineStats.map((x) => x.hours), 1);
                return (
                  <div key={d.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-black uppercase">{d.name}</span>
                      <span className="text-neutral-600">
                        {d.hours.toFixed(1)} HR · NT${' '}
                        {d.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 border border-black h-3 p-[1px]">
                      <div
                        className="bg-black h-full transition-none"
                        style={{ width: `${(d.hours / maxHours) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Month */}
          <div className="border-2 border-black p-6 bg-white">
            <h4 className="font-mono font-bold text-xs text-black uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b-2 border-black">
              <TrendingUp size={14} strokeWidth={2} />
              <span>MONTHLY MAN-HOUR BURNOUT</span>
            </h4>
            {monthlyStats.length === 0 ? (
              <div className="text-xs font-mono text-neutral-500 p-3 border border-black bg-neutral-50 text-center">
                尚無工時紀錄
              </div>
            ) : (
              <div className="space-y-3.5 text-xs font-mono">
                {monthlyStats.map((m) => {
                  const maxMonth = Math.max(...monthlyStats.map((x) => x.hours), 1);
                  return (
                    <div key={m.month}>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-black">{m.month}</span>
                        <span className="text-neutral-600">
                          {m.hours.toFixed(1)} HR · {m.count} 筆 · NT${' '}
                          {m.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 border border-black h-3 p-[1px]">
                        <div
                          className="bg-black h-full transition-none"
                          style={{ width: `${(m.hours / maxMonth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Work Log Registry */}
        <div className="border-2 border-black bg-white">
          <div className="border-b-2 border-black px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-black text-white">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} strokeWidth={2} />
              <span>WORK LOG REGISTRY / 工時記錄清冊</span>
            </h4>
            <div className="flex gap-2 font-mono text-[11px]">
              <select
                value={filterDiscipline}
                onChange={(e) => setFilterDiscipline(e.target.value)}
                className="bg-white text-black border border-white px-2 py-1 focus:outline-none font-bold"
              >
                <option value="all">全部工種</option>
                <option value="結構工程">結構工程</option>
                <option value="建築設計">建築設計</option>
                <option value="機電MEP">機電MEP</option>
                <option value="現場施工">現場施工</option>
              </select>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="bg-white text-black border border-white px-2 py-1 focus:outline-none font-bold"
              >
                <option value="all">全部人員</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sortedLogs.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-500">
              目前尚無工時紀錄。點擊右上「填報工時」開始記錄。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b-2 border-black bg-neutral-100 text-[10px] uppercase tracking-widest text-neutral-600">
                    <th className="py-2.5 px-4 font-bold">DATE</th>
                    <th className="py-2.5 px-4 font-bold">TASK</th>
                    <th className="py-2.5 px-4 font-bold">PERSONNEL</th>
                    <th className="py-2.5 px-4 font-bold">HOURS</th>
                    <th className="py-2.5 px-4 font-bold">OVERTIME</th>
                    <th className="py-2.5 px-4 font-bold">COST</th>
                    <th className="py-2.5 px-4 font-bold">NOTE</th>
                    <th className="py-2.5 px-4 text-center font-bold">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {sortedLogs.map((w) => {
                    const r = rateOf(w.userId);
                    const cost =
                      (w.hours || 0) * r.hourlyRate +
                      (w.overtimeHours || 0) * r.hourlyRate * r.overtimeMultiplier;
                    return (
                      <tr key={w.id} className="hover:bg-neutral-50 transition-none">
                        <td className="py-2.5 px-4 text-neutral-700">{w.date}</td>
                        <td className="py-2.5 px-4 font-bold text-black">
                          {w.taskId}
                          <span className="block text-[10px] text-neutral-400 font-medium">
                            {taskNameOf(w.taskId)}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">{userNameOf(w.userId)}</td>
                        <td className="py-2.5 px-4 font-bold">{w.hours}</td>
                        <td className="py-2.5 px-4">{w.overtimeHours}</td>
                        <td className="py-2.5 px-4">
                          NT$ {cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-600 max-w-[220px] truncate">
                          {w.note || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => onDeleteWorkLog(w.id)}
                            className="inline-flex items-center gap-1 border border-black px-2 py-1 text-neutral-700 hover:bg-black hover:text-white transition-none cursor-pointer uppercase text-[10px] font-bold"
                            title="刪除工時紀錄"
                          >
                            <Trash2 size={12} strokeWidth={1.5} />
                            DEL
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};