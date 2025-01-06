import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';

const DiagramGenerator = () => {
  const [text, setText] = useState('');
  const [diagrams, setDiagrams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        fontFamily: 'Gloria Hallelujah, cursive',
        primaryColor: '#4B5563',
        primaryTextColor: '#111827',
        primaryBorderColor: '#4B5563',
        lineColor: '#4B5563',
        secondaryColor: '#6B7280',
        tertiaryColor: '#9CA3AF',
      },
      flowchart: {
        curve: 'basis',
        nodeSpacing: 60,
        rankSpacing: 60,
        useMaxWidth: false,
        htmlLabels: true,
      },
      sequence: {
        mirrorActors: false,
        bottomMarginAdj: 10,
        messageMargin: 40,
        noteMargin: 10,
        useMaxWidth: true,
      },
      securityLevel: 'loose'
    });
  }, []);

  const generateDiagrams = async (text) => {
    const response = await axios.post('http://localhost:8787/api/v1/', { query: text });
    return response.data;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const generatedDiagrams = await generateDiagrams(text);
    setDiagrams(generatedDiagrams);
    setIsLoading(false);
  };

  useEffect(() => {
    if (diagrams.length > 0) {
      renderDiagrams();
    }
  }, [diagrams]);

  useEffect(() => {
    if (selectedDiagram) {
      setTimeout(() => {
        renderModalDiagram();
      }, 0);
    } else {
      renderDiagrams();
    }
  }, [selectedDiagram]);

  const renderDiagrams = () => {
    document.querySelectorAll('.diagram-grid .mermaid').forEach((element) => {
      element.removeAttribute('data-processed');
      element.innerHTML = element.getAttribute('data-diagram');
    });
    mermaid.contentLoaded();
  };

  const renderModalDiagram = () => {
    const modalElement = document.querySelector('.diagram-modal .mermaid');
    if (modalElement) {
      try {
        modalElement.removeAttribute('data-processed');
        modalElement.innerHTML = selectedDiagram.mermaid;
        mermaid.contentLoaded();
      } catch (error) {
        console.error('Error rendering modal diagram:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="bg-white rounded-lg p-6 mb-8 border-2 border-gray-200 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 font-hand">
            Sketchify
          </h1>
          <div className="space-y-4">
            <textarea
              placeholder="Type something to generate hand-drawn diagrams..."
              className="w-full min-h-[160px] p-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none placeholder-gray-400 font-sans"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={!text || isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sketching...
                </>
              ) : (
                '✏️ Draw'
              )}
            </button>
          </div>
        </div>

        {diagrams.length > 0 && (
          <div className="diagram-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {diagrams.map((diagram, index) => (
              <div
                key={index}
                onClick={() => setSelectedDiagram(diagram)}
                className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-gray-200"
              >
                <h3 className="text-sm font-medium text-gray-600 mb-3 font-hand">
                  {diagram.title}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="diagram-container w-full flex justify-center">
                    <div
                      className="mermaid w-full"
                      data-diagram={diagram.mermaid}
                    >
                      {diagram.mermaid}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDiagram && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col">
              <div className="p-3 border-b-2 border-gray-100 flex justify-between items-center flex-shrink-0">
                <h3 className="text-sm font-medium text-gray-600 font-hand">
                  {selectedDiagram.title}
                </h3>
                <button
                  onClick={() => setSelectedDiagram(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="diagram-modal bg-gray-50 flex-1 p-8">
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="mermaid"
                    key={selectedDiagram.mermaid} // Force re-render on content change
                  >
                    {selectedDiagram.mermaid}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap');
          
          .font-hand {
            font-family: 'Gloria Hallelujah', cursive;
          }

          /* Custom styles for Mermaid diagrams */
          .mermaid {
            font-family: 'Gloria Hallelujah', cursive !important;
          }
          
          /* Grid view diagram styles */
          .diagram-grid .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
          }
          
          .diagram-modal .mermaid svg {
  width: 100% !important;
  height: auto !important;
  max-width: none !important;  /* Remove artificial width limit */
  max-height: 80vh !important; /* Still cap the height for scrolling */
}
          
          .mermaid path {
            stroke-width: 2px !important;
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
          }
          
          .mermaid rect, .mermaid circle, .mermaid polygon {
            fill: #fff !important;
            stroke-width: 2px !important;
          }
          
          .mermaid .node rect {
            rx: 8px !important;
            ry: 8px !important;
          }
          
          .mermaid .edgePath {
            stroke-dasharray: 5, 5 !important;
          }
          
          .mermaid text {
            font-size: 16px !important;
          }
          
          @media (min-width: 1024px) {
            .mermaid text {
              font-size: 18px !important;
            }
          }

          .diagram-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </div>
  );
};

export default DiagramGenerator;
