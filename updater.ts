import { TOCNode, parseTOCFromMarkdown, IS_ORDERED_LIST_REGEX } from "./parser";
import { MarkdownView } from "obsidian";

export async function generateTOCLinkedSections(view: MarkdownView) {
  const file = view.file;
  if (!file) return;

  const content = await view.app.vault.read(file);
  const tocTree = parseTOCFromMarkdown(content);

  const updatedLines = content.split("\n");
  const insertedLines: string[] = [];

  const existingTItles = new Set<string>();
  for (const line of updatedLines) {
    const match = line.match(/^#+\s+(.*?)(\s+\^.*)?$/);
    if (match) {
      const title = match[1].trim();
      existingTItles.add(title);
    }
  }

  
  const headerIndex = updatedLines.findIndex((line) =>
    line.trim().startsWith("## 목차")
  );
  if (headerIndex === -1) return;

  const tocStart = headerIndex + 1;
  let tocEnd = tocStart;
  while (
      tocEnd < updatedLines.length &&
      (/^\s*(([-*])|(\d+(\.\d+)*\.))\s+/.test(updatedLines[tocEnd]) || updatedLines[tocEnd].trim() === "")
  ) {
      tocEnd++;
  }

  const linkifiedTOC = tocTree.map(node => linkifyTOCNode(node)).flat();
  updatedLines.splice(tocStart, tocEnd - tocStart, ...linkifiedTOC);
  
  insertedLines.push("", "---", "");
  for (const node of tocTree) {
      insertSection(node, 2);
    }
    
    const newContent = [...updatedLines, ...insertedLines].join("\n");
    await view.app.vault.modify(file, newContent);

    function insertSection(node: TOCNode, level: number) {
      const id = slugify(node.title);

      if (!existingTItles.has(node.title)) {
        const headingPrefix = "#".repeat(level);
        insertedLines.push(`${headingPrefix} ${node.listSymbol}. ${node.title} ^${id}`);
        insertedLines.push(`[🔝 목차로](#목차)`);
        insertedLines.push("");
      }

      const isOrdered = IS_ORDERED_LIST_REGEX.test(node.listSymbol);
      const symbolBase = isOrdered ? "." : node.listSymbol;
      node.children.forEach((child, index) => {
        const prefix = isOrdered ? `${index + 1}${symbolBase}` : symbolBase;
        insertedLines.push(`${prefix} ${child.title} ^${slugify(child.title)}`);
      });

      insertedLines.push("");
      node.children.forEach(child => insertSection(child, level + 1));
    }
}

function slugify(text: string): string {
    const safeText = (text ?? "").toString();
//   return text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "");
  return safeText.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "");
}

function linkifyTOCNode(node: TOCNode, level: number = 0): string[] {
  const indent = "  ".repeat(level);
  const id = slugify(node.title);
  const line = `${indent}${node.listSymbol} [${node.title}](#${id})`;
  const children = node.children.map(child => linkifyTOCNode(child, level + 1)).flat();
  return [line, ...children];
}
