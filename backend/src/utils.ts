import { GoogleGenerativeAI } from "@google/generative-ai";

const SystemPrompt = `
Create a diagrammatic representation of a given text using Mermaid syntax to facilitate easy revision later and include a concise title for the diagram in JSON format.

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
    "mermaid": "<mermaid diagram 1>"
  },
  {
    "title": "<concise title 2>",
    "mermaid": "<mermaid diagram 2>"
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
    "mermaid": "graph TD;\n    A[Input] --> B[Process] --> C[Output]"
  }
]
\`\`\`

**Example 2**

*Given Text*: "The manager approves the budget, followed by implementation by the team."

*Mermaid Output*:
\`\`\`json
[
  {
    "title": "Approval and Implementation Process",
    "mermaid": "graph LR;\n    A[Manager Approval] --> B[Budget Implementation] --> C[Team Execution]"
  }
]
\`\`\`

# Notes

- Instead of a single big diagram, break the concept down into 2-3 smaller indivisible and complete diagrams and then output multiple in a list. IMPORTANT
- Consider the clarity and simplicity of the diagram to ensure it's easy to revise later.
- Do not add any extra styling, keep it simple. Just focus on making accurate diagrams and outputting valid mermaid.
- Think about alternative ways of representing complex relationships to maintain simplicity.
- Remember to choose the most effective type of diagram based on the structure and content of the provided text.
- ALWAYS GIVE VALID MERMAID SYNTAX WITHOUT ANY MISTAKES`;

export async function getDiagrams(genAI, query) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: SystemPrompt,
    });
    const result = await model.generateContent(`Text: ${query}`);
    console.log(result);
    const response = await result.response;

    const diagrams = response.text();
    console.log(diagrams);
    return JSON.parse(diagrams.replace("```json", "").replace("```", ""));
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while generating diagrams." };
  }
}
