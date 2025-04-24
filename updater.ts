import { TOCNode } from "./parser";
import { MarkdownView, TFile, App } from "obsidian";

export async function generateTOCLinkedSections(view: MarkdownView) {
  const file = view.file;
  if (!file) return;

  const content = await view.app.vault.read(file);
  const tocTree = parseTOCFromMarkdown(content);

  const updatedLines = content.split("\n");
  const insertedLines: string[] = [];

  function insertSection(node: TOCNode, level: number) {
    const id = slugify(node.title);
    const headingPrefix = "#".repeat(level);
    insertedLines.push(`${headingPrefix} ${node.title} ^${id}`);
    insertedLines.push("");
    for (const child of node.children) {
      insertSection(child, level + 1);
    }
  }

  const headerIndex = updatedLines.findIndex((line) => line.trim().startsWith("## 목차"));
  const tocStart = headerIndex + 1;
  let tocEnd = tocStart;
  while (tocEnd < updatedLines.length && /^\s*([-*]|\d+\.)\s+/.test(updatedLines[tocEnd])) {
    tocEnd++;
  }

  const tocSection = updatedLines.slice(tocStart, tocEnd);
  const linkifiedTOC = tocTree.map(node => linkifyTOCNode(node)).flat();

  updatedLines.splice(tocStart, tocEnd - tocStart, ...linkifiedTOC);

  // append missing sections at the end of the document (or could be more intelligent in the future)
  insertedLines.push("", "---", "");
  for (const node of tocTree) {
    insertSection(node, 2); // start at ## level
  }

  const newContent = [...updatedLines, ...insertedLines].join("\n");
  await view.app.vault.modify(file, newContent);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "");
}

function linkifyTOCNode(node: TOCNode, level: number = 0): string[] {
  const indent = "  ".repeat(level);
  const id = slugify(node.title);
  const line = `${indent}- [${node.title}](#${id})`;
  const children = node.children.map(child => linkifyTOCNode(child, level + 1)).flat();
  return [line, ...children];
}

import { parseTOCFromMarkdown } from "./parser";
