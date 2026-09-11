import React from 'react';
import {
  BarChart3,
  Timer,
  AlertTriangle,
  TrendingUp,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { KanbanTask, RfiItem, ProjectId } from '../types';

interface AnalyticsViewProps {
  tasks: KanbanTask[];
  rfis: RfiItem[];
  currentProjectId: ProjectId;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  rfis,
  currentProjectId,
}) => {
  const projectTasks = tasks.filter((t) => t.projectId === currentProjectId);
  const projectRfis = rfis.filter((r) => r.projectId === currentProjectId);

  // Overall Task Completion
  const totalTasks = projectTasks.length;
  const doneTasks = projectTasks.filter((t) => t.status === 'done').length;
  const overallRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // By Discipline Completion
  const disciplines = ['結構工程', '機電MEP', '建築設計', '現場施工'] as const;
  const disciplineStats = disciplines.map((disc) => {
    const discTasks = projectTasks.filter((t) => t.discipline === disc);
    const discDone = discTasks.filter((t) => t.status === 'done').length;
    const rate = discTasks.length > 0 ? Math.round((discDone / discTasks.length) * 100) : 0;
    return {
      name: disc,
      total: discTasks.length,
      done: discDone,
      rate,
    };
  });

  // Schedule & Cost Impact
  const totalImpactDays = projectRfis.reduce((acc, r) => acc + (r.impactDays || 0), 0);
  const totalImpactCost = projectRfis.reduce((acc, r) => acc + (r.impactCost || 0), 0);

  // Status breakdown
  const statusCounts = {
    backlog: projectTasks.filter((t) => t.status === 'backlog').length,
    in_progress: projectTasks.filter((t) => t.status === 'in_progress').length,
    review: projectTasks.filter((t) => t.status === 'review').length,
    done: projectTasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-y-auto bg-white text-black font-body">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Editorial Section Header */}
        <div className="border-b-2 border-black pb-4">
          <h2 className="text-3xl font-display font-black text-black uppercase tracking-tight flex items-center gap-3">
            <BarChart3 size={24} strokeWidth={2} />
            <span>OPERATIONAL METRICS & SLA PERFORMANCE</span>
          </h2>
          <p className="font-mono text-xs text-neutral-500 mt-1 uppercase tracking-widest">
            ENGINEERING DELIVERABLES AUDIT · VARIANCE MONITORING · {currentProjectId}
          </p>
        </div>

        {/* Top 3 Metric Cards (Stark Architectural Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Task Completion Rate */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h3 className="font-mono text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} strokeWidth={2} />
                <span>TASK COMPLETION RATE</span>
              </h3>
              <span className="font-mono font-bold text-xs bg-black text-white px-2 py-0.5">
                {overallRate}%
              </span>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1 text-black font-bold">
                  <span>AGGREGATE PROGRESS</span>
                  <span>{doneTasks} / {totalTasks} UNITS</span>
                </div>
                <div className="w-full bg-neutral-200 border border-black h-3 p-[1px]">
                  <div
                    className="bg-black h-full transition-none"
                    style={{ width: `${overallRate}%` }}
                  ></div>
                </div>
              </div>

              {disciplineStats.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1 text-neutral-600 text-[11px]">
                    <span>
                      {item.name} [{item.done}/{item.total}]
                    </span>
                    <span className="text-black font-bold">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 border border-neutral-400 h-2">
                    <div
                      className="bg-black h-full transition-none"
                      style={{ width: `${item.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: RFI Turnaround SLA (Inverted Black Card) */}
          <div className="bg-black text-white border-2 border-black p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3 mb-4 font-mono text-xs">
              <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
                <Timer size={14} strokeWidth={2} />
                <span>RFI TURNAROUND SLA</span>
              </h3>
              <span className="border border-white px-2 py-0.5 font-bold text-[10px]">
                SLA &le; 3.0 DAYS
              </span>
            </div>

            <div className="text-center py-4">
              <span className="text-6xl font-display font-black font-mono tracking-tight block">
                2.4
              </span>
              <span className="text-xs font-mono text-neutral-400 block mt-2 uppercase tracking-widest">
                AVERAGE BUSINESS DAYS TO ENDORSEMENT
              </span>
            </div>

            <div className="text-xs font-mono border-2 border-white bg-black text-white p-3 text-center flex items-center justify-center gap-2">
              <CheckCircle size={14} strokeWidth={2} />
              <span className="font-bold">20% FASTER THAN CONTRACTUAL BASELINE</span>
            </div>
          </div>

          {/* Card 3: Schedule & Budget Variance */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4 font-mono text-xs">
              <h3 className="font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} strokeWidth={2} />
                <span>SCHEDULE & COST IMPACT</span>
              </h3>
              <span className="bg-black text-white px-2 py-0.5 font-bold text-[10px]">
                VARIANCE LOG
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border border-black flex justify-between items-center bg-neutral-50">
                <span className="text-neutral-600 uppercase">APPROVED EXTENSION</span>
                <span className="font-bold text-base text-black">
                  +{totalImpactDays} DAYS
                </span>
              </div>
              <div className="p-3 border border-black flex justify-between items-center bg-neutral-50">
                <span className="text-neutral-600 uppercase">CHANGE ORDER SUM</span>
                <span className="font-bold text-base text-black">
                  NT$ {totalImpactCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-500 pt-3 border-t border-neutral-200 mt-3">
              ALL VARIATIONS GROUNDED IN STRUCTURAL CALCULATION SHEETS
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kanban Status Breakdown */}
          <div className="border-2 border-black p-6 bg-white">
            <h4 className="font-mono font-bold text-xs text-black uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b-2 border-black">
              <TrendingUp size={14} strokeWidth={2} />
              <span>KANBAN PHASE WORKLOAD DISTRIBUTION</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 border border-black text-center bg-neutral-50">
                <span className="text-[10px] text-neutral-500 block uppercase">BACKLOG</span>
                <span className="text-2xl font-display font-black text-black">
                  {statusCounts.backlog}
                </span>
              </div>
              <div className="p-3 border border-black text-center bg-neutral-50">
                <span className="text-[10px] text-neutral-500 block uppercase">ACTIVE</span>
                <span className="text-2xl font-display font-black text-black">
                  {statusCounts.in_progress}
                </span>
              </div>
              <div className="p-3 border border-black text-center bg-neutral-50">
                <span className="text-[10px] text-neutral-500 block uppercase">REVIEW</span>
                <span className="text-2xl font-display font-black text-black">
                  {statusCounts.review}
                </span>
              </div>
              <div className="p-3 border border-black text-center bg-black text-white">
                <span className="text-[10px] text-neutral-400 block uppercase">RESOLVED</span>
                <span className="text-2xl font-display font-black text-white">
                  {statusCounts.done}
                </span>
              </div>
            </div>
          </div>

          {/* RFI Status Breakdown */}
          <div className="border-2 border-black p-6 bg-white">
            <h4 className="font-mono font-bold text-xs text-black uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b-2 border-black">
              <AlertTriangle size={14} strokeWidth={2} />
              <span>RFI LOG DISPOSITION STATUS</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 border border-black text-center bg-neutral-50">
                <span className="text-[10px] text-neutral-500 block uppercase">PENDING</span>
                <span className="text-2xl font-display font-black text-black">
                  {projectRfis.filter((r) => r.status === '待處理').length}
                </span>
              </div>
              <div className="p-3 border border-black text-center bg-neutral-50">
                <span className="text-[10px] text-neutral-500 block uppercase">REVIEW</span>
                <span className="text-2xl font-display font-black text-black">
                  {projectRfis.filter((r) => r.status === '審查中').length}
                </span>
              </div>
              <div className="p-3 border border-black text-center bg-black text-white">
                <span className="text-[10px] text-neutral-400 block uppercase">APPROVED</span>
                <span className="text-2xl font-display font-black text-white">
                  {projectRfis.filter((r) => r.status === '已回覆').length}
                </span>
              </div>
              <div className="p-3 border border-black text-center bg-neutral-50">
                <span className="text-[10px] text-neutral-500 block uppercase">REJECTED</span>
                <span className="text-2xl font-display font-black text-black line-through">
                  {projectRfis.filter((r) => r.status === '已駁回').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
