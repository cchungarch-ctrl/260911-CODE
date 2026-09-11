import React, { useState } from 'react';
import { X, Copy, Check, Download, Monitor, Code2 } from 'lucide-react';
import { generateStandaloneHtml } from '../../utils/generateHtml';
import { KanbanTask, RfiItem, User, WorkLog, UserRate, ProjectId } from '../../types';

interface HtmlSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: KanbanTask[];
  rfis: RfiItem[];
  users: User[];
  worklogs: WorkLog[];
  userRates: UserRate[];
  currentProjectId: ProjectId;
}

export const HtmlSourceModal: React.FC<HtmlSourceModalProps> = ({
  isOpen,
  onClose,
  tasks,
  rfis,
  users,
  worklogs,
  userRates,
  currentProjectId,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateStandaloneHtml({
    tasks,
    rfis,
    users,
    worklogs,
    userRates,
    currentProjectId,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexuspm-standalone-preview.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-6 font-mono">
      <div className="bg-white border-2 border-black w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-none">
        {/* Modal Header */}
        <div className="p-4 border-b-2 border-black flex flex-wrap items-center justify-between gap-3 bg-white flex-none">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center">
              <Code2 size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase text-black tracking-wider flex items-center gap-2">
                STANDALONE HTML5 CLIENT BUNDLE & EXPORT
              </h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                OFFLINE-CAPABLE ZERO-DEPENDENCY MONOLITHIC SPECIFICATION
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tab switch */}
            <div className="border-2 border-black flex text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 transition-none flex items-center gap-1.5 cursor-pointer uppercase font-bold ${
                  activeTab === 'preview'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                <Monitor size={12} />
                PREVIEW
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 transition-none flex items-center gap-1.5 cursor-pointer uppercase font-bold border-l-2 border-black ${
                  activeTab === 'code'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                <Code2 size={12} />
                SOURCE
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="bg-white hover:bg-neutral-100 text-black text-xs px-3 py-1.5 border-2 border-black flex items-center gap-1 cursor-pointer uppercase font-bold transition-none"
              title="Copy to clipboard"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-black hover:bg-neutral-800 text-white text-xs px-3 py-1.5 border-2 border-black flex items-center gap-1 cursor-pointer uppercase font-bold transition-none"
              title="Download HTML"
            >
              <Download size={12} />
              <span>DOWNLOAD</span>
            </button>

            <button
              onClick={onClose}
              className="text-black hover:bg-neutral-200 p-1 cursor-pointer font-bold border-2 border-black"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-3 bg-neutral-100">
          {activeTab === 'preview' ? (
            <iframe
              title="Standalone HTML Preview"
              srcDoc={htmlContent}
              className="w-full h-full border-2 border-black bg-white"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            />
          ) : (
            <textarea
              readOnly
              value={htmlContent}
              className="w-full h-full font-mono text-xs text-black bg-white border-2 border-black p-4 focus:outline-none select-all"
            />
          )}
        </div>
      </div>
    </div>
  );
};
