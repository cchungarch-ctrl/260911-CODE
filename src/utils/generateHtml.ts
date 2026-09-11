import { KanbanTask, RfiItem, User, WorkLog, UserRate, ProjectId } from '../types';

interface GenerateHtmlParams {
  tasks: KanbanTask[];
  rfis: RfiItem[];
  users: User[];
  worklogs: WorkLog[];
  userRates: UserRate[];
  currentProjectId: ProjectId;
}

export function generateStandaloneHtml({
  tasks,
  rfis,
  users,
  worklogs,
  userRates,
  currentProjectId,
}: GenerateHtmlParams): string {
  const jsonState = JSON.stringify(
    {
      currentProject: currentProjectId,
      users,
      tasks,
      rfis,
      worklogs,
      userRates,
    },
    null,
    2
  );

  return `<!DOCTYPE html>
<html lang="zh-TW" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusPM 營建專案與 RFI 全功能管理系統</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .kanban-col { min-height: calc(100vh - 230px); }
        .drag-over { background-color: rgba(14, 165, 233, 0.08) !important; border-style: dashed !important; border-color: #0284c7 !important; }
    </style>
</head>
<body class="h-full flex flex-col overflow-hidden custom-scrollbar bg-slate-950 text-slate-100">

    <header class="bg-slate-900 border-b border-slate-800 flex-none z-30 shadow-lg">
        <div class="px-5 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                    <i class="fa-solid fa-cubes text-xl"></i>
                </div>
                <div>
                    <h1 class="font-bold text-base text-white flex items-center gap-2">
                        NexusPM 專案與 RFI 管制系統
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">SPA + REST API</span>
                    </h1>
                    <p class="text-xs text-slate-400">營建工程多方協調與圖檔變更追蹤平台</p>
                </div>
            </div>

            <div class="flex items-center space-x-3">
                <div class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
                    <span class="text-slate-400"><i class="fa-solid fa-building me-1 text-cyan-400"></i>當前專案:</span>
                    <select id="project-selector" onchange="switchProject(this.value)" class="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium">
                        <option value="PRJ-001" class="bg-slate-900">台北信義 A11 頂級商辦新建工程</option>
                        <option value="PRJ-002" class="bg-slate-900">竹科綠能科技廠房二期擴建工程</option>
                        <option value="PRJ-003" class="bg-slate-900">台中高鐵站前複合式大樓計畫</option>
                    </select>
                </div>

                <div class="h-6 w-px bg-slate-800"></div>

                <button onclick="openNewTaskModal()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-plus"></i> 新增工作看板
                </button>
                <button onclick="openNewRfiModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-file-circle-plus"></i> 發起 RFI 請求
                </button>
            </div>
        </div>

        <div class="px-5 flex space-x-1 border-t border-slate-800/80 bg-slate-900/60">
            <button onclick="switchTab('gantt')" id="tab-gantt" class="tab-btn active px-4 py-2.5 text-xs font-medium border-b-2 border-blue-500 text-blue-400 flex items-center gap-2 transition-all">
                <i class="fa-solid fa-calendar-days text-blue-400"></i> 甘特排程圖 (Gantt Timeline)
            </button>
            <button onclick="switchTab('kanban')" id="tab-kanban" class="tab-btn px-4 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-all">
                <i class="fa-solid fa-columns"></i> 看板管理 (Kanban Board)
            </button>
            <button onclick="switchTab('rfi')" id="tab-rfi" class="tab-btn px-4 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-all">
                <i class="fa-solid fa-clipboard-question"></i> RFI 資訊請求追蹤 (RFI Tracker)
                <span id="rfi-count-badge" class="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full text-[10px]">2</span>
            </button>
            <button onclick="switchTab('users')" id="tab-users" class="tab-btn px-4 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-all">
                <i class="fa-solid fa-users-gear"></i> 人員與指派權限 (Users & Teams)
            </button>
            <button onclick="switchTab('analytics')" id="tab-analytics" class="tab-btn px-4 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-all">
                <i class="fa-solid fa-chart-pie"></i> 專案統計分析 (Analytics)
            </button>
            <button onclick="switchTab('api')" id="tab-api" class="tab-btn px-4 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-all">
                <i class="fa-solid fa-server text-cyan-400"></i> 前後端分離 API 控制台 (Backend Console)
            </button>
        </div>
    </header>

    <main class="flex-1 overflow-hidden relative">
        <!-- Section 0: Gantt -->
        <section id="section-gantt" class="h-full flex flex-col bg-white text-slate-800 overflow-hidden select-none">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-black text-slate-900 tracking-tight">Team Projects</h2>
                    <p class="text-xs text-slate-500">視覺化甘特圖排程（Monday.com 精緻風格，支援拖曳與進度檢視）</p>
                </div>
                <div class="flex items-center space-x-2 text-xs">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-semibold border border-blue-100">今日定位: 9月16日</span>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto overflow-x-hidden p-6" id="gantt-chart-container">
                <!-- Injected via renderGantt -->
            </div>
        </section>

        <!-- Section 1: Kanban -->
        <section id="section-kanban" class="h-full p-4 overflow-x-auto overflow-y-hidden custom-scrollbar hidden">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
                        <input type="text" id="kanban-search" oninput="filterKanban()" placeholder="搜尋任務標題、編號或描述..." class="bg-slate-950 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 w-64">
                    </div>
                    <select id="kanban-filter-assignee" onchange="filterKanban()" class="bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none">
                        <option value="all">所有指派人員</option>
                    </select>
                    <select id="kanban-filter-discipline" onchange="filterKanban()" class="bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none">
                        <option value="all">所有專業類別</option>
                        <option value="結構工程">結構工程 (Structural)</option>
                        <option value="建築設計">建築設計 (Architectural)</option>
                        <option value="機電MEP">機電 MEP</option>
                        <option value="現場施工">現場施工 (Civil)</option>
                    </select>
                </div>
                <div class="flex items-center space-x-4 text-xs text-slate-400">
                    <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>高優先度</span></div>
                    <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>中優先度</span></div>
                    <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span>低優先度</span></div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100%-65px)] min-w-[1050px]">
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
                    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span><h3 class="font-bold text-xs text-slate-200 tracking-wide uppercase">待處理事項 (Backlog)</h3></div>
                        <span id="count-backlog" class="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">0</span>
                    </div>
                    <div id="col-backlog" ondrop="drop(event, 'backlog')" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)" class="kanban-col p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3"></div>
                </div>
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
                    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><h3 class="font-bold text-xs text-slate-200 tracking-wide uppercase">執行中 (In Progress)</h3></div>
                        <span id="count-in_progress" class="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">0</span>
                    </div>
                    <div id="col-in_progress" ondrop="drop(event, 'in_progress')" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)" class="kanban-col p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3"></div>
                </div>
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
                    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><h3 class="font-bold text-xs text-slate-200 tracking-wide uppercase">審查中 (Under Review)</h3></div>
                        <span id="count-review" class="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">0</span>
                    </div>
                    <div id="col-review" ondrop="drop(event, 'review')" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)" class="kanban-col p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3"></div>
                </div>
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
                    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                        <div class="flex items-center space-x-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><h3 class="font-bold text-xs text-slate-200 tracking-wide uppercase">完成與結案 (Done)</h3></div>
                        <span id="count-done" class="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">0</span>
                    </div>
                    <div id="col-done" ondrop="drop(event, 'done')" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)" class="kanban-col p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3"></div>
                </div>
            </div>
        </section>

        <!-- Section 2: RFI -->
        <section id="section-rfi" class="h-full p-6 overflow-y-auto custom-scrollbar hidden">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                    <div class="p-3 rounded-xl bg-blue-500/10 text-blue-400"><i class="fa-solid fa-folder-open text-2xl"></i></div>
                    <div><p class="text-xs text-slate-400">總 RFI 請求數</p><h4 id="stat-rfi-total" class="text-xl font-bold text-slate-100">0</h4></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                    <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400"><i class="fa-solid fa-clock text-2xl"></i></div>
                    <div><p class="text-xs text-slate-400">待建築師/技師簽核</p><h4 id="stat-rfi-pending" class="text-xl font-bold text-amber-400">0</h4></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                    <div class="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><i class="fa-solid fa-circle-check text-2xl"></i></div>
                    <div><p class="text-xs text-slate-400">已審核通過</p><h4 id="stat-rfi-approved" class="text-xl font-bold text-emerald-400">0</h4></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                    <div class="p-3 rounded-xl bg-rose-500/10 text-rose-400"><i class="fa-solid fa-coins text-2xl"></i></div>
                    <div><p class="text-xs text-slate-400">累計衍生工程款</p><h4 id="stat-rfi-impact" class="text-xl font-bold text-rose-400">$ 0</h4></div>
                </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
                    <h3 class="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-emerald-400"></i> RFI 資訊請求簽核記錄清單
                    </h3>
                    <button onclick="openNewRfiModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl transition">
                        <i class="fa-solid fa-plus me-1"></i> 新增 RFI
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800 font-medium">
                                <th class="py-3 px-4">RFI 編號</th>
                                <th class="py-3 px-4">主題與問項摘要</th>
                                <th class="py-3 px-4">專業類別</th>
                                <th class="py-3 px-4">提報人員</th>
                                <th class="py-3 px-4">指派簽核者</th>
                                <th class="py-3 px-4">回覆期限</th>
                                <th class="py-3 px-4">工期/費用影響</th>
                                <th class="py-3 px-4">簽核狀態</th>
                                <th class="py-3 px-4 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody id="rfi-table-body" class="divide-y divide-slate-800/60 text-slate-300"></tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Section 3: Users -->
        <section id="section-users" class="h-full p-6 overflow-y-auto custom-scrollbar hidden">
            <h2 class="text-base font-bold text-slate-100 mb-4">專案團隊與權限角色指派</h2>
            <div id="users-grid" class="grid grid-cols-1 md:grid-cols-4 gap-4"></div>
        </section>

        <!-- Section 4: Analytics -->
        <section id="section-analytics" class="h-full p-6 overflow-y-auto custom-scrollbar hidden">
            <h2 class="text-base font-bold text-slate-100 mb-4">專案進度與 RFI 回覆時效分析</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h3 class="text-xs font-bold text-slate-300 mb-3">整體任務完成度</h3>
                    <div class="text-2xl font-bold text-cyan-400 font-mono mb-2">達成率 50%</div>
                    <div class="w-full bg-slate-950 rounded-full h-2"><div class="bg-cyan-500 h-2 rounded-full" style="width: 50%"></div></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h3 class="text-xs font-bold text-slate-300 mb-3">RFI 平均答覆天數</h3>
                    <div class="text-3xl font-bold text-emerald-400 font-mono">2.4 天</div>
                    <p class="text-[11px] text-slate-400 mt-2">優於契約 3.0 天規範</p>
                </div>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h3 class="text-xs font-bold text-slate-300 mb-3">工期與費用追加影響</h3>
                    <p class="text-xs text-amber-400 font-mono font-bold">+2 天工期展延</p>
                    <p class="text-xs text-rose-400 font-mono font-bold mt-1">+NT$ 150,000 工程款</p>
                </div>
            </div>
        </section>

        <!-- Section 5: API Console -->
        <section id="section-api" class="h-full p-6 overflow-y-auto custom-scrollbar hidden">
            <div class="max-w-4xl mx-auto space-y-4">
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <h3 class="text-sm font-bold text-white mb-2">前後端分離 RESTful API 規格</h3>
                    <p class="text-xs text-slate-400">標準 JSON Payload 格式與狀態碼映射 (200 OK / 201 Created / 400 Bad Request)。</p>
                </div>
            </div>
        </section>
    </main>

    <script>
        const STATE = ${jsonState};

        window.onload = function() {
            renderUsers();
            populateUserDropdowns();
            renderKanban();
            renderRfiTable();
            updateStats();
        };

        function switchTab(tabName) {
            document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active', 'border-blue-500', 'text-blue-400');
                btn.classList.add('border-transparent', 'text-slate-400');
            });
            document.getElementById('section-' + tabName)?.classList.remove('hidden');
            const activeBtn = document.getElementById('tab-' + tabName);
            if (activeBtn) {
                activeBtn.classList.add('active', 'border-blue-500', 'text-blue-400');
                activeBtn.classList.remove('border-transparent', 'text-slate-400');
            }
        }

        function switchProject(prjId) {
            STATE.currentProject = prjId;
            renderKanban();
            renderRfiTable();
            updateStats();
        }

        function renderKanban() {
            const cols = ['backlog', 'in_progress', 'review', 'done'];
            cols.forEach(col => {
                const el = document.getElementById('col-' + col);
                if (el) el.innerHTML = '';
            });

            const searchVal = (document.getElementById('kanban-search')?.value || '').toLowerCase();
            const assigneeVal = document.getElementById('kanban-filter-assignee')?.value || 'all';
            const discVal = document.getElementById('kanban-filter-discipline')?.value || 'all';

            const counts = { backlog: 0, in_progress: 0, review: 0, done: 0 };

            STATE.tasks.filter(t => t.projectId === STATE.currentProject).forEach(task => {
                if (searchVal && !task.title.toLowerCase().includes(searchVal) && !task.id.toLowerCase().includes(searchVal)) return;
                if (assigneeVal !== 'all' && task.assigneeId !== assigneeVal) return;
                if (discVal !== 'all' && task.discipline !== discVal) return;

                counts[task.status] = (counts[task.status] || 0) + 1;
                const assignee = STATE.users.find(u => u.id === task.assigneeId) || { name: '未指派', avatar: '' };

                const priorityColor = task.priority === 'high' ? 'border-l-rose-500' : (task.priority === 'medium' ? 'border-l-amber-500' : 'border-l-slate-400');
                const priorityBadge = task.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : (task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300');

                const cardHtml = \`
                    <div id="card-\${task.id}" draggable="true" ondragstart="drag(event, '\${task.id}')" class="bg-slate-950 border border-slate-800 border-l-4 \${priorityColor} rounded-xl p-3 shadow-md hover:border-slate-700 transition cursor-grab">
                        <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                            <span class="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">\${task.id}</span>
                            <span class="px-2 py-0.5 rounded-full font-medium \${priorityBadge}">\${task.priority.toUpperCase()}</span>
                        </div>
                        <h4 class="font-semibold text-xs text-slate-100 mb-1">\${task.title}</h4>
                        <p class="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">\${task.desc}</p>
                        \${task.image ? \`<div class="mb-2 rounded-lg overflow-hidden border border-slate-800"><img src="\${task.image}" class="w-full h-24 object-cover"></div>\` : ''}
                        <div class="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                            <span class="text-slate-300">\${assignee.name}</span>
                            <span class="text-slate-500">\${task.duedate.slice(5)}</span>
                        </div>
                    </div>
                \`;

                const colElem = document.getElementById('col-' + task.status);
                if (colElem) colElem.innerHTML += cardHtml;
            });

            cols.forEach(col => {
                const countEl = document.getElementById('count-' + col);
                if (countEl) countEl.innerText = counts[col] || 0;
            });
        }

        function allowDrop(ev) { ev.preventDefault(); }
        function dragEnter(ev) { ev.currentTarget.classList.add('drag-over'); }
        function dragLeave(ev) { ev.currentTarget.classList.remove('drag-over'); }
        function drag(ev, taskId) { ev.dataTransfer.setData("text/plain", taskId); }
        function drop(ev, newStatus) {
            ev.preventDefault();
            ev.currentTarget.classList.remove('drag-over');
            const taskId = ev.dataTransfer.getData("text/plain");
            const task = STATE.tasks.find(t => t.id === taskId);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                renderKanban();
            }
        }
        function filterKanban() { renderKanban(); }

        function renderRfiTable() {
            const tbody = document.getElementById('rfi-table-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            STATE.rfis.filter(r => r.projectId === STATE.currentProject).forEach(rfi => {
                const raisedUser = STATE.users.find(u => u.id === rfi.raisedBy) || { name: '未知' };
                const assigneeUser = STATE.users.find(u => u.id === rfi.assigneeId) || { name: '未指派' };
                const trHtml = \`
                    <tr class="hover:bg-slate-900/60 transition border-b border-slate-800/40">
                        <td class="py-3 px-4 font-mono text-cyan-400 font-semibold">\${rfi.id}</td>
                        <td class="py-3 px-4 font-medium text-slate-100">\${rfi.subject}</td>
                        <td class="py-3 px-4">\${rfi.discipline}</td>
                        <td class="py-3 px-4">\${raisedUser.name}</td>
                        <td class="py-3 px-4">\${assigneeUser.name}</td>
                        <td class="py-3 px-4 font-mono">\${rfi.deadline}</td>
                        <td class="py-3 px-4 font-mono">\${rfi.impactCost > 0 ? '+NT$' + rfi.impactCost.toLocaleString() : '無影響'}</td>
                        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border">\${rfi.status}</span></td>
                        <td class="py-3 px-4 text-center"><button class="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">檢視</button></td>
                    </tr>
                \`;
                tbody.innerHTML += trHtml;
            });
        }

        function renderUsers() {
            const grid = document.getElementById('users-grid');
            if (!grid) return;
            grid.innerHTML = '';
            STATE.users.forEach(u => {
                grid.innerHTML += \`
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                        <img src="\${u.avatar}" class="w-14 h-14 rounded-full mx-auto mb-2 border border-cyan-500 object-cover">
                        <h4 class="font-bold text-sm text-slate-100">\${u.name}</h4>
                        <p class="text-xs text-cyan-400">\${u.role}</p>
                    </div>
                \`;
            });
        }

        function populateUserDropdowns() {
            const filterAssignee = document.getElementById('kanban-filter-assignee');
            if (filterAssignee) {
                STATE.users.forEach(u => {
                    filterAssignee.innerHTML += \`<option value="\${u.id}">\${u.name}</option>\`;
                });
            }
        }

        function updateStats() {
            const pRfis = STATE.rfis.filter(r => r.projectId === STATE.currentProject);
            document.getElementById('stat-rfi-total').innerText = pRfis.length;
            document.getElementById('stat-rfi-pending').innerText = pRfis.filter(r => r.status === '審查中' || r.status === '待處理').length;
            document.getElementById('stat-rfi-approved').innerText = pRfis.filter(r => r.status === '已回覆').length;
            const cost = pRfis.reduce((acc, r) => acc + (r.impactCost || 0), 0);
            document.getElementById('stat-rfi-impact').innerText = 'NT$ ' + cost.toLocaleString();
        }

        function renderGantt() {
            const container = document.getElementById('gantt-chart-container');
            if (!container) return;

            const days = [];
            for (let i = 8; i <= 24; i++) {
                days.push({
                    day: i,
                    isSunday: i === 9 || i === 23,
                    isToday: i === 16
                });
            }

            let html = '<div class="min-w-[900px]"><div class="flex items-center border-b border-slate-200 pb-3 mb-4"><div class="w-14 text-xs font-bold text-slate-400 uppercase text-center">成員</div><div class="flex-1 grid grid-cols-17 text-center" style="display: grid; grid-template-columns: repeat(17, minmax(0, 1fr));">';

            days.forEach(d => {
                html += '<div class="flex flex-col items-center justify-center ' + (d.isSunday ? 'bg-slate-50' : '') + '">';
                if (d.isToday) {
                    html += '<div class="w-7 h-7 rounded-full bg-[#0085ff] text-white font-bold text-xs flex items-center justify-center shadow-md">' + d.day + '</div>';
                } else {
                    html += '<span class="text-slate-600 font-semibold text-xs">' + d.day + '</span>';
                }
                if (d.isSunday) {
                    html += '<span class="text-[9px] text-slate-400">Sunday</span>';
                }
                html += '</div>';
            });

            html += '</div></div><div class="space-y-3">';

            const pTasks = STATE.tasks.filter(t => t.projectId === STATE.currentProject);

            STATE.users.forEach(user => {
                const userTasks = pTasks.filter(t => t.assigneeId === user.id);
                html += '<div class="flex items-center min-h-[64px] py-1 border-b border-slate-100"><div class="w-14 flex items-center justify-center"><img src="' + user.avatar + '" class="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm" title="' + user.name + '"></div><div class="flex-1 h-12 relative flex items-center">';

                userTasks.forEach(task => {
                    const startDay = task.startDate ? parseInt(task.startDate.slice(8)) : 10;
                    const endDay = parseInt(task.duedate.slice(8)) || 16;
                    const leftPct = Math.max(0, Math.min(92, ((startDay - 8) / 17) * 100));
                    const widthPct = Math.max(6, Math.min(100 - leftPct, ((endDay - startDay + 1) / 17) * 100));
                    const color = task.color || '#3b82f6';

                    html += '<div style="left: ' + leftPct + '%; width: ' + widthPct + '%; background-color: ' + color + ';" class="absolute h-9 rounded-full flex items-center justify-between px-3 text-slate-900 font-semibold text-xs shadow-sm hover:shadow cursor-pointer transition"><span class="truncate">' + task.title + '</span><div class="w-3.5 h-3.5 rounded-full bg-white/50 border border-white/30 flex-none ml-1"></div></div>';
                });

                html += '</div></div>';
            });

            html += '</div></div>';
            container.innerHTML = html;
        }

        function openNewTaskModal() { alert('請在上方主介面執行「新增看板工作」'); }
        function openNewRfiModal() { alert('請在上方主介面執行「發起 RFI 請求」'); }

        window.addEventListener('DOMContentLoaded', () => {
            populateUserDropdowns();
            renderGantt();
            renderKanban();
            renderRfiTable();
            renderUsers();
            updateStats();
        });
    <\/script>
</body>
</html>`;
}
