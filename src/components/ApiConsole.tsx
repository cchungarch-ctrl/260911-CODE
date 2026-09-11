import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Trash2,
  Network,
  Monitor,
  Plug,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { ApiLog, ProjectId, KanbanTask, RfiItem, User } from '../types';

interface ApiConsoleProps {
  logs: ApiLog[];
  onClearLogs: () => void;
  onExecuteApi: (method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, payload?: unknown) => void;
  currentProjectId: ProjectId;
  tasks: KanbanTask[];
  rfis: RfiItem[];
  users: User[];
}

export const ApiConsole: React.FC<ApiConsoleProps> = ({
  logs,
  onClearLogs,
  onExecuteApi,
  currentProjectId,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'GET_TASKS' | 'POST_TASK' | 'GET_RFIS' | 'POST_RFI_RESPONSE' | 'GET_USERS'>('GET_TASKS');
  const [payloadText, setPayloadText] = useState(
    '// HTTP GET /api/v1/projects/' + currentProjectId + '/tasks\n// Header: Authorization: Bearer JWT_TOKEN_HERE'
  );

  const handleSelectEndpoint = (ep: 'GET_TASKS' | 'POST_TASK' | 'GET_RFIS' | 'POST_RFI_RESPONSE' | 'GET_USERS') => {
    setSelectedEndpoint(ep);
    if (ep === 'GET_TASKS') {
      setPayloadText(`// HTTP GET /api/v1/projects/${currentProjectId}/tasks\n// Header: Authorization: Bearer JWT_TOKEN_HERE`);
    } else if (ep === 'POST_TASK') {
      setPayloadText(
        JSON.stringify(
          {
            title: '機電水箱給水管壓降測試紀錄',
            discipline: '機電MEP',
            priority: 'high',
            assigneeId: 'usr_4',
            duedate: '2026-09-30',
            desc: '配合消防及水利審查，進行壓力測試與紀錄照片上傳。',
          },
          null,
          2
        )
      );
    } else if (ep === 'GET_RFIS') {
      setPayloadText(`// HTTP GET /api/v1/rfis?projectId=${currentProjectId}&status=all`);
    } else if (ep === 'POST_RFI_RESPONSE') {
      setPayloadText(
        JSON.stringify(
          {
            rfiId: 'RFI-2026-001',
            status: '已回覆',
            response: '經結構計算核定，同意依照新修訂圖號 S-105 加設翼板鋼鈑補強筋，工期展延 1 天。',
            impactDays: 1,
            impactCost: 50000,
          },
          null,
          2
        )
      );
    } else if (ep === 'GET_USERS') {
      setPayloadText(`// HTTP GET /api/v1/users\n// 查詢當前組織工程師、技師與建築師清單`);
    }
  };

  const handleSend = () => {
    if (selectedEndpoint === 'GET_TASKS') {
      onExecuteApi('GET', `/api/v1/projects/${currentProjectId}/tasks`);
    } else if (selectedEndpoint === 'POST_TASK') {
      try {
        const parsed = JSON.parse(payloadText);
        onExecuteApi('POST', '/api/v1/tasks', parsed);
      } catch {
        onExecuteApi('POST', '/api/v1/tasks', { error: 'Invalid JSON payload' });
      }
    } else if (selectedEndpoint === 'GET_RFIS') {
      onExecuteApi('GET', `/api/v1/rfis?projectId=${currentProjectId}`);
    } else if (selectedEndpoint === 'POST_RFI_RESPONSE') {
      try {
        const parsed = JSON.parse(payloadText);
        onExecuteApi('POST', `/api/v1/rfis/${parsed.rfiId || 'RFI-2026-001'}/responses`, parsed);
      } catch {
        onExecuteApi('POST', '/api/v1/rfis/RFI-2026-001/responses', { error: 'Invalid JSON payload' });
      }
    } else if (selectedEndpoint === 'GET_USERS') {
      onExecuteApi('GET', '/api/v1/users');
    }
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-y-auto bg-white text-black font-body">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Architecture Banner */}
        <div className="border-2 border-black p-6 bg-neutral-50 text-black font-mono">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-black text-white flex-none">
              <Network size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1 text-black">
                DECOUPLED FRONT-END & BACK-END ARCHITECTURE (前後端分離系統)
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4 font-body">
                The client SPA operates via asynchronous JSON payloads conforming strictly to RESTful specifications. The front-end renders all views in responsive HTML5/Tailwind and communicates with the backend via stateless HTTP interfaces.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-white p-3 border border-black">
                  <span className="font-bold flex items-center gap-1.5 mb-1 uppercase">
                    <Monitor size={12} /> CLIENT SPA
                  </span>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    Zero-radius UI, FileReader Base64, HTML5 drag-and-drop state machines.
                  </p>
                </div>
                <div className="bg-white p-3 border border-black">
                  <span className="font-bold flex items-center gap-1.5 mb-1 uppercase">
                    <Plug size={12} /> REST ENDPOINTS
                  </span>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    Standard contracts: /tasks, /rfis, /users. Supports JWT Bearer & RBAC.
                  </p>
                </div>
                <div className="bg-white p-3 border border-black">
                  <span className="font-bold flex items-center gap-1.5 mb-1 uppercase">
                    <Database size={12} /> CLOUD DB & STORAGE
                  </span>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    Relational PostgreSQL schema with S3/GCS immutable object storage buckets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive API Tester & Log Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {/* Left: Request Tester */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={14} strokeWidth={2} />
                  <span>REST INTERFACE CONSOLE</span>
                </h4>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                  CLIENT READY
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1 uppercase">SELECT TARGET ENDPOINT</label>
                  <select
                    value={selectedEndpoint}
                    onChange={(e) => handleSelectEndpoint(e.target.value as any)}
                    className="w-full bg-white text-xs text-black border-2 border-black p-2 font-mono font-bold focus:outline-none cursor-pointer uppercase"
                  >
                    <option value="GET_TASKS">GET /api/v1/projects/:id/tasks</option>
                    <option value="POST_TASK">POST /api/v1/tasks</option>
                    <option value="GET_RFIS">GET /api/v1/rfis</option>
                    <option value="POST_RFI_RESPONSE">POST /api/v1/rfis/:id/responses</option>
                    <option value="GET_USERS">GET /api/v1/users</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1 uppercase">REQUEST PAYLOAD (JSON)</label>
                  <textarea
                    rows={7}
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    className="w-full bg-neutral-50 font-mono text-xs text-black border-2 border-black p-3 focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="w-full mt-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 border-2 border-black transition-none flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
            >
              <Send size={14} />
              <span>DISPATCH HTTP REQUEST</span>
            </button>
          </div>

          {/* Right: Server Logs & Response */}
          <div className="border-2 border-black p-6 bg-white flex flex-col">
            <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} strokeWidth={2} />
                <span>SERVER TELEMETRY LOGS</span>
              </h4>
              <button
                onClick={onClearLogs}
                className="text-xs hover:underline flex items-center gap-1 cursor-pointer uppercase font-bold"
              >
                <Trash2 size={12} />
                <span>CLEAR</span>
              </button>
            </div>

            <div className="flex-1 bg-black text-white p-4 font-mono text-xs overflow-y-auto max-h-[380px] space-y-3">
              {logs.length === 0 ? (
                <div className="text-neutral-500 italic py-8 text-center uppercase">
                  // TELEMETRY ACTIVE. STANDBY FOR CALLS...
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border border-neutral-700 bg-neutral-900 text-xs font-mono space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">
                        [HTTP {log.method}] <span className="text-neutral-400">{log.endpoint}</span>
                      </span>
                      <span className="font-bold border border-white px-1.5 py-0.5 text-[10px]">
                        STATUS: {log.status} ({log.timestamp})
                      </span>
                    </div>
                    {log.payload && (
                      <div className="text-neutral-400 text-[10px]">
                        Payload: {JSON.stringify(log.payload)}
                      </div>
                    )}
                    <pre className="text-neutral-200 overflow-x-auto text-[10px] bg-black p-2 border border-neutral-800 max-h-40">
                      {JSON.stringify(log.responseData, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
