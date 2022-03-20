import * as vscode from "vscode";
import sortImports from "./sortImports";

type ArrayTransformer = (lines: string[]) => string[];
type SortingAlgorithm = (a: string, b: string) => number;

export function sortInsideEditor() {
  let editor = vscode.window.activeTextEditor;

  if (editor) {
    let edits: vscode.TextEdit[] = sortImports(editor!.document);
    editor.edit((editBuilder) => {
      edits.forEach((edit) => {
        editBuilder.replace(edit.range, edit.newText);
      });
    });
    console.log("5: ", { editor });
    // sortLineLength();
  }
}

function makeSorter(algorithm?: SortingAlgorithm): ArrayTransformer {
  return function (lines: string[]): string[] {
    return lines.sort(algorithm);
  };
}

function sortActiveSelection(
  transformers: ArrayTransformer[]
): Thenable<boolean> | undefined {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return undefined;
  }
  const selection = textEditor.selection;

  if (
    selection.isEmpty &&
    vscode.workspace.getConfiguration("sortLines").get("sortEntireFile") ===
      true
  ) {
    return sortLines(
      textEditor,
      0,
      textEditor.document.lineCount - 1,
      transformers
    );
  }

  if (selection.isSingleLine) {
    return undefined;
  }
  return sortLines(
    textEditor,
    selection.start.line,
    selection.end.line,
    transformers
  );
}

function sortLines(
  textEditor: vscode.TextEditor,
  startLine: number,
  endLine: number,
  transformers: ArrayTransformer[]
): Thenable<boolean> {
  let lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }

  // Remove blank lines in selection
  if (
    vscode.workspace.getConfiguration("sortLines").get("filterBlankLines") ===
    true
  ) {
    removeBlanks(lines);
  }

  lines = transformers.reduce(
    (currentLines, transform) => transform(currentLines),
    lines
  );

  return textEditor.edit((editBuilder) => {
    const range = new vscode.Range(
      startLine,
      0,
      endLine,
      textEditor.document.lineAt(endLine).text.length
    );
    editBuilder.replace(range, lines.join("\n"));
  });
}

function removeBlanks(lines: string[]): void {
  for (let i = 0; i < lines.length; ++i) {
    if (lines[i].trim() === "") {
      lines.splice(i, 1);
      i--;
    }
  }
}

function lineLengthCompare(a: string, b: string): number {
  // Use Array.from so that multi-char characters count as 1 each
  const aLength = Array.from(a).length;
  const bLength = Array.from(b).length;
  if (aLength === bLength) {
    return 0;
  }
  return aLength > bLength ? 1 : -1;
}

export const sortLineLength = () =>
  sortActiveSelection([makeSorter(lineLengthCompare)]);
