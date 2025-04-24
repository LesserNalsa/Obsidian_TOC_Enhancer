import { Plugin, MarkdownView } from 'obsidian';
import { generateTOCLinkedSections } from './updater';

export default class TOCEnchancerPlugin extends Plugin {

	async onload() {
		this.addCommand({
			id: "generate-toc-linked-section",
			name: "Generate TOC-linked sections",
			callback: async () => {
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if(!activeView) return;
				await generateTOCLinkedSections(activeView);
			},
		})
	}

	processEditor(){
		const editor = this.app.workspace.activeEditor?.editor;
		if (!editor) return;

		const lines = editor.getValue().split("\n");
		const output: string[] = [];
		const slugify = (text: string) => 
			text.trim().toLowerCase().replace(/[^\w가-힣\s-]/g, "").replace(/\s+/g, "-");

		let inTOC = false;
		const tocItems: {title: string; id: string}[] = [];

		for (const line of lines){
			if (line.match(/^##\s*목차/)){
				inTOC = true;
				output.push(`## 목차 ^목차`);
				continue;
			}

			if (inTOC && line.match(/^\s*-\s+\[.*\]/)){
				const title = line.match(/\[([^\]]+)\]/)?.[1];
				if (!title) continue;

				const id = slugify(title);
				tocItems.push({title, id});
				output.push(`- [${title}](#^section-${id})`);
				continue;
			}

			if (inTOC && line.trim() === ""){
				inTOC = false;
				output.push(`---`);
				tocItems.forEach(({ title, id}) => {
					output.push(`\n## ${title} ^section-${id}\n\n내용...\n\n[🔼 목차로](#^목차)\n`);
				});
				continue;
			}

			output.push(line);
		}

		editor.setValue(output.join("\n"));
	}
}