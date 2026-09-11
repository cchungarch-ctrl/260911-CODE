import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GanttChart } from './components/GanttChart';
import { KanbanBoard } from './components/KanbanBoard';
import { RfiTracker } from './components/RfiTracker';
import { UsersView } from './components/UsersView';
import { AnalyticsView } from './components/AnalyticsView';
import { ApiConsole } from './components/ApiConsole';
import { WorkHoursView } from './components/WorkHoursView';
import { NewTaskModal } from './components/Modals/NewTaskModal';
import { NewRfiModal } from './components/Modals/NewRfiModal';
import { ViewRfiModal } from './components/Modals/ViewRfiModal';
import { ImageLightboxModal } from './components/Modals/ImageLightboxModal';
import { HtmlSourceModal } from './components/Modals/HtmlSourceModal';
import { LogWorkHoursModal } from './components/Modals/LogWorkHoursModal';
import { EditUserRateModal } from './components/Modals/EditUserRateModal';
import {
  INITIAL_PROJECTS,
  INITIAL_USERS,
  INITIAL_TASKS,
  INITIAL_RFIS,
  INITIAL_WORKLOGS,
  INITIAL_USER_RATES,
} from './data/initialData';
import {
  ProjectId,
  TabType,
  KanbanTask,
  RfiItem,
  User,
  ApiLog,
  TaskStatus,
  RfiStatus,
  WorkLog,
  UserRate,
} from './types';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
}

