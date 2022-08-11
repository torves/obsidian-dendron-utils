import { ItemView, WorkspaceLeaf, TFile } from "obsidian";

export const VIEW_TYPE_DENDRON = "dendron-view";

// TODO:
export const getChildrenCount = (files: TFile[], i: number) => {
	return 1;
};

// TODO:
export const getParent = (files: TFile[], i: number) => {
	return "";
};

export default class DendronView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_DENDRON;
	}

	getDisplayText(): string {
		return "Dendron View";
	}

	protected async onOpen(): Promise<void> {
		const container = this.containerEl.children[1];
		container.empty();
		// container.createEl("h4", { text: "Dendron File Tree" });

		// TODO: Filer out notes which are in the assets folder - this should maybe be a list in settings.
		const files = this.app.vault
			.getMarkdownFiles()
			// Sort files alpha-numerically
			.sort((a, b) => a.basename.localeCompare(b.basename))
			// Wrap the files data with meta data needed for Dendron file hierarchies
			.map((f, i, files) => {
				return {
					...f,
					parent: getParent(files, i),
					children: getChildrenCount(files, i),
				};
			});

		// console.log(files);
		for (const f of files) {
			// Using DOM and class structure to mimic vanilla Obsidian as much as possible.
			const navFile = container.createDiv({
				cls: `nav-folder ${
					f.children > 0 ? "nav-folder is-collapsed" : ""
				}`,
			});
			const navFileTitle = navFile.createDiv({
				cls: `nav-file-title ${
					f.children > 0 ? "nav-folder-title" : ""
				}`,
			});
			// const collapseIcon =
			navFileTitle.createDiv(
				"nav-folder-collapse-indicator collapse-icon"
			).innerHTML = `<svg viewBox="0 0 100 100" class="right-triangle" width="8" height="8"><path fill="currentColor" stroke="currentColor" d="M94.9,20.8c-1.4-2.5-4.1-4.1-7.1-4.1H12.2c-3,0-5.7,1.6-7.1,4.1c-1.3,2.4-1.2,5.2,0.2,7.6L43.1,88c1.5,2.3,4,3.7,6.9,3.7 s5.4-1.4,6.9-3.7l37.8-59.6C96.1,26,96.2,23.2,94.9,20.8L94.9,20.8z"></path></svg>`;
			// const navFileTitleContent =
			navFileTitle.createDiv({
				cls: `nav-file-title-content ${
					f.children > 0 ? "nav-folder-title-content" : ""
				}`,
				text: f.basename,
			});
		}
	}

	protected async onClose(): Promise<void> {
		//
	}
}
