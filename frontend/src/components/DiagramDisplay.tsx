import { AlertCircle } from "lucide-react";
import React from "react"
import { DiagramDisplayProps } from "../types";

export const DiagramDisplay: React.FC<DiagramDisplayProps> = ({ diagram, index, hasError, onClick }) => {
  return (
    <div
      onClick={() => !hasError && onClick()}
      className={`diagram-display bg-white rounded-lg p-4 ${!hasError ? 'cursor-pointer hover:shadow-lg' : ''} transition-all border-2 border-gray-200`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-600 font-hand">
          {diagram.title}
        </h3>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        {hasError ? (
          <div className="flex items-center justify-center gap-2 text-red-500 p-4">
            <AlertCircle className="w-5 h-5" />
            <span>Unable to render diagram due to syntax error</span>
          </div>
        ) : (
          <div className="diagram-container w-full flex justify-center">
            <div className="mermaid w-full" key={`diagram-${index}-${diagram.mermaid}`}>
              {diagram.mermaid}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




