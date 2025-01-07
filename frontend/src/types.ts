type Diagram = {
  title: string;
  mermaid: string;
};

type DiagramExample = {
  title: string;
  text: string;
};

type CachedExamples = {
  [key: string]: Diagram[];
};

type DiagramErrors = {
  [key: number]: boolean;
};

type DiagramDisplayProps = {
  diagram: Diagram;
  index: number;
  hasError: boolean;
  onClick: () => void;
};

type DiagramModalProps = {
  diagram: Diagram;
  onClose: () => void;
};

type DiagramGeneratorProps = {
  // Add props if needed for the main component
};

// Extend the global namespace for environment variables
declare global {
  interface ImportMetaEnv {
    VITE_BACKEND_URL: string;
  }
}

export type {
  Diagram,
  DiagramExample,
  CachedExamples,
  DiagramErrors,
  DiagramDisplayProps,
  DiagramModalProps,
  DiagramGeneratorProps,
};
