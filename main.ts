import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	async onload() {
		// This adds an editor command that replaces the selected text with a link to the corresponding Bible verse.
		this.addCommand({
			id: 'insert-bible-link',
			name: 'Insert Bible Link',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// Get the selected text
				const selectedText = editor.getSelection();

				const linkText = this.getBibleLink(selectedText);

				if (linkText === "") {
					return;
				}

				// Replace the selected text with the link text
				editor.replaceSelection(linkText);
			}
		});

		this.addCommand({
			id: 'insert-bible-link-with-olivetree',
			name: 'Insert Bible Link with OliveTree',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// Get the selected text
				const selectedText = editor.getSelection();

				const linkText = this.getBibleLink(selectedText);

				if (linkText === "") {
					return;
				}

				const olivetreeLinkText = this.getOlivetreelink(selectedText);

				if (olivetreeLinkText === "") {
					return;
				}

				// Replace the selected text with the link text
				editor.replaceSelection(linkText + " " + olivetreeLinkText);
			}
		});
	}

	onunload() {

	}

	getBibleLink(selectedText:string):string {
		// If the selected text is empty, show an error message
		if (selectedText === '') {
			new Notice('No text selected!');
			return "";
		}

		// Use regex to split the text by the space that has a letter before it and a number after it
		const [book, chapterAndVerse] = selectedText.split(/(?<=[a-zA-Z])\s(?=\d)/);

		// If the split failed, show an error message
		if (book === undefined || chapterAndVerse === undefined) {
			new Notice('Invalid text selected!');
			return "";
		}

		// Split the rest by the colon
		let [chapter, verses] = chapterAndVerse.split(':');

		// If the split failed, show an error message
		if (chapter === undefined || verses === undefined) {
			new Notice('Invalid text selected!');
			return "";
		}

		// If the verses contains a dash, split it by the dash
		if (verses.includes('-')) {
			verses = verses.split('-')[0];

			// If the split failed, show an error message
			if (verses === undefined) {
				new Notice('Invalid text selected!');
				return "";
			}
		}

		// Create the link text
		return `[[${book} ${chapter}#${verses}|${selectedText}]]`;
	}

	getOlivetreelink(selectedText:string):string {
		// Use regex to split the text by the space that has a letter before it and a number after it
		let [book, chapterAndVerse] = selectedText.split(/(?<=[a-zA-Z])\s(?=\d)/);

		// Remove leading and trailing whitespace from book
		book = book.trim();

		// Make the book URL friendly
		book = book.replace(' ', '%20');

		// Split the rest by the colon
		let [chapter, verses] = chapterAndVerse.split(':');

		// If the verses contains a dash, split it by the dash
		if (verses.includes('-')) {
			verses = verses.split('-')[0];
		}

		// Create the link text
		return `[(OTL)](olivetree://bible/${book}.${chapter}.${verses})`;
	}
}