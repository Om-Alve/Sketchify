import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import axios from 'axios';
import { X, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { DiagramErrors, CachedExamples, DiagramDisplayProps, DiagramModalProps, DiagramExample, Diagram } from '../types.ts'

const CACHED_EXAMPLES: CachedExamples = {
  "Simple Flowchart": [
    {
      "title": "Login Flow - Basic",
      "mermaid": "graph LR\n    A[Enter Credentials] --> B{Valid?}\n    B -- Yes --> C[Dashboard]\n    B -- No --> D[Error Message]\n    D --> A"
    },
    {
      "title": "Login Flow - Detail",
      "mermaid": "graph LR\n    A[User Enters Credentials] --> B{Credentials Valid?}\n    B -- Yes --> C[Redirect to Dashboard]\n    B -- No --> D[Display Error Message]\n    D --> E[Prompt User to Re-enter Credentials]\n     E --> A"
    }
  ],
  "Software Architecture": [
    {
      "title": "System Architecture - Main Flow",
      "mermaid": "graph LR;\n    A[Frontend] --> B(API Gateway);\n    B --> C{Auth Service};\n    B --> D{Data Service};\n    D --> E[Database];"
    },
    {
      "title": "API Gateway Routing",
      "mermaid": "graph LR;\n    A[API Gateway] -->|Auth Request| B{Auth Service};\n    A -->|Data Request| C{Data Service};"
    }
  ],
  "State Machine": [
    {
      "title": "Traffic Light State Transitions",
      "mermaid": "stateDiagram-v2\n    [*] --> Red\n    Red --> Green : Timer (30s)\n    Green --> Yellow : Timer (5s)\n    Yellow --> Red : Timer (3s)"
    },
    {
      "title": "Traffic Light Timing Details",
      "mermaid": "graph LR\n    A[Red] -->|30s| B(Green)\n    B -->|5s| C(Yellow)\n    C -->|3s| A"
    }
  ],
  "Project Timeline": [
    {
      "title": "Add Item to Cart Sequence",
      "mermaid": "sequenceDiagram\n    participant Customer\n    participant System\n    Customer->>System: Add item to cart\n    System-->>Customer: Item added to cart"
    },
    {
      "title": "Checkout Process Sequence",
      "mermaid": "sequenceDiagram\n    participant Customer\n    participant System\n    Customer->>System: Initiate checkout\n    System->>System: Check inventory\n    System->>System: Process payment\n    System-->>Customer: Confirmation email"
    }
  ]
};

const EXAMPLES: DiagramExample[] = [
  {
    title: "Simple Flowchart",
    text: "Create a flowchart showing user login flow: start with 'Enter Credentials', if valid go to 'Dashboard', if invalid show 'Error Message' and return to credentials"
  },
  {
    title: "Software Architecture",
    text: "Draw a system architecture diagram showing: Frontend connects to API Gateway, which routes to Auth Service and Data Service. Data Service connects to Database."
  },
  {
    title: "Project Timeline",
    text: "Create a sequence diagram for an e-commerce checkout: Customer adds item to cart, system checks inventory, if available process payment, then send confirmation email"
  },
  {
    title: "State Machine",
    text: "Make a state diagram for a traffic light system showing the transitions between Red, Yellow, and Green states with appropriate timing"
  }
];

const DiagramDisplay: React.FC<DiagramDisplayProps> = ({ diagram, index, hasError, onClick }) => {
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

const DiagramModal: React.FC<DiagramModalProps> = ({ diagram, onClose }) => {
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

const DiagramGenerator = () => {
  const [text, setText] = useState<string>('');
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [diagramErrors, setDiagramErrors] = useState<DiagramErrors>({});
  const [activeExample, setActiveExample] = useState<number | null>(null);

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

  const generateDiagrams = async (inputText: string) => {
    const matchingExample = EXAMPLES.find(example => example.text === inputText);
    if (matchingExample && CACHED_EXAMPLES[matchingExample.title]) {
      return CACHED_EXAMPLES[matchingExample.title];
    }

    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL, { query: inputText });
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  const validateMermaidSyntax = async (mermaidCode: string) => {
    try {
      await mermaid.parse(mermaidCode);
      return true;
    } catch (error) {
      console.error('Mermaid syntax error:', error);
      return false;
    }
  };

  const handleGenerate = async (textToGenerate?: string) => {
    const inputText = textToGenerate || text;
    if (!inputText.trim()) return;

    setIsLoading(true);
    setDiagramErrors({});
    setDiagrams([]);

    try {
      const generatedDiagrams = await generateDiagrams(inputText);
      const errors: DiagramErrors = {};

      await Promise.all(
        generatedDiagrams.map(async (diagram: Diagram, index: number) => {
          const isValid = await validateMermaidSyntax(diagram.mermaid);
          if (!isValid) {
            errors[index] = true;
          }
        })
      );

      setDiagramErrors(errors);
      setDiagrams(generatedDiagrams);

      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    } catch (error) {
      console.error('Error generating diagrams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = async (example: DiagramExample, index: number) => {
    setText(example.text);
    setActiveExample(index);
    await handleGenerate(example.text);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };
  useEffect(() => {
    if (selectedDiagram) {
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [selectedDiagram]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="bg-white rounded-lg p-6 mb-8 border-2 border-gray-200 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 font-hand">
            Sketchify
          </h1>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Try these examples:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAMPLES.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example, index)}
                  className={`p-3 text-left rounded-lg transition-all text-sm ${activeExample === index
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                    : 'hover:bg-gray-50 border-2 border-gray-100'
                    }`}
                >
                  <div className="font-medium mb-1">{example.title}</div>
                  <div className="text-gray-600 line-clamp-2">{example.text}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              placeholder="Type something to generate hand-drawn diagrams..."
              className="w-full min-h-[160px] p-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none placeholder-gray-400 font-sans"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={!text.trim() || isLoading}
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
              <DiagramDisplay
                key={`${index}-${diagram.mermaid}`}
                diagram={diagram}
                index={index}
                hasError={diagramErrors[index]}
                onClick={() => setSelectedDiagram(diagram)}
              />
            ))}
          </div>
        )}

        {selectedDiagram && (
          <DiagramModal
            diagram={selectedDiagram}
            onClose={() => setSelectedDiagram(null)}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap');
          
          .font-hand {
            font-family: 'Gloria Hallelujah', cursive;
          }

          .mermaid {
            font-family: 'Gloria Hallelujah', cursive !important;
          }
          
          .diagram-grid .mermaid svg {
            max-width: 100% !important;
            height: auto !important;
          }
          
          .diagram-modal .mermaid svg {
            width: 100% !important;
            height: auto !important;
            max-width: none !important;
            max-height: 80vh !important;
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
