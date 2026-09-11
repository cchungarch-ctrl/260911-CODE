export type ProjectId = 'PRJ-TEAM' | 'PRJ-001' | 'PRJ-002' | 'PRJ-003' | string;

export interface Project {
  id: ProjectId;
  name: string;
  code: string;
  location: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  email: string;
}

export type TaskDiscipline = '結構工程' | '建築設計' | '機電MEP' | '現場施工';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export interface KanbanTask {
  id: string;
  projectId: ProjectId;
  title: string;
  discipline: TaskDiscipline;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  startDate?: string;
  duedate: string;
  desc: string;
  image?: string | null;
  rfiId?: string | null;
  createdAt: string;
  color?: string;
  progress?: number;
}

export type RfiStatus = '待處理' | '審查中' | '已回覆' | '已駁回';

export interface RfiItem {
  id: string;
  projectId: ProjectId;
  subject: string;
  discipline: TaskDiscipline;
  raisedBy: string;
  assigneeId: string;
  deadline: string;
  question: string;
  image?: string | null;
  status: RfiStatus;
  impactDays: number;
  impactCost: number;
  response?: string | null;
  responseDate?: string | null;
  linkedTaskId?: string | null;
  createdAt: string;
}

export interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  payload?: unknown;
  responseData: unknown;
  status: number;
  timestamp: string;
}

export type TabType = 'gantt' | 'kanban' | 'rfi' | 'users' | 'analytics' | 'api';