export default function App() {
  const [currentProject, setCurrentProject] = useState<ProjectId>(() => {
    return (localStorage.getItem('nexuspm_project') as ProjectId) || 'PRJ-TEAM';
  });

  const [activeTab, setActiveTab] = useState<TabType>('gantt');

  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('nexuspm_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasTeamTasks = parsed.some((t: KanbanTask) => t.projectId === 'PRJ-TEAM');
        if (!hasTeamTasks) {
          return [...INITIAL_TASKS.filter((t) => t.projectId === 'PRJ-TEAM'), ...parsed];
        }
        return parsed;
      } catch {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  const [rfis, setRfis] = useState<RfiItem[]>(() => {
    const saved = localStorage.getItem('nexuspm_rfis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_RFIS;
      }
    }
    return INITIAL_RFIS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexuspm_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_USERS.length) return parsed;
        return INITIAL_USERS;
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [worklogs, setWorklogs] = useState<WorkLog[]>(() => {
    const saved = localStorage.getItem('nexuspm_worklogs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WORKLOGS;
      }
    }
    return INITIAL_WORKLOGS;
  });

  const [userRates, setUserRates] = useState<UserRate[]>(() => {
    const saved = localStorage.getItem('nexuspm_user_rates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_USER_RATES.length) return parsed;
        return INITIAL_USER_RATES;
      } catch {
        return INITIAL_USER_RATES;
      }
    }
    return INITIAL_USER_RATES;
  });

  const [apiLogs, setApiLogs] = useState<ApiLog[]>(() => [
    {
      id: 'log-init-1',
      method: 'GET',
      endpoint: '/api/v1/projects/PRJ-001/status',
      status: 200,
      responseData: {
        status: 'online',
        server: 'NexusPM Node.js REST API v2.4',
        dbConnection: 'PostgreSQL - Connected',
        activeProject: 'PRJ-001 (台北信義 A11 頂級商辦新建工程)',
      },
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'log-init-2',
      method: 'GET',
      endpoint: '/api/v1/projects/PRJ-001/tasks',
      status: 200,
      responseData: {
        total: 5,
        backlog: 1,
        in_progress: 1,
        review: 2,
        done: 1,
      },
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewRfiOpen, setIsNewRfiOpen] = useState(false);
  const [isViewRfiOpen, setIsViewRfiOpen] = useState(false);
  const [selectedRfiId, setSelectedRfiId] = useState<string | null>(null);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isLogWorkHoursOpen, setIsLogWorkHoursOpen] = useState(false);
  const [isEditRateOpen, setIsEditRateOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexuspm_project', currentProject);
  }, [currentProject]);

  useEffect(() => {
    localStorage.setItem('nexuspm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexuspm_rfis', JSON.stringify(rfis));
  }, [rfis]);

  useEffect(() => {
    localStorage.setItem('nexuspm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexuspm_worklogs', JSON.stringify(worklogs));
  }, [worklogs]);

  useEffect(() => {
    localStorage.setItem('nexuspm_user_rates', JSON.stringify(userRates));
  }, [userRates]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addApiLog = (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    responseData: unknown,
    status: number = 200,
    payload?: unknown
  ) => {
    const newLog: ApiLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      method,
      endpoint,
      payload,
      responseData,
      status,
      timestamp: new Date().toLocaleTimeString(),
    };
    setApiLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const handleSelectProject = (projectId: ProjectId) => {
    setCurrentProject(projectId);
    const prj = INITIAL_PROJECTS.find((p) => p.id === projectId);
    showToast(`已切換至專案: ${prj?.name || projectId}`, 'info');
    addApiLog('GET', `/api/v1/projects/${projectId}/dashboard`, {
      projectId,
      name: prj?.name,
      loadedTasks: tasks.filter((t) => t.projectId === projectId).length,
      loadedRfis: rfis.filter((r) => r.projectId === projectId).length,
    });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    const task = tasks.find((t) => t.id === taskId);
    showToast(`任務 ${taskId} 移至 [${newStatus}]`, 'success');
    addApiLog('PUT', `/api/v1/tasks/${taskId}/status`, {
      taskId,
      previousStatus: task?.status,
      newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`任務 ${taskId} 已刪除`, 'warning');
    addApiLog('DELETE', `/api/v1/tasks/${taskId}`, {
      success: true,
      deletedTaskId: taskId,
    });
  };

  const handleUpdateTask = (updatedTask: KanbanTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    showToast(`任務 [${updatedTask.title}] 已更新`, 'success');
    addApiLog('PUT', `/api/v1/tasks/${updatedTask.id}`, {
      success: true,
      task: updatedTask,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateTask = (taskData: Omit<KanbanTask, 'id' | 'createdAt'>) => {
    const newId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    const newTask: KanbanTask = {
      ...taskData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`已建立看板任務 ${newId}`, 'success');
    addApiLog(
      'POST',
      '/api/v1/tasks',
      {
        success: true,
        createdTask: newTask,
      },
      201,
      taskData
    );
  };

  const handleCreateRfi = (rfiData: Omit<RfiItem, 'id' | 'createdAt'>) => {
    const newId = `RFI-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRfi: RfiItem = {
      ...rfiData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRfis((prev) => [newRfi, ...prev]);
    showToast(`已發起 RFI 資訊請求單 ${newId}`, 'success');
    addApiLog(
      'POST',
      '/api/v1/rfis',
      {
        success: true,
        createdRfi: newRfi,
      },
      201,
      rfiData
    );
  };

  const handleSubmitRfiResponse = (
    rfiId: string,
    status: RfiStatus,
    replyText: string,
    impactDays: number,
    impactCost: number
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setRfis((prev) =>
      prev.map((r) =>
        r.id === rfiId
          ? {
              ...r,
              status,
              response: replyText,
              impactDays,
              impactCost,
              responseDate: today,
            }
          : r
      )
    );
    showToast(`RFI ${rfiId} 簽核完成 [${status}]`, 'success');
    addApiLog(
      'POST',
      `/api/v1/rfis/${rfiId}/responses`,
      {
        rfiId,
        status,
        response: replyText,
        impactDays,
        impactCost,
        signedAt: today,
      },
      200
    );
  };

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newId = `usr_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`已新增成員: ${newUser.name}`, 'success');
    addApiLog('POST', '/api/v1/users', { success: true, user: newUser }, 201, userData);
  };

  const handleCreateWorkLog = (logData: Omit<WorkLog, 'id' | 'createdAt'>) => {
    const newId = `WL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLog: WorkLog = {
      ...logData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWorklogs((prev) => [newLog, ...prev]);
    showToast(`工時已登錄 ${newLog.hours}H (+${newLog.overtimeHours}H)`, 'success');
    addApiLog(
      'POST',
      '/api/v1/worklogs',
      {
        success: true,
        createdWorkLog: newLog,
      },
      201,
      logData
    );
  };

  const handleDeleteWorkLog = (logId: string) => {
    setWorklogs((prev) => prev.filter((w) => w.id !== logId));
    showToast(`工時紀錄 ${logId} 已刪除`, 'warning');
    addApiLog('DELETE', `/api/v1/worklogs/${logId}`, { success: true, deletedLogId: logId });
  };

  const handleUpdateUserRate = (rate: UserRate) => {
    setUserRates((prev) => {
      const exists = prev.some((r) => r.userId === rate.userId);
      if (exists) return prev.map((r) => (r.userId === rate.userId ? rate : r));
      return [...prev, rate];
    });
    const userName = users.find((u) => u.id === rate.userId)?.name || rate.userId;
    showToast(`費率已更新: ${userName} NT$ ${rate.hourlyRate}/hr`, 'success');
    addApiLog(
      'PUT',
      `/api/v1/users/${rate.userId}/rate`,
      { success: true, rate },
      200,
      rate
    );
  };

  const handleSelectRfiFromTask = (rfiId: string) => {
    setActiveTab('rfi');
    setSelectedRfiId(rfiId);
    setIsViewRfiOpen(true);
  };

  const handleOpenViewRfi = (rfiId: string) => {
    setSelectedRfiId(rfiId);
    setIsViewRfiOpen(true);
  };

  const handleJumpToTask = (taskId: string) => {
    setActiveTab('kanban');
    showToast(`已跳轉至任務 ${taskId}`);
  };

  const handleExecuteApi = (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    payload?: unknown
  ) => {
    if (endpoint.includes('/tasks') && method === 'GET') {
      const projectTasks = tasks.filter((t) => t.projectId === currentProject);
      addApiLog(method, endpoint, { count: projectTasks.length, tasks: projectTasks }, 200);
      showToast('已取得最新任務資料');
    } else if (endpoint.includes('/tasks') && method === 'POST') {
      if (payload && typeof payload === 'object' && 'title' in payload) {
        const p = payload as any;
        const newId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
        const newTask: KanbanTask = {
          id: newId,
          projectId: currentProject,
          title: p.title || '新建立任務',
          discipline: p.discipline || '現場施工',
          priority: p.priority || 'medium',
          status: 'backlog',
          assigneeId: p.assigneeId || 'usr_1',
          duedate: p.duedate || '2026-09-30',
          desc: p.desc || '透過 REST API 端點建立',
          image: null,
          rfiId: null,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setTasks((prev) => [newTask, ...prev]);
        addApiLog(method, endpoint, { success: true, createdTask: newTask }, 201, payload);
        showToast(`API: 建立任務 ${newId} 成功`, 'success');
      } else {
        addApiLog(method, endpoint, { error: 'Payload 格式錯誤' }, 400, payload);
        showToast('API: 請求格式錯誤', 'warning');
      }
    } else if (endpoint.includes('/rfis') && method === 'GET') {
      const projectRfis = rfis.filter((r) => r.projectId === currentProject);
      addApiLog(method, endpoint, { count: projectRfis.length, rfis: projectRfis }, 200);
      showToast('已取得最新 RFI 資料');
    } else if (endpoint.includes('/responses') && method === 'POST') {
      addApiLog(method, endpoint, { success: true, message: 'RFI 簽核意見已送達' }, 200, payload);
      showToast('API: RFI 簽核成功', 'success');
    } else if (endpoint.includes('/users') && method === 'GET') {
      addApiLog(method, endpoint, { count: users.length, users }, 200);
      showToast('已取得專案人員列表');
    } else {
      addApiLog(method, endpoint, { message: 'Action executed successfully' }, 200, payload);
    }
  };

  const currentRfi = rfis.find((r) => r.id === selectedRfiId) || null;
  const pendingRfiCount = rfis.filter(
    (r) => r.projectId === currentProject && (r.status === '審查中' || r.status === '待處理')
  ).length;

  return (
    <div className="h-screen flex overflow-hidden bg-white text-black font-body select-none">
      {/* Left architectural monochrome rail / sidebar */}
      <Sidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        pendingRfiCount={pendingRfiCount}
        currentUser={users[0] || INITIAL_USERS[0]}
        onOpenHtmlModal={() => setIsHtmlModalOpen(true)}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onOpenNewRfi={() => setIsNewRfiOpen(true)}
      />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Header & Navigation */}
        <Header
          currentProject={currentProject}
          projects={INITIAL_PROJECTS}
          onSelectProject={handleSelectProject}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
          onOpenNewRfi={() => setIsNewRfiOpen(true)}
          onOpenHtmlModal={() => setIsHtmlModalOpen(true)}
          pendingRfiCount={pendingRfiCount}
        />

        {/* Main Workspace Tabs */}
        <main className="flex-1 overflow-hidden relative bg-white">
          {activeTab === 'gantt' && (
            <GanttChart
              tasks={tasks}
              users={users}
              currentProjectId={currentProject}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTask={() => setIsNewTaskOpen(true)}
              onSelectRfi={handleSelectRfiFromTask}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanBoard
              tasks={tasks}
              users={users}
              currentProjectId={currentProject}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              onSelectRfi={handleSelectRfiFromTask}
              onImageClick={(url, title) => setLightboxImage({ url, title })}
            />
          )}

          {activeTab === 'rfi' && (
            <RfiTracker
              rfis={rfis}
              users={users}
              currentProjectId={currentProject}
              onOpenNewRfi={() => setIsNewRfiOpen(true)}
              onOpenViewRfi={handleOpenViewRfi}
            />
          )}

          {activeTab === 'workhours' && (
            <WorkHoursView
              worklogs={worklogs}
              userRates={userRates}
              tasks={tasks}
              users={users}
              currentProjectId={currentProject}
              onOpenLogModal={() => setIsLogWorkHoursOpen(true)}
              onOpenRateModal={() => setIsEditRateOpen(true)}
              onDeleteWorkLog={handleDeleteWorkLog}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              users={users}
              tasks={tasks}
              rfis={rfis}
              onAddUser={handleAddUser}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              rfis={rfis}
              currentProjectId={currentProject}
            />
          )}

          {activeTab === 'api' && (
            <ApiConsole
              logs={apiLogs}
              onClearLogs={() => setApiLogs([])}
              onExecuteApi={handleExecuteApi}
              currentProjectId={currentProject}
              tasks={tasks}
              rfis={rfis}
              users={users}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        users={users}
        currentProjectId={currentProject}
        onCreateTask={handleCreateTask}
      />

      <NewRfiModal
        isOpen={isNewRfiOpen}
        onClose={() => setIsNewRfiOpen(false)}
        users={users}
        currentProjectId={currentProject}
        tasks={tasks}
        onCreateRfi={handleCreateRfi}
      />

      <ViewRfiModal
        isOpen={isViewRfiOpen}
        onClose={() => {
          setIsViewRfiOpen(false);
          setSelectedRfiId(null);
        }}
        rfi={currentRfi}
        users={users}
        onSubmitResponse={handleSubmitRfiResponse}
        onImageClick={(url, title) => setLightboxImage({ url, title })}
        onJumpToTask={handleJumpToTask}
      />

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage?.url || null}
        title={lightboxImage?.title || ''}
        onClose={() => setLightboxImage(null)}
      />

      <LogWorkHoursModal
        isOpen={isLogWorkHoursOpen}
        onClose={() => setIsLogWorkHoursOpen(false)}
        tasks={tasks}
        users={users}
        currentProjectId={currentProject}
        worklogs={worklogs}
        onCreateWorkLog={handleCreateWorkLog}
      />

      <EditUserRateModal
        isOpen={isEditRateOpen}
        onClose={() => setIsEditRateOpen(false)}
        users={users}
        userRates={userRates}
        onUpdateUserRate={handleUpdateUserRate}
      />

      <HtmlSourceModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        tasks={tasks}
        rfis={rfis}
        users={users}
        worklogs={worklogs}
        userRates={userRates}
        currentProjectId={currentProject}
      />

      {/* Toast Notification Container (Sharp 0px border-2 monochrome) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none font-mono">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-black border-2 border-white text-white px-4 py-2.5 flex items-center gap-3 text-xs shadow-none animate-none"
          >
            {toast.type === 'success' ? (
              <CheckCircle size={15} strokeWidth={2} className="text-white flex-none" />
            ) : toast.type === 'warning' ? (
              <AlertCircle size={15} strokeWidth={2} className="text-white flex-none" />
            ) : (
              <Info size={15} strokeWidth={2} className="text-white flex-none" />
            )}
            <span className="font-bold tracking-wide">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
