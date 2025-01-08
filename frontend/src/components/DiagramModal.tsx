import React, { useEffect } from "react";
import { X } from "lucide-react";
import { DiagramModalProps } from "../types";

export const DiagramModal: React.FC<DiagramModalProps> = ({ diagram, onClose }) => {
  useEffect(() => {
    const modalContainer = document.querySelector('.diagram-modal .mermaid');
    if (modalContainer) {
      const svg = modalContainer.querySelector('svg');
      if (svg) {
        svg.style.minWidth = '600px';
        svg.style.width = 'auto';
        svg.style.maxWidth = '100%';
        svg.style.maxHeight = '70vh';
      }
    }
  }, [diagram]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-[90vw] max-w-6xl flex flex-col">
        <div className="p-3 border-b-2 border-gray-100 flex justify-between items-center flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-600 font-hand">
            {diagram.title}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="diagram-modal bg-gray-50 flex-1 p-8 overflow-auto">
          <div className="w-full h-full flex items-center justify-center">
            <div className="mermaid w-full" key={`modal-${diagram.mermaid}`}>
              {diagram.mermaid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
