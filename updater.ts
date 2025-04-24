import { TOCNode, parseTOCFromMarkdown, IS_ORDERED_LIST_REGEX } from "./parser";
import { romanize } from "@romanize/korean";
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

    // for (const node of tocTree) {
    //     const isLastRoot = 
    //     insertSection(node, 2);
    // }

    tocTree.forEach((node, index) => {
        const isLastRoot = index === tocTree.length - 1;
        insertSection(node, 2, isLastRoot);
    });
    
    const newContent = [...updatedLines, ...insertedLines].join("\n");
    await view.app.vault.modify(file, newContent);

    function insertSection(node: TOCNode, level: number, isLastRoot: boolean = false) {

        if (!existingTItles.has(node.title)) {
            const headingPrefix = "#".repeat(level);
            insertedLines.push(`${headingPrefix} ${node.listSymbol} ${node.title}`);
            insertedLines.push(`[🔝 목차로](#목차)`);
            // insertedLines.push("");
        }

        node.children.forEach(child => {
            insertSection(child, level + 1);
            insertedLines.push("");
        });

        if (level === 2 && !isLastRoot) {
            insertedLines.push("");
            insertedLines.push("");
        }
    }
}

function slugify(text: string): string {
    const safeText = (text ?? "").toString();
    return encodeURIComponent(safeText);
}

function linkifyTOCNode(node: TOCNode, level: number = 0): string[] {
  const indent = "\t".repeat(level);
  const id = slugify(node.listSymbol + " " +node.title);
  const line = `${indent}${node.listSymbol} [${node.title}](#${id})`;
  const children = node.children.map(child => linkifyTOCNode(child, level + 1)).flat();
  return [line, ...children];
}
