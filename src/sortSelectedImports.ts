import * as vscode from "vscode";
import * as options from "./options";
import { compareLineLength } from "./sortingAlgorithms";
import { SortingAlgorithm, ArrayTransformer } from "./types";

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

  if (selection.isEmpty && options.getSortEntireFile() === true) {
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

const sortSelectedImports = () =>
  sortActiveSelection([makeSorter(compareLineLength)]);

export { sortSelectedImports };
