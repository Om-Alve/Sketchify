import { GoogleGenerativeAI } from "@google/generative-ai";

const SystemPrompt = `
Create a diagrammatic representation of a given text using Mermaid syntax to facilitate easy revision later and include a concise title for the diagram in JSON format. IMPORTANT NOTE: Text after arrows should be in ||. For example: A[Data] -->|Encapsulation| B(Application)
# Steps

1. **Identify Key Components**: Analyze the text to pinpoint main ideas, processes, or hierarchical structures that need to be represented.
2. **Select Diagram Type**: Determine the most suitable diagram type (e.g., flowchart, sequence diagram, tree chart) based on the structure of the content, keep it simple.
3. **Create Mermaid Syntax**: Convert identified components and their relationships into Mermaid syntax for the selected diagram type. Make sure the syntax is valid!
4. **Review and Adjust**: Ensure the diagram accurately reflects the text and is formatted correctly in Mermaid syntax for clarity and future revision.
5. **Ensure Manageable Size**: Adjust the syntax to ensure that the resulting diagram is not too large to render easily on a standard screen.

# Output Format

- Output each diagram as a JSON object and list multiple diagrams as an array of such objects.
- Each JSON object should include a "title" field with a concise title of the diagram and a "mermaid" field containing the Mermaid syntax as a plain text representation suitable for rendering as a diagram.

# MAKE SURE TO USE THE FOLLOWING OUTPUT FORMAT:
[
  {
    "title": "<concise title 1>",
    "mermaid": \'<mermaid diagram 1>\'
  },
  {
    "title": "<concise title 2>",
    "mermaid": \'<mermaid diagram 2>\'
  }
]

# Examples

**Example 1**

*Given Text*: "A process starts with input, which is then processed and results in output."

*Mermaid Output*:
\`\`\`json
[
  {
    "title": "Basic Process Flow",
    "mermaid": \`graph TD;\n    A[Input] --> B[Process] --> C[Output]\`
  }
]
\`\`\`

**Example 2 Wrap text on arrows using |<text>| (IMPORTANT!!!!)**

Given Text: "Orders get validated, then payments are processed with a success or failure outcome"

Mermaid Output:

\`\`\`json
[
  {
    "title": "Order Processing Flow",
    "mermaid": \`graph LR;\n    A[Order] -->|validation| B[Payment]\n    B -->|success| C[Complete]\n    B -->|failure| D[Rejected]\`
  }
]
\`\`\`

# Notes

- Instead of a single big diagram, break the concept down into 2-3 smaller indivisible and complete diagrams and then output multiple in a list. IMPORTANT
- Consider the clarity and simplicity of the diagram to ensure it's easy to revise later.
- Do not add any extra styling, keep it simple. Just focus on making accurate diagrams and outputting valid mermaid.
- Think about alternative ways of representing complex relationships to maintain simplicity.
- Remember to choose the most effective type of diagram based on the structure and content of the provided text.
- ALWAYS GIVE VALID MERMAID SYNTAX WITHOUT ANY MISTAKES
`;

function validateMermaidSyntax(syntax: string): boolean {
  try {
    const validTypes = [
      "graph",
      "flowchart",
      "sequenceDiagram",
      "classDiagram",
      "stateDiagram",
      "erDiagram",
      "gantt",
      "pie",
    ];

    const firstLine = syntax.trim().split("\n")[0].trim();
    const hasValidStart = validTypes.some((type) => firstLine.startsWith(type));

    if (!hasValidStart) {
      console.error("Invalid diagram type:", firstLine);
      return false;
    }

    const lines = syntax.trim().split("\n");
    for (const line of lines) {
      const openBrackets = (line.match(/[\[({]/g) || []).length;
      const closeBrackets = (line.match(/[\])}]/g) || []).length;

      if (openBrackets !== closeBrackets) {
        console.error("Unmatched brackets in line:", line);
        return false;
      }

      const validArrows = ["-->", "--->", "==>", "-.->"];
      if (line.includes(">")) {
        const hasValidArrow = validArrows.some((arrow) => line.includes(arrow));
        if (!hasValidArrow) {
          console.error("Invalid arrow syntax in line:", line);
          return false;
        }
      }
    }
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}

function validateDiagrams(diagrams: any[]): boolean {
  if (!Array.isArray(diagrams)) {
    console.error("Response is not an array");
    return false;
  }

  for (const diagram of diagrams) {
    if (!diagram.title || typeof diagram.title !== "string") {
      console.error("Missing or invalid title");
      return false;
    }

    if (!diagram.mermaid || typeof diagram.mermaid !== "string") {
      console.error("Missing or invalid mermaid syntax");
      return false;
    }

    const sanitizedSyntax = sanitizeMermaidSyntax(diagram.mermaid).replace(
      /(\[?\w+[\w\s()[\]{}]*?\]?)\s*-->\s*(\w+)\s+(\[?\w+[\w\s()[\]{}]*?\]?)/g,
      "$1 -->|$2| $3",
    );
    const isValid = validateMermaidSyntax(sanitizedSyntax);

    if (!isValid) {
      console.error("Invalid mermaid syntax in diagram:", diagram.title);
      return false;
    }

    diagram.mermaid = sanitizedSyntax;
  }

  return true;
}

function sanitizeMermaidSyntax(syntax: string): string {
  if (!syntax || typeof syntax !== "string") {
    console.error("Invalid input: syntax must be a non-empty string");
    return "";
  }

  let sanitized = syntax
    .replace(/[^\w\s\->,()[\]{}:;="'#./]+/g, "")
    .replace(/javascript:/gi, "")
    .replace(/<script/gi, "")
    .trim();

  sanitized = sanitized.replace(/(\w)(-->|---|==>|-.->)(\w)/g, "$1 $2 $3");

  const lines = sanitized.split("\n");
  const validatedLines = lines.map((line) => {
    line = line.replace(/--+>/g, "-->");
    line = line.replace(/==+>/g, "==>");
    line = line.replace(/-\.+->/g, "-.->");

    line = line.replace(/\[([^\]]+)\]/g, "[$1]");
    line = line.replace(/\(([^)]+)\)/g, "($1)");

    return line;
  });

  return validatedLines.join("\n");
}

export async function getDiagrams(
  genAI: any,
  query: string,
  maxRetries = 3,
): Promise<any> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: SystemPrompt,
      });

      const result = await model.generateContent(`Text: ${query}`);
      const response = await result.response;
      let rawDiagrams = response.text();

      const cleanedResponse = rawDiagrams
        .replace(/```json\s*|\s*```/g, "")
        .trim();

      const diagrams = JSON.parse(cleanedResponse);
      const isValid = validateDiagrams(diagrams);

      if (isValid) {
        return diagrams;
      }

      console.log(
        `Attempt ${attempts + 1}: Invalid Mermaid syntax, retrying...`,
      );
      attempts++;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;

      if (attempts === maxRetries) {
        return {
          error: "Failed to generate valid diagrams after multiple attempts",
          details: error.message,
        };
      }
    }
  }

  return {
    error: "Maximum retry attempts reached without successful validation",
  };
}
