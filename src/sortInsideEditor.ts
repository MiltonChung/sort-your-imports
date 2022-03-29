import * as vscode from "vscode";
import * as options from "./options";
import writeImports from "./writeImports";
import { processImports } from "./processImports";
import { parseKeyImports, parseSelectedImports } from "./parseImportNodes";
import { removeDuplicates } from "./sortingAlgorithms";

const sortInsideEditorOnKey = (): boolean => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }

  let imports = parseKeyImports(editor.document);
  imports = processImports(imports);
  const sortedImportText = writeImports(imports);

  const edits: vscode.TextEdit[] = imports.map(
    (importClause: { range: vscode.Range }) =>
      vscode.TextEdit.delete(importClause.range)
  );

  edits.push(
    vscode.TextEdit.insert(new vscode.Position(0, 0), sortedImportText)
  );

  editor.edit((editBuilder) => {
    edits.forEach((edit) => {
      editBuilder.replace(edit.range, edit.newText);
    });
  });
  return true;
};

/* 
write the imports and push the new edits to the editor
*/
const sortInsideEditorOnClick = (): boolean => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }
  const selection = editor.selection;
  let startLine: vscode.TextLine, endLine: vscode.TextLine;

  if (selection.isEmpty && options.getSortEntireFile() === true) {
    startLine = editor.document.lineAt(0);
    endLine = editor.document.lineAt(editor.document.lineCount - 1);
  } else {
    startLine = editor.document.lineAt(selection.start.line);
    endLine = editor.document.lineAt(selection.end.line);
  }

  let imports = parseSelectedImports(editor, startLine, endLine);
  imports = processImports(imports);

  let lines: string[] = [];

  for (let i = 0; i < imports.length; i++) {
    lines.push(imports[i].text.replace(/(\r\n|\n|\r)/gm, ""));
  }

  if (
    lines.length !==
    endLine.range.start.line - startLine.range.start.line + 1
  ) {
    vscode.window.showErrorMessage(
      "Please select only import lines. Empty lines and non-import lines are not allowed!"
    );
    return false;
  }

  if (options.getSortOption() === "removeDuplicates") {
    lines = removeDuplicates(lines);
  }

  editor.edit((editBuilder) => {
    const range = new vscode.Range(
      startLine.range.start.line,
      0,
      endLine.range.start.line,
      editor.document.lineAt(endLine.range.start.line).text.length
    );

    editBuilder.replace(range, lines.join("\n"));
  });

  return true;
};

export { sortInsideEditorOnKey, sortInsideEditorOnClick };
