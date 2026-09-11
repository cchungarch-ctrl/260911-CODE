import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] bg-white border-2 border-black overflow-hidden shadow-none flex flex-col"
      >
        <div className="p-3 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <span className="text-xs font-bold uppercase truncate pr-4">{title}</span>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-neutral-300 p-1"
              title="Open raw image"
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              className="text-white hover:text-neutral-300 p-1 cursor-pointer font-bold"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-neutral-100">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[80vh] object-contain border-2 border-black grayscale contrast-125"
          />
        </div>
      </div>
    </div>
  );
};
