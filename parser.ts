  // parser.ts
  export const LIST_LINE_REGEX = /^(\s*)([-*]|\d+(?:\.\d+)*\.)\s+(.*)$/;
  export const IS_ORDERED_LIST_REGEX = /^\d+(?:\.\d+)*\.$/;

  export interface TOCNode {
    title: string;
    listSymbol: string;
    depth: number;
    children: TOCNode[];
  }

  export function parseTOCFromMarkdown(content: string): TOCNode[] {
    const lines = content.split("\n");
    const tocStart = 
        lines.findIndex((line) => 
            line
                .trim().startsWith("## ") && (line.includes("목차") || line.includes("목록"))
        );

    if (tocStart === -1) return [];
  
    const tocLines: string[] = [];

    for (let i = tocStart + 1; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(LIST_LINE_REGEX);
      
      if (match) {
        tocLines.push(line);
      } else if (line.trim() === '') {
        continue;
      } else {
        break;
      }
    }
  
    const root: TOCNode[] = [];
    const stack: { node: TOCNode; indent: number }[] = [];
  
    for (const line of tocLines) {
      const match = line.match(LIST_LINE_REGEX);
      if (!match) continue;
  
      const indent = match[1].length;
      const listSymbol = match[2];
      const title = match[3];

      const node: TOCNode = { 
        title,
        listSymbol,
        depth: indent,
        children: [] 
      };
  
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
  
      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].node.children.push(node);
      }
  
      stack.push({ node, indent });
    }
  
    return root;
  }