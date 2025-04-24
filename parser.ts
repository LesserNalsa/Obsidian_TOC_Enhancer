export interface TOCNode {
    title: string;
    depth: number;
    children: TOCNode[];
  }
  
  export function parseTOCFromMarkdown(content: string): TOCNode[] {
    const lines = content.split("\n");
    const tocStart = lines.findIndex((line) => line.trim().startsWith("## ") && line.includes("목차"));
    if (tocStart === -1) return [];
  
    const tocLines: string[] = [];
    for (let i = tocStart + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
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
      const match = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (!match) continue;
  
      const indent = match[1].length;
      const title = match[3].trim();
      const node: TOCNode = { title, depth: indent, children: [] };
  
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